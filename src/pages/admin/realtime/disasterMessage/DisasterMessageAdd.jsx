'use no memo';

import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { Clock, ChevronDown, List, FileText, Send } from 'lucide-react';

/**
 * [관리자] 재난 문자 수동 등록 페이지
 */
const DisasterMessageAdd = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  const [submitted, setSubmitted] = useState(false);
  
  // 1. 초기 폼 상태 (오늘 날짜와 기본값 세팅)
  const [formData, setFormData] = useState({
    category: '안전안내',
    type: '기상',
    sender: '',
    content: '',
    region: '전라북도 전주시',
    dateTime: new Date().toISOString().replace('T', ' ').substring(0, 19), // 현재 시간
    isVisible: true
  });

  // 브레드크럼 설정
  useEffect(() => {
    if (setBreadcrumbTitle) setBreadcrumbTitle("재난 문자 등록");
    return () => setBreadcrumbTitle && setBreadcrumbTitle("");
  }, [setBreadcrumbTitle]);

  // 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData(prev => ({ ...prev, isVisible: !prev.isVisible }));
  };

  const isFormValid = () => {
    const requiredFields = ['category', 'type', 'sender', 'content', 'region', 'dateTime'];
    return requiredFields.every(key => formData[key] !== '' && formData[key] !== null);
  };

  const handleSave = async () => {
    setSubmitted(true);
    if (!isFormValid()) {
      alert("입력되지 않은 필수 값이 있습니다.");
      return;
    }

    if (window.confirm("새로운 재난 문자를 등록하시겠습니까?")) {
      try {
        // 실제로는 여기서 axios.post 등을 호출하겠지?
        console.log("등록 데이터:", formData);
        alert("성공적으로 등록되었습니다.");
        navigate('/admin/realtime/disasterMessageList'); // 리스트로 이동
      } catch (error) {
        alert("등록 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        
        {/* 헤더 영역 */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-heading-l text-admin-text-primary tracking-tight font-bold">
              재난 문자 신규 등록
            </h2>
            <p className="text-body-m text-graygray-40 mt-2">수동으로 재난 문자 정보를 입력하여 시스템에 등록합니다.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="px-6 h-12 border border-graygray-30 bg-white text-graygray-70 rounded-md font-bold hover:bg-graygray-10 transition-all cursor-pointer">취소</button>
            <button onClick={handleSave} className="px-8 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-md cursor-pointer flex items-center gap-2">
              <Send size={18} /> 등록하기
            </button>
          </div>
        </div>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard overflow-hidden">
          
          {/* 상단 안내 바 */}
          <div className="p-6 border-b border-admin-border bg-blue-50/50 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-admin-primary animate-pulse" />
            <span className="text-body-s-bold text-admin-primary">신규 데이터 작성 중</span>
          </div>

          <div className="p-10 space-y-12 bg-white">
            
            {/* 1. 본문 내용 작성 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border">
                <FileText size={18} /> 재난 문자 본문 내용
              </h3>
              <div className="flex flex-col gap-3">
                <textarea 
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={6}
                  placeholder="재난 문자 본문 내용을 입력하세요. (예: [전주시청] 오늘 14시 대설주의보 발효...)"
                  className={`text-lg font-medium outline-none w-full transition-all resize-none leading-relaxed p-6 rounded-xl border
                    ${submitted && !formData.content ? 'border-red-500 bg-red-50/10' : 'border-admin-border bg-white focus:border-admin-primary focus:ring-2 ring-blue-100'}`} 
                />
                {submitted && !formData.content && <p className="text-red-500 text-xs ml-1 font-medium">본문 내용은 반드시 입력해야 합니다.</p>}
              </div>
            </div>

            {/* 2. 상세 분류 및 발송 정보 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border">
                <List size={18} /> 발송 및 분류 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                
                {/* 구분 Select */}
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">구분</label>
                  <div className="relative">
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full h-14 px-5 rounded-lg border border-admin-border bg-white focus:border-admin-primary focus:ring-2 ring-blue-100 outline-none text-body-m appearance-none font-bold cursor-pointer transition-all"
                    >
                      <option value="안전안내">안전안내</option>
                      <option value="긴급재난">긴급재난</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* 유형 Select */}
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">유형</label>
                  <div className="relative">
                    <select 
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full h-14 px-5 rounded-lg border border-admin-border bg-white focus:border-admin-primary focus:ring-2 ring-blue-100 outline-none text-body-m appearance-none font-bold cursor-pointer transition-all"
                    >
                      <option value="기상">기상특보</option>
                      <option value="실종자">실종자</option>
                      <option value="화재">화재</option>
                      <option value="교통통제">교통통제</option>
                      <option value="기타">기타</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>

                <InputField label="발송 기관" name="sender" value={formData.sender} onChange={handleChange} placeholder="예: 전주시청" showError={submitted && !formData.sender} />
                <InputField label="수신 지역" name="region" value={formData.region} onChange={handleChange} placeholder="예: 전라북도 전주시" showError={submitted && !formData.region} />
              </div>
            </div>

            {/* 3. 노출 정보 및 일시 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4 border-t border-admin-border">
              <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">시스템 즉시 노출</label>
                <div className="flex items-center gap-6 h-14 px-2">
                  <button
                    type="button"
                    onClick={handleToggle}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 cursor-pointer ${formData.isVisible ? 'bg-admin-primary' : 'bg-gray-300'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.isVisible ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                  <div className="flex flex-col">
                    <span className={`text-body-s-bold ${formData.isVisible ? 'text-admin-primary' : 'text-graygray-40'}`}>
                      {formData.isVisible ? "노출함" : "노출 안 함"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">발송 일시</label>
                <input 
                  type="text"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleChange}
                  placeholder="YYYY-MM-DD HH:mm:ss"
                  className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m
                    ${submitted && !formData.dateTime ? 'border-red-500 bg-red-50/10' : 'border-admin-border bg-white focus:border-admin-primary focus:ring-2 ring-blue-100'}`}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// 등록 전용 공통 입력 컴포넌트
const InputField = ({ label, name, value, onChange, placeholder, showError }) => (
  <div className="flex flex-col gap-3">
    <label className="text-body-m-bold text-admin-text-secondary ml-1">{label}</label>
    <input 
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m font-bold
        ${showError ? 'border-red-500 bg-red-50/10' : 'border-admin-border bg-white focus:border-admin-primary focus:ring-2 ring-blue-100'}`}
    />
    {showError && <p className="text-red-500 text-xs ml-1 font-medium">필수 입력 항목입니다.</p>}
  </div>
);

export default DisasterMessageAdd;