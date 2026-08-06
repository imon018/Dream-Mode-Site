import { useState, useRef, useEffect } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/functions";
import useAuth from "../hooks/useAuth";

// =================================================
// AI CHAT WIDGET
// Home/Shop-এর যেকোনো লেআউটে <AIChatWidget /> বসিয়ে দিলেই কাজ
// করবে। এটা নিচে-ডানে একটা ভাসমান বাটন হিসেবে দেখাবে।
// =================================================

export default function AIChatWidget() {

  const { user } = useAuth() || {};

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      display:
        "আসসালামু আলাইকুম! আমি Dream Mode-এর AI সহকারী। " +
        "প্রোডাক্ট খুঁজে দেওয়া, অর্ডার করা বা আপনার অর্ডারের " +
        "স্ট্যাটাস জানাতে আমি সাহায্য করতে পারি। কী জানতে চান?",
    },
  ]);

  const scrollRef = useRef(null);

  useEffect(() => {

    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });

  }, [messages, open]);

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
        },
      ]);

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
      </button>

      {/* চ্যাট উইন্ডো */}
      {open && (
        <div
          className="fixed bottom-40 right-5 z-50 flex h-[70vh] max-h-[560px] w-[90vw]
                     max-w-[380px] flex-col overflow-hidden rounded-2xl border
                     border-gray-200 bg-white shadow-2xl"
        >
          <div className="bg-black px-4 py-3 text-white">
            <p className="font-semibold">Dream Mode Assistant</p>
            <p className="text-xs text-gray-300">সাধারণত সাথে সাথে উত্তর দেয়</p>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-3 py-3"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
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
