import React, { useState } from "react";
import { useParams } from "react-router-dom";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { useTheme } from "../../../contexts/ThemeContext";
import MachineSidebar from "../../../components/Machine/MachineSidebar";
import { FaCheckCircle, FaTimes, FaClock, FaPaperPlane } from "react-icons/fa";

const MBookingDetails = () => {
  const { dark } = useTheme();
  const { id } = useParams();
  const [message, setMessage] = useState("");

  const booking = {
    id,
    number: "8789-12456",
    client: {
      name: "جون لورانس",
      phone: "(555) 123-4567",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    car: {
      model: "2021 Toyota Camry",
      plate: "XYZ-1236",
    },
    service: "فحص الفرامل وتغيير الزيت",
    date: "October 26, 2026 at 2:00 PM",
    notes:
      "السيارة تُصدر صوت من الفرامل الأمامية اليمنى عند الضغط على الفرامل أثناء السرعة العالية",
    status: "new",
    messages: [
      {
        id: 1,
        from: "client",
        text: "ممكن أعرف التكلفة التقريبية قبل الحضور؟",
        time: "10:30 AM",
      },
      {
        id: 2,
        from: "mechanic",
        text:
          "التكلفة عادة بين 200–300 ريال، والفحص النهائي يتم عند الحضور.",
        time: "10:35 AM",
      },
    ],
  };

  return (
    <div
      dir="rtl"
      className={`flex min-h-screen transition-colors duration-500
        ${dark ? "bg-[#0B1220] text-white" : "bg-gray-50 text-[#1E3A5F]"}
      `}
    >
      <MachineSidebar />

      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">الحجوزات</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NotificationBell size={20} />
          </div>
        </div>

        {/* Status Bar */}
        <div
          className={`rounded-xl px-6 py-4 flex items-center justify-between
            ${dark ? "bg-[#0d1629]" : "bg-white shadow-md"}
          `}
        >
          <div>
            <h2 className="font-bold text-lg">مراجعة طلب الحجز</h2>
            <p className={dark ? "text-gray-400" : "text-gray-500 text-sm"}>
              رقم الحجز: {booking.number}
            </p>
          </div>

          <span
            className={`px-4 py-1 rounded-lg text-sm font-medium
              ${
                dark
                  ? "bg-yellow-600/20 text-yellow-400"
                  : "bg-yellow-100 text-yellow-700"
              }
            `}
          >
            في انتظار الموافقة
          </span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Details */}
          <div
            className={`lg:col-span-2 rounded-xl p-6
              ${
                dark
                  ? "bg-[#0d1629]"
                  : "bg-white shadow-md border border-gray-200"
              }
            `}
          >
            <h3
              className={`font-bold mb-4 pb-3 border-b
                ${dark ? "border-gray-800" : "border-gray-200"}
              `}
            >
              تفاصيل الطلب
            </h3>

            <div className="space-y-4 text-sm">
              <DetailRow dark={dark} label="العميل" value={booking.client.name} />
              <DetailRow dark={dark} label="الهاتف" value={booking.client.phone} />
              <DetailRow dark={dark} label="العربة" value={booking.car.model} />
              <DetailRow
                dark={dark}
                label="لوحة الترخيص"
                value={booking.car.plate}
              />
              <DetailRow dark={dark} label="الخدمة" value={booking.service} />
              <DetailRow dark={dark} label="التاريخ" value={booking.date} />
              <DetailRow dark={dark} label="ملاحظات" value={booking.notes} />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-6">
              <ActionBtn color="green" icon={<FaCheckCircle />} text="الموافقة" />
              <ActionBtn color="red" icon={<FaTimes />} text="رفض الحجز" />
              <ActionBtn color="yellow" icon={<FaClock />} text="اقتراح وقت" />
            </div>
          </div>

          {/* Chat */}
         <div
  className={`rounded-xl flex flex-col h-full
    ${
      dark
        ? "bg-[#0d1629]"
        : "bg-white shadow-md border border-gray-200"
    }
  `}
>
  {/* Chat Header */}
  <div
    className={`p-4 flex items-center gap-3 border-b
      ${dark ? "border-gray-800" : "border-gray-200"}
    `}
  >
    <img
      src={booking.client.avatar}
      className="w-10 h-10 rounded-full"
      alt="client"
    />
    <div>
      <p className="font-semibold">{booking.client.name}</p>
      <span className="text-xs text-green-500">متصل الآن</span>
    </div>
  </div>

  {/* Messages */}
  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
    {booking.messages.map((msg) => {
      const isMe = msg.from === "mechanic";

      return (
        <div
          key={msg.id}
          className={`flex ${isMe ? "justify-end" : "justify-start"} gap-2`}
        >
          {!isMe && (
            <img
              src={booking.client.avatar}
              className="w-7 h-7 rounded-full self-end"
              alt="avatar"
            />
          )}

          <div
            className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed
              ${
                isMe
                  ? "bg-blue-600 text-white rounded-br-md"
                  : dark
                  ? "bg-[#1a2332] text-white rounded-bl-md"
                  : "bg-gray-100 text-gray-800 rounded-bl-md"
              }
            `}
          >
            {msg.text}

            <div
              className={`text-[10px] mt-1 text-right
                ${isMe ? "text-blue-200" : "text-gray-400"}
              `}
            >
              {msg.time}
            </div>
          </div>
        </div>
      );
    })}
  </div>

  {/* Message Input */}
  <div
    className={`p-3 flex items-center gap-2 border-t
      ${dark ? "border-gray-800" : "border-gray-200"}
    `}
  >
    <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="اكتب رسالة..."
      className={`flex-1 rounded-xl px-4 py-2 text-sm outline-none
        ${
          dark
            ? "bg-[#131c2f] text-white placeholder-gray-500"
            : "bg-gray-100 text-gray-900 placeholder-gray-400"
        }
      `}
    />

    <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition">
      <FaPaperPlane size={14} />
    </button>
  </div>
</div>

        </div>
      </div>
    </div>
  );
};

const DetailRow = ({
  label,
  value,
  dark,
}: {
  label: string;
  value: string;
  dark: boolean;
}) => (
  <div
    className={`flex justify-between pb-2 border-b
      ${dark ? "border-gray-800" : "border-gray-200"}
    `}
  >
    <span className={dark ? "text-gray-400" : "text-gray-500"}>{label}</span>
    <span className="font-medium max-w-[60%] text-right">{value}</span>
  </div>
);

const ActionBtn = ({
  icon,
  text,
  color,
}: {
  icon: React.ReactNode;
  text: string;
  color: "green" | "red" | "yellow";
}) => {
  const colors = {
    green: "bg-green-600 hover:bg-green-700",
    red: "bg-red-600 hover:bg-red-700",
    yellow: "bg-yellow-600 hover:bg-yellow-700",
  };

  return (
    <button
      className={`flex items-center gap-2 px-5 py-2 rounded-xl text-white transition ${colors[color]}`}
    >
      {icon}
      {text}
    </button>
  );
};

export default MBookingDetails;
