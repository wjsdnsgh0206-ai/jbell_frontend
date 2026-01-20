'use no memo';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { MapPin, AlertTriangle, Clock, ChevronDown, List } from 'lucide-react';

// [데이터] 사고속보 더미 데이터 임포트
import { AccidentNewsData } from './AccidentNewsData';

const AccidentNewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    category: '', // '구분' 필드 (기타돌발, 재난, 공사)
    type: '',
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

  const [originData, setOriginData] = useState(null);

  useEffect(() => {
    const getDetailData = () => {
      setLoading(true);
      try {
        const found = AccidentNewsData.find(item => String(item.id) === String(id));
        if (found) {
          setFormData(found);
          setOriginData(found);
          if (setBreadcrumbTitle) setBreadcrumbTitle(found.content);
        } else {
          alert("해당 사고 정보를 찾을 수 없습니다.");
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
    setFormData(prev => ({ ...prev, visible: !prev.visible }));
  };

  const handleCancel = () => {
    if (window.confirm("수정 중인 내용을 취소하고 원래대로 되돌리시겠습니까?")) {
      setFormData(originData);
      setIsEdit(false);
      setSubmitted(false);
    }
  };

  const isFormValid = () => {
    // 모든 필드가 비어있지 않은지 체크
    return Object.values(formData).every(value => value !== '' && value !== null);
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
            <h2 className="text-heading-l text-admin-text-primary tracking-tight">
              사고속보 {isEdit ? '수정' : '상세 정보'}
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
          {/* 주요 사고 메시지 (사고 내용 강조) */}
          <div className="p-8 border-b border-admin-border bg-white flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-orange-500" size={24} />
              <input 
                name="content"
                value={formData.content}
                onChange={handleChange}
                disabled={!isEdit}
                placeholder="사고 내용을 입력하세요"
                className={`text-2xl font-bold outline-none w-full max-w-[800px] transition-all
                  ${isEdit ? 'bg-blue-50/30 px-3 py-1 rounded-md' : 'bg-transparent text-graygray-50'}`} 
              />
            </div>
            {submitted && !formData.content && <p className="text-red-500 text-xs ml-9 font-medium">필수로 입력해야하는 값입니다.</p>}
          </div>

          <div className="p-10 space-y-12 bg-white">
            
            {/* 0. 기본 분류 정보 (구분 추가) */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border">
                <List size={18} /> 기본 분류 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* 구분 Select 박스 */}
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
                      <option value="" disabled>구분 선택</option>
                      <option value="기타돌발">기타돌발</option>
                      <option value="재난">재난</option>
                      <option value="공사">공사</option>
                    </select>
                    {isEdit && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ChevronDown size={20} />
                      </div>
                    )}
                  </div>
                  {submitted && !formData.category && <p className="text-red-500 text-xs ml-1 font-medium">필수로 입력해야하는 값입니다.</p>}
                </div>
              </div>
            </div>

            {/* 1. 위치 및 도로 정보 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border">
                <MapPin size={18} /> 위치 및 도로 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <DetailField label="도로명" name="roadName" value={formData.roadName} isEdit={isEdit} onChange={handleChange} showError={submitted && !formData.roadName} />
                <DetailField label="도로번호" name="roadNo" value={formData.roadNo} isEdit={isEdit} onChange={handleChange} showError={submitted && !formData.roadNo} />
                <DetailField label="진행 방향" name="direction" value={formData.direction} isEdit={isEdit} onChange={handleChange} showError={submitted && !formData.direction} />
                
                {/* 도로 유형 Select 박스 */}
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">도로 유형</label>
                  <div className="relative">
                    <select 
                      name="detailType"
                      value={formData.detailType}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className={`w-full h-14 px-5 rounded-lg border transition-all outline-none text-body-m appearance-none
                        ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100 cursor-pointer' : 'border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed'}`}
                    >
                      <option value="" disabled>도로 유형 선택</option>
                      <option value="기타">기타</option>
                      <option value="공사">공사</option>
                      <option value="교통사고">교통사고</option>
                      <option value="작업">작업</option>
                      <option value="차량고장">차량고장</option>
                    </select>
                    {isEdit && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ChevronDown size={20} />
                      </div>
                    )}
                  </div>
                  {submitted && !formData.detailType && <p className="text-red-500 text-xs ml-1 font-medium">필수로 입력해야하는 값입니다.</p>}
                </div>
              </div>
            </div>

            {/* 2. 차단 및 시간 정보 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border">
                <Clock size={18} /> 차단 및 시간 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <DetailField label="차단 차로" name="blockedLanes" value={formData.blockedLanes} isEdit={isEdit} onChange={handleChange} highlight="text-orange-600" showError={submitted && !formData.blockedLanes} />
                <DetailField label="차단 유형" name="blockType" value={formData.blockType} isEdit={isEdit} onChange={handleChange} showError={submitted && !formData.blockType} />
                <DetailField label="발생 일시" name="date" value={formData.date} isEdit={isEdit} onChange={handleChange} showError={submitted && !formData.date} />
                
                {/* 종료 예정 DateTime 박스 */}
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">종료 예정</label>
                  <input 
                    type={isEdit ? "datetime-local" : "text"}
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled={!isEdit}
                    className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m
                      ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-graygray-5 text-red-500 cursor-not-allowed'}`}
                  />
                  {submitted && !formData.endDate && <p className="text-red-500 text-xs ml-1 font-medium">필수로 입력해야하는 값입니다.</p>}
                </div>
              </div>
            </div>

            {/* 3. 좌표 및 노출 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
              <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">좌표 정보 (Lat / Lng)</label>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-4">
                    <input name="lat" value={formData.lat} onChange={handleChange} disabled={!isEdit} placeholder="위도"
                      className={`flex-1 h-14 px-5 rounded-lg border outline-none transition-all text-body-m
                      ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed'}`} />
                    <input name="lng" value={formData.lng} onChange={handleChange} disabled={!isEdit} placeholder="경도"
                      className={`flex-1 h-14 px-5 rounded-lg border outline-none transition-all text-body-m
                      ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed'}`} />
                  </div>
                  {submitted && (!formData.lat || !formData.lng) && <p className="text-red-500 text-xs ml-1 font-medium">필수로 입력해야하는 값입니다.</p>}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-body-m-bold text-admin-text-secondary ml-1">노출 상태 설정</label>
                <div className="flex items-center gap-6 h-14 px-2">
                  <button
                    type="button"
                    onClick={handleToggle}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${formData.visible ? 'bg-admin-primary' : 'bg-gray-300'} ${isEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.visible ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                  <div className="flex flex-col">
                    <span className={`text-body-s-bold ${formData.visible ? 'text-admin-primary' : 'text-graygray-40'}`}>
                      {formData.visible ? "활성화 (Y)" : "비활성화 (N)"}
                    </span>
                    <p className="text-[12px] text-gray-400">
                      {formData.visible ? '* 현재 사용자 화면에 노출 중입니다.' : '* 현재 사용자 화면에서 숨김 처리되었습니다.'}
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

export default AccidentNewsDetail;