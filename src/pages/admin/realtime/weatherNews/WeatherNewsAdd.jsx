"use no memo";

import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Activity, Clock, ChevronDown, List, PlusCircle } from "lucide-react";

// [API 및 공통 데이터 임포트]
import { disasterApi } from "@/services/api"; 
import { WEATHER_OPTIONS } from "./WeatherTypeData";

/**
 * 한국 시간(KST) 기준으로 현재 날짜와 시간을 반환하는 함수
 * YYYY-MM-DD HH:mm 형식
 */
const getKSTNow = () => {
  const now = new Date();
  // 한국 시간은 UTC보다 9시간 빠름
  const kstOffset = 9 * 60 * 60 * 1000; 
  const kstDate = new Date(now.getTime() + kstOffset);
  return kstDate.toISOString().slice(0, 16).replace("T", " ");
};

/**
 * 한국 날짜(YYYYMMDD)를 반환하는 함수 (MAAS_OBNT_DT용)
 */
const getKSTDateString = () => {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  return kstDate.toISOString().slice(0, 10).replace(/-/g, "");
};

const WeatherNewsAdd = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();
  const [submitted, setSubmitted] = useState(false);

  // 1. 상태 관리 - 초기값에 한국 시간 적용
  const [formData, setFormData] = useState({
    level: "보통",
    type: "한파", 
    dateTime: getKSTNow(), 
    title: "",
    content: "",
    isVisible: true,
  });

  useEffect(() => {
    if (setBreadcrumbTitle) setBreadcrumbTitle("기상 특보 신규 등록");
  }, [setBreadcrumbTitle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, isVisible: !prev.isVisible }));
  };

  // 2. 저장 로직
  const handleSave = async () => {
    setSubmitted(true);
    
    if (!formData.title || !formData.content) {
      alert("필수 항목을 입력해주세요.");
      return;
    }

    try {
      const payload = {
        // DTO의 @JsonProperty 설정에 맞춰 구성
        TTL: formData.title,
        PRSNTN_TM: formData.dateTime.replace(/[^0-9]/g, ""), // 숫자만 (YYYYMMDDHHmm)
        RLVT_ZONE: "전라북도",
        SPNE_FRMNT_PRCON_CN: formData.content,
        TIME_TXT: formData.dateTime,
        MAAS_OBNT_DT: getKSTDateString(), // 💡 한국 기준 날짜 (YYYYMMDD)
        visible_yn: formData.isVisible ? 'Y' : 'N',
        // visibleYn: formData.isVisible ? 'Y' : 'N',
        level: formData.level,
        newsType: formData.type,
        is_manual: 'Y',
        warningType: formData.type,
      };

      await disasterApi.createWeather(payload);
      
      alert("신규 특보가 성공적으로 등록되었습니다.");
      navigate("/admin/realtime/weatherNewsList"); 
    } catch (error) {
      console.error("등록 실패 상세:", error.response?.data);
      alert("등록에 실패했습니다. 데이터를 다시 확인해주세요.");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-heading-l text-admin-text-primary tracking-tight font-bold">기상 특보 신규 등록</h2>
            <p className="text-body-m text-graygray-50 mt-2">새로운 기상 특보 정보를 시스템에 등록합니다.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="px-6 h-12 border border-graygray-30 bg-white rounded-md font-bold hover:bg-graygray-10 transition-all">취소</button>
            <button onClick={handleSave} className="px-8 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-md">등록하기</button>
          </div>
        </div>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard overflow-hidden">
          <div className="p-8 border-b border-admin-border bg-white flex items-center gap-3">
            <PlusCircle className="text-admin-primary" size={24} />
            <div className="flex-1">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="특보 제목을 입력하세요 (예: 전라북도 한파주의보 발효)"
                className={`w-full text-2xl font-bold outline-none border-b-2 border-transparent focus:border-admin-primary pb-1 transition-all ${submitted && !formData.title ? "border-red-500" : ""}`}
              />
            </div>
          </div>

          <div className="p-10 space-y-12 bg-white">
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border font-bold"><List size={18} /> 특보 기본 분류</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary font-bold ml-1">특보 유형</label>
                  <div className="relative">
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full h-14 px-5 rounded-lg border border-admin-primary bg-white outline-none text-body-m appearance-none cursor-pointer"
                    >
                      {WEATHER_OPTIONS.WEATHER_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={20} />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary font-bold ml-1">경보 수준</label>
                  <div className="relative">
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="w-full h-14 px-5 rounded-lg border border-admin-primary bg-white outline-none text-body-m appearance-none cursor-pointer"
                    >
                      {WEATHER_OPTIONS.WEATHER_LEVELS.map((l) => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={20} />
                  </div>
                </div>

                <DetailField label="발효 일시" name="dateTime" value={formData.dateTime} isEdit={true} onChange={handleChange} placeholder="YYYY-MM-DD HH:mm" />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border font-bold"><Activity size={18} /> 특보 상세 내용</h3>
              <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary font-bold ml-1">상세 통보문 내용</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={6}
                  className={`p-5 rounded-lg border border-admin-primary outline-none text-body-m resize-none focus:ring-2 ring-blue-100 ${submitted && !formData.content ? "border-red-500" : ""}`}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border font-bold"><Clock size={18} />노출 상태 설정</h3>
              <div className="flex items-center gap-6 h-14 px-2">
                <button
                  type="button"
                  onClick={handleToggle}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${formData.isVisible ? "bg-admin-primary" : "bg-gray-300"}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.isVisible ? "translate-x-6" : "translate-x-0"}`} />
                </button>
                <span className={`text-body-s-bold font-bold ${formData.isVisible ? "text-admin-primary" : "text-graygray-40"}`}>
                  {formData.isVisible ? "활성화 (Y)" : "비활성화 (N)"}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const DetailField = ({ label, name, value, isEdit, onChange, placeholder, showError }) => (
  <div className="flex flex-col gap-3">
    <label className="text-body-m-bold text-admin-text-secondary font-bold ml-1">{label}</label>
    <input
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={!isEdit}
      placeholder={placeholder}
      className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m font-medium ${isEdit ? "border-admin-primary bg-white focus:ring-2 ring-blue-100" : "border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed"} ${showError ? "border-red-500" : ""}`}
    />
  </div>
);

export default WeatherNewsAdd;