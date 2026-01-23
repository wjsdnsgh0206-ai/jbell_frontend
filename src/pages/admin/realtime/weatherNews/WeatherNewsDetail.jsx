'use no memo';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { Activity, Clock, ChevronDown, List, ShieldCheck, AlertTriangle } from 'lucide-react';

// [데이터] WeatherNewsData 임포트
import { initialWeatherData } from './WeatherNewsData';

const WeatherNewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  
  // 데이터 구조 (WeatherNewsList의 데이터와 일치)
  const [formData, setFormData] = useState({
    id: '',
    level: '',      // 경보수준 (위험, 주의, 보통)
    type: '',       // 특보유형 (지진, 호우홍수 등)
    dateTime: '',   // 발효일시
    title: '',      // 특보내용(제목)
    content: '',    // 상세 내용
    region: '',     // 발생 지역
    isVisible: true // 노출 여부
  });

  const [originData, setOriginData] = useState(null);

  useEffect(() => {
    const getDetailData = () => {
      setLoading(true);
      try {
        // ID로 해당 특보 데이터 찾기
        const found = initialWeatherData.find(item => String(item.id) === String(id));
        if (found) {
          setFormData(found);
          setOriginData(found);
          if (setBreadcrumbTitle) setBreadcrumbTitle("기상 특보 상세 정보");
        } else {
          alert("해당 특보 정보를 찾을 수 없습니다.");
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
      // API 연동 시점 (현재는 더미 업데이트)
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
              기상 특보 {isEdit ? '수정' : '상세 정보'}
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
          {/* 특보 상태 강조 영역 */}
          <div className="p-8 border-b border-admin-border bg-white flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-admin-primary" size={24} />
              <div className="text-2xl font-bold text-graygray-50">
                [{formData.type}] {formData.title}
              </div>
              <span className={`ml-4 px-3 py-1 rounded-full text-xs font-bold border ${
                formData.level === '위험' ? 'bg-red-50 text-red-600 border-red-100' : 
                formData.level === '주의' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-gray-50 text-gray-600 border-gray-100'
              }`}>
                수준: {formData.level}
              </span>
            </div>
          </div>

          <div className="p-10 space-y-12 bg-white">
            
            {/* 1. 기본 분류 정보 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border font-bold">
                <List size={18} /> 특보 기본 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 특보유형 Select */}
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">특보 유형</label>
                  <div className="relative">
                    <select 
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className={`w-full h-14 px-5 rounded-lg border transition-all outline-none text-body-m appearance-none font-medium
                        ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100 cursor-pointer' : 'border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed'}`}
                    >
                      {['지진', '호우홍수', '산사태', '태풍', '산불', '한파'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {isEdit && <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><ChevronDown size={20} /></div>}
                  </div>
                </div>

                {/* 경보수준 Select */}
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">경보 수준</label>
                  <div className="relative">
                    <select 
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className={`w-full h-14 px-5 rounded-lg border transition-all outline-none text-body-m appearance-none font-medium
                        ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100 cursor-pointer' : 'border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed'}`}
                    >
                      {['위험', '주의', '보통'].map(lvl => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                    {isEdit && <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><ChevronDown size={20} /></div>}
                  </div>
                </div>

                {/* 발효 일시 (읽기 전용 추천) */}
                <DetailField 
                  label="발효 일시" 
                  name="dateTime" 
                  value={formData.dateTime} 
                  isEdit={isEdit} 
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
                  isEdit={isEdit} 
                  onChange={handleChange} 
                  placeholder="예: 강풍주의보 발효"
                  showError={submitted && !formData.title} 
                />
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">상세 통보문 내용</label>
                  <textarea 
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    disabled={!isEdit}
                    rows={5}
                    placeholder="기상청 통보문 상세 내용을 입력하세요."
                    className={`p-5 rounded-lg border transition-all outline-none text-body-m resize-none
                      ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : 'border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed'}`}
                  />
                  {submitted && !formData.content && <p className="text-red-500 text-xs ml-1 font-medium">상세 내용은 필수입니다.</p>}
                </div>
              </div>
            </div>

            {/* 3. 노출 및 관리 설정 */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border font-bold">
                <Clock size={18} /> 시스템 관리 설정
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <DetailField 
                  label="관리 번호 (ID)" 
                  name="id" 
                  value={formData.id} 
                  isEdit={false} 
                />

                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">사용자 화면 노출 상태</label>
                  <div className="flex items-center gap-6 h-14 px-2">
                    <button
                      type="button"
                      onClick={handleToggle}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${formData.isVisible ? 'bg-admin-primary' : 'bg-gray-300'} ${isEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.isVisible ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                    <div className="flex flex-col">
                      <span className={`text-body-s-bold ${formData.isVisible ? 'text-admin-primary' : 'text-graygray-40'} font-bold`}>
                        {formData.isVisible ? "현재 노출 중" : "미노출 (숨김)"}
                      </span>
                      <p className="text-[12px] text-gray-400">
                        {formData.isVisible ? '* 대시보드 및 실시간 목록에 해당 특보가 표시됩니다.' : '* 해당 정보는 관리자 페이지에서만 확인 가능합니다.'}
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
    <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">{label}</label>
    <input 
      name={name}
      value={value || ''}
      onChange={onChange}
      disabled={!isEdit}
      placeholder={placeholder}
      className={`h-14 px-5 rounded-lg border transition-all outline-none text-body-m font-medium
        ${isEdit ? 'border-admin-primary bg-white focus:ring-2 ring-blue-100' : `border-admin-border bg-graygray-5 text-graygray-50 cursor-not-allowed`} 
        ${showError && isEdit ? 'border-red-500 ring-red-50' : ''}
      `}
    />
    {showError && isEdit && <p className="text-red-500 text-xs ml-1 font-medium">필수로 입력해야 하는 값입니다.</p>}
  </div>
);

export default WeatherNewsDetail;