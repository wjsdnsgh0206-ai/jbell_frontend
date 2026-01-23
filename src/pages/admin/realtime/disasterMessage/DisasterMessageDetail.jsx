'use no memo';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { AlertTriangle, Clock, ChevronDown, List, Info, FileText } from 'lucide-react';
// [데이터] 재난 문자 초기 데이터 임포트
import { initialMessageData } from "./DisasterMessageData";

const DisasterMessageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    category: '',
    type: '',
    sender: '',
    content: '',
    region: '',
    dateTime: '',
    isVisible: true
  });

  const [originData, setOriginData] = useState(null);

  useEffect(() => {
    const getDetailData = () => {
      setLoading(true);
      try {
        const found = initialMessageData.find(item => String(item.id) === String(id));
        if (found) {
          setFormData(found);
          setOriginData(found);
          if (setBreadcrumbTitle) setBreadcrumbTitle("재난 문자 상세 정보");
        } else {
          alert("해당 재난 문자 정보를 찾을 수 없습니다.");
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
    const requiredFields = ['category', 'type', 'sender', 'content', 'region', 'dateTime'];
    return requiredFields.every(key => formData[key] !== '' && formData[key] !== null);
  };

  const handleSave = async () => {
    setSubmitted(true);
    if (!isFormValid()) {
      alert("입력되지 않은 필수 값이 있습니다.");
      return;
    }
    try {
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
              재난 문자 {isEdit ? '내용 수정' : '상세 내역'}
            </h2>
          </div>
          <div className="flex gap-3">
            {!isEdit ? (
              <>
                <button onClick={() => navigate(-1)} className="px-6 h-12 border border-graygray-30 bg-white text-graygray-70 rounded-md font-bold hover:bg-graygray-10 transition-all cursor-pointer">목록으로</button>
                <button onClick={() => setIsEdit(true)} className="px-8 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-sm cursor-pointer">수정하기</button>
              </>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleCancel} className="px-6 h-12 border border-graygray-30 bg-white text-graygray-70 rounded-md font-bold hover:bg-graygray-10 transition-all cursor-pointer">취소</button>
                <button onClick={handleSave} className="px-8 h-12 bg-[#22C55E] text-white rounded-md font-bold hover:opacity-90 transition-all shadow-md cursor-pointer">저장하기</button>
              </div>
            )}
          </div>
        </div>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard overflow-hidden">
          
          {/* 상단 강조 영역: 문자 본문 대신 핵심 요약 정보 노출 */}
          <div className="p-8 border-b border-admin-border bg-graygray-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm 
                ${formData.category === '긴급재난' ? 'bg-red-500 text-white' : 'bg-admin-primary text-white'}`}>
                {formData.category}
              </div>
              <h3 className="text-xl font-bold text-admin-text-primary">
                {formData.type} 안내문 <span className="text-graygray-40 font-medium ml-2 text-base">({formData.id})</span>
              </h3>
            </div>
            <div className="flex items-center gap-2 text-graygray-50 bg-white px-4 py-2 rounded-lg border border-admin-border shadow-sm">
              <Clock size={18} className="text-admin-primary" />
              <span className="text-body-m-bold">{formData.dateTime} 발송</span>
            </div>
          </div>

          <div className="p-10 space-y-12 bg-white">
            
            {/* 1. 재난 문자 본문 내용 (가장 중요하므로 상단으로 배치) */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border">
                <FileText size={18} /> 재난 문자 본문 내용
              </h3>
              <div className="flex flex-col gap-3">
                <textarea 
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  disabled={!isEdit}
                  rows={5}
                  placeholder="재난 문자 본문 내용을 입력하세요"
                  className={`text-lg font-medium outline-none w-full transition-all resize-none leading-relaxed p-6 rounded-xl border
                    ${isEdit ? 'border-admin-primary bg-blue-50/10 focus:ring-2 ring-blue-100' : 'border-admin-border bg-graygray-5 text-graygray-70 cursor-not-allowed'}`} 
                />
                {submitted && !formData.content && <p className="text-red-500 text-xs ml-1 font-medium">본문 내용은 반드시 입력해야 합니다.</p>}
              </div>
            </div>

            {/* 2. 상세 정보 섹션 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border">
                <List size={18} /> 발송 및 분류 상세
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
                      disabled={!isEdit}
                      className={`w-full h-14 px-5 rounded-lg border transition-all outline-none text-body-m appearance-none font-bold
                        ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100 cursor-pointer' : 'border-admin-border bg-graygray-5 text-admin-primary cursor-not-allowed'}`}
                    >
                      <option value="안전안내">안전안내</option>
                      <option value="긴급재난">긴급재난</option>
                    </select>
                    {isEdit && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />}
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
                      disabled={!isEdit}
                      className={`w-full h-14 px-5 rounded-lg border transition-all outline-none text-body-m appearance-none font-bold
                        ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100 cursor-pointer' : 'border-admin-border bg-graygray-5 text-gray-700 cursor-not-allowed'}`}
                    >
                      <option value="기상">기상특보</option>
                      <option value="실종자">실종자</option>
                      <option value="화재">화재</option>
                      <option value="교통통제">교통통제</option>
                      <option value="기타">기타</option>
                    </select>
                    {isEdit && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />}
                  </div>
                </div>

                <DetailField label="발송 기관" name="sender" value={formData.sender} isEdit={isEdit} onChange={handleChange} showError={submitted && !formData.sender} />
                <DetailField label="수신 지역" name="region" value={formData.region} isEdit={isEdit} onChange={handleChange} showError={submitted && !formData.region} />
              </div>
            </div>

            {/* 3. 노출 정보 및 일시 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4 border-t border-admin-border">
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
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">발송 일시 수정</label>
                <input 
                  type="text"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleChange}
                  disabled={!isEdit}
                  className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m
                    ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed'}`}
                />
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
      className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m font-bold
        ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : `border-admin-border bg-graygray-5 text-graygray-70 cursor-not-allowed ${highlight}`} 
        ${showError && isEdit ? 'border-red-500 ring-red-50' : ''}
      `}
    />
    {showError && isEdit && <p className="text-red-500 text-xs ml-1 font-medium">필수 입력 항목입니다.</p>}
  </div>
);

export default DisasterMessageDetail;