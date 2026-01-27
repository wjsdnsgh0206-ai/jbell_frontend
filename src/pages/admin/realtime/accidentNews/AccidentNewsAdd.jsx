'use no memo';

import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { MapPin, AlertTriangle, Clock, ChevronDown, List } from 'lucide-react';

const AccidentNewsAdd = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    category: '',
    detailType: '',
    content: '',
    roadName: '',
    roadNo: '',
    direction: '',
    blockedLanes: '',
    blockType: '',
    date: '',
    endDate: '',
    lat: '',
    lng: '',
    visible: true
  });

  useEffect(() => {
    if (setBreadcrumbTitle) setBreadcrumbTitle("사고속보 신규 등록");
    return () => setBreadcrumbTitle && setBreadcrumbTitle("");
  }, [setBreadcrumbTitle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData(prev => ({ ...prev, visible: !prev.visible }));
  };

  const isFormValid = () => {
    const requiredFields = [
      'category', 'detailType', 'content', 'roadName', 
      'roadNo', 'direction', 'blockedLanes', 'blockType', 
      'date', 'endDate', 'lat', 'lng'
    ];
    return requiredFields.every(field => formData[field] !== '' && formData[field] !== null);
  };

  // 저장 핸들러 (네가 준 코드의 navigate 로직 반영)
  const handleSave = async () => {
    setSubmitted(true);
    
    if (!isFormValid()) {
      alert("모든 필수 항목을 입력해야 등록이 가능합니다.");
      return;
    }

    try {
      // 1. 데이터 확인 (콘솔)
      console.log("DB 전송 데이터:", formData);
      
      // 2. 성공 알림창
      alert("새 사고속보가 등록되었습니다.");
      
      // 3. 목록으로 이동 (참고 코드 경로 반영)
      // 경로는 네 프로젝트 구조에 맞춰서 "/admin/contents/accidentNewsList"로 설정했어.
      navigate("/admin/realtime/accidentNews"); 
      
    } catch (error) {
      console.error("등록 중 오류:", error);
      alert("등록 중 오류가 발생했습니다.");
    }
  }
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        
        {/* 헤더 영역 */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-heading-l text-admin-text-primary tracking-tight">사고속보 신규 등록</h2>
            <p className="text-body-m text-graygray-50 mt-2">새로운 사고 속보를 등록합니다.</p>
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
          <div className="p-8 border-b border-admin-border bg-white flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-orange-500" size={24} />
              <input 
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="사고 내용을 입력하세요"
                className={`text-2xl font-bold outline-none w-full max-w-[800px] bg-blue-50/30 px-3 py-1 rounded-md focus:ring-2 ring-blue-100 transition-all
                  ${submitted && !formData.content ? 'ring-2 ring-red-500' : ''}`}
              />
            </div>
            {submitted && !formData.content && <p className="text-red-500 text-xs ml-9 font-medium">필수로 입력해야하는 값입니다.</p>}
          </div>

          <div className="p-10 space-y-12 bg-white">
            {/* 구분 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border">
                <List size={18} /> 기본 분류 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">구분</label>
                  <div className="relative">
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full h-14 px-5 rounded-lg border outline-none text-body-m appearance-none font-bold cursor-pointer transition-all
                        ${submitted && !formData.category ? 'border-red-500 ring-red-50' : 'border-admin-primary focus:ring-2 ring-blue-100'}`}
                    >
                      <option value="">구분 선택</option>
                      <option value="기타돌발">기타돌발</option>
                      <option value="재난">재난</option>
                      <option value="공사">공사</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                  {submitted && !formData.category && <p className="text-red-500 text-xs ml-1 font-medium">필수로 입력해야하는 값입니다.</p>}
                </div>
              </div>
            </div>

            {/* 위치 정보 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border">
                <MapPin size={18} /> 위치 및 도로 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <InputField label="도로명" name="roadName" value={formData.roadName} placeholder="도로명" onChange={handleChange} showError={submitted && !formData.roadName} />
                <InputField label="도로번호" name="roadNo" value={formData.roadNo} placeholder="도로번호" onChange={handleChange} showError={submitted && !formData.roadNo} />
                <InputField label="진행 방향" name="direction" value={formData.direction} placeholder="진행 방향" onChange={handleChange} showError={submitted && !formData.direction} />
                
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">도로 유형</label>
                  <div className="relative">
                    <select 
                      name="detailType"
                      value={formData.detailType}
                      onChange={handleChange}
                      className={`w-full h-14 px-5 rounded-lg border outline-none text-body-m appearance-none cursor-pointer transition-all
                        ${submitted && !formData.detailType ? 'border-red-500 ring-red-50' : 'border-admin-primary focus:ring-2 ring-blue-100'}`}
                    >
                      <option value="">유형 선택</option>
                      <option value="기타">기타</option>
                      <option value="공사">공사</option>
                      <option value="교통사고">교통사고</option>
                      <option value="작업">작업</option>
                      <option value="차량고장">차량고장</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                  {submitted && !formData.detailType && <p className="text-red-500 text-xs ml-1 font-medium">필수로 입력해야하는 값입니다.</p>}
                </div>
              </div>
            </div>

            {/* 시간 정보 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border">
                <Clock size={18} /> 차단 및 시간 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <InputField label="차단 차로" name="blockedLanes" value={formData.blockedLanes} placeholder="차단 차로" onChange={handleChange} showError={submitted && !formData.blockedLanes} />
                <InputField label="차단 유형" name="blockType" value={formData.blockType} placeholder="차단 유형" onChange={handleChange} showError={submitted && !formData.blockType} />
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">발생 일시</label>
                  <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} 
                    className={`h-14 px-5 rounded-lg border outline-none transition-all ${submitted && !formData.date ? 'border-red-500 ring-red-50' : 'border-admin-primary'}`} />
                  {submitted && !formData.date && <p className="text-red-500 text-xs ml-1 font-medium">필수로 입력해야하는 값입니다.</p>}
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">종료 예정</label>
                  <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} 
                    className={`h-14 px-5 rounded-lg border outline-none transition-all ${submitted && !formData.endDate ? 'border-red-500 ring-red-50' : 'border-admin-primary'}`} />
                  {submitted && !formData.endDate && <p className="text-red-500 text-xs ml-1 font-medium">필수로 입력해야하는 값입니다.</p>}
                </div>
              </div>
            </div>

            {/* 좌표 및 노출 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
              <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">좌표 (Lat / Lng)</label>
                <div className="flex gap-4">
                  <input name="lat" value={formData.lat} onChange={handleChange} placeholder="위도" className={`flex-1 h-14 px-5 rounded-lg border outline-none ${submitted && !formData.lat ? 'border-red-500' : 'border-admin-primary'}`} />
                  <input name="lng" value={formData.lng} onChange={handleChange} placeholder="경도" className={`flex-1 h-14 px-5 rounded-lg border outline-none ${submitted && !formData.lng ? 'border-red-500' : 'border-admin-primary'}`} />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">노출 상태</label>
                <div className="flex items-center gap-6 h-14 px-2">
                  <button type="button" onClick={handleToggle} className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${formData.visible ? 'bg-admin-primary' : 'bg-gray-300'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${formData.visible ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                  <span className={`text-body-s-bold ${formData.visible ? 'text-admin-primary' : 'text-graygray-40'}`}>{formData.visible ? "활성화" : "비활성화"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const InputField = ({ label, name, value, placeholder, onChange, showError }) => (
  <div className="flex flex-col gap-3">
    <label className="text-body-m-bold text-admin-text-secondary ml-1">{label}</label>
    <input 
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`h-14 px-5 rounded-lg border transition-all outline-none ${showError ? 'border-red-500 ring-red-50' : 'border-admin-primary focus:ring-2 ring-blue-100'}`}
    />
    {showError && <p className="text-red-500 text-xs ml-1 font-medium">필수 입력란입니다.</p>}
  </div>
);


export default AccidentNewsAdd;