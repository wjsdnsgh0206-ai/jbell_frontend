'use no memo';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { MapPin, AlertTriangle, Clock, ChevronDown, List, Info } from 'lucide-react';
// [데이터] 재난 발생 초기 데이터 임포트
import { initialDisasters } from "./DisasterEventData";

const DisasterEventManagementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  
  // DisasterEventManagementList에서 사용하는 데이터 구조에 맞춤
  const [formData, setFormData] = useState({
    id: '',
    serialNumber: '', // 산불일련번호 등
    type: '',         // 재난 유형
    region: '',       // 발생 지역
    content: '',      // 내용
    dateTime: '',     // 발생 일시
    status: '',       // 상태 (진행중/종료)
    isVisible: true,  // 노출 여부
    lat: '',          // 위도 (가정)
    lng: ''           // 경도 (가정)
  });

  const [originData, setOriginData] = useState(null);

  useEffect(() => {
    const getDetailData = () => {
      setLoading(true);
      try {
        // 실제 환경에서는 API 호출이겠지만, 여기서는 initialDisasters에서 찾음
        const found = initialDisasters.find(item => String(item.id) === String(id));
        if (found) {
          const data = {
            ...found,
            lat: found.lat || "35.8242", // 더미 데이터에 없을 경우 대비
            lng: found.lng || "127.1480"
          };
          setFormData(data);
          setOriginData(data);
          if (setBreadcrumbTitle) setBreadcrumbTitle(found.content);
        } else {
          alert("해당 재난 정보를 찾을 수 없습니다.");
          navigate(-1);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    getDetailData();
    return () => setBreadcrumbTitle && setBreadcrumbTitle("");
  }, [id, setBreadcrumbTitle, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    if (!isEdit) return; 
    setFormData(prev => ({ ...prev, isVisible: !prev.isVisible }));
  };

  const handleCancel = () => {
    if (window.confirm("수정 중인 내용을 취소하고 원래대로 되돌리시겠습니까?")) {
      setFormData(originData);
      setIsEdit(false);
      setSubmitted(false);
    }
  };

  const isFormValid = () => {
    // 필수 필드 체크 (id, serialNumber, type, region, content, dateTime, status)
    const requiredFields = ['serialNumber', 'type', 'region', 'content', 'dateTime', 'status'];
    return requiredFields.every(key => formData[key] !== '' && formData[key] !== null);
  };

  const handleSave = async () => {
    setSubmitted(true);
    if (!isFormValid()) {
      alert("입력되지 않은 필수 값이 있습니다.");
      return;
    }
    try {
      // 실제로는 여기서 axios.put 등을 사용해 서버에 저장
      setOriginData(formData);
      alert("성공적으로 저장되었습니다.");
      setIsEdit(false);
      setSubmitted(false);
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div className="p-10 text-center text-admin-text-secondary">데이터를 불러오는 중입니다...</div>;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        
        {/* 헤더 영역 */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-heading-l text-admin-text-primary tracking-tight font-bold">
              재난 발생 {isEdit ? '정보 수정' : '상세 정보'}
            </h2>
          </div>
          <div className="flex gap-3">
            {!isEdit ? (
              <>
                <button onClick={() => navigate(-1)} className="px-6 h-12 border border-graygray-30 bg-white text-graygray-70 rounded-md font-bold hover:bg-graygray-10 transition-all">목록으로</button>
                <button onClick={() => setIsEdit(true)} className="px-8 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-sm">수정하기</button>
              </>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleCancel} className="px-6 h-12 border border-graygray-30 bg-white text-graygray-70 rounded-md font-bold hover:bg-graygray-10 transition-all">취소</button>
                <button onClick={handleSave} className="px-8 h-12 bg-[#22C55E] text-white rounded-md font-bold hover:opacity-90 transition-all shadow-md">저장하기</button>
              </div>
            )}
          </div>
        </div>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard overflow-hidden">
          {/* 주요 메시지 강조 */}
          <div className="p-8 border-b border-admin-border bg-white flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-500" size={24} />
              <input 
                name="content"
                value={formData.content}
                onChange={handleChange}
                disabled={!isEdit}
                placeholder="재난 내용을 입력하세요"
                className={`text-2xl font-bold outline-none w-full max-w-[800px] transition-all
                  ${isEdit ? 'bg-blue-50/30 px-3 py-1 rounded-md' : 'bg-transparent text-graygray-50'}`} 
              />
            </div>
            {submitted && !formData.content && <p className="text-red-500 text-xs ml-9 font-medium">내용은 필수 입력 사항입니다.</p>}
          </div>

          <div className="p-10 space-y-12 bg-white">
            
            {/* 1. 기본 분류 정보 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border">
                <List size={18} /> 기본 정보 및 유형
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <DetailField label="재난 일련번호" name="serialNumber" value={formData.serialNumber} isEdit={isEdit} onChange={handleChange} showError={submitted && !formData.serialNumber} />
                
                {/* 재난 유형 Select */}
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">재난 유형</label>
                  <div className="relative">
                    <select 
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className={`w-full h-14 px-5 rounded-lg border transition-all outline-none text-body-m appearance-none font-bold
                        ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100 cursor-pointer' : 'border-admin-border bg-graygray-5 text-admin-primary cursor-not-allowed'}`}
                    >
                      <option value="산불">산불</option>
                      <option value="홍수">홍수</option>
                      <option value="지진">지진</option>
                      <option value="폭설">폭설</option>
                      <option value="태풍">태풍</option>
                    </select>
                    {isEdit && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ChevronDown size={20} />
                      </div>
                    )}
                  </div>
                </div>

                {/* 상태 Select */}
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">상황 상태</label>
                  <div className="relative">
                    <select 
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className={`w-full h-14 px-5 rounded-lg border transition-all outline-none text-body-m appearance-none font-bold
                        ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100 cursor-pointer' : 'border-admin-border bg-graygray-5 text-red-600 cursor-not-allowed'}`}
                    >
                      <option value="진행중">진행중</option>
                      <option value="종료">종료</option>
                    </select>
                    {isEdit && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ChevronDown size={20} />
                      </div>
                    )}
                  </div>
                </div>

                <DetailField label="발생 지역" name="region" value={formData.region} isEdit={isEdit} onChange={handleChange} showError={submitted && !formData.region} />
              </div>
            </div>

            {/* 2. 시간 및 위치 정보 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border">
                <Clock size={18} /> 시간 및 위치 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">발생 일시</label>
                  <input 
                    type={isEdit ? "datetime-local" : "text"}
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleChange}
                    disabled={!isEdit}
                    className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m
                      ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed'}`}
                  />
                  {submitted && !formData.dateTime && <p className="text-red-500 text-xs ml-1 font-medium">필수로 입력해야하는 값입니다.</p>}
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">좌표 정보 (Lat / Lng)</label>
                  <div className="flex gap-4">
                    <input name="lat" value={formData.lat} onChange={handleChange} disabled={!isEdit} placeholder="위도"
                      className={`flex-1 h-14 px-5 rounded-lg border outline-none transition-all text-body-m
                      ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed'}`} />
                    <input name="lng" value={formData.lng} onChange={handleChange} disabled={!isEdit} placeholder="경도"
                      className={`flex-1 h-14 px-5 rounded-lg border outline-none transition-all text-body-m
                      ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed'}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 노출 정보 */}
            <div className="pt-4 border-t border-admin-border">
              <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">사용자 앱 노출 설정</label>
                <div className="flex items-center gap-6 h-14 px-2">
                  <button
                    type="button"
                    onClick={handleToggle}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${formData.isVisible ? 'bg-admin-primary' : 'bg-gray-300'} ${isEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.isVisible ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                  <div className="flex flex-col">
                    <span className={`text-body-s-bold ${formData.isVisible ? 'text-admin-primary' : 'text-graygray-40'}`}>
                      {formData.isVisible ? "노출 중 (ON)" : "미노출 (OFF)"}
                    </span>
                    <p className="text-[12px] text-gray-400">
                      {formData.isVisible ? '* 현재 재난 상황판 및 앱에 정보가 게시되고 있습니다.' : '* 현재 비노출 상태이며 관리자만 확인 가능합니다.'}
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

// 공통 필드 컴포넌트
const DetailField = ({ label, name, value, isEdit, onChange, highlight = "", showError = false }) => (
  <div className="flex flex-col gap-3">
    <label className="text-body-m-bold text-admin-text-secondary ml-1">{label}</label>
    <input 
      name={name}
      value={value || ''}
      onChange={onChange}
      disabled={!isEdit}
      className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m
        ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : `border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed ${highlight}`} 
        ${showError && isEdit ? 'border-red-500 ring-red-50' : ''}
      `}
    />
    {showError && isEdit && <p className="text-red-500 text-xs ml-1 font-medium">필수로 입력해야하는 값입니다.</p>}
  </div>
);

export default DisasterEventManagementDetail;