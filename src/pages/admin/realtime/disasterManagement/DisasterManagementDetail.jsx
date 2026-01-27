'use no memo';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { MapPin, Activity, Clock, ChevronDown, List, ShieldCheck } from 'lucide-react';

// [데이터] 아까 만든 재난 관리 더미 데이터 임포트
import { DisasterManagementData } from './DisasterManagementData';

const DisasterManagementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  
  // 데이터 구조 규칙 (CamelCase 적용)
  const [formData, setFormData] = useState({
    id: '',
    category: '',    // 재난유형 (지진, 호우·홍수 등)
    dataSource: '',  // 연동 API 소스 명칭
    mapLayer: '',    // 지도 레이어 설정 정보
    apiStatus: '',   // 정상 / 점검중
    visibleYn: 'Y',  // 노출 여부
    updatedAt: ''    // 최종 수정일
  });

  const [originData, setOriginData] = useState(null);

  useEffect(() => {
    const getDetailData = () => {
      setLoading(true);
      try {
        const found = DisasterManagementData.find(item => String(item.id) === String(id));
        if (found) {
          setFormData(found);
          setOriginData(found);
          if (setBreadcrumbTitle) setBreadcrumbTitle(`${found.category} 관리 상세`);
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
    setFormData(prev => ({ ...prev, visibleYn: prev.visibleYn === 'Y' ? 'N' : 'Y' }));
  };

  const handleCancel = () => {
    if (window.confirm("수정 중인 내용을 취소하고 원래대로 되돌리시겠습니까?")) {
      setFormData(originData);
      setIsEdit(false);
      setSubmitted(false);
    }
  };

  const isFormValid = () => {
    // id와 updatedAt을 제외한 주요 필드 체크
    const { category, dataSource, mapLayer, apiStatus } = formData;
    return category && dataSource && mapLayer && apiStatus;
  };

  const handleSave = async () => {
    setSubmitted(true);
    if (!isFormValid()) {
      alert("입력되지 않은 필수 값이 있습니다.");
      return;
    }
    try {
      // 실제 서비스 시에는 여기서 API 통신
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
              실시간 재난 정보 {isEdit ? '수정' : '상세 정보'}
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
          {/* 재난 유형 강조 영역 */}
          <div className="p-8 border-b border-admin-border bg-white flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-admin-primary" size={24} />
              <div className="text-2xl font-bold text-graygray-50">
                {formData.category} 재난 연동 관리
              </div>
              <span className={`ml-4 px-3 py-1 rounded-full text-xs font-bold ${
                formData.apiStatus === '정상' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                현재 API {formData.apiStatus}
              </span>
            </div>
          </div>

          <div className="p-10 space-y-12 bg-white">
            
            {/* 1. 기본 분류 정보 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border">
                <List size={18} /> 기본 분류 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 재난유형 Select 박스 */}
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">재난 유형</label>
                  <div className="relative">
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className={`w-full h-14 px-5 rounded-lg border transition-all outline-none text-body-m appearance-none font-bold
                        ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100 cursor-pointer' : 'border-admin-border bg-graygray-5 text-admin-primary cursor-not-allowed'}`}
                    >
                      <option value="" disabled>유형 선택</option>
                      {['지진', '호우·홍수', '산사태', '태풍', '산불', '한파'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {isEdit && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ChevronDown size={20} />
                      </div>
                    )}
                  </div>
                  {submitted && !formData.category && <p className="text-red-500 text-xs ml-1 font-medium">필수로 선택해야 합니다.</p>}
                </div>

                {/* API 상태 Select 박스 */}
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">연동 상태</label>
                  <div className="relative">
                    <select 
                      name="apiStatus"
                      value={formData.apiStatus}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className={`w-full h-14 px-5 rounded-lg border transition-all outline-none text-body-m appearance-none
                        ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100 cursor-pointer' : 'border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed'}`}
                    >
                      <option value="정상">정상 작동</option>
                      <option value="점검중">시스템 점검중</option>
                    </select>
                    {isEdit && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ChevronDown size={20} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 연동 및 지도 설정 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border">
                <Activity size={18} /> 데이터 및 지도 설정
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DetailField 
                  label="연동 데이터 소스 (API)" 
                  name="dataSource" 
                  value={formData.dataSource} 
                  isEdit={isEdit} 
                  onChange={handleChange} 
                  placeholder="예: kmaWarningApi (기상청)"
                  showError={submitted && !formData.dataSource} 
                />
                <DetailField 
                  label="지도 레이어 설정" 
                  name="mapLayer" 
                  value={formData.mapLayer} 
                  isEdit={isEdit} 
                  onChange={handleChange} 
                  placeholder="지도에 표시될 정보 명칭"
                  showError={submitted && !formData.mapLayer} 
                />
              </div>
            </div>

            {/* 3. 기타 정보 및 노출 설정 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border">
                <Clock size={18} /> 시스템 관리
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <DetailField 
                  label="최종 수정 일시" 
                  name="updatedAt" 
                  value={formData.updatedAt} 
                  isEdit={false} // 날짜는 자동 기록되므로 수정 불가
                  onChange={handleChange} 
                />

                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1">사용자 화면 노출 여부</label>
                  <div className="flex items-center gap-6 h-14 px-2">
                    <button
                      type="button"
                      onClick={handleToggle}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${formData.visibleYn === 'Y' ? 'bg-admin-primary' : 'bg-gray-300'} ${isEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.visibleYn === 'Y' ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                    <div className="flex flex-col">
                      <span className={`text-body-s-bold ${formData.visibleYn === 'Y' ? 'text-admin-primary' : 'text-graygray-40'}`}>
                        {formData.visibleYn === 'Y' ? "현재 노출 중" : "미노출 (숨김)"}
                      </span>
                      <p className="text-[12px] text-gray-400">
                        {formData.visibleYn === 'Y' ? '* 해당 재난 레이어가 실시간 지도에 활성화됩니다.' : '* 해당 정보는 관리자만 볼 수 있습니다.'}
                      </p>
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
const DetailField = ({ label, name, value, isEdit, onChange, placeholder, showError = false }) => (
  <div className="flex flex-col gap-3">
    <label className="text-body-m-bold text-admin-text-secondary ml-1">{label}</label>
    <input 
      name={name}
      value={value || ''}
      onChange={onChange}
      disabled={!isEdit}
      placeholder={placeholder}
      className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m
        ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : `border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed`} 
        ${showError && isEdit ? 'border-red-500 ring-red-50' : ''}
      `}
    />
    {showError && isEdit && <p className="text-red-500 text-xs ml-1 font-medium">필수로 입력해야하는 값입니다.</p>}
  </div>
);

export default DisasterManagementDetail;