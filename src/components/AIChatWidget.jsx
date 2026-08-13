import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/functions";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import { useSettings } from "../context/SettingsContext";
import { addWishlistItem } from "../services/wishlistService";

// =================================================
// AI CHAT WIDGET — Dream AI থিম
// Home/Shop-এর যেকোনো লেআউটে <AIChatWidget /> বসিয়ে দিলেই কাজ
// করবে। এটা একটা ভাসমান বাটন হিসেবে দেখাবে, যেটা আগে যেমন
// WhatsApp বাটন যেকোনো জায়গায় টেনে (drag) নেওয়া যেতো, ঠিক
// সেভাবেই স্ক্রিনের যেকোনো জায়গায় সরানো যাবে এবং পজিশন সেভ
// থাকবে।
//
// এই ভার্সনে যা আছে:
// - localStorage-এ চ্যাট history সেভ থাকে, রিফ্রেশ করলেও হারায় না
// - localStorage-এ বাটনের পজিশন সেভ থাকে (drag করে যেখানে রাখা হয়)
// - চ্যাট বন্ধ থাকা অবস্থায় নতুন রিপ্লাই এলে বাটনে unread badge
// - চ্যাট শুরুতে quick-action কার্ড (customizable via `quickActions` prop)
// - প্রথমবার ওয়েবসাইটে ঢুকলে একবার greeting বাবল popup হয়
// =================================================

const STORAGE_KEY = "dreamModeChatHistory";
const WIDGET_POSITION_KEY = "dreamAIWidgetPosition";
const GREETING_SHOWN_KEY = "dreamAIGreetingShown";

const BUTTON_SIZE = 58;
const PANEL_MARGIN = 16;
const PANEL_WIDTH = 380;
const PANEL_HEIGHT = 560;
const BUBBLE_WIDTH = 240;
const BUBBLE_HEIGHT_ESTIMATE = 110;

const WELCOME_MESSAGE = {
  role: "assistant",
  display:
    "আসসালামু আলাইকুম! আমি Dream AI, আপনার শপিং সহকারী। " +
    "প্রোডাক্ট খুঁজে দেওয়া, অর্ডার করা বা আপনার অর্ডারের " +
    "স্ট্যাটাস জানাতে আমি সাহায্য করতে পারি। কী জানতে চান?",
};

// কাস্টমার-চ্যাটের ডিফল্ট quick-action কার্ড। Admin প্যানেলে
// আলাদা `quickActions` prop দিয়ে ওভাররাইড করা হয়।
const DEFAULT_QUICK_ACTIONS = [
  {
    icon: "🛍️",
    title: "প্রোডাক্ট খুঁজুন",
    subtitle: "পণ্য অনুসন্ধান করুন",
    prompt: "আমাকে কিছু ভালো প্রোডাক্ট সাজেস্ট করুন",
  },
  {
    icon: "🛠️",
    title: "এডমিন হেল্প",
    subtitle: "সরাসরি যোগাযোগ করুন",
    type: "adminHelp",
  },
  {
    icon: "🚚",
    title: "ডেলিভারি তথ্য",
    subtitle: "শিপিং ও ডেলিভারি",
    prompt: "ডেলিভারি চার্জ ও সময় সম্পর্কে জানতে চাই",
  },
  {
    icon: "↩️",
    title: "রিটার্ন পলিসি",
    subtitle: "রিটার্ন ও রিফান্ড",
    prompt: "আপনাদের রিটার্ন পলিসি কী?",
  },
];

function loadStoredMessages(storageKey, welcomeMessage) {

  try {

    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : null;

    if (Array.isArray(parsed) && parsed.length) {
      return parsed;
    }

  } catch (error) {
    console.error(error);
  }

  return [welcomeMessage];

}

function formatTime() {

  try {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (error) {
    return "";
  }

}

// -------------------------------------------------
// রোবট আইকন — সাদামাটা browser emoji-র বদলে ভেক্টর SVG আইকন,
// যাতে সব ডিভাইসে একই সাইজ ও লুক দেখায়। `bodyColor` হলো রোবটের
// মূল বডি/কানের রং, `screenColor` হলো মুখের স্ক্রিনের রং।
// -------------------------------------------------
function RobotIcon({ className = "h-6 w-6", bodyColor = "#FFFFFF", screenColor = "#4C1D95" }) {

  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      <line x1="32" y1="4" x2="32" y2="13" stroke={bodyColor} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="32" cy="4" r="4" fill={bodyColor} />

      <rect x="2" y="25" width="8" height="15" rx="4" fill={bodyColor} />
      <rect x="54" y="25" width="8" height="15" rx="4" fill={bodyColor} />

      <rect x="10" y="13" width="44" height="37" rx="18" fill={bodyColor} />

      <rect x="17" y="21" width="30" height="22" rx="11" fill={screenColor} />

      <circle cx="26.5" cy="32" r="3.2" fill={bodyColor} />
      <circle cx="37.5" cy="32" r="3.2" fill={bodyColor} />

      <path
        d="M26 38c2.2 2 9.8 2 12 0"
        stroke={bodyColor}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );

}

// -------------------------------------------------
// প্রোডাক্ট কার্ড — search_products/check_stock থেকে পাওয়া
// প্রোডাক্টগুলো ছবি, নাম, দাম, স্টক সহ কার্ড আকারে দেখায়।
// -------------------------------------------------
function ProductCards({ products }) {

  const { addToCart, cartCount } = useCart() || {};
  const { user } = useAuth() || {};
  const navigate = useNavigate();
  const [addedId, setAddedId] = useState(null);
  const [addedCartCount, setAddedCartCount] = useState(0);
  const [wishedId, setWishedId] = useState(null);

  if (!products || !products.length) return null;

  const handleWishlist = async (e, p) => {

    e.preventDefault();
    e.stopPropagation();

    if (!user?.uid) return;

    try {
      await addWishlistItem(user.uid, p);
      setWishedId(p.id);
      setTimeout(() => setWishedId((cur) => (cur === p.id ? null : cur)), 2500);
    } catch (error) {
    console.error(error);
  }

  };

  const handleAddToCart = (e, p) => {

    e.preventDefault();
    e.stopPropagation();

    if (!p.inStock || !addToCart) return;

    addToCart(p);
    setAddedId(p.id);
    setAddedCartCount((cartCount || 0) + 1);
    setTimeout(() => setAddedId((cur) => (cur === p.id ? null : cur)), 2500);

  };

  const handleBuyNow = (e, p) => {

    e.preventDefault();
    e.stopPropagation();

    if (!p.inStock || !addToCart) return;

    addToCart(p);
    navigate("/checkout");

  };

  return (
    <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
      {products.map((p) => (
        <div
          key={p.id}
          className="block w-36 flex-shrink-0 rounded-xl border border-gray-200
                     bg-white p-2 text-left shadow-sm hover:shadow-md
                     transition-shadow"
        >
          <Link to={`/product/${p.id}`}>
            <div className="relative mb-2 h-24 w-full overflow-hidden rounded-lg bg-gray-100">
              {p.offerPrice > 0 && p.price > p.offerPrice && (
                <span className="absolute left-1 top-1 z-10 rounded-full bg-red-600
                                  px-1.5 py-0.5 text-[9px] font-bold text-white shadow">
                  {Math.round(((p.price - p.offerPrice) / p.price) * 100)}% OFF
                </span>
              )}
              {user?.uid && (
                <button
                  type="button"
                  onClick={(e) => handleWishlist(e, p)}
                  aria-label="Wishlist-এ যোগ করুন"
                  className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center
                             justify-center rounded-full bg-white/90 text-sm shadow
                             hover:bg-white"
                >
                  {wishedId === p.id ? "❤️" : "🤍"}
                </button>
              )}
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl">
                  📦
                </div>
              )}
            </div>

            <p className="line-clamp-2 text-xs font-medium text-gray-800">
              {p.name}
            </p>

            <div className="mt-1 flex items-baseline gap-1">
              {p.offerPrice > 0 ? (
                <>
                  <span className="text-sm font-bold text-violet-700">
                    ৳{p.offerPrice}
                  </span>
                  <span className="text-[11px] text-gray-400 line-through">
                    ৳{p.price}
                  </span>
                </>
              ) : (
                <span className="text-sm font-bold text-violet-700">৳{p.price}</span>
              )}
            </div>

            <p
              className={`mt-1 text-[11px] font-medium ${
                p.inStock ? "text-green-600" : "text-red-500"
              }`}
            >
              {p.inStock ? `স্টকে আছে (${p.stock})` : "স্টক নেই"}
            </p>
          </Link>

          {p.inStock && (
            <div className="mt-2 space-y-1">
              <button
                type="button"
                onClick={(e) => handleBuyNow(e, p)}
                className="w-full rounded-lg bg-violet-600 px-2 py-1 text-[11px]
                           font-semibold text-white hover:bg-violet-700"
              >
                Buy Now
              </button>
              <button
                type="button"
                onClick={(e) => handleAddToCart(e, p)}
                className="w-full rounded-lg border border-violet-600 px-2 py-1
                           text-[11px] font-semibold text-violet-700
                           hover:bg-violet-50"
              >
                {addedId === p.id ? "✓ Cart-এ যোগ হয়েছে" : "🛒 Add to Cart"}
              </button>
              {addedId === p.id && (
                <button
                  type="button"
                  onClick={() => navigate("/checkout")}
                  className="w-full rounded-lg bg-green-50 px-2 py-1 text-[10px]
                             font-medium text-green-700 hover:bg-green-100"
                >
                  Cart-এ এখন {addedCartCount} আইটেম — Checkout করুন
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

}

// -------------------------------------------------
// অর্ডার কার্ড — get_order_status/get_orders_by_phone থেকে পাওয়া
// অর্ডারগুলো সংক্ষেপে দেখায়।
// -------------------------------------------------
function OrderCards({ orders }) {

  if (!orders || !orders.length) return null;

  return (
    <div className="mt-2 space-y-2">
      {orders.map((o) => (
        <div
          key={o.id}
          className="rounded-xl border border-gray-200 bg-white p-3 text-xs shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-gray-500">
              #{o.id.slice(-8)}
            </span>
            <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[11px] text-white">
              {o.status}
            </span>
          </div>

          {o.itemsSummary && (
            <p className="mt-1 text-gray-700">{o.itemsSummary}</p>
          )}

          <div className="mt-1 flex items-center justify-between text-gray-600">
            <span>পেমেন্ট: {o.paymentStatus}</span>
            {!!o.total && <span className="font-semibold">৳{o.total}</span>}
          </div>
        </div>
      ))}
    </div>
  );

}

// -------------------------------------------------
// ইনভয়েস কার্ড — generate_invoice_pdf থেকে পাওয়া PDF লিংক
// ডাউনলোড বাটন হিসেবে দেখায়।
// -------------------------------------------------
function InvoiceCard({ invoice }) {

  if (!invoice || !invoice.pdfUrl) return null;

  return (
    <a
      href={invoice.pdfUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 flex items-center gap-2 rounded-xl border border-blue-200
                 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700
                 hover:bg-blue-100"
    >
      📄 ইনভয়েস PDF ডাউনলোড করুন
    </a>
  );

}

// -------------------------------------------------
// Admin/WhatsApp বাটন — get_admin_contact থেকে পাওয়া নাম্বার দিয়ে
// সরাসরি WhatsApp চ্যাট খোলার বাটন দেখায়।
// -------------------------------------------------
function AdminContactCard({ adminContact }) {

  if (!adminContact || !adminContact.whatsapp) return null;

  return (
    <a
      href={adminContact.whatsappLink || `https://wa.me/${adminContact.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 flex items-center gap-2 rounded-xl border border-green-200
                 bg-green-50 px-3 py-2 text-xs font-medium text-green-700
                 hover:bg-green-100"
    >
      💬 WhatsApp-এ Admin-এর সাথে কথা বলুন ({adminContact.whatsapp})
    </a>
  );

}

// -------------------------------------------------
// এডমিন হেল্প কার্ড — "এডমিন হেল্প" quick-action এ ক্লিক করলে
// সরাসরি (কোনো AI কল ছাড়াই) এডমিনের WhatsApp নাম্বার ও Store
// ইমেইল দেখায়।
// -------------------------------------------------
function AdminHelpCard({ adminHelp }) {

  if (!adminHelp || (!adminHelp.whatsapp && !adminHelp.email)) return null;

  return (
    <div className="mt-2 space-y-1.5">
      {adminHelp.whatsapp && (
        <a
          href={`https://wa.me/${adminHelp.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl border border-green-200
                     bg-green-50 px-3 py-2 text-xs font-medium text-green-700
                     hover:bg-green-100"
        >
          💬 WhatsApp: {adminHelp.whatsapp}
        </a>
      )}

      {adminHelp.email && (
        <a
          href={`mailto:${adminHelp.email}`}
          className="flex items-center gap-2 rounded-xl border border-blue-200
                     bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700
                     hover:bg-blue-100"
        >
          ✉️ ইমেইল: {adminHelp.email}
        </a>
      )}
    </div>
  );

}

// -------------------------------------------------
// Quick-reply চিপস — প্রোডাক্ট কার্ড দেখানো হলে তার নিচে ছোট
// suggested-question বাটন দেখায়, যাতে কাস্টমার টাইপ না করেই এক
// ট্যাপে পরের প্রশ্ন জিজ্ঞেস করতে পারে (related products/trending/
// checkout ইত্যাদি)।
// -------------------------------------------------
function QuickReplyChips({ products, onPick, disabled }) {

  if (!products || !products.length) return null;

  const first = products[0];

  const chips = [
    { label: "🔁 আরও মিলিয়ে দেখান", prompt: `${first.name}-এর সাথে মিলিয়ে আর কী নেওয়া যায়?` },
    { label: "🔥 ট্রেন্ডিং প্রোডাক্ট", prompt: "এখন সবচেয়ে বেশি বিক্রি হচ্ছে এমন প্রোডাক্ট দেখান" },
    { label: "🚚 ডেলিভারি চার্জ", prompt: "ডেলিভারি চার্জ কত হবে?" },
  ];

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {chips.map((c) => (
        <button
          key={c.label}
          type="button"
          disabled={disabled}
          onClick={() => onPick(c.prompt)}
          className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1
                     text-[11px] font-medium text-violet-700 hover:bg-violet-100
                     disabled:opacity-50"
        >
          {c.label}
        </button>
      ))}
    </div>
  );

}

export default function AIChatWidget({
  functionName = "aiChat",
  storageKey = STORAGE_KEY,
  title = "Dream AI",
  subtitle = "আপনার শপিং সহকারী",
  welcomeText = WELCOME_MESSAGE.display,
  quickActions = DEFAULT_QUICK_ACTIONS,
} = {}) {

  const { user } = useAuth() || {};
  const { settings } = useSettings();
  const { cart } = useCart() || {};
  const navigate = useNavigate();

  // লগইন করা কাস্টমারকে নাম ধরে শুভেচ্ছা জানানো — নাম না থাকলে
  // (গেস্ট বা নাম সেট করা নেই) ডিফল্ট সাধারণ welcome text দেখানো হয়।
  const displayName = (user?.name || user?.displayName || "").trim();
  const personalizedWelcomeText = displayName
    ? `আসসালামু আলাইকুম, ${displayName}! আমি Dream AI, আপনার শপিং সহকারী। ` +
      "প্রোডাক্ট খুঁজে দেওয়া, অর্ডার করা বা আপনার অর্ডারের স্ট্যাটাস জানাতে " +
      "আমি সাহায্য করতে পারি। কী জানতে চান?"
    : welcomeText;

  const welcomeMessage = { role: "assistant", display: personalizedWelcomeText };

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState(() => loadStoredMessages(storageKey, welcomeMessage));
  const [attachedImage, setAttachedImage] = useState(null); // { dataUrl, mimeType }
  const [imageError, setImageError] = useState("");

  // ভাসমান বাটনের পজিশন — WhatsApp বাটনের মতোই যেকোনো জায়গায় drag করা যাবে
  const [position, setPosition] = useState(() => ({
    x: Math.max(0, window.innerWidth - BUTTON_SIZE - 20),
    y: Math.max(0, window.innerHeight - BUTTON_SIZE - 150),
  }));
  const [dragging, setDragging] = useState(false);

  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const dragStateRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0, moved: false });
  const cartRecoveryShownRef = useRef(false);
  const proactiveCheckedRef = useRef(false);

  const MAX_IMAGE_MB = 4;

  // --------- ইউজার লগইন তথ্য দেরিতে (async) লোড হলে, এখনো কথোপকথন
  // শুরু না হয়ে থাকলে (শুধু welcome message আছে) নাম দিয়ে
  // greeting আপডেট করা — চলমান কথোপকথন থাকলে ছোঁয়া হয় না ---------
  useEffect(() => {

    if (!displayName) return;

    setMessages((prev) => {

      if (prev.length !== 1 || prev[0].role !== "assistant") return prev;
      if (prev[0].display === personalizedWelcomeText) return prev;

      return [{ role: "assistant", display: personalizedWelcomeText }];

    });

  }, [displayName, personalizedWelcomeText]);

  // --------- সেভ করা পজিশন লোড (মাউন্টে একবার) ---------
  useEffect(() => {

    try {

      const saved = localStorage.getItem(WIDGET_POSITION_KEY);

      if (saved) {

        const oldPosition = JSON.parse(saved);

        const safePosition = {
          x: Math.min(Math.max(0, oldPosition.x), window.innerWidth - BUTTON_SIZE),
          y: Math.min(Math.max(0, oldPosition.y), window.innerHeight - BUTTON_SIZE),
        };

        setPosition(safePosition);

      }

    } catch (error) {
    console.error(error);
  }

  }, []);

  // --------- প্রথমবার ওয়েবসাইটে ঢুকলে একবার greeting বাবল দেখানো ---------
  useEffect(() => {

    let showTimer;
    let hideTimer;

    try {

      const alreadyShown = localStorage.getItem(GREETING_SHOWN_KEY);

      if (!alreadyShown) {

        showTimer = setTimeout(() => {

          setShowGreeting(true);

          try {
            localStorage.setItem(GREETING_SHOWN_KEY, "1");
          } catch (error) {
    console.error(error);
  }

          hideTimer = setTimeout(() => setShowGreeting(false), 9000);

        }, 1400);

      }

    } catch (error) {
    console.error(error);
  }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };

  }, []);

  const getPoint = (e) => {

    if (e.touches && e.touches[0]) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }

    return { x: e.clientX, y: e.clientY };

  };

  const handlePointerDown = (e) => {

    setShowGreeting(false);

    const point = getPoint(e);

    dragStateRef.current = {
      startX: point.x,
      startY: point.y,
      startPosX: position.x,
      startPosY: position.y,
      moved: false,
    };

    setDragging(true);

  };

  const handlePointerMove = (e) => {

    const point = getPoint(e);
    const dx = point.x - dragStateRef.current.startX;
    const dy = point.y - dragStateRef.current.startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      dragStateRef.current.moved = true;
    }

    const nextX = Math.min(
      Math.max(0, dragStateRef.current.startPosX + dx),
      window.innerWidth - BUTTON_SIZE
    );

    const nextY = Math.min(
      Math.max(0, dragStateRef.current.startPosY + dy),
      window.innerHeight - BUTTON_SIZE
    );

    setPosition({ x: nextX, y: nextY });

  };

  const handlePointerUp = () => {

    setDragging(false);

    setPosition((currentPosition) => {

      try {
        localStorage.setItem(WIDGET_POSITION_KEY, JSON.stringify(currentPosition));
      } catch (error) {
    console.error(error);
  }

      return currentPosition;

    });

    if (!dragStateRef.current.moved) {
      setOpen((o) => !o);
    }

  };

  // drag চলাকালীন window-জুড়ে মুভমেন্ট ট্র্যাক করা হয়, যাতে বাটনের
  // বাইরে দ্রুত মাউস সরে গেলেও drag হারিয়ে না যায়
  useEffect(() => {

    if (!dragging) return;

    const onMove = (e) => handlePointerMove(e);
    const onUp = () => handlePointerUp();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  // বাটনের বর্তমান পজিশনের কাছাকাছি স্ক্রিনে জায়গা অনুযায়ী চ্যাট প্যানেল বসানো
  const getPanelStyle = () => {

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const panelWidth = Math.min(PANEL_WIDTH, vw - PANEL_MARGIN * 2);
    const panelHeight = Math.min(PANEL_HEIGHT, Math.floor(vh * 0.75));

    const buttonCenterX = position.x + BUTTON_SIZE / 2;
    const buttonCenterY = position.y + BUTTON_SIZE / 2;

    const openToLeft = buttonCenterX > vw / 2;
    const openUpward = buttonCenterY > vh / 2;

    let left = openToLeft
      ? position.x + BUTTON_SIZE - panelWidth
      : position.x;

    left = Math.min(Math.max(PANEL_MARGIN, left), vw - panelWidth - PANEL_MARGIN);

    let top = openUpward
      ? position.y - panelHeight - 12
      : position.y + BUTTON_SIZE + 12;

    top = Math.min(Math.max(PANEL_MARGIN, top), vh - panelHeight - PANEL_MARGIN);

    return { left, top, width: panelWidth, height: panelHeight };

  };

  // greeting বাবলের পজিশন — বাটনের কাছাকাছি, ছোট সাইজের জন্য আলাদা হিসাব
  const getGreetingStyle = () => {

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const bubbleWidth = Math.min(BUBBLE_WIDTH, vw - PANEL_MARGIN * 2);

    const buttonCenterX = position.x + BUTTON_SIZE / 2;
    const buttonCenterY = position.y + BUTTON_SIZE / 2;

    const openToLeft = buttonCenterX > vw / 2;
    const openUpward = buttonCenterY > vh / 2;

    let left = openToLeft
      ? position.x + BUTTON_SIZE - bubbleWidth
      : position.x;

    left = Math.min(Math.max(PANEL_MARGIN, left), vw - bubbleWidth - PANEL_MARGIN);

    let top = openUpward
      ? position.y - BUBBLE_HEIGHT_ESTIMATE - 10
      : position.y + BUTTON_SIZE + 10;

    top = Math.min(Math.max(PANEL_MARGIN, top), vh - BUBBLE_HEIGHT_ESTIMATE - PANEL_MARGIN);

    return { left, top, width: bubbleWidth };

  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // একই ছবি আবার সিলেক্ট করলেও change event ফায়ার হবে

    if (!file) return;

    setImageError("");

    if (!file.type.startsWith("image/")) {
      setImageError("শুধু ছবি (image) ফাইল সংযুক্ত করা যাবে।");
      return;
    }

    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setImageError(`ছবিটি ${MAX_IMAGE_MB}MB-এর বেশি বড় — একটু ছোট ছবি দিন।`);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAttachedImage({
        dataUrl: reader.result,
        mimeType: file.type,
      });
    };

    reader.onerror = () => {
      setImageError("ছবি লোড করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    };

    reader.readAsDataURL(file);
  };

  const removeAttachedImage = () => setAttachedImage(null);

  useEffect(() => {

    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });

  }, [messages, open]);

  // চ্যাট history localStorage-এ সেভ রাখা — রিফ্রেশ করলে হারাবে না
  useEffect(() => {

    try {

      localStorage.setItem(storageKey, JSON.stringify(messages));

    } catch (error) {
    console.error(error);
  }

  }, [messages]);

  // চ্যাট খোলা হলে unread badge ও greeting বাবল মুছে যাবে
  useEffect(() => {

    if (open) {
      setUnreadCount(0);
      setMenuOpen(false);
      setShowGreeting(false);
    }

  }, [open]);

  // --------- প্যানেলের বাইরে ট্যাপ/ক্লিক করলে চ্যাট অটো বন্ধ হবে
  // (ফ্লোটিং বাটনে ক্লিক আলাদাভাবে handlePointerUp-এ সামলানো হয়,
  // তাই সেটা এখানে বাদ দেওয়া হয়েছে যাতে ডাবল-টগল না হয়) ---------
  useEffect(() => {

    if (!open) return;

    const handleOutside = (e) => {

      const target = e.target;

      if (panelRef.current && panelRef.current.contains(target)) return;
      if (buttonRef.current && buttonRef.current.contains(target)) return;

      setOpen(false);

    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };

  }, [open]);

  // --------- Smart Cart Recovery: চ্যাট খোলার সময় Cart-এ আইটেম
  // পড়ে থাকলে (কোনো AI কল ছাড়াই, শুধু local cart context থেকে)
  // একবার মনে করিয়ে দেওয়া — সেশনে একবারের বেশি না ---------
  useEffect(() => {

    if (!open || cartRecoveryShownRef.current) return;
    if (!cart || !cart.length) return;

    cartRecoveryShownRef.current = true;

    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        display: `আপনার Cart-এ ${totalQty}টি আইটেম অপেক্ষা করছে। Checkout করবেন? 🛒`,
        cartRecovery: true,
        time: formatTime(),
      },
    ]);

  }, [open, cart]);

  // --------- Proactive AI: লগইন করা কাস্টমার প্রথমবার চ্যাট খুললে
  // (কথোপকথন এখনো শুরু হয়নি) চুপচাপ ব্যাকগ্রাউন্ডে নতুন
  // প্রোডাক্ট/wishlist ছাড় আছে কিনা চেক করানো — কিছু পাওয়া গেলে
  // AI নিজে থেকেই এক লাইনে জানাবে, না পেলে কিছু দেখানো হবে না ---------
  useEffect(() => {

    if (!open || proactiveCheckedRef.current) return;
    if (!user?.uid) return;
    if (messages.length !== 1 || messages[0].role !== "assistant") return;

    proactiveCheckedRef.current = true;

    const timer = setTimeout(() => {
      sendMessage(
        "[PROACTIVE_CHECK] নতুন প্রোডাক্ট বা wishlist ছাড় আছে কিনা দেখুন।",
        { hidden: true }
      );
    }, 600);

    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user?.uid]);

  // "এডমিন হেল্প" quick-action — কোনো AI কল ছাড়াই সরাসরি এডমিনের
  // WhatsApp নাম্বার ও Store ইমেইল মেসেজ আকারে দেখানো হয়
  const handleAdminHelp = () => {

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        display: "নিচে আমাদের এডমিনের সরাসরি যোগাযোগের তথ্য দেওয়া হলো:",
        adminHelp: {
          whatsapp: settings?.whatsapp || "",
          email: settings?.email || "",
        },
        time: formatTime(),
      },
    ]);

  };

  const handleQuickAction = (action) => {

    if (loading) return;

    if (action.type === "adminHelp") {
      handleAdminHelp();
      return;
    }

    sendMessage(action.prompt);

  };

  const sendMessage = async (overrideText, options = {}) => {

    const isQuickAction = typeof overrideText === "string";
    const text = (isQuickAction ? overrideText : input).trim();
    const isHidden = !!options.hidden;

    if ((!text && !attachedImage) || loading) return;

    if (!isQuickAction) {
      setInput("");
    }

    const imageToSend = attachedImage;
    setAttachedImage(null);
    setImageError("");

    const nextMessages = [
      ...messages,
      {
        role: "user",
        display: text || "📷 ছবি পাঠানো হয়েছে",
        image: imageToSend ? imageToSend.dataUrl : null,
        hidden: isHidden,
        time: formatTime(),
      },
    ];

    setMessages(nextMessages);
    setLoading(true);

    try {

      // Claude API-এর ফরম্যাটে পাঠানোর জন্য শুধু role+content রাখা
      // হচ্ছে, tool_use/tool_result ব্লক ইতিমধ্যে display করার
      // দরকার নেই, তাই ফাইনাল রিপ্লাইয়ের সাথে আলাদা রাখা হলো।
      // সর্বশেষ ইউজার মেসেজে ছবি সংযুক্ত থাকলে সেটার base64 ডেটা
      // (data: URL prefix বাদ দিয়ে) আলাদাভাবে পাঠানো হচ্ছে যাতে
      // ব্যাকএন্ড vision-সক্ষম provider-কে (Gemini) সেটা দেখাতে পারে।
      // পুরো history-টা প্রতিবার পাঠানোর দরকার নেই — চ্যাট যত লম্বা
      // হবে তত বেশি টোকেন খরচ হবে, যেটা ফ্রি tier-এর rate limit-এ
      // আরও দ্রুত ধাক্কা দেয়। শেষ কয়েকটা মেসেজই (context বোঝার
      // জন্য যথেষ্ট) পাঠানো হচ্ছে।
      const MAX_HISTORY_MESSAGES = 16;
      const trimmedMessages = nextMessages.slice(-MAX_HISTORY_MESSAGES);

      const apiMessages = trimmedMessages.map((m, idx) => {

        const base = { role: m.role, content: m.display };

        const isLastMessage = idx === trimmedMessages.length - 1;

        if (isLastMessage && m.image) {

          const [, mimeType, base64Data] =
            m.image.match(/^data:(.+?);base64,(.*)$/) || [];

          if (base64Data) {
            base.image = { mimeType: mimeType || "image/jpeg", data: base64Data };
          }

        }

        return base;

      });

      const aiChat = httpsCallable(functions, functionName);

      const result = await aiChat({ messages: apiMessages });

      const replyText = (result.data.reply || "").trim();

      // Proactive চেকে সত্যিই জানানোর মতো কিছু না পেলে ব্যাকএন্ড ঠিক
      // "NIL_PROACTIVE" পাঠায় — সেক্ষেত্রে কোনো নতুন বাবল দেখানো হবে
      // না (কাস্টমার এটা জিজ্ঞেসই করেননি, তাই চুপ থাকাই স্বাভাবিক)।
      if (replyText === "NIL_PROACTIVE") {
        setLoading(false);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          display: result.data.reply || "দুঃখিত, উত্তর পাওয়া যায়নি।",
          products: result.data.products || [],
          orders: result.data.orders || [],
          adminContact: result.data.adminContact || null,
          invoice: result.data.invoice || null,
          time: formatTime(),
        },
      ]);

      // widget বন্ধ থাকা অবস্থায় রিপ্লাই এলে unread count বাড়বে
      setOpen((currentlyOpen) => {

        if (!currentlyOpen) {
          setUnreadCount((c) => c + 1);
        }

        return currentlyOpen;

      });

    } catch (error) {


      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          display:
            "দুঃখিত, এই মুহূর্তে সাড়া দিতে পারছি না। " +
            "একটু পর আবার চেষ্টা করুন, অথবা WhatsApp-এ যোগাযোগ করুন।",
          time: formatTime(),
        },
      ]);

    } finally {

      setLoading(false);

    }

  };

  // আগে প্লেইন Enter চাপলেই সাথে সাথে মেসেজ সেন্ড হয়ে যেতো, ফলে
  // একাধিক লাইনে কিছু লেখা যেতো না (Enter দিলে টেক্সট নতুন লাইনে
  // না গিয়ে সোজা সেন্ড হয়ে যেতো)। এখন Enter স্বাভাবিক নতুন-লাইন
  // হিসেবেই কাজ করবে (textarea-এর ডিফল্ট আচরণ) — মেসেজ পাঠাতে
  // "পাঠান" বাটন চাপতে হবে, অথবা Ctrl/Cmd+Enter শর্টকাট ব্যবহার
  // করা যাবে।
  const handleKeyDown = (e) => {

    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      sendMessage();
    }

  };

  const startNewChat = () => {

    setMessages([welcomeMessage]);
    proactiveCheckedRef.current = false;

  };

  return (
    <>
      {/* প্রথমবার ঢুকলে একবার দেখা যাওয়া greeting বাবল */}
      {showGreeting && !open && (
        <div
          style={getGreetingStyle()}
          onClick={() => {
            setOpen(true);
            setShowGreeting(false);
          }}
          className="fixed z-[1000] max-w-[240px] cursor-pointer rounded-2xl rounded-bl-sm
                     bg-white p-3 text-sm shadow-2xl"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowGreeting(false);
            }}
            aria-label="বন্ধ করুন"
            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center
                       rounded-full bg-gray-300 text-[10px] text-gray-700 shadow"
          >
            ✕
          </button>

          <p className="text-gray-800">
            হাই! আমি <span className="font-semibold text-violet-600">Dream AI</span> 👋
          </p>
          <p className="mt-1 text-gray-600">
            আপনার শপিং সহকারী। আজ কীভাবে সাহায্য করতে পারি?
          </p>
        </div>
      )}

      {/* ফ্লোটিং বাটন — যেকোনো জায়গায় টেনে (drag) সরানো যাবে */}
      <button
        ref={buttonRef}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        style={{
          left: position.x,
          top: position.y,
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          touchAction: "none",
        }}
        aria-label="Dream AI চ্যাট"
        className={`fixed z-[1000] flex flex-col items-center justify-center gap-0.5
                   rounded-full bg-gradient-to-br from-violet-600 via-purple-600
                   to-fuchsia-600 text-white shadow-2xl ring-4 ring-white/40
                   transition-transform hover:scale-105
                   ${dragging ? "cursor-grabbing scale-105" : "cursor-grab"}`}
      >
        {open ? (
          <span className="text-xl">✕</span>
        ) : (
          <>
            <RobotIcon className="h-5 w-5" bodyColor="#FFFFFF" screenColor="#4C1D95" />
            <span className="text-[7px] font-bold leading-none tracking-wide">
              Dream AI
            </span>
          </>
        )}

        {!open && (
          <span className="absolute -top-1 -right-1 text-xs">✨</span>
        )}

        {!open && unreadCount > 0 && (
          <span
            className="absolute -bottom-1 -right-1 flex h-5 min-w-[20px] items-center
                       justify-center rounded-full bg-red-500 px-1 text-[10px]
                       font-bold text-white ring-2 ring-white"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* চ্যাট উইন্ডো — বাটন যেখানে আছে তার কাছাকাছি খোলে */}
      {open && (
        <div
          ref={panelRef}
          style={getPanelStyle()}
          className="fixed z-[1000] flex flex-col overflow-hidden rounded-2xl border
                     border-gray-200 bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between bg-gradient-to-r
                          from-violet-600 via-purple-600 to-fuchsia-600 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full
                              bg-white/90">
                <RobotIcon className="h-6 w-6" bodyColor="#7C3AED" screenColor="#FFFFFF" />
              </div>

              <div>
                <p className="flex items-center gap-1 font-semibold leading-tight">
                  {title} <span className="text-sm">✨</span>
                </p>
                <p className="text-xs text-white/80">{subtitle}</p>
              </div>
            </div>

            <div className="relative flex items-center gap-1">
              <button
                onClick={() => setMenuOpen((m) => !m)}
                aria-label="মেনু"
                className="rounded-lg px-2 py-1 text-lg leading-none hover:bg-white/10"
              >
                ⋮
              </button>

              <button
                onClick={() => setOpen(false)}
                aria-label="বন্ধ করুন"
                className="rounded-lg px-2 py-1 text-lg leading-none hover:bg-white/10"
              >
                ⌄
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />

                  <div className="absolute right-0 top-10 z-20 w-44 overflow-hidden
                                  rounded-xl border border-gray-200 bg-white text-sm
                                  text-gray-700 shadow-xl">
                    <button
                      onClick={() => {
                        startNewChat();
                        setMenuOpen(false);
                      }}
                      className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                    >
                      🔄 নতুন চ্যাট শুরু করুন
                    </button>

                    <button
                      onClick={() => {
                        sendMessage("এখন থেকে সবসময় বাংলায় কথা বলুন।");
                        setMenuOpen(false);
                      }}
                      className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                    >
                      🇧🇩 বাংলায় চ্যাট করুন
                    </button>

                    <button
                      onClick={() => {
                        sendMessage("Please reply in English from now on.");
                        setMenuOpen(false);
                      }}
                      className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                    >
                      🇬🇧 Chat in English
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-3 py-3"
          >
            {messages.map((m, idx) => {

              if (m.hidden) return null;

              return (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-violet-100 text-gray-900"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  {m.image && (
                    <img
                      src={m.image}
                      alt="সংযুক্ত ছবি"
                      className="mb-1 max-h-40 w-full rounded-lg object-cover"
                    />
                  )}
                  {m.display}
                </div>

                {m.time && (
                  <span className="mt-0.5 px-1 text-[10px] text-gray-400">
                    {m.time}
                  </span>
                )}

                {m.role === "assistant" && (
                  <div className="w-full max-w-[92%]">
                    <ProductCards products={m.products} />
                    <OrderCards orders={m.orders} />
                    <AdminContactCard adminContact={m.adminContact} />
                    <AdminHelpCard adminHelp={m.adminHelp} />
                    <InvoiceCard invoice={m.invoice} />
                    {m.cartRecovery && (
                      <button
                        type="button"
                        onClick={() => navigate("/checkout")}
                        className="mt-1 rounded-full bg-violet-600 px-3 py-1
                                   text-[11px] font-semibold text-white
                                   hover:bg-violet-700"
                      >
                        Checkout করুন 🛒
                      </button>
                    )}
                    <QuickReplyChips
                      products={m.products}
                      disabled={loading}
                      onPick={(prompt) => sendMessage(prompt)}
                    />
                  </div>
                )}
              </div>
              );
            })}

            {/* চ্যাট একদম শুরুতে থাকলে quick-action কার্ড দেখানো হয় */}
            {messages.length === 1 && !loading && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {quickActions.map((action) => (
                  <button
                    key={action.title}
                    onClick={() => handleQuickAction(action)}
                    disabled={loading}
                    className="flex flex-col items-start gap-0.5 rounded-xl border
                               border-gray-200 bg-white p-3 text-left shadow-sm
                               transition-shadow hover:shadow-md disabled:opacity-50"
                  >
                    <span className="text-lg">{action.icon}</span>
                    <span className="text-xs font-semibold text-gray-800">
                      {action.title}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {action.subtitle}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 rounded-2xl border
                                border-gray-200 bg-white px-3 py-2 text-sm
                                text-gray-500 shadow-sm">
                  <span>ভাবছি...</span>
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full
                                     bg-violet-500 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full
                                     bg-purple-500 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full
                                     bg-fuchsia-500" />
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-2">
            {imageError && (
              <p className="mb-1 px-1 text-[11px] text-red-500">{imageError}</p>
            )}

            {attachedImage && (
              <div className="mb-2 flex items-center gap-2 px-1">
                <div className="relative">
                  <img
                    src={attachedImage.dataUrl}
                    alt="সংযুক্ত করার জন্য প্রস্তুত"
                    className="h-14 w-14 rounded-lg object-cover border border-gray-300"
                  />
                  <button
                    onClick={removeAttachedImage}
                    aria-label="ছবি সরান"
                    className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center
                               justify-center rounded-full bg-violet-600 text-[11px] text-white"
                  >
                    ✕
                  </button>
                </div>
                <span className="text-[11px] text-gray-500">ছবি সংযুক্ত হয়েছে</span>
              </div>
            )}

            <div className="flex items-end gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <button
                onClick={handleAttachClick}
                disabled={loading}
                aria-label="ছবি সংযুক্ত করুন"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center
                           rounded-xl border border-violet-200 text-lg text-violet-600
                           hover:bg-violet-50 disabled:opacity-40"
              >
                📎
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="মেসেজ লিখুন..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2
                           text-sm outline-none focus:border-violet-500"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || (!input.trim() && !attachedImage)}
                className="rounded-xl bg-gradient-to-br from-violet-600 to-purple-600
                           px-4 py-2 text-sm font-medium text-white shadow-sm
                           disabled:opacity-40"
              >
                পাঠান
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 bg-white px-3 py-1.5 text-center
                          text-[11px] text-gray-400">
            ✨ Powered by <span className="font-medium text-violet-600">Dream AI</span>
          </div>
        </div>
      )}
    </>
  );

}
