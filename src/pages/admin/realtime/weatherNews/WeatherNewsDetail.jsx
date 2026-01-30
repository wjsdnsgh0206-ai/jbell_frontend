'use no memo';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { Activity, Clock, ChevronDown, List, ShieldCheck } from 'lucide-react';
import { disasterApi } from "@/services/api";  // 작성하신 api.js 임포트

const WeatherNewsDetail = () => {
  const { id } = useParams(); // URL의 prsntn_sn 값
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  
  // 백엔드 DTO 구조에 맞춘 초기 상태
  const [formData, setFormData] = useState({
    PRSNTN_SN: '',
    TTL: '',
    PRSNTN_TM: '',
    RLVT_ZONE: '',
    SPNE_FRMNT_PRCON_CN: '',
    TIME_TXT: '',
    MAAS_OBNT_DT: '',
    visibleYn: 'Y',
    level: '보통',
    newsType: ''
  });

  const [originData, setOriginData] = useState(null);

  // 1. 상세 데이터 로드 (백엔드 연동)
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await disasterApi.getWeatherDetail(id);
        console.log("진짜 응답:", response); // 여기서 데이터가 보일 겁니다!

        if (response) { 
            setFormData(response); // response.data가 아니라 response를 바로 세팅
            setOriginData(response);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert("데이터를 불러오는데 실패했습니다.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate, setBreadcrumbTitle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    if (!isEdit) return; 
    setFormData(prev => ({ ...prev, visibleYn: prev.visibleYn === 'Y' ? 'N' : 'Y' }));
  };

  const handleCancel = () => {
    if (window.confirm("수정 중인 내용을 취소하시겠습니까?")) {
      setFormData(originData);
      setIsEdit(false);
    }
  };

  // 2. 수정 데이터 저장 (백엔드 연동)
  const handleSave = async () => {
    setSubmitted(true);
    if (!formData.TTL || !formData.SPNE_FRMNT_PRCON_CN) {
      alert("입력되지 않은 필수 값이 있습니다.");
      return;
    }

    try {
      // API 호출 (키값은 id, 데이터는 formData)
      await disasterApi.updateWeather(id, formData);
      
      alert("성공적으로 수정되었습니다.");
      setOriginData(formData);
      setIsEdit(false);
      setSubmitted(false);
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div className="p-10 text-center">데이터를 불러오는 중입니다...</div>;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
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
          <div className="p-8 border-b border-admin-border bg-white flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-admin-primary" size={24} />
              <div className="text-2xl font-bold text-graygray-50">
                {formData.TTL}
              </div>
              <span className={`ml-4 px-3 py-1 rounded-full text-xs font-bold border ${
                formData.level === '위험' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-600 border-gray-100'
              }`}>
                수준: {formData.level || '보통'}
              </span>
            </div>
          </div>

          <div className="p-10 space-y-12 bg-white">
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border font-bold">
                <List size={18} /> 특보 기본 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">발생 지역</label>
                  <input 
                    name="RLVT_ZONE"
                    value={formData.RLVT_ZONE || ''}
                    onChange={handleChange}
                    disabled={!isEdit}
                    className={`h-14 px-5 rounded-lg border outline-none font-medium ${isEdit ? 'border-admin-primary bg-white' : 'border-admin-border bg-graygray-5'}`}
                  />
                </div>
                <DetailField 
                  label="발효 일시" 
                  name="TIME_TXT" 
                  value={formData.TIME_TXT} 
                  isEdit={isEdit} 
                  onChange={handleChange} 
                />
                <DetailField 
                  label="관리 번호 (ID)" 
                  name="PRSNTN_SN" 
                  value={formData.PRSNTN_SN} 
                  isEdit={false} 
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border font-bold">
                <Activity size={18} /> 특보 상세 내용
              </h3>
              <div className="grid grid-cols-1 gap-8">
                <DetailField 
                  label="특보 제목" 
                  name="TTL" 
                  value={formData.TTL} 
                  isEdit={isEdit} 
                  onChange={handleChange} 
                  showError={submitted && !formData.TTL} 
                />
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">상세 통보문 내용</label>
                  <textarea 
                    name="SPNE_FRMNT_PRCON_CN"
                    value={formData.SPNE_FRMNT_PRCON_CN || ''}
                    onChange={handleChange}
                    disabled={!isEdit}
                    rows={5}
                    className={`p-5 rounded-lg border transition-all outline-none text-body-m resize-none ${isEdit ? 'border-admin-primary bg-white focus:ring-2' : 'border-admin-border bg-graygray-5 text-graygray-50'}`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-body-m-bold text-admin-text-primary pb-2 border-b border-admin-border font-bold">
                <Clock size={18} /> 시스템 관리 설정
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex flex-col gap-3">
                  <label className="text-body-m-bold text-admin-text-secondary ml-1 font-bold">사용자 화면 노출 상태</label>
                  <div className="flex items-center gap-6 h-14 px-2">
                    <button
                      type="button"
                      onClick={handleToggle}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${formData.visibleYn === 'Y' ? 'bg-admin-primary' : 'bg-gray-300'} ${isEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.visibleYn === 'Y' ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                    <span className={`text-body-s-bold ${formData.visibleYn === 'Y' ? 'text-admin-primary' : 'text-graygray-40'} font-bold`}>
                      {formData.visibleYn === 'Y' ? "현재 노출 중" : "미노출 (숨김)"}
                    </span>
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