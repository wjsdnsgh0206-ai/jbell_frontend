'use no memo';

import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { MapPin, AlertTriangle, Clock, ChevronDown, List, PlusCircle } from 'lucide-react';

const DisasterEventManagementAdd = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  const [submitted, setSubmitted] = useState(false);
  
  // 초기값 설정
  const [formData, setFormData] = useState({
    serialNumber: '',
    type: '산불',    // 기본값
    region: '전주시', // 기본값
    content: '',
    dateTime: '',
    status: '진행중', // 기본값
    isVisible: true,
    lat: '',
    lng: ''
  });

  useEffect(() => {
    if (setBreadcrumbTitle) setBreadcrumbTitle("재난 발생 등록");
    return () => setBreadcrumbTitle && setBreadcrumbTitle("");
  }, [setBreadcrumbTitle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData(prev => ({ ...prev, isVisible: !prev.isVisible }));
  };

  const isFormValid = () => {
    // 필수 입력 필드 검증
    const requiredFields = ['serialNumber', 'type', 'region', 'content', 'dateTime', 'lat', 'lng'];
    return requiredFields.every(key => formData[key].trim() !== '');
  };

  const handleRegister = async () => {
    setSubmitted(true);
    if (!isFormValid()) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    try {
      // 실제 구현 시 여기서 API POST 요청을 보냄
      console.log("등록 데이터:", formData);
      alert("성공적으로 등록되었습니다.");
      navigate("/admin/realtime/disaster"); // 등록 후 리스트로 이동
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
              재난 발생 신규 등록
            </h2>
            <p className="text-body-m text-gray-500 mt-2">새로운 재난 상황 정보를 시스템에 등록합니다.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="px-6 h-12 border border-graygray-30 bg-white text-graygray-70 rounded-md font-bold hover:bg-graygray-10 transition-all"
            >
              취소
            </button>
            <button 
              onClick={handleRegister} 
              className="px-8 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
            >
              등록하기
            </button>
          </div>
        </div>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard overflow-hidden bg-white">
          {/* 재난 내용 입력 (강조) */}
          <div className="p-8 border-b border-admin-border flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-admin-primary" size={24} />
              <input 
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="재난 내용 및 메시지를 입력하세요 (예: 전주시 덕진구 산불 발생, 인근 주민 대피 바랍니다)"
                className={`text-2xl font-bold outline-none w-full max-w-[900px] transition-all bg-blue-50/30 px-3 py-2 rounded-md border-b-2 ${submitted && !formData.content ? 'border-red-500' : 'border-transparent focus:border-admin-primary'}`} 
              />
            </div>
            {submitted && !formData.content && <p className="text-red-500 text-sm ml-9 font-medium">내용은 필수 입력 사항입니다.</p>}
          </div>

          <div className="p-10 space-y-12">
            
            {/* 1. 기본 분류 정보 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border font-bold">
                <List size={18} /> 기본 정보 및 유형
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <RegisterField label="재난 일련번호" name="serialNumber" value={formData.serialNumber} placeholder="예: 2026-FIRE-001" onChange={handleChange} showError={submitted && !formData.serialNumber} />
                
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">재난 유형</label>
                  <div className="relative">
                    <select 
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full h-14 px-5 rounded-lg border border-admin-primary bg-white outline-none text-body-m appearance-none font-bold cursor-pointer"
                    >
                      <option value="산불">산불</option>
                      <option value="홍수">홍수</option>
                      <option value="지진">지진</option>
                      <option value="폭설">폭설</option>
                      <option value="태풍">태풍</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">상황 상태</label>
                  <div className="relative">
                    <select 
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full h-14 px-5 rounded-lg border border-admin-primary bg-white outline-none text-body-m appearance-none font-bold cursor-pointer text-red-600"
                    >
                      <option value="진행중">진행중</option>
                      <option value="종료">종료</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                <RegisterField label="발생 지역" name="region" value={formData.region} placeholder="예: 전주시 덕진구" onChange={handleChange} showError={submitted && !formData.region} />
              </div>
            </div>

            {/* 2. 시간 및 위치 정보 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border font-bold">
                <Clock size={18} /> 시간 및 위치 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">발생 일시</label>
                  <input 
                    type="datetime-local"
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleChange}
                    className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m border-admin-primary focus:ring-2 ring-blue-100 ${submitted && !formData.dateTime ? 'border-red-500' : ''}`}
                  />
                  {submitted && !formData.dateTime && <p className="text-red-500 text-xs ml-1 font-medium">발생 일시를 선택해주세요.</p>}
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">좌표 정보 (Lat / Lng)</label>
                  <div className="flex gap-4">
                    <input name="lat" value={formData.lat} onChange={handleChange} placeholder="위도(Lat)"
                      className={`flex-1 h-14 px-5 rounded-lg border border-admin-primary outline-none transition-all text-body-m focus:ring-2 ring-blue-100 ${submitted && !formData.lat ? 'border-red-500' : ''}`} />
                    <input name="lng" value={formData.lng} onChange={handleChange} placeholder="경도(Lng)"
                      className={`flex-1 h-14 px-5 rounded-lg border border-admin-primary outline-none transition-all text-body-m focus:ring-2 ring-blue-100 ${submitted && !formData.lng ? 'border-red-500' : ''}`} />
                  </div>
                  {submitted && (!formData.lat || !formData.lng) && <p className="text-red-500 text-xs ml-1 font-medium">정확한 좌표를 입력해주세요.</p>}
                </div>
              </div>
            </div>

            {/* 3. 노출 정보 */}
            <div className="pt-4 border-t border-admin-border">
              <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">사용자 앱 노출 설정</label>
                <div className="flex items-center gap-6 h-14 px-2">
                  <button
                    type="button"
                    onClick={handleToggle}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${formData.isVisible ? 'bg-admin-primary' : 'bg-gray-300'} cursor-pointer`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.isVisible ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                  <div className="flex flex-col">
                    <span className={`text-body-s-bold ${formData.isVisible ? 'text-admin-primary' : 'text-graygray-40'}`}>
                      {formData.isVisible ? "즉시 노출 (ON)" : "미노출 저장 (OFF)"}
                    </span>
                    <p className="text-[12px] text-gray-400">
                      * 등록 즉시 모든 사용자 화면에 정보가 표시됩니다.
                    </p>
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

// 등록용 필드 컴포넌트
const RegisterField = ({ label, name, value, placeholder, onChange, showError = false }) => (
  <div className="flex flex-col gap-3">
    <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">{label}</label>
    <input 
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m border-admin-primary focus:ring-2 ring-blue-100
        ${showError ? 'border-red-500 ring-red-50' : ''}
      `}
    />
    {showError && <p className="text-red-500 text-xs ml-1 font-medium">필수 입력 항목입니다.</p>}
  </div>
);

export default DisasterEventManagementAdd;