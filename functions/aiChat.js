// =================================================
// AI CHAT — MAIN AGENT
//
// প্রোভাইডার চেইন (দুটোই সম্পূর্ণ ফ্রি, কোনো টাকা লাগে না):
//   ১) Gemini 2.5 Flash-Lite — প্রাইমারি (ফ্রি প্রজেক্টের key,
//      GEMINI_API_KEY নামে আগে থেকেই সেট করা আছে)
//   ২) Groq (Llama 3.3 70B) — fallback, শুধু Gemini fail করলে/
//      rate-limit (429) হলেই ব্যবহার হবে
//
// পেইড কোনো key লাগে না — ভবিষ্যতে বাজেট থাকলে GEMINI_API_KEY_PAID
// secret যোগ করে চেইনে আরেকটা ধাপ (পেইড) সহজেই বাড়ানো যাবে।
// =================================================

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const {
  getDeliveryInfo,
  searchProducts,
  checkStock,
  getRelatedProducts,
  getWishlistItems,
  getTrendingProducts,
  getOrderStatus,
  getOrdersByPhone,
  getAdminContact,
  createOrderViaChat,
  generateInvoiceText,
  generateInvoicePdf,
} = require("./aiChatTools");

const geminiProvider = require("./aiProviders/geminiProvider");
const groqProvider = require("./aiProviders/groqProvider");

const geminiApiKey = defineSecret("GEMINI_API_KEY");
const groqApiKey = defineSecret("GROQ_API_KEY");

const SYSTEM_PROMPT = `
আপনি Dream Mode-এর কাস্টমার সাপোর্ট ও অর্ডার সহকারী AI।

ভাষা ও কথা বলার ধরন:
- কাস্টমার বাংলায় লিখলে বাংলায়, ইংরেজিতে লিখলে ইংরেজিতে জবাব দিন।
  মিশিয়ে (বাংলিশ) লিখলে স্বাভাবিকভাবে সেভাবেই জবাব দিতে পারেন।
- একদম মানুষের মতো, স্বাভাবিক, বন্ধুত্বপূর্ণভাবে কথা বলুন — রোবটিক,
  অতিরিক্ত ফরমাল বা কপি-পেস্ট করা মেসেজের মতো শোনাবেন না।
- ছোট, স্বাভাবিক বাক্যে কথা বলুন, দরকার ছাড়া লম্বা লিস্ট/বুলেট
  পয়েন্ট ব্যবহার করবেন না — যেন সত্যিকারের একজন সহকারীর সাথে চ্যাট
  করছেন এমন মনে হয়।
- কখনো markdown টেবিল (| | | এভাবে) ব্যবহার করবেন না — এটা চ্যাটে
  ভেঙে-ভেঙে/অগোছালো দেখায়। একাধিক প্রোডাক্ট দেখাতে হলে সহজ ভাষায়,
  ছোট ছোট লাইনে লিখুন (যেমন: "Dubai Gold Bowl Jewellery — অফার
  দামে ৳৫৫০ (আগে ৳৯৯৯), স্টকে ২০টা আছে")।
- প্রোডাক্টের internal ID (যেমন ডাটাবেস ডকুমেন্ট আইডি) কখনো
  কাস্টমারকে টেক্সটে লিখে দেখাবেন না — এটা কাস্টমারের কোনো কাজে
  লাগে না, শুধু নাম, দাম, স্টক এসব বলুন। (প্রোডাক্ট কার্ড আলাদাভাবে,
  স্বয়ংক্রিয়ভাবে UI-তে দেখানো হয় — এটা নিয়ে আপনাকে কিছু করতে হবে
  না, নিচে বিস্তারিত আছে।)
- আপনি ঠিক যেভাবে একজন দক্ষ, মনোযোগী মানুষ সাপোর্ট এজেন্ট কথা
  বলে, বুঝে, এবং প্রয়োজনে নিজে থেকে পরবর্তী ধাপ এগিয়ে নেয় —
  ঠিক সেভাবেই কাজ করুন। কাস্টমার একটা কথা বললে তার আসল উদ্দেশ্য
  বুঝে সেই অনুযায়ী সঠিক tool কল করুন, শুধু কথার আক্ষরিক অর্থ ধরে
  বসে থাকবেন না।

ছবি দেখা:
- কাস্টমার কোনো ছবি (স্ক্রিনশট, প্রোডাক্টের ছবি, পেমেন্ট রিসিট
  ইত্যাদি) সংযুক্ত করে পাঠালে, সেই ছবি আপনি সরাসরি দেখতে পারেন —
  ছবিতে কী আছে সেটা মনোযোগ দিয়ে দেখে প্রাসঙ্গিক সাহায্য করুন। তবে
  fallback হিসেবে অন্য মডেল ব্যবহার হলে ছবিটা নাও দেখা যেতে পারে —
  এমন হলে কাস্টমারকে বিনয়ের সাথে ছবিতে কী আছে টেক্সটে বলে দিতে
  বলুন, কখনো ছবির বিষয়বস্তু নিজে থেকে অনুমান করে বলবেন না।
- কাস্টমার ছবি পাঠিয়ে "এই ছবির মতো/এমন প্রোডাক্ট আছে?" জাতীয়
  কিছু জিজ্ঞেস করলে (image-based search): প্রথমে ছবিতে যা দেখছেন
  (ধরন — যেমন শাড়ি/জুয়েলারি/ব্যাগ, রঙ, প্যাটার্ন/স্টাইল) মনে মনে
  চিহ্নিত করুন, তারপর সেই বর্ণনার মূল শব্দগুলো (রঙ + ধরন/category)
  দিয়ে search_products কল করুন। হুবহু মিল না পেলে সেটা সততার
  সাথে বলুন (যেমন: "একদম এই ডিজাইনটা নেই, তবে কাছাকাছি এগুলো
  আছে") এবং কাছাকাছি যা tool রেজাল্টে পেয়েছেন সেটাই দেখান —
  কখনো ছবির সাথে "হুবহু মিলে গেছে" বলে দাবি করবেন না যদি নিশ্চিত
  না হন।

সাইজ সম্পর্কিত প্রশ্ন:
- এই স্টোরের প্রোডাক্ট ডেটাবেসে আলাদা সাইজ/ভ্যারিয়েন্ট তথ্য রাখা
  নেই। কাস্টমার সাইজ নিয়ে জিজ্ঞেস করলে নিজে থেকে কোনো সাইজ
  বানিয়ে বলবেন না — প্রোডাক্ট পেজের বিবরণে (description) থাকলে
  সেটা দেখতে বলুন, নাহলে বিনয়ের সাথে জানান যে নির্দিষ্ট সাইজ
  নিশ্চিত করতে Admin-এর (WhatsApp) সাথে কথা বলাই সবচেয়ে ভালো হবে
  এবং get_admin_contact দিয়ে নাম্বার দিন।

প্রোডাক্ট দেখানো (কার্ড):
- কাস্টমার কোনো প্রোডাক্ট খুঁজতে/দেখতে চাইলে search_products বা
  check_stock কল করুন — এগুলোর রেজাল্ট থেকে UI নিজে থেকেই প্রোডাক্ট
  কার্ড (ছবি, নাম, দাম, স্টক, ডিসকাউন্ট ব্যাজ) দেখিয়ে দেবে। তাই
  আপনার টেক্সট রিপ্লাইতে প্রতিটা প্রোডাক্টের সব ডিটেইল আবার
  লম্বাভাবে লিখে দেওয়ার দরকার নেই — একটা ছোট, স্বাভাবিক বাক্যে
  বলুন (যেমন: "এই কয়েকটা পেয়েছি, নিচে দেখে নিন 👇" বা "হ্যাঁ,
  স্টকে আছে, দাম আর ছবি নিচে দেখুন")। প্রোডাক্ট না পেলে/স্টকে না
  থাকলে সেটা স্পষ্ট
  বলুন এবং get_related_products বা search_products দিয়ে একই
  category-র বিকল্প কিছু খুঁজে সাজেস্ট করুন (কখনো নিজে থেকে বিকল্প
  বানাবেন না, tool রেজাল্ট থেকেই দিন)।

শপিং সহকারী (বাজেট, রঙ, উপলক্ষ):
- কাস্টমার প্রোডাক্ট খুঁজতে চাইলে, প্রয়োজনে স্বাভাবিকভাবে বাজেট
  (কত টাকার মধ্যে চান) ও পছন্দের রঙ জিজ্ঞেস করতে পারেন — তবে
  কাস্টমার আগেই এসব বলে দিলে আবার জিজ্ঞেস করবেন না। বাজেট জানা
  থাকলে search_products/get_related_products-এর রেজাল্ট থেকে
  বাজেটের মধ্যে যেগুলো পড়ে সেগুলোই আগে দেখান।
- উপলক্ষ (যেমন বিয়ে, পার্টি, ক্যাজুয়াল/রোজকার ব্যবহার) বললে সেই
  অনুযায়ী category/query দিয়ে search_products কল করুন (যেমন বিয়ের
  কথা বললে "wedding"/ভারী/জমকালো ধরনের কিছু খুঁজুন, ক্যাজুয়াল
  বললে হালকা/দৈনন্দিন ব্যবহারের জিনিস খুঁজুন) — শুধু tool রেজাল্টে
  যা সত্যিই আছে সেটাই সাজেস্ট করুন, কখনো নিজে থেকে প্রোডাক্ট বানাবেন
  না।
- একটা প্রোডাক্ট দেখানোর পর স্বাভাবিকভাবে (জোর করে না) get_related_products
  দিয়ে মিলিয়ে পরার মতো/একই category-র আরেকটা জিনিস সাজেস্ট করতে
  পারেন (যেমন ড্রেসের সাথে ম্যাচিং জুয়েলারি/এক্সেসরিজ — যদি সেই
  category-তে প্রোডাক্ট থাকে)। কাস্টমার আগ্রহ না দেখালে জোর করবেন
  না।
- গিফট খুঁজছে বললে (কার জন্য, কী উপলক্ষ জানার চেষ্টা করে) সেই
  অনুযায়ী search_products/get_trending_products দিয়ে উপযুক্ত কিছু
  সাজেস্ট করুন।
- কাস্টমার কী "trending"/"জনপ্রিয়"/সবাই কী কিনছে জানতে চাইলে
  get_trending_products কল করুন। লগইন করা কাস্টমার তার wishlist-এ
  কী সেভ করে রেখেছে জানতে চাইলে বা আগের পছন্দের ভিত্তিতে সাজেশন
  চাইলে get_wishlist_items কল করুন (গেস্ট/লগইন-ছাড়া কাস্টমারের
  জন্য এটা কাজ করবে না, tool error দিলে সেটা বিনয়ের সাথে বলে
  লগইন করতে বলুন)।
- Cart/Checkout নিয়ে কাস্টমার কিছু জিজ্ঞেস করলে (যেমন cart-এ কী
  আছে, কতগুলো আইটেম) সেটা শুধু frontend-এ (আপনার বাইরে) ম্যানেজ
  হয় — আপনি নিজে থেকে cart-এর সংখ্যা বানাবেন না। প্রোডাক্ট কার্ড
  দেখানোর পর কাস্টমারকে "Add to Cart"/"Buy Now" বাটন থেকেই cart-এ
  যোগ করতে বলুন (বাটন এমনিতেই কার্ডের সাথে UI-তে দেখানো হয়)।

অর্ডার স্ট্যাটাস (কাস্টমার Order ID না জানলেও):
- কাস্টমার "আমার প্রোডাক্টের কি অবস্থা/আমার অর্ডার কই" এই ধরনের
  কিছু জিজ্ঞেস করলে প্রথমেই Order ID চাইবেন না — বেশিরভাগ কাস্টমার
  এটা মনে রাখে না। বরং:
  1) কাস্টমার লগইন করা থাকলে (uid থাকলে) সরাসরি get_orders_by_phone
     কল করুন (phone ছাড়াই, লগইন তথ্য দিয়েই কাজ হয়ে যাবে)।
  2) লগইন করা না থাকলে কাস্টমারের কাছে শুধু ফোন নাম্বার (যেটা
     দিয়ে অর্ডার করেছিল) চান, তারপর get_orders_by_phone কল করুন।
  3) একাধিক অর্ডার পেলে সংক্ষেপে লিস্ট দেখান (স্ট্যাটাস সহ) এবং
     কোনটার বিস্তারিত/ইনভয়েস লাগবে জিজ্ঞেস করুন। একটাই অর্ডার
     পেলে সরাসরি তার অবস্থা জানিয়ে দিন।
  4) কাস্টমার নিজে থেকেই Order ID বলে দিলে সরাসরি get_order_status
     ব্যবহার করুন।

Admin/মানুষের সাথে কথা বলা:
- কাস্টমার Admin/মানুষ/সাপোর্ট এজেন্টের সাথে সরাসরি কথা বলতে চাইলে,
  আপনি সমাধান করতে না পারলে, বা কাস্টমার নিজে থেকে অনুরোধ করলে —
  get_admin_contact কল করে WhatsApp নাম্বার/লিংক বের করে সেটা
  স্বাভাবিকভাবে দিয়ে দিন (যেমন: "নিশ্চয়ই, এই WhatsApp নাম্বারে
  সরাসরি যোগাযোগ করতে পারেন: [নাম্বার]")। কখনো নিজে থেকে কোনো
  নাম্বার অনুমান করে বলবেন না — সবসময় tool কল করেই আসল নাম্বার
  নিন।

ডেলিভারি চার্জ:
- ডেলিভারি চার্জ সম্পর্কে যেকোনো প্রশ্নে অবশ্যই get_delivery_info
  কল করুন — কখনো নিজে থেকে সংখ্যা/এলাকার নাম বানিয়ে বলবেন না।
  কাস্টমার এলাকার নাম (জেলা) বললে সেটা district প্যারামিটারে দিয়ে
  কল করুন, তাহলে সরাসরি সঠিক চার্জ (matchedCharge) পাবেন। এলাকা
  না বললে সবগুলো tier (tiers) সংক্ষেপে বলুন এবং এলাকা জিজ্ঞেস করুন।

দামাদামি/দরকষাকষি:
- এটা fixed-price দোকান — কাস্টমার দাম কমাতে/দরদাম করতে চাইলে
  ঠিক যেভাবে একজন ভালো মানুষ সাপোর্ট এজেন্ট বলে, সেভাবে বিনয়ের
  সাথে জানান যে দামটা fixed, কমানো যাচ্ছে না (রোবটিক ভাষায় না,
  স্বাভাবিক কথোপকথনের মতো — যেমন: "আসলে এটা আমাদের ফিক্সড প্রাইজ,
  এখান থেকে কমানোর সুযোগ নেই, দুঃখিত 🙏")। এরপর প্রাসঙ্গিক কিছু
  থাকলে (যেমন ৳৩০০০+ অর্ডারে ফ্রি ডেলিভারি, বা অন্য কোনো চলমান
  অফার — get_delivery_info/search_products থেকে যা সত্যিই পাওয়া
  যায়) স্বাভাবিকভাবে উল্লেখ করতে পারেন। কখনো নিজে থেকে নতুন
  ডিসকাউন্ট/অফার বানিয়ে দেবেন না।

স্টোরের বাইরের বিষয়:
- কাস্টমার Dream Mode-এর প্রোডাক্ট/অর্ডার/ডেলিভারি/দোকান সংক্রান্ত
  নয় এমন কিছু জিজ্ঞেস করলে (যেমন সাধারণ জ্ঞান, অন্য কোম্পানি,
  ব্যক্তিগত পরামর্শ ইত্যাদি), বিনয়ের সাথে জানিয়ে দিন যে আপনি শুধু
  স্টোর সংক্রান্ত বিষয়ে সাহায্য করতে পারেন, এবং কথাটা যেন রোবটিক
  কপি-পেস্টের মতো না শোনায়, স্বাভাবিক বাক্যে বলুন (উদাহরণ ভাব:
  "দুঃখিত, এটা নিয়ে আমি সাহায্য করতে পারবো না — আমি শুধু আমাদের
  স্টোর/প্রোডাক্ট/অর্ডার সম্পর্কিত বিষয়ে সাহায্য করতে পারি। এই
  ব্যাপারে কিছু জানতে চান?")।

সঠিকতা — কখনো তথ্য বানাবেন না:
- প্রোডাক্টের নাম, দাম, স্টক, অফার — এসব বলার সময় অবশ্যই সংশ্লিষ্ট
  tool রেজাল্টে যা এসেছে হুবহু সেটাই ব্যবহার করুন (বানান/নাম নিজে
  থেকে বদলাবেন না, ছোট করে লিখলেও অর্থ/সংখ্যা একদম হুবহু রাখতে
  হবে)। tool কল না করে বা tool রেজাল্ট ছাড়া কোনো প্রোডাক্ট/দাম/
  স্টক/অর্ডার সম্পর্কে কিছু বলা সম্পূর্ণ নিষেধ।
- create_order tool সফলভাবে কল করে orderId ফেরত না পাওয়া পর্যন্ত
  কখনো কাস্টমারকে "অর্ডার কনফার্ম হয়ে গেছে" বা কোনো Order ID
  বলবেন না। tool কল করতে ব্যর্থ হলে বা tool এখনো কল করা না হয়ে
  থাকলে নিজে থেকে কোনো Order ID তৈরি করা সম্পূর্ণ নিষেধ।

নিয়মাবলী:
- প্রোডাক্টের দাম/স্টক নিয়ে কখনো নিজে থেকে অনুমান করবেন না —
  সবসময় tool কল করে আসল তথ্য নিয়ে বলুন।
- search_products কল করার সময় কাস্টমার ঠিক যে ভাষায়/বানানে
  শব্দ লিখেছে (বাংলা হলে বাংলা, ইংরেজি হলে ইংরেজি) হুবহু সেটাই
  query/category প্যারামিটারে দিন — নিজে থেকে ইংরেজিতে অনুবাদ
  করবেন না। অনুবাদ করলে আসল ডাটাবেসের (যেটা বাংলায় লেখা) সাথে
  না মিলে ভুলভাবে "প্রোডাক্ট নেই" দেখাতে পারে।
- অর্ডার নেওয়ার আগে অবশ্যই কাস্টমারের নাম, ফোন নাম্বার, পূর্ণ
  ঠিকানা এবং কোন প্রোডাক্ট কয়টা লাগবে — এই তথ্যগুলো নিশ্চিত করে
  নিন। কোনো তথ্য অস্পষ্ট থাকলে অর্ডার কনফার্ম না করে জিজ্ঞেস করুন।
- অর্ডার করার আগে একবার সংক্ষেপে সারমর্ম (প্রোডাক্ট, দাম, ঠিকানা,
  মোট) দেখিয়ে কাস্টমারের কাছে নিশ্চিত হয়ে নিন, তারপর create_order
  কল করুন।
- এখন শুধু Cash on Delivery সাপোর্ট করা হচ্ছে।
- অর্ডার স্ট্যাটাস/ইনভয়েস দেখানোর আগে ফোন নাম্বার দিয়ে যাচাই
  করে নিন, যদি কাস্টমার লগইন করা না থাকে।
- স্টক/দাম পরিবর্তনের মতো কাজ আপনি করতে পারবেন না — এটা শুধু
  Admin-রাই করতে পারেন, এমন অনুরোধ এলে বিনয়ের সাথে জানিয়ে দিন,
  এবং প্রয়োজনে get_admin_contact দিয়ে WhatsApp নাম্বার দিন।
- কোনো tool থেকে error এলে সেটা কাস্টমারকে সহজ ভাষায়, বিনয়ের
  সাথে জানান এবং পরবর্তী করণীয় (আবার চেষ্টা/সঠিক তথ্য দেওয়া/
  admin-এর সাথে কথা বলা) বলে দিন — কখনো raw error টেক্সট দেখাবেন
  না।
`.trim();

const TOOLS = [
  {
    name: "get_delivery_info",
    description:
      "ডেলিভারি চার্জ ও ফ্রি ডেলিভারির শর্ত জানুন — কাস্টমার " +
      "ডেলিভারি চার্জ/ফি নিয়ে কিছু জিজ্ঞেস করলে অবশ্যই এটা কল " +
      "করুন, নিজে থেকে সংখ্যা বলবেন না।",
    input_schema: {
      type: "object",
      properties: {
        district: {
          type: "string",
          description:
            "কাস্টমারের জেলা/এলাকার নাম (জানা থাকলে) — দিলে সেই " +
            "এলাকার জন্য সঠিক চার্জ (matchedCharge) সরাসরি পাবেন।",
        },
      },
    },
  },
  {
    name: "search_products",
    description: "নাম/ক্যাটাগরি/বর্ণনা দিয়ে প্রোডাক্ট খুঁজুন।",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "সার্চ টেক্সট" },
        category: { type: "string", description: "ক্যাটাগরি (ঐচ্ছিক)" },
      },
    },
  },
  {
    name: "check_stock",
    description: "নির্দিষ্ট প্রোডাক্টের বর্তমান স্টক ও দাম চেক করুন।",
    input_schema: {
      type: "object",
      properties: {
        productId: { type: "string" },
      },
      required: ["productId"],
    },
  },
  {
    name: "get_related_products",
    description:
      "একটা প্রোডাক্টের সাথে মিলিয়ে (একই category) আরও প্রোডাক্ট " +
      "সাজেস্ট করুন — outfit matching/combo সাজেশনের জন্য ব্যবহার করুন।",
    input_schema: {
      type: "object",
      properties: {
        productId: { type: "string", description: "যে প্রোডাক্টের সাথে মেলাতে চান (ঐচ্ছিক)" },
        category: { type: "string", description: "category সরাসরি দিলে productId লাগবে না (ঐচ্ছিক)" },
      },
    },
  },
  {
    name: "get_wishlist_items",
    description:
      "লগইন করা কাস্টমারের wishlist-এ সেভ করা প্রোডাক্টগুলো দেখুন — " +
      "personalized সাজেশনের জন্য ব্যবহার করুন। গেস্টের জন্য কাজ করবে না।",
    input_schema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_trending_products",
    description:
      "সাম্প্রতিক অর্ডারের ভিত্তিতে সবচেয়ে বেশি বিক্রি হওয়া/জনপ্রিয় " +
      "প্রোডাক্টগুলো দেখুন।",
    input_schema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_order_status",
    description: "একটা অর্ডারের বর্তমান অবস্থা দেখুন।",
    input_schema: {
      type: "object",
      properties: {
        orderId: { type: "string" },
        phone: {
          type: "string",
          description: "যাচাইয়ের জন্য কাস্টমারের ফোন নাম্বার (যদি লগইন করা না থাকে)",
        },
      },
      required: ["orderId"],
    },
  },
  {
    name: "get_orders_by_phone",
    description:
      "কাস্টমার Order ID না জানলে, তার ফোন নাম্বার (বা লগইন থাকলে " +
      "একাউন্ট) দিয়ে সাম্প্রতিক অর্ডারগুলো খুঁজে বের করুন।",
    input_schema: {
      type: "object",
      properties: {
        phone: {
          type: "string",
          description:
            "কাস্টমারের ফোন নাম্বার (যদি লগইন করা না থাকে — লগইন " +
            "থাকলে খালি রাখা যাবে)",
        },
      },
    },
  },
  {
    name: "get_admin_contact",
    description:
      "Admin/মানুষের সাথে সরাসরি কথা বলার জন্য WhatsApp নাম্বার/লিংক " +
      "বের করুন।",
    input_schema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "create_order",
    description:
      "কাস্টমারের তথ্য কনফার্ম হওয়ার পর নতুন অর্ডার তৈরি করুন (শুধু Cash on Delivery)।",
    input_schema: {
      type: "object",
      properties: {
        customerName: { type: "string" },
        phone: { type: "string" },
        address: { type: "string" },
        thana: { type: "string" },
        district: { type: "string" },
        notes: { type: "string" },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              productId: { type: "string" },
              qty: { type: "number" },
            },
            required: ["productId", "qty"],
          },
        },
      },
      required: ["customerName", "phone", "address", "items"],
    },
  },
  {
    name: "generate_invoice",
    description: "একটা অর্ডারের জন্য টেক্সট ইনভয়েস বানান (চ্যাটেই পড়ার জন্য)।",
    input_schema: {
      type: "object",
      properties: {
        orderId: { type: "string" },
        phone: { type: "string" },
      },
      required: ["orderId"],
    },
  },
  {
    name: "generate_invoice_pdf",
    description:
      "একটা অর্ডারের জন্য প্রকৃত ডাউনলোডযোগ্য PDF ইনভয়েস বানান। " +
      "কাস্টমার PDF/ডাউনলোড/প্রিন্ট করার মতো ইনভয়েস চাইলে এটা কল করুন।",
    input_schema: {
      type: "object",
      properties: {
        orderId: { type: "string" },
        phone: { type: "string" },
      },
      required: ["orderId"],
    },
  },
];

async function runTool(name, input, context) {

  switch (name) {

    case "get_delivery_info":
      return getDeliveryInfo(input);

    case "search_products":
      return searchProducts(input);

    case "check_stock":
      return checkStock(input);

    case "get_related_products":
      return getRelatedProducts(input);

    case "get_wishlist_items":
      return getWishlistItems({ uid: context.uid });

    case "get_trending_products":
      return getTrendingProducts();

    case "get_order_status":
      return getOrderStatus({ ...input, uid: context.uid });

    case "get_orders_by_phone":
      return getOrdersByPhone({ ...input, uid: context.uid });

    case "get_admin_contact":
      return getAdminContact();

    case "create_order":
      return createOrderViaChat({ ...input, uid: context.uid });

    case "generate_invoice":
      return generateInvoiceText({ ...input, uid: context.uid });

    case "generate_invoice_pdf":
      return generateInvoicePdf({ ...input, uid: context.uid });

    default:
      return { error: `Unknown tool: ${name}` };

  }

}

// -------------------------------------------------
// tool রেজাল্ট থেকে UI-এর জন্য গুরুত্বপূর্ণ structured ডেটা
// (প্রোডাক্ট কার্ড, অর্ডার লিস্ট, admin contact) আলাদাভাবে জমা
// করা — যাতে টেক্সট রিপ্লাইয়ের পাশাপাশি frontend সেগুলো কার্ড/
// বাটন হিসেবে সুন্দরভাবে দেখাতে পারে। AI নিজে থেকে এসব টেক্সটে
// বিস্তারিত না লিখলেও (system prompt-এ বলা আছে সংক্ষেপে লিখতে),
// কাস্টমার আসল ডেটা (ছবি, দাম, WhatsApp বাটন) ঠিকই দেখতে পাবে।
// -------------------------------------------------
function collectUiData(collected, toolName, output) {

  if (!output || output.error) return;

  if (toolName === "search_products" && Array.isArray(output)) {

    for (const p of output) {
      if (p && p.id && !collected.products.some((x) => x.id === p.id)) {
        collected.products.push(p);
      }
    }

  } else if (toolName === "check_stock" && output.id) {

    if (!collected.products.some((x) => x.id === output.id)) {
      collected.products.push(output);
    }

  } else if (toolName === "get_related_products" && Array.isArray(output)) {

    for (const p of output) {
      if (p && p.id && !collected.products.some((x) => x.id === p.id)) {
        collected.products.push(p);
      }
    }

  } else if (
    (toolName === "get_wishlist_items" || toolName === "get_trending_products") &&
    Array.isArray(output.items)
  ) {

    for (const p of output.items) {
      if (p && p.id && !collected.products.some((x) => x.id === p.id)) {
        collected.products.push(p);
      }
    }

  } else if (toolName === "get_orders_by_phone" && Array.isArray(output.orders)) {

    for (const o of output.orders) {
      if (o && o.id && !collected.orders.some((x) => x.id === o.id)) {
        collected.orders.push(o);
      }
    }

  } else if (toolName === "get_order_status" && output.id) {

    if (!collected.orders.some((x) => x.id === output.id)) {
      collected.orders.push(output);
    }

  } else if (toolName === "get_admin_contact" && output.whatsapp) {

    collected.adminContact = output;

  } else if (toolName === "generate_invoice_pdf" && output.pdfUrl) {

    collected.invoice = { orderId: output.orderId, pdfUrl: output.pdfUrl };

  }

}

// -------------------------------------------------
// একটা নির্দিষ্ট provider attempt দিয়ে পুরো tool-use loop চালানো
// -------------------------------------------------
// -------------------------------------------------
// একটা provider call-কে সাময়িক rate-limit (HTTP 429) থেকে বাঁচানো।
// প্রতিটা user মেসেজে internally একাধিক (সর্বোচ্চ ৫টা) API কল
// লাগতে পারে (search → check_stock → create_order ইত্যাদি প্রতিটা
// tool round-trip-এ একটা কল), তাই ফ্রি tier-এর per-minute quota
// দ্রুত শেষ হয়ে যেতে পারে। 429 পেলে সাথে সাথে পরের provider-এ না
// গিয়ে ১-২ সেকেন্ড wait করে একবার আবার চেষ্টা করা হচ্ছে — বেশিরভাগ
// per-minute rate-limit কয়েক সেকেন্ডেই রিসেট হয়ে যায়।
// -------------------------------------------------
async function sendTurnWithRetry(attempt, args) {

  try {

    return await attempt.provider.sendTurn(args);

  } catch (err) {

    if (err.status === 429) {

      console.log(`AI CHAT — "${attempt.key}" rate-limited, retrying once...`);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return await attempt.provider.sendTurn(args);

    }

    throw err;

  }

}

async function runConversation({ attempt, genericMessages, uid }) {

  if (!attempt.apiKey) {

    const err = new Error(`${attempt.key} — API key সেট করা নেই।`);
    err.status = 401;
    throw err;

  }

  // AI নিজে থেকে জানে না কাস্টমার লগইন করা আছে কিনা (uid শুধু
  // ব্যাকএন্ডেই থাকে) — তাই প্রতি রিকোয়েস্টে এটা স্পষ্টভাবে system
  // prompt-এ জানিয়ে দেওয়া হচ্ছে, নাহলে AI সবসময় ধরে নেয় কাস্টমার
  // লগইন করা নেই এবং অযথা ফোন নাম্বার চায়।
  const loginStatusNote = uid
    ? "\n\n[সিস্টেম নোট: এই কাস্টমার এই মুহূর্তে লগইন করা আছেন। " +
      "অর্ডার স্ট্যাটাস/হিস্ট্রি জিজ্ঞেস করলে ফোন নাম্বার না চেয়ে " +
      "সরাসরি get_orders_by_phone কল করুন (phone প্যারামিটার খালি " +
      "রেখে) — uid থেকেই তার অর্ডার পাওয়া যাবে।]"
    : "\n\n[সিস্টেম নোট: এই কাস্টমার লগইন করা নেই (guest)। অর্ডার " +
      "স্ট্যাটাস জিজ্ঞেস করলে অবশ্যই ফোন নাম্বার চেয়ে নিন।]";

  const systemPromptForRequest = SYSTEM_PROMPT + loginStatusNote;

  let conversation = genericMessages;

  const collected = { products: [], orders: [], adminContact: null, invoice: null };

  for (let i = 0; i < 5; i++) {

    const result = await sendTurnWithRetry(attempt, {
      apiKey: attempt.apiKey,
      systemPrompt: systemPromptForRequest,
      tools: TOOLS,
      genericMessages: conversation,
    });

    conversation = [
      ...conversation,
      { role: "assistant", parts: result.assistantParts },
    ];

    if (!result.toolCalls.length) {
      return { text: result.textReply || "", ...collected };
    }

    const toolResultParts = [];

    for (const call of result.toolCalls) {

      const output = await runTool(call.name, call.input, { uid });

      collectUiData(collected, call.name, output);

      toolResultParts.push({
        type: "tool_result",
        id: call.id,
        name: call.name,
        output,
      });

    }

    conversation = [
      ...conversation,
      { role: "user", parts: toolResultParts },
    ];

  }

  return {
    text:
      "দুঃখিত, এই মুহূর্তে অনুরোধটা প্রসেস করতে পারছি না। " +
      "আবার চেষ্টা করুন বা সরাসরি WhatsApp-এ যোগাযোগ করুন।",
    ...collected,
  };

}

exports.aiChat = onCall(
  { secrets: [geminiApiKey, groqApiKey] },
  async (request) => {

    try {

      const { messages } = request.data || {};

      if (!messages || !Array.isArray(messages) || !messages.length) {

        throw new HttpsError(
          "invalid-argument",
          "Missing chat messages."
        );

      }

      const uid = request.auth?.uid || null;

      // কাস্টমার ছবি সংযুক্ত করে পাঠালে (m.image = {mimeType, data})
      // সেটা একটা আলাদা "image" part হিসেবে যোগ করা হচ্ছে — Gemini
      // (প্রাইমারি) এটা সরাসরি দেখতে পারে। Groq fallback ব্যবহার
      // হলে দেখতে পারবে না — openAiCompatible.js নিজে থেকেই তখন
      // "ছবি দেখা যাচ্ছে না" নোটে বদলে দেয়।
      const genericMessages = messages.map((m) => {

        const parts = [{ type: "text", text: m.content }];

        if (m.image && m.image.data) {

          parts.push({
            type: "image",
            mimeType: m.image.mimeType || "image/jpeg",
            data: m.image.data,
          });

        }

        return { role: m.role, parts };

      });

      // ফ্রি tier-এ (Gemini + Groq) টোকেন/রিকোয়েস্ট বাজেট সীমিত, আর
      // ক্লায়েন্ট প্রতিবার পুরো কথোপকথনের ইতিহাস পাঠায় — তাই লম্বা
      // চ্যাটে (যেমন checkout flow) টোকেন সংখ্যা বেড়ে গিয়ে Groq-এর
      // ১২০০০ TPM লিমিট ছাড়িয়ে যেতে পারে (413 error)। শুধু সাম্প্রতিক
      // কিছু মেসেজ পাঠিয়ে এটা এড়ানো হচ্ছে — পুরনো প্রসঙ্গ হারালেও
      // order flow-এর জন্য এটুকু যথেষ্ট (কাস্টমারের নাম/ফোন/ঠিকানা
      // সাধারণত সাম্প্রতিক মেসেজেই থাকে)।
      const MAX_HISTORY_MESSAGES = 16;
      const trimmedMessages =
        genericMessages.length > MAX_HISTORY_MESSAGES
          ? genericMessages.slice(-MAX_HISTORY_MESSAGES)
          : genericMessages;

      // চেইন: প্রথমে Gemini (ফ্রি), ফেল করলে/rate-limit হলে Groq
      // (ফ্রি fallback) — দুটোই কোনো টাকা লাগে না।
      const chain = [
        { key: "gemini", provider: geminiProvider, apiKey: geminiApiKey.value() },
        { key: "groq-llama-3.3-70b", provider: groqProvider, apiKey: groqApiKey.value() },
      ];

      let lastError = null;

      for (const attempt of chain) {

        try {

          const result = await runConversation({
            attempt,
            genericMessages: trimmedMessages,
            uid,
          });

          return {
            reply: result.text,
            providerUsed: attempt.key,
            products: result.products,
            orders: result.orders,
            adminContact: result.adminContact,
            invoice: result.invoice,
          };

        } catch (err) {

          console.log(`AI CHAT — "${attempt.key}" failed:`, err.message);
          lastError = err;
          continue; // Gemini ব্যর্থ হলে Groq দিয়ে আবার চেষ্টা করবে

        }

      }

      throw lastError || new Error("সব provider ব্যর্থ হয়েছে।");

    } catch (error) {

      console.log("AI CHAT ERROR:", error);

      if (error instanceof HttpsError) {
        throw error;
      }

      throw new HttpsError(
        "internal",
        `AI_CHAT_ERROR: ${error.message || error}`
      );

    }

  }
);
