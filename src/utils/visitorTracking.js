// =================================================
// VISITOR TRACKING — ওয়েবসাইট ট্রাফিক ও পেজ-টাইম ট্র্যাকিং
//
// প্রতিটা পেজ ভিউয়ের জন্য Firestore-এর "pageViews" কালেকশনে একটা
// ডকুমেন্ট তৈরি হয় (visitorId, sessionId, page, enteredAt), এবং
// ভিজিটর যতক্ষণ পেজে থাকে সেই সময়টা (duration, সেকেন্ডে) নিয়মিত
// আপডেট হতে থাকে। এই ডেটা Admin AI Assistant (functions/
// aiChatAdminTools.js -> getTrafficAnalytics) থেকে পড়া হয়।
//
// visitorId/sessionId সম্পূর্ণ anonymous — কোনো ব্যক্তিগত তথ্য
// (নাম/ফোন/ইমেইল) সংরক্ষণ করা হয় না, শুধু browser-generated random id।
// =================================================

import {
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firestore";

const VISITOR_ID_KEY = "dm_visitor_id";
const SESSION_ID_KEY = "dm_session_id";
const HEARTBEAT_MS = 15000; // প্রতি ১৫ সেকেন্ডে duration আপডেট হয়

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function getVisitorId() {
  if (typeof window === "undefined") return "server";

  let id = localStorage.getItem(VISITOR_ID_KEY);

  if (!id) {
    id = generateId();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }

  return id;
}

function getSessionId() {
  if (typeof window === "undefined") return "server";

  let id = sessionStorage.getItem(SESSION_ID_KEY);

  if (!id) {
    id = generateId();
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }

  return id;
}

let currentViewRef = null;
let currentViewStartedAt = null;
let _heartbeatInterval = null;
let lifecycleAttached = false;

async function writeDuration(isFinal) {
  if (!currentViewRef || !currentViewStartedAt) return;

  const durationSeconds = Math.max(
    0,
    Math.round((Date.now() - currentViewStartedAt) / 1000)
  );

  try {
    await updateDoc(currentViewRef, {
      duration: durationSeconds,
      isActive: !isFinal,
      ...(isFinal ? { leftAt: serverTimestamp() } : {}),
    });
  } catch (_err) {
    // ট্র্যাকিং কখনো সাইট ভাঙবে না — silently ignore
  }
}

// নতুন পেজে ঢোকার সময় কল হয় (route change-এ)
export async function startPageView(path) {
  await endPageView();

  currentViewStartedAt = Date.now();

  try {
    const ref = await addDoc(collection(db, "pageViews"), {
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      page: path,
      title: typeof document !== "undefined" ? document.title : "",
      referrer: typeof document !== "undefined" ? document.referrer : "",
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "",
      enteredAt: serverTimestamp(),
      duration: 0,
      isActive: true,
    });

    currentViewRef = ref;
  } catch (_err) {
    currentViewRef = null;
    currentViewStartedAt = null;
  }
}

// পেজ ছেড়ে যাওয়ার সময় (route change / ট্যাব বন্ধ / hidden) কল হয়
export async function endPageView() {
  if (!currentViewRef) return;

  await writeDuration(true);

  currentViewRef = null;
  currentViewStartedAt = null;
}

// একবারই কল করতে হয় (app mount-এ) — heartbeat ও visibility/unload
// listener সেট করে দেয়, যাতে ট্যাব বন্ধ করলে বা মিনিমাইজ করলেও
// ততক্ষণ পর্যন্ত কাটানো সময়টা সংরক্ষিত থাকে।
export function initVisitorTrackingLifecycle() {
  if (typeof window === "undefined" || lifecycleAttached) return;

  lifecycleAttached = true;

  _heartbeatInterval = setInterval(() => {
    if (currentViewRef && document.visibilityState === "visible") {
      writeDuration(false);
    }
  }, HEARTBEAT_MS);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      endPageView();
    }
  });

  window.addEventListener("pagehide", () => {
    endPageView();
  });
}
