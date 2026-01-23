"use no memo";

import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Activity,
  Clock,
  ChevronDown,
  List,
  ShieldCheck,
  PlusCircle,
} from "lucide-react";

const WeatherNewsAdd = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  const [submitted, setSubmitted] = useState(false);

  // 초기 입력 데이터 상태 (WeatherNewsList 구조와 동일)
  const [formData, setFormData] = useState({
    id: `W-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`, // 임시 ID 생성
    level: "보통", // 기본값
    type: "지진", // 기본값
    dateTime: new Date().toISOString().slice(0, 16).replace("T", " "), // 현재 시간 포맷
    title: "",
    content: "",
    isVisible: true,
  });

  useEffect(() => {
    if (setBreadcrumbTitle) setBreadcrumbTitle("기상 특보 신규 등록");
    return () => setBreadcrumbTitle && setBreadcrumbTitle("");
  }, [setBreadcrumbTitle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, isVisible: !prev.isVisible }));
  };

  const isFormValid = () => {
    const { level, type, title, content } = formData;
    return level && type && title && content;
  };

  const handleSave = async () => {
    setSubmitted(true);
    if (!isFormValid()) {
      alert("입력되지 않은 필수 값이 있습니다.");
      return;
    }

    try {
      // 실제 구현 시 여기서 API POST 요청
      console.log("신규 데이터 등록:", formData);
      alert("신규 특보가 성공적으로 등록되었습니다.");
      navigate("/admin/realtime/weatherNewsList"); // 등록 후 리스트로 이동
    } catch (error) {
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        {/* 헤더 영역 */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-heading-l text-admin-text-primary tracking-tight font-bold">
              기상 특보 신규 등록
            </h2>
            <p className="text-body-m text-graygray-50 mt-2">
              새로운 기상 특보 정보를 시스템에 등록합니다.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-6 h-12 border border-graygray-30 bg-white text-graygray-70 rounded-md font-bold hover:bg-graygray-10 transition-all"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-8 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-md"
            >
              등록하기
            </button>
          </div>
        </div>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard overflow-hidden">
          {/* 타이틀 영역 */}
          <div className="p-8 border-b border-admin-border bg-white flex items-center gap-3">
            <PlusCircle className="text-admin-primary" size={24} />
            <div className="flex-1">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="새로운 특보 제목을 입력하세요 (예: 경기도 한파주의보 발효)"
                className={`w-full text-2xl font-bold text-graygray-50 outline-none border-b-2 border-transparent focus:border-admin-primary pb-1 transition-all
        ${submitted && !formData.title ? "border-red-500 placeholder-red-300" : "placeholder-gray-300"}
      `}
              />
              {submitted && !formData.title && (
                <p className="text-red-500 text-xs mt-2 font-medium">
                  특보 제목은 리스트에 노출되는 핵심 정보이므로 반드시 입력해야
                  해!
                </p>
              )}
            </div>
          </div>

          <div className="p-10 space-y-12 bg-white">
            {/* 1. 기본 분류 정보 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border font-bold">
                <List size={18} /> 특보 기본 분류
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 특보유형 Select */}
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">
                    특보 유형
                  </label>
                  <div className="relative">
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full h-14 px-5 rounded-lg border border-admin-primary bg-white focus:ring-2 ring-blue-100 outline-none text-body-m appearance-none font-medium cursor-pointer"
                    >
                      {[
                        "지진",
                        "호우홍수",
                        "산사태",
                        "태풍",
                        "산불",
                        "한파",
                      ].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                {/* 경보수준 Select */}
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">
                    경보 수준
                  </label>
                  <div className="relative">
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="w-full h-14 px-5 rounded-lg border border-admin-primary bg-white focus:ring-2 ring-blue-100 outline-none text-body-m appearance-none font-medium cursor-pointer"
                    >
                      {["위험", "주의", "보통"].map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                {/* 발효 일시 */}
                <DetailField
                  label="발효 일시"
                  name="dateTime"
                  value={formData.dateTime}
                  isEdit={true}
                  onChange={handleChange}
                  placeholder="YYYY-MM-DD HH:mm"
                />
              </div>
            </div>

            {/* 2. 상세 내용 설정 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border font-bold">
                <Activity size={18} /> 특보 상세 내용
              </h3>
              <div className="grid grid-cols-1 gap-8">
                <DetailField
                  label="특보 제목"
                  name="title"
                  value={formData.title}
                  isEdit={true}
                  onChange={handleChange}
                  placeholder="예: 경기도(수원) 한파주의보 발효"
                  showError={submitted && !formData.title}
                />
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">
                    상세 통보문 내용
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={6}
                    placeholder="기상청으로부터 수신된 상세 통보문 내용을 입력하세요."
                    className={`p-5 rounded-lg border transition-all outline-none text-body-m resize-none border-admin-primary focus:ring-2 ring-blue-100 ${submitted && !formData.content ? "border-red-500 ring-red-50" : ""}`}
                  />
                  {submitted && !formData.content && (
                    <p className="text-red-500 text-xs ml-1 font-medium">
                      상세 내용은 필수 입력 사항입니다.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 3. 시스템 설정 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border font-bold">
                <Clock size={18} /> 노출 및 시스템 설정
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <DetailField
                  label="관리 번호 (자동생성)"
                  name="id"
                  value={formData.id}
                  isEdit={false}
                />

                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">
                    즉시 노출 여부
                  </label>
                  <div className="flex items-center gap-6 h-14 px-2">
                    <button
                      type="button"
                      onClick={handleToggle}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${formData.isVisible ? "bg-admin-primary" : "bg-gray-300"}`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.isVisible ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </button>
                    <div className="flex flex-col">
                      <span
                        className={`text-body-s-bold ${formData.isVisible ? "text-admin-primary" : "text-graygray-40"} font-bold`}
                      >
                        {formData.isVisible
                          ? "등록 후 즉시 노출"
                          : "등록 후 비노출(숨김)"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// 공통 필드 컴포넌트
const DetailField = ({
  label,
  name,
  value,
  isEdit,
  onChange,
  placeholder,
  showError = false,
}) => (
  <div className="flex flex-col gap-3">
    <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">
      {label}
    </label>
    <input
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={!isEdit}
      placeholder={placeholder}
      className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m font-medium
        ${isEdit ? "border-admin-primary bg-white focus:ring-2 ring-blue-100" : `border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed`} 
        ${showError ? "border-red-500 ring-red-50" : ""}
      `}
    />
    {showError && (
      <p className="text-red-500 text-xs ml-1 font-medium">
        필수 입력 항목입니다.
      </p>
    )}
  </div>
);

export default WeatherNewsAdd;
