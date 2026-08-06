import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/functions";
import useAuth from "../hooks/useAuth";

// =================================================
// AI CHAT WIDGET
// Home/Shop-এর যেকোনো লেআউটে <AIChatWidget /> বসিয়ে দিলেই কাজ
// করবে। এটা নিচে-ডানে একটা ভাসমান বাটন হিসেবে দেখাবে।
//
// এই ভার্সনে যোগ করা হয়েছে:
// - localStorage-এ চ্যাট history সেভ থাকে, রিফ্রেশ করলেও হারায় না
// - চ্যাট বন্ধ থাকা অবস্থায় নতুন রিপ্লাই এলে বাটনে unread badge
// =================================================

const STORAGE_KEY = "dreamModeChatHistory";

const WELCOME_MESSAGE = {
  role: "assistant",
  display:
    "আসসালামু আলাইকুম! আমি Dream Mode-এর AI সহকারী। " +
    "প্রোডাক্ট খুঁজে দেওয়া, অর্ডার করা বা আপনার অর্ডারের " +
    "স্ট্যাটাস জানাতে আমি সাহায্য করতে পারি। কী জানতে চান?",
};

function loadStoredMessages() {

  try {

    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;

    if (Array.isArray(parsed) && parsed.length) {
      return parsed;
    }

  } catch (error) {

    console.log("AI CHAT WIDGET — history load failed:", error);

  }

  return [WELCOME_MESSAGE];

}

// -------------------------------------------------
// প্রোডাক্ট কার্ড — search_products/check_stock থেকে পাওয়া
// প্রোডাক্টগুলো ছবি, নাম, দাম, স্টক সহ কার্ড আকারে দেখায়।
// -------------------------------------------------
function ProductCards({ products }) {

  if (!products || !products.length) return null;

  return (
    <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
      {products.map((p) => (
        <Link
          key={p.id}
          to={`/product/${p.id}`}
          className="block w-36 flex-shrink-0 rounded-xl border border-gray-200
                     bg-white p-2 text-left shadow-sm hover:shadow-md
                     transition-shadow"
        >
          <div className="mb-2 h-24 w-full overflow-hidden rounded-lg bg-gray-100">
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
                <span className="text-sm font-bold text-black">
                  ৳{p.offerPrice}
                </span>
                <span className="text-[11px] text-gray-400 line-through">
                  ৳{p.price}
                </span>
              </>
            ) : (
              <span className="text-sm font-bold text-black">৳{p.price}</span>
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
            <span className="rounded-full bg-black px-2 py-0.5 text-[11px] text-white">
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

export default function AIChatWidget() {

  const { user } = useAuth() || {};

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState(loadStoredMessages);

  const scrollRef = useRef(null);

  useEffect(() => {

    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });

  }, [messages, open]);

  // চ্যাট history localStorage-এ সেভ রাখা — রিফ্রেশ করলে হারাবে না
  useEffect(() => {

    try {

      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));

    } catch (error) {

      console.log("AI CHAT WIDGET — history save failed:", error);

    }

  }, [messages]);

  // চ্যাট খোলা হলে unread badge মুছে যাবে
  useEffect(() => {

    if (open) {
      setUnreadCount(0);
    }

  }, [open]);

  const sendMessage = async () => {

    const text = input.trim();

    if (!text || loading) return;

    setInput("");

    const nextMessages = [
      ...messages,
      { role: "user", display: text },
    ];

    setMessages(nextMessages);
    setLoading(true);

    try {

      // Claude API-এর ফরম্যাটে পাঠানোর জন্য শুধু role+content রাখা
      // হচ্ছে, tool_use/tool_result ব্লক ইতিমধ্যে display করার
      // দরকার নেই, তাই ফাইনাল রিপ্লাইয়ের সাথে আলাদা রাখা হলো।
      const apiMessages = nextMessages.map((m) => ({
        role: m.role,
        content: m.display,
      }));

      const aiChat = httpsCallable(functions, "aiChat");

      const result = await aiChat({ messages: apiMessages });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          display: result.data.reply || "দুঃখিত, উত্তর পাওয়া যায়নি।",
          products: result.data.products || [],
          orders: result.data.orders || [],
          adminContact: result.data.adminContact || null,
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

      console.log("AI CHAT WIDGET ERROR:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          display:
            "দুঃখিত, এই মুহূর্তে সাড়া দিতে পারছি না। " +
            "একটু পর আবার চেষ্টা করুন, অথবা WhatsApp-এ যোগাযোগ করুন।",
        },
      ]);

    } finally {

      setLoading(false);

    }

  };

  const handleKeyDown = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }

  };

  const startNewChat = () => {

    setMessages([WELCOME_MESSAGE]);

  };

  return (
    <>
      {/* ফ্লোটিং বাটন */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center
                   rounded-full bg-black text-white shadow-lg hover:bg-gray-800
                   transition-transform active:scale-95"
        aria-label="AI Chat"
      >
        {open ? "✕" : "💬"}

        {!open && unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center
                       justify-center rounded-full bg-red-500 px-1 text-[11px]
                       font-bold text-white"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* চ্যাট উইন্ডো */}
      {open && (
        <div
          className="fixed bottom-40 right-5 z-50 flex h-[70vh] max-h-[560px] w-[90vw]
                     max-w-[380px] flex-col overflow-hidden rounded-2xl border
                     border-gray-200 bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between bg-black px-4 py-3 text-white">
            <div>
              <p className="font-semibold">Dream Mode Assistant</p>
              <p className="text-xs text-gray-300">সাধারণত সাথে সাথে উত্তর দেয়</p>
            </div>

            <button
              onClick={startNewChat}
              className="rounded-lg border border-gray-500 px-2 py-1 text-xs text-gray-200
                         hover:bg-gray-800"
            >
              নতুন চ্যাট
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-3 py-3"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-black text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  {m.display}
                </div>

                {m.role === "assistant" && (
                  <div className="w-full max-w-[92%]">
                    <ProductCards products={m.products} />
                    <OrderCards orders={m.orders} />
                    <AdminContactCard adminContact={m.adminContact} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500">
                  লিখছে...
                </div>
              </div>
            )}
          </div>

          <div className="flex items-end gap-2 border-t border-gray-200 p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="মেসেজ লিখুন..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2
                         text-sm outline-none focus:border-black"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white
                         disabled:opacity-40"
            >
              পাঠান
            </button>
          </div>
        </div>
      )}
    </>
  );

}
