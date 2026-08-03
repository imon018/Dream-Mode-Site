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
// এই ব্রাউজার/ডিভাইস Passkey সাপোর্ট করে কিনা
// =========================

export function isPasskeySupported(){

  try{

    return browserSupportsWebAuthn();

  }catch(err){

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

    console.log("PASSKEY REGISTRATION ERROR:", error);

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

  let assertionResponse;

  try{

    assertionResponse =
    await startAuthentication({
      optionsJSON: options,
    });

  }catch(error){

    console.log("PASSKEY LOGIN (BROWSER) ERROR:", error);

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

    throw new Error(
      "ডিভাইস/ব্রাউজারে সাময়িক একটা সমস্যা হচ্ছে Passkey যাচাই করতে। " +
      "আবার চেষ্টা করুন, অথবা এখন Email/Password দিয়ে Login করুন।"
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

    console.log("PASSKEY LOGIN (VERIFY) ERROR:", error);

    if(
      error.message?.includes("PASSKEY_NOT_SETUP") ||
      error.code === "functions/not-found"
    ){

      throw new Error("PASSKEY_NOT_SETUP");

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

  try{

    await updateDoc(
      doc(db, "users", result.user.uid),
      {
        lastLogin: serverTimestamp(),
      }
    );

  }catch(err){

    console.log(err);

  }

  if(role === "admin"){

    await notifyAdminLogin({
      uid: result.user.uid,
      displayName: result.user.displayName || "Admin",
    }).catch((err)=>console.log(err));

  }else{

    await notifyUserLogin({
      uid: result.user.uid,
    }).catch((err)=>console.log(err));

  }

  return {
    user: result.user,
    role: role || "user",
    isNewUser: false,
    hasPassword: true,
  };

}
