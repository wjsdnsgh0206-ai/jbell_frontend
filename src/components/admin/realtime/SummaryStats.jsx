import React from "react";
import { AlertCircle, Mail, Skull, TrendingUp, TrendingDown } from "lucide-react";

export const SummaryStats = () => {
  const stats = [
    {
      id: 1,
      label: "특보 발령",
      value: "12",
      unit: "건",
      trend: "+2",
      isUp: true,
      icon: <AlertCircle size={20} />,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      id: 2,
      label: "재난 문자",
      value: "154",
      unit: "회",
      trend: "-12",
      isUp: false,
      icon: <Mail size={20} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: 3,
      label: "인명 피해(사망)",
      value: "0",
      unit: "명",
      trend: "0",
      isUp: false,
      icon: <Skull size={20} />,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      id: 4,
      label: "피해 복구율",
      value: "85",
      unit: "%",
      trend: "+5",
      isUp: true,
      icon: <TrendingUp size={20} />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <section className="absolute top-[145px] left-[50px] flex gap-6 w-[1500px]">
      {stats.map((item) => (
        <article
          key={item.id}
          className="flex-1 bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 mb-1">{item.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#1d1d1d]">{item.value}</span>
                <span className="text-sm font-bold text-gray-500">{item.unit}</span>
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
            item.trend === "0" ? "bg-gray-100 text-gray-400" : item.isUp ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
          }`}>
            {item.trend !== "0" && (item.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />)}
            {item.trend === "0" ? "변동없음" : Math.abs(item.trend)}
          </div>
        </article>
      ))}
    </section>
  );
};