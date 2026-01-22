'use no memo';

import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { Map, Activity, ChevronDown, List, ShieldCheck } from 'lucide-react';

/**
 * [관리자] 실시간 재난 관리 신규 등록
 */
const DisasterManagementAdd = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  const [submitted, setSubmitted] = useState(false);
  
  // 데이터 구조 규칙 적용 (CamelCase)
  const [formData, setFormData] = useState({
    category: '',    // 재난유형 (지진, 호우·홍수 등)
    dataSource: '',  // 연동 데이터 (API 소스 명칭)
    mapLayer: '',    // 지도 설정 정보
    apiStatus: '정상', // 초기값 정상
    visibleYn: 'Y'   // 초기값 노출
  });

  useEffect(() => {
    if (setBreadcrumbTitle) setBreadcrumbTitle("실시간 재난 정보 등록");
    return () => setBreadcrumbTitle && setBreadcrumbTitle("");
  }, [setBreadcrumbTitle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData(prev => ({ ...prev, visibleYn: prev.visibleYn === 'Y' ? 'N' : 'Y' }));
  };

  const isFormValid = () => {
    // 등록 시 필수 필드 체크
    const { category, dataSource, mapLayer } = formData;
    return category && dataSource && mapLayer;
  };

  const handleSave = async () => {
    setSubmitted(true);
    
    if (!isFormValid()) {
      alert("모든 필수 항목을 입력해야 등록이 가능합니다.");
      return;
    }

    try {
      // 실제 서비스 시 API 연동 (POST)
      console.log("DB 등록 데이터:", {
        ...formData,
        createdAt: new Date().toISOString().split('T')[0] // 오늘 날짜 할당
      });
      
      alert("새로운 재난 관리 정보가 등록되었습니다.");
      navigate("/admin/realtime/disasterManagementList"); // 목록으로 이동
      
    } catch (error) {
      console.error("등록 중 오류:", error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        
        {/* 헤더 영역 */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-heading-l text-admin-text-primary tracking-tight">실시간 재난 정보 등록</h2>
            <p className="text-body-m text-graygray-50 mt-2">새로운 외부 API 데이터 연동 및 지도 레이어를 등록합니다.</p>
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
          {/* 재난 유형 선택 영역 */}
          <div className="p-8 border-b border-admin-border bg-white flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-admin-primary" size={24} />
              <div className="flex flex-col gap-1 w-full max-w-[400px]">
                <div className="relative">
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full h-12 px-4 rounded-md border font-bold text-xl outline-none appearance-none transition-all
                      ${submitted && !formData.category ? 'border-red-500 bg-red-50' : 'border-blue-100 bg-blue-50/30 focus:ring-2 ring-blue-100'}`}
                  >
                    <option value="">재난 유형을 선택하세요</option>
                    {['지진', '호우·홍수', '산사태', '태풍', '산불', '한파'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>
            </div>
            {submitted && !formData.category && <p className="text-red-500 text-xs ml-9 font-medium">재난 유형 선택은 필수입니다.</p>}
          </div>

          <div className="p-10 space-y-12 bg-white">
            
            {/* 1. API 연동 설정 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border">
                <Activity size={18} /> API 및 시스템 설정
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField 
                  label="연동 데이터 소스 (API)" 
                  name="dataSource" 
                  value={formData.dataSource} 
                  placeholder="예: kmaApi / sluiceApi (api.js 변수명)" 
                  onChange={handleChange} 
                  showError={submitted && !formData.dataSource} 
                />
                
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">초기 연동 상태</label>
                  <div className="relative">
                    <select 
                      name="apiStatus"
                      value={formData.apiStatus}
                      onChange={handleChange}
                      className="w-full h-14 px-5 rounded-lg border border-admin-primary outline-none text-body-m appearance-none cursor-pointer focus:ring-2 ring-blue-100"
                    >
                      <option value="정상">정상 작동</option>
                      <option value="점검중">점검중</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 지도 및 레이어 설정 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border">
                <Map size={18} /> 지도 레이어 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                <InputField 
                  label="지도 표시 정보 (Layer Name)" 
                  name="mapLayer" 
                  value={formData.mapLayer} 
                  placeholder="예: 실시간 강수량 분포도 / 대피소 위치 정보" 
                  onChange={handleChange} 
                  showError={submitted && !formData.mapLayer} 
                />
              </div>
            </div>

            {/* 3. 노출 상태 설정 */}
            <div className="pt-4">
              <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">초기 노출 설정</label>
                <div className="flex items-center gap-6 h-14 px-2">
                  <button 
                    type="button" 
                    onClick={handleToggle} 
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${formData.visibleYn === 'Y' ? 'bg-admin-primary' : 'bg-gray-300'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-300 ${formData.visibleYn === 'Y' ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                  <div className="flex flex-col">
                    <span className={`text-body-s-bold ${formData.visibleYn === 'Y' ? 'text-admin-primary' : 'text-graygray-40'}`}>
                      {formData.visibleYn === 'Y' ? "즉시 노출 (Y)" : "비노출 저장 (N)"}
                    </span>
                    <p className="text-[12px] text-gray-400">
                      * '즉시 노출' 선택 시 등록과 동시에 사용자 지도 화면에 반영됩니다.
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

// 공통 입력 필드 컴포넌트
const InputField = ({ label, name, value, placeholder, onChange, showError }) => (
  <div className="flex flex-col gap-3">
    <label className="text-body-m-bold text-admin-text-secondary ml-1">{label}</label>
    <input 
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m
        ${showError ? 'border-red-500 ring-red-50' : 'border-admin-primary focus:ring-2 ring-blue-100'}`}
    />
    {showError && <p className="text-red-500 text-xs ml-1 font-medium">필수로 입력해야 하는 항목입니다.</p>}
  </div>
);

export default DisasterManagementAdd;