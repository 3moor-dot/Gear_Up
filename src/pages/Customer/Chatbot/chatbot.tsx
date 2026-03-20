import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  MdSend,
  MdSmartToy,
  MdAutoAwesome,
  MdOutlineAttachFile,
  MdClose,
} from "react-icons/md";
import Header from "../../../components/Customer/customer_header";
import Sidebar from "../../../components/Customer/customer_sidebar";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  time: string;
  imagePreview?: string;
}

const API_URL = "https://gearupapp.runasp.net/api/Chatbot/message";

const SUGGESTED_QUESTIONS = [
  "كيف أحجز موعد صيانة؟",
  "ما هي قطع الغيار المتاحة؟",
  "متى موعد الصيانة القادمة؟",
  "كيف أتابع طلب الصيانة؟",
];

const getTime = () =>
  new Date().toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });

const MessageBubble = ({ msg }: { msg: Message }) => {
  const isUser = msg.role === "user";

  return (
    <div
      className={`w-full flex ${isUser ? "justify-start" : "justify-end"} animate-[fadeIn_.25s_ease]`}
      dir="rtl"
    >
      <div
        className={`max-w-[85%] md:max-w-[70%] flex gap-3 ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm mt-1 ${
            isUser
              ? "bg-gradient-to-br from-[#137FEC] to-[#0EA5E9] text-white"
              : "bg-gradient-to-br from-slate-900 to-slate-700 text-white"
          }`}
        >
          {isUser ? <span className="text-sm font-bold">أ</span> : <MdSmartToy size={18} />}
        </div>

        <div className={`flex flex-col ${isUser ? "items-start" : "items-end"}`}>
          <div
            className={`px-4 py-3 rounded-2xl text-sm md:text-[15px] leading-7 shadow-sm border ${
              isUser
                ? "bg-gradient-to-br from-[#137FEC] to-[#0EA5E9] text-white border-transparent rounded-tr-md"
                : "bg-white dark:bg-[#111827] text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 rounded-tl-md"
            }`}
          >
            {msg.imagePreview && (
              <img
                src={msg.imagePreview}
                alt="uploaded"
                className="max-w-full w-56 rounded-xl mb-3 border border-white/20 object-cover"
              />
            )}
            <p className="break-words whitespace-pre-wrap">{msg.text}</p>
          </div>

          <span className="text-[11px] text-gray-400 mt-1 px-2">{msg.time}</span>
        </div>
      </div>
    </div>
  );
};

const TypingIndicator = () => {
  return (
    <div className="w-full flex justify-end animate-[fadeIn_.25s_ease]" dir="rtl">
      <div className="max-w-[85%] md:max-w-[70%] flex gap-3">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
          <MdSmartToy size={18} />
        </div>

        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#137FEC] animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-[#137FEC] animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 rounded-full bg-[#137FEC] animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "bot",
      text: "مرحبًا 👋 أنا مساعد GearUp الذكي. أقدر أساعدك في الصيانة، الأعطال، المواعيد، وطلبات الخدمة. كيف أساعدك اليوم؟",
      time: "الآن",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const extractBotReply = (reply: unknown): string => {
    if (reply === null || reply === undefined || reply === "") {
      return "تم استلام رسالتك بنجاح.";
    }

    if (typeof reply === "string") {
      const trimmedReply = reply.trim();

      try {
        const parsed = JSON.parse(trimmedReply);

        if (parsed && typeof parsed === "object") {
          if (typeof parsed.ai_answer === "string" && parsed.ai_answer.trim()) {
            return parsed.ai_answer;
          }

          if (typeof parsed.reply === "string" && parsed.reply.trim()) {
            return parsed.reply;
          }

          if (typeof parsed.message === "string" && parsed.message.trim()) {
            return parsed.message;
          }

          if (typeof parsed.answer === "string" && parsed.answer.trim()) {
            return parsed.answer;
          }
        }

        return trimmedReply;
      } catch {
        return trimmedReply;
      }
    }

    if (typeof reply === "object") {
      const obj = reply as Record<string, unknown>;

      if (typeof obj.ai_answer === "string" && obj.ai_answer.trim()) {
        return obj.ai_answer;
      }

      if (typeof obj.reply === "string" && obj.reply.trim()) {
        return obj.reply;
      }

      if (typeof obj.message === "string" && obj.message.trim()) {
        return obj.message;
      }

      if (typeof obj.answer === "string" && obj.answer.trim()) {
        return obj.answer;
      }

      try {
        return JSON.stringify(obj);
      } catch {
        return "تم استلام رسالتك بنجاح.";
      }
    }

    return String(reply);
  };

  const sendMessage = async (text?: string) => {
    const msgText = (text ?? inputText).trim();

    if (!msgText && !selectedImage) return;

    const token = sessionStorage.getItem("userToken");

    if (!token) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "bot",
          text: "يجب تسجيل الدخول أولًا.",
          time: getTime(),
        },
      ]);
      return;
    }

    setShowSuggestions(false);

    const currentImage = selectedImage;
    const currentImagePreview = imagePreview;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: msgText || "تم إرسال صورة",
      time: getTime(),
      imagePreview: currentImagePreview || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);
    setSelectedImage(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    try {
      const formData = new FormData();
      formData.append("Message", msgText || "");

      if (currentImage) {
        formData.append("Image", currentImage);
      }

      const response = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });

      console.log("FULL RESPONSE:", response.data);
      console.log("REPLY:", response.data?.reply);
      console.log("TYPE OF REPLY:", typeof response.data?.reply);

      const { reply, success, error } = response.data;

      const botReply = success
        ? extractBotReply(reply)
        : error || "حدث خطأ أثناء معالجة رسالتك.";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: botReply,
          time: getTime(),
        },
      ]);
    } catch (error: any) {
      console.error("Chatbot API Error:", error);

      let errorMessage = "حصل خطأ أثناء الاتصال بالمساعد الذكي.";

      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.error || "البيانات المرسلة غير صحيحة.";
      } else if (error.response?.status === 401) {
        errorMessage = "يجب تسجيل الدخول أولًا أو التوكين انتهت صلاحيته.";
      } else if (error.response?.status === 403) {
        errorMessage = "ليس لديك صلاحية لاستخدام هذه الخدمة.";
      } else if (error.response?.status === 404) {
        errorMessage = "رابط الخدمة غير موجود.";
      } else if (error.response?.status === 500) {
        errorMessage = error.response?.data?.error || "حصل خطأ في السيرفر.";
      } else if (error.message?.toLowerCase().includes("network")) {
        errorMessage = "تعذر الاتصال بالسيرفر. تأكد من الإنترنت أو إعدادات CORS.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: errorMessage,
          time: getTime(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-[#f3f7fb] dark:bg-[#0B1120] overflow-hidden" dir="rtl">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 min-h-0 p-3 md:p-5 overflow-hidden">
          <div className="h-full max-w-5xl mx-auto grid grid-rows-[auto_1fr_auto_auto] gap-4 overflow-hidden">
            <div className="rounded-3xl bg-gradient-to-l from-[#137FEC] via-[#1992f3] to-[#0EA5E9] p-4 md:p-5 shadow-xl shadow-[#137FEC]/15 text-white">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-2xl border border-white/20">
                  <MdSmartToy size={28} />
                  <span className="absolute -bottom-1 -left-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-lg md:text-xl font-extrabold">المساعد الذكي</h1>
                  <p className="text-white/80 text-sm mt-1">
                    دردشة ذكية لمساعدتك في الصيانة، الأعطال، المواعيد، والطلبات
                  </p>
                </div>

                <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm">
                  <MdAutoAwesome size={18} />
                  <span className="text-sm font-semibold">GearUp AI</span>
                </div>
              </div>
            </div>

            <section className="min-h-0 rounded-3xl border border-gray-200/80 dark:border-gray-800 bg-white/70 dark:bg-[#0f172a]/90 backdrop-blur-md shadow-sm overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-[#111827]/70">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-gray-800 dark:text-white">المحادثة</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        اسأل عن الأعطال أو أرسل صورة للمشكلة
                      </p>
                    </div>

                    <div className="text-xs px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                      متصل الآن
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-4 bg-[linear-gradient(to_bottom,_rgba(19,127,236,0.03),_transparent)]">
                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} msg={msg} />
                  ))}

                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </section>

            {showSuggestions && (
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-[#137FEC] hover:text-[#137FEC] hover:-translate-y-0.5 transition-all shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827] shadow-sm p-2 md:p-3">
              {imagePreview && (
                <div className="mb-3 px-2">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="w-24 h-24 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1 shadow"
                      type="button"
                    >
                      <MdClose size={16} />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 md:gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <button
                  className="w-11 h-11 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#1f2937] transition"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <MdOutlineAttachFile size={20} />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 h-11 bg-transparent outline-none px-3 text-sm md:text-[15px] text-gray-800 dark:text-white placeholder:text-gray-400"
                  dir="rtl"
                />

                <button
                  onClick={() => sendMessage()}
                  disabled={!inputText.trim() && !selectedImage}
                  className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#137FEC] to-[#0EA5E9] text-white flex items-center justify-center shadow-md shadow-[#137FEC]/25 hover:scale-[1.03] active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  type="button"
                >
                  <MdSend size={20} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatbotPage;