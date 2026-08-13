// =================================================
// ট্রাফিক রিপোর্ট — প্রতি ৬ ঘণ্টা পর পর অটোমেটিক
//
// প্রতি ৬ ঘণ্টায় একবার চলে (Asia/Dhaka টাইমজোন অনুযায়ী) এবং
// আজকের এখন পর্যন্ত মোট পেজভিউ, ইউনিক ভিজিটর, সবচেয়ে বেশি দেখা
// পেজ এবং আজকের নতুন রেজিস্ট্রেশন সংখ্যা হিসাব করে Admin-এর
// notification feed-এ (Admin AI Assistant-এর নামে) একটা সংক্ষিপ্ত
// আপডেট পাঠিয়ে দেয়। AdminDrawer-এর নোটিফিকেশন বেল/লিস্টেই এটা
// স্বয়ংক্রিয়ভাবে দেখা যাবে (notifications কালেকশন, receiverId: "ADMIN")।
// =================================================

const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

const { getTrafficAnalytics } = require("./aiChatAdminTools");

// বাংলাদেশ সময় (UTC+6) অনুযায়ী "আজ"-এর শুরুর মুহূর্তটা বের করে
function getTodayStartInBangladesh() {

  const BD_OFFSET_MS = 6 * 60 * 60 * 1000;
  const nowBd = new Date(Date.now() + BD_OFFSET_MS);

  const midnightBdUtcMs = Date.UTC(
    nowBd.getUTCFullYear(),
    nowBd.getUTCMonth(),
    nowBd.getUTCDate(),
    0,
    0,
    0
  );

  return new Date(midnightBdUtcMs - BD_OFFSET_MS);

}

async function buildAndSendTrafficReport() {

  const todayStart = getTodayStartInBangladesh();

  const hoursSinceMidnight = Math.max(
    1,
    Math.ceil((Date.now() - todayStart.getTime()) / (60 * 60 * 1000))
  );

  const traffic = await getTrafficAnalytics({ hours: hoursSinceMidnight });

  // আজকে নতুন রেজিস্ট্রেশন
  let newRegistrations = 0;

  try {

    const usersSnap = await admin
      .firestore()
      .collection("users")
      .where("createdAt", ">=", todayStart)
      .get();

    newRegistrations = usersSnap.size;

  } catch (err) {
    console.error("Traffic report: user count failed", err);
  }

  // মোট রেজিস্টার্ড ইউজার
  let totalUsers = null;

  try {

    const countSnap = await admin
      .firestore()
      .collection("users")
      .count()
      .get();

    totalUsers = countSnap.data().count;

  } catch (err) {
    console.error("Traffic report: total user count failed", err);
  }

  const topPage = traffic.topPages[0];

  const lines = [];

  lines.push(
    `আজ এখন পর্যন্ত মোট ${traffic.totalPageViews}টি পেজভিউ এবং ${traffic.uniqueVisitors} জন ইউনিক ভিজিটর এসেছেন।`
  );

  if (topPage) {

    lines.push(
      `সবচেয়ে বেশি দেখা পেজ: "${topPage.page}" — ${topPage.views} বার দেখা হয়েছে, গড়ে ${topPage.averageTimeOnPageSeconds} সেকেন্ড করে সময় কাটিয়েছেন ভিজিটররা।`
    );

  }

  if (traffic.liveVisitorsNow > 0) {
    lines.push(`এই মুহূর্তে সাইটে লাইভ আছেন ${traffic.liveVisitorsNow} জন।`);
  }

  lines.push(
    `আজ নতুন রেজিস্ট্রেশন হয়েছে ${newRegistrations} জনের` +
      (totalUsers !== null
        ? ` (মোট রেজিস্টার্ড ইউজার এখন ${totalUsers} জন)।`
        : "।")
  );

  const message = lines.join(" ");

  await admin.firestore().collection("notifications").add({
    title: "📊 ট্রাফিক আপডেট (Admin AI)",
    message,
    type: "traffic_report",
    priority: "medium",
    receiverId: "ADMIN",
    senderId: null,
    senderName: "Admin AI Assistant",
    senderRole: "system",
    actionUrl: "/admin",
    image: "",
    extra: {
      totalPageViews: traffic.totalPageViews,
      uniqueVisitors: traffic.uniqueVisitors,
      liveVisitorsNow: traffic.liveVisitorsNow,
      topPages: traffic.topPages,
      newRegistrationsToday: newRegistrations,
      totalRegisteredUsers: totalUsers,
    },
    isRead: false,
    isDeleted: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

}

// প্রতি ৬ ঘণ্টা পর পর: রাত ১২টা, সকাল ৬টা, দুপুর ১২টা, সন্ধ্যা ৬টা
// (Asia/Dhaka টাইমজোন অনুযায়ী)
exports.trafficReportScheduled = onSchedule(
  {
    schedule: "0 0,6,12,18 * * *",
    timeZone: "Asia/Dhaka",
  },
  async () => {

    try {
      await buildAndSendTrafficReport();
    } catch (err) {
      console.error("Traffic report failed:", err);
    }

    return null;

  }
);
