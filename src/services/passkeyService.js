import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
} from "@simplewebauthn/browser";


import {
  httpsCallable,
} from "firebase/functions";


import {
  signInWithCustomToken,
} from "firebase/auth";


import {
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";


import {
  auth,
} from "../firebase/auth";


import {
  db,
} from "../firebase/firestore";


import {
  functions,
} from "../firebase/functions";


import {
  notifyUserLogin,
  notifyAdminLogin,
} from "./notificationService";




// =========================
// এই ডিভাইসে আগে যেসব Passkey দিয়ে সফলভাবে Register/Login করা
// হয়েছে, তাদের Credential ID লোকালি (localStorage) মনে রাখা
// হচ্ছে। এর উদ্দেশ্য: "Login with Passkey" চাপলে যদি এই
// ডিভাইসে ঠিক ১টা Passkey থাকে, তাহলে কোনো Account-চুজার/
// "Use saved passkey?" শীট না দেখিয়ে সরাসরি ফিঙ্গারপ্রিন্ট/
// বায়োমেট্রিক প্রম্পট দেখানো (allowCredentials-এ নির্দিষ্ট করে
// একটাই আইডি পাঠিয়ে) — আর ১টার বেশি থাকলে সেগুলোর মধ্যে থেকে
// বেছে নেওয়ার চুজার দেখানো (allowCredentials-এ সবগুলো আইডি
// পাঠিয়ে)। কোনোটাই সেভ করা না থাকলে (নতুন ডিভাইস/ব্রাউজার,
// অথবা অন্য কোনো ব্রাউজার/অ্যাপে সেটআপ করা প্যাসকি) আগের মতোই
// usernameless/discoverable ফ্লো-তে ফলব্যাক করবে।

const LOCAL_PASSKEYS_KEY = "dreamMode_localPasskeys";


function getLocalPasskeys(){

  try{

    const raw =
      localStorage.getItem(LOCAL_PASSKEYS_KEY);

    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];

  }catch(err){

    return [];

  }

}


function saveLocalPasskey(credentialId){

  if(!credentialId) return;

  try{

    const existing =
      getLocalPasskeys()
      .filter(
        (item) => item.id !== credentialId
      );

    const updated =
      [
        ...existing,
        { id: credentialId, savedAt: Date.now() },
      ];

    localStorage.setItem(
      LOCAL_PASSKEYS_KEY,
      JSON.stringify(updated)
    );

  }catch(err){
    // localStorage না থাকলেও যেন পুরো ফ্লো ভেঙে না পড়ে
  }

}


function removeLocalPasskey(credentialId){

  try{

    const updated =
      getLocalPasskeys()
      .filter(
        (item) => item.id !== credentialId
      );

    localStorage.setItem(
      LOCAL_PASSKEYS_KEY,
      JSON.stringify(updated)
    );

  }catch(err){
    // ignore
  }

}




// =========================
// এই ব্রাউজার/ডিভাইস Passkey সাপোর্ট করে কিনা
// =========================

export function isPasskeySupported(){

  try{

    return browserSupportsWebAuthn();

  }catch(_err){

    return false;

  }

}




// =========================
// ডিভাইসের একটা ছোট, সহজে চেনা যায় এমন নাম বানানো
// (যেমন: "Chrome on Windows") — Passkey লিস্টে দেখানোর জন্য
// =========================

function guessDeviceLabel(){

  const ua =
  navigator.userAgent || "";

  let browserName = "Browser";

  if(/Edg\//.test(ua)) browserName = "Edge";
  else if(/OPR\//.test(ua)) browserName = "Opera";
  else if(/Chrome\//.test(ua)) browserName = "Chrome";
  else if(/Firefox\//.test(ua)) browserName = "Firefox";
  else if(/Safari\//.test(ua)) browserName = "Safari";

  let osName = "Device";

  if(/Android/.test(ua)) osName = "Android";
  else if(/iPhone|iPad|iPod/.test(ua)) osName = "iOS";
  else if(/Windows/.test(ua)) osName = "Windows";
  else if(/Mac OS X/.test(ua)) osName = "macOS";
  else if(/Linux/.test(ua)) osName = "Linux";

  return `${browserName} on ${osName}`;

}




// =========================
// PASSKEY SETUP (Register a new passkey for the logged-in user)
// =========================

export async function registerPasskey(customLabel){

  const generateOptions =
  httpsCallable(functions, "generatePasskeyRegistrationOptions");

  const optionsResult =
  await generateOptions();

  const options =
  optionsResult.data;

  let attestationResponse;

  try{

    attestationResponse =
    await startRegistration({
      optionsJSON: options,
    });

  }catch(error){


    if(error.name === "InvalidStateError"){

      throw new Error(
        "এই Passkey ইতিমধ্যে এই ডিভাইসে সেটআপ করা আছে।"
      );

    }

    throw new Error(
      "Passkey তৈরি করা যায়নি। আবার চেষ্টা করুন।"
    );

  }

  const verify =
  httpsCallable(functions, "verifyPasskeyRegistration");

  const verifyResult =
  await verify({
    response: attestationResponse,
    label: customLabel || guessDeviceLabel(),
  });

  if(!verifyResult.data?.verified){

    throw new Error(
      "Passkey verify করা যায়নি।"
    );

  }

  // রেজিস্ট্রেশন সফল হলে এই ডিভাইসের জন্য Credential ID মনে
  // রাখা হচ্ছে, যাতে পরের বার "Login with Passkey"-এ সরাসরি
  // বায়োমেট্রিক প্রম্পট দেখানো যায় (একাধিক থাকলে চুজার দেখাবে)।
  saveLocalPasskey(attestationResponse.id);

  return verifyResult.data;

}




// =========================
// LIST MY PASSKEYS
// =========================

export async function getMyPasskeys(){

  const list =
  httpsCallable(functions, "listPasskeys");

  const result =
  await list();

  return result.data?.passkeys || [];

}




// =========================
// DELETE A PASSKEY
// =========================

export async function removePasskey(credentialId){

  const del =
  httpsCallable(functions, "deletePasskey");

  await del({
    credentialId,
  });

  // ডিলিট করা Passkey-টা লোকাল লিস্ট থেকেও সরিয়ে দেওয়া হচ্ছে,
  // যাতে এই ডিভাইসের "মনে রাখা" তালিকাটা সবসময় সার্ভারের সাথে
  // সিঙ্কে থাকে।
  removeLocalPasskey(credentialId);

}




// =========================
// LOGIN WITH PASSKEY
// (Usernameless — user শুধু বাটনে ক্লিক করবে, ব্রাউজার/ডিভাইস
// থেকে সেভ করা Passkey বেছে নিলেই লগইন হয়ে যাবে)
// =========================

export async function loginWithPasskey(){

  if(!isPasskeySupported()){

    throw new Error(
      "আপনার ব্রাউজার Passkey সাপোর্ট করে না।"
    );

  }

  const generateAuthOptions =
  httpsCallable(functions, "generatePasskeyAuthenticationOptions");

  const optionsResult =
  await generateAuthOptions();

  const {
    options,
    challengeId,
  } = optionsResult.data || {};


  // এই ডিভাইসে আগে থেকে মনে রাখা Passkey থাকলে, সেগুলোর ID
  // দিয়ে allowCredentials ভরে দেওয়া হচ্ছে — এতে ১টা থাকলে
  // ব্রাউজার সরাসরি বায়োমেট্রিক প্রম্পট দেখাবে (কোনো Account
  // চুজার ছাড়াই), আর ১টার বেশি থাকলে শুধু এই ID গুলোর মধ্যে
  // থেকে বেছে নেওয়ার চুজার দেখাবে। কিছু মনে রাখা না থাকলে
  // (নতুন ডিভাইস/ব্রাউজার) আগের usernameless/discoverable
  // ফ্লো-তেই ফলব্যাক করবে (allowCredentials খালি থাকবে)।

  const localPasskeys = getLocalPasskeys();

  const authOptions =
    localPasskeys.length
    ?
    {
      ...options,
      allowCredentials: localPasskeys.map(
        (item) => ({
          id: item.id,
          type: "public-key",
        })
      ),
    }
    :
    options;


  let assertionResponse;

  try{

    assertionResponse =
    await startAuthentication({
      optionsJSON: authOptions,
    });

  }catch(error){


    // Android-এ Chrome/Google Play Services-এর Credential Manager-এর
    // একটা পরিচিত, মাঝে মাঝে হওয়া bug আছে (NotReadableError/AbortError
    // ইত্যাদি) যেটা Passkey সেটআপ করা থাকলেও মাঝেমধ্যে fail করে। এটাকে
    // "Setup করা হয়নি" থেকে আলাদা মেসেজ দেখানো হচ্ছে যাতে ইউজার
    // confuse না হয়ে আবার চেষ্টা করেন বা Password দিয়ে Login করেন।
    if(
      error.name === "NotAllowedError" ||
      error.name === "InvalidStateError"
    ){

      throw new Error("PASSKEY_NOT_SETUP");

    }

    // Android App (Capacitor) থেকে চালানোর সময় ওয়েবভিউ যদি সঠিক
    // ডোমেইনের (www.dream-mode.shop) বদলে অন্য কোনো origin (যেমন
    // localhost) থেকে লোড হয়, তাহলে ব্রাউজার নিজেই এই SecurityError
    // ছুঁড়ে দেয় — কারণ RP ID বর্তমান origin-এর সাথে মেলে না। এটা
    // ব্যবহারকারীর কোনো ভুল না, তাই raw ব্রাউজার এরর না দেখিয়ে
    // বোধগম্য মেসেজ দেখানো হচ্ছে।
    if(error.name === "SecurityError"){

      throw new Error(
        "এই অ্যাপ থেকে এখনই Passkey দিয়ে Login করা যাচ্ছে না। " +
        "অনুগ্রহ করে অ্যাপটি সবশেষ ভার্সনে Update করুন, অথবা " +
        "আপাতত Email/Password দিয়ে Login করুন।"
      );

    }

    throw new Error(
      `PASSKEY_CLIENT_ERROR: ${error.name || ""} — ${error.message || error}`
    );

  }

  const verify =
  httpsCallable(functions, "verifyPasskeyLogin");

  let verifyResult;

  try{

    verifyResult =
    await verify({
      challengeId,
      response: assertionResponse,
    });

  }catch(error){


    if(
      error.message?.includes("PASSKEY_NOT_SETUP")
    ){

      throw new Error("PASSKEY_NOT_SETUP");

    }

    if(
      error.message?.includes("PASSKEY_ACCOUNT_NOT_FOUND")
    ){

      throw new Error(
        "এই Passkey-র সাথে যুক্ত অ্যাকাউন্টটি খুঁজে পাওয়া যায়নি।"
      );

    }

    if(
      error.message?.includes("PASSKEY_LOGIN_EXPIRED") ||
      error.code === "functions/deadline-exceeded" ||
      error.code === "functions/failed-precondition"
    ){

      throw new Error(
        "সময় শেষ হয়ে গেছে। আবার চেষ্টা করুন।"
      );

    }

    if(
      error.message?.includes("PASSKEY_VERIFY_FAILED") ||
      error.message?.includes("PASSKEY_TOKEN_ERROR") ||
      error.message?.includes("PASSKEY_OPTIONS_ERROR") ||
      error.message?.includes("PASSKEY_UNEXPECTED_ERROR")
    ){

      // এই মেসেজগুলো এখন backend থেকে আসল, নির্দিষ্ট কারণসহ আসে
      // (যেমন rpID/origin mismatch, বা createCustomToken/IAM
      // permission সমস্যা)। আগে এই তথ্যটা সব সময় একটা generic
      // মেসেজ দিয়ে চাপা পড়ে যেত, যার কারণে আসল সমস্যা ধরা যাচ্ছিল না।

      throw new Error(
        "Passkey Login করা যায়নি। কারিগরি বিস্তারিত: " +
        error.message.replace(
          /.*PASSKEY_(VERIFY_FAILED|TOKEN_ERROR|OPTIONS_ERROR|UNEXPECTED_ERROR):\s*/,
          ""
        ) +
        " — আপাতত Email/Password দিয়ে Login করুন।"
      );

    }

    // শুধুমাত্র সত্যিকারের অজানা/নেটওয়ার্ক সমস্যার ক্ষেত্রেই এই generic
    // মেসেজ দেখানো হবে এখন। console-এ আসল error টা দেখা যাবে debug করার জন্য।

    throw new Error(
      "ডিভাইস/ব্রাউজারে সাময়িক একটা সমস্যা হচ্ছে Passkey যাচাই করতে। " +
      "আবার চেষ্টা করুন, অথবা এখন Email/Password দিয়ে Login করুন।"
    );

  }

  const {
    token,
    role,
  } = verifyResult.data || {};

  if(!token){

    throw new Error(
      "Passkey login ব্যর্থ হয়েছে।"
    );

  }

  const result =
  await signInWithCustomToken(auth, token);

  // লগইন সফল হয়েছে মানে এই Credential ID বৈধ ও এই ডিভাইসেই
  // ব্যবহৃত হচ্ছে — পরের বার সরাসরি বায়োমেট্রিক প্রম্পট দেখানোর
  // জন্য এটা মনে রাখা হচ্ছে (আগে থেকে থাকলে duplicate হবে না)।
  saveLocalPasskey(assertionResponse.id);


  try{

    await updateDoc(
      doc(db, "users", result.user.uid),
      {
        lastLogin: serverTimestamp(),
      }
    );

  }catch (err) {
    console.error(err);
  }

  if(role === "admin"){

    await notifyAdminLogin({
      uid: result.user.uid,
      displayName: result.user.displayName || "Admin",
    }).catch((err)=>console.error(err));

  }else{

    await notifyUserLogin({
      uid: result.user.uid,
    }).catch((err)=>console.error(err));

  }

  return {
    user: result.user,
    role: role || "user",
    isNewUser: false,
    hasPassword: true,
  };

}
