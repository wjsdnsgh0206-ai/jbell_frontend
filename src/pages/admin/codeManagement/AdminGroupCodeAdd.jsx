import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

const SuccessIcon = ({ fill = "#2563EB" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="8" fill={fill}/>
    <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ErrorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="8" fill="#E15141"/>
    <path d="M10 6L6 10M6 6L10 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AdminGroupCodeAdd = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    groupCodeId: '', groupName: '', desc: '', order: 1
  });

  // 중복 상태 관리
  const [isDuplicate, setIsDuplicate] = useState({ id: false, name: false });

  const isDirty = useMemo(() => {
    return !!(formData.groupCodeId.trim() || formData.groupName.trim() || formData.desc.trim());
  }, [formData]);

  const handlePopState = useCallback(() => {
    if (isDirty) {
      window.history.pushState(null, "", window.location.href);
      setIsCancelModalOpen(true);
    }
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) {
      window.removeEventListener('popstate', handlePopState);
      return;
    }
    window.history.pushState(null, "", window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isDirty, handlePopState]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

   // 실시간 서버 중복 체크
  useEffect(() => {
    if (!formData.groupCodeId && !formData.groupName) {
      setIsDuplicate({ id: false, name: false });
      return;
    }

    const checkGroupDuplicate = async () => {
      try {
        const res = await axios.get('/api/common/code/check/group', {
          params: {
            groupCode: formData.groupCodeId,
            groupName: formData.groupName
          }
        });
        setIsDuplicate({ id: res.data.isIdDup, name: res.data.isNameDup });
      } catch (err) {
        console.error("중복 체크 실패", err);
      }
    };

    const timer = setTimeout(checkGroupDuplicate, 400);
    return () => clearTimeout(timer);
  }, [formData.groupCodeId, formData.groupName]);

  const isIdEmpty = isSubmitted && !formData.groupCodeId.trim();
  const isNameEmpty = isSubmitted && !formData.groupName.trim();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "groupCodeId") {
      const transformedValue = value.toUpperCase().replace(/[^A-Z0-9_]/g, "").slice(0, 20);
      setFormData(prev => ({ ...prev, [name]: transformedValue }));
    } else if (name === "groupName") {
      if (value.length <= 20) setFormData(prev => ({ ...prev, [name]: value }));
    } else if (name === "order") {
      // 숫자만 입력 가능하도록 수정 (AdminSubCodeAdd와 동일한 로직)
      const val = value.replace(/[^0-9]/g, "");
      setFormData(prev => ({ ...prev, [name]: val }));
    } else if (name === "desc") {
      if (value.length <= 50) setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveClick = () => {
    setIsSubmitted(true);
    if (!formData.groupCodeId.trim() || !formData.groupName.trim()) {
      alert("필수 입력 사항을 모두 작성해주세요.");
      return;
    }
    // 실제 중복 상태 체크
    if (isDuplicate.id || isDuplicate.name) {
      return;
    }
    setIsModalOpen(true);
  };

  // 실제 DB 저장 로직
  const handleConfirmSave = async () => {
    try {
      const payload = {
        groupCode: formData.groupCodeId.trim().toUpperCase(),
        groupName: formData.groupName.trim(),
        desc: formData.desc.trim(),
        order: Number(formData.order) || 1,
        visible: isRegistered
      };

      await axios.post('/api/common/code/groups', payload);

      setIsModalOpen(false);
      window.removeEventListener('popstate', handlePopState);
      
      setToastMessage("그룹코드가 성공적으로 등록되었습니다.");
      setShowToast(true);
      
      // 실제 목록 페이지 경로로 이동
      setTimeout(() => navigate('/admin/system/commonCodeList', { replace: true }), 1500);
    } catch (err) {
      alert(err.response?.data?.message || "저장 중 오류가 발생했습니다.");
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) { setIsCancelModalOpen(true); } 
    else { navigate(-1); }
  };

  const confirmCancel = () => {
    window.removeEventListener('popstate', handlePopState); 
    setIsCancelModalOpen(false);
    setToastMessage("등록이 취소되었습니다.");
    setShowToast(true);
    setTimeout(() => navigate('/admin/system/commonCodeList'), 1000);
  };

  return (
    <div className="relative flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500">
            <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
                {!toastMessage.includes("취소") && <SuccessIcon fill="#4ADE80" />}
                <span className="font-bold text-[16px]">{toastMessage}</span>
            </div>
        </div>
      )}

      <main className="p-10 text-left">
        <h2 className="text-[32px] font-bold mt-2 mb-10 tracking-tight">그룹 코드 등록</h2>
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] tracking-tight border-b-2 border-gray-100 pb-3">그룹코드 정보 입력</h3>
          
          <div className="flex flex-col space-y-10">
            {/* 그룹 코드 ID */}
            <div className="w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 ID (필수)</label>
              <input 
                name="groupCodeId" value={formData.groupCodeId} onChange={handleChange} autoComplete="off" placeholder="예: SYSTEM_AUTH"
                className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${
                  isIdEmpty || isDuplicate.id ? 'border-[#E15141] ring-1 ring-red-50' : formData.groupCodeId ? 'border-[#2563EB]' : 'border-gray-300 focus:border-[#2563EB]'
                }`}
              />
              <div className="flex justify-between items-start mt-2">
                <div className="flex-1 min-h-[20px]">
                  {isIdEmpty ? (
                    <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium"><ErrorIcon /> 그룹 코드 ID를 입력해주세요.</div>
                  ) : isDuplicate.id ? (
                    <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium"><ErrorIcon /> 이미 존재하는 코드 ID입니다.</div>
                  ) : formData.groupCodeId ? (
                    <div className="text-[#2563EB] text-sm flex items-center gap-2 font-medium"><SuccessIcon /> 사용 가능한 코드 ID입니다.</div>
                  ) : (
                    <p className="text-[13px] text-gray-400 font-medium">* 영문 대문자, 숫자, 언더바(_)만 사용 가능</p>
                  )}
                </div>
                <span className="text-[12px] text-gray-400 font-medium ml-4 shrink-0">{formData.groupCodeId.length} / 20</span>
              </div>
            </div>

            {/* 그룹 코드 명 */}
            <div className="w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 명 (필수)</label>
              <input 
                name="groupName" 
                value={formData.groupName} 
                onChange={handleChange} 
                autoComplete="off" 
                placeholder="예: 시스템 권한 코드"
                className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${
                  isNameEmpty || isDuplicate.name ? 'border-[#E15141] ring-1 ring-red-50' : formData.groupName ? 'border-[#2563EB]' : 'border-gray-300 focus:border-[#2563EB]'
                }`}
              />
              <div className="flex justify-between items-start mt-2">
                <div className="flex-1 min-h-[20px]">
                  {isNameEmpty ? (
                    <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium"><ErrorIcon /> 그룹 코드 명을 입력해주세요.</div>
                  ) : isDuplicate.name ? (
                    <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium"><ErrorIcon /> 이미 존재하는 그룹명입니다.</div>
                  ) : formData.groupName ? (
                    /* 이 부분을 추가하여 ID와 동일한 UI를 제공합니다 */
                    <div className="text-[#2563EB] text-sm flex items-center gap-2 font-medium"><SuccessIcon fill="#2563EB" /> 사용 가능한 그룹명입니다.</div>
                  ) : (
                    <p className="text-[13px] text-gray-400 font-medium">* 최대 20자까지 입력 가능</p>
                  )}
                </div>
                <span className="text-[12px] text-gray-400 font-medium ml-4 shrink-0">{formData.groupName.length} / 20</span>
              </div>
            </div>

            {/* 나머지 필드들 */}
            <div className="w-full max-w-[600px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 설명</label>
              <textarea name="desc" value={formData.desc} onChange={handleChange} rows="2" placeholder="코드 설명을 입력해주세요." className="w-full bg-white border border-gray-300 rounded-lg px-5 py-4 text-[#111] outline-none focus:border-[#2563EB] resize-none leading-relaxed transition-all font-medium" />
              <div className="flex justify-end mt-2"><span className="text-[12px] text-gray-400 font-medium">{formData.desc.length} / 50</span></div>
            </div>

            {/* 순서 입력 섹션 */}
<div className="w-full group">
  <label className="block font-bold text-[16px] mb-3 text-[#111]">순서</label>
  <div className="relative w-[100px]">
    <input 
      type="text" // 화살표 제거를 위해 text로 변경
      name="order" 
      value={formData.order} 
      onChange={handleChange} 
      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center outline-none focus:border-[#2563EB] font-medium transition-all" 
    />
    
    {/* 커스텀 증감 화살표 (SubCodeAdd와 동일 UI) */}
    <div className="absolute right-[1px] top-[1px] bottom-[1px] flex flex-col w-[24px] opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-r-lg overflow-hidden border-l border-gray-100">
      <button 
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, order: Number(prev.order) + 1 }))}
        className="flex-1 hover:bg-gray-100 flex items-center justify-center border-b border-gray-100"
      >
        <svg width="8" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 5L5 1L9 5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button 
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, order: Math.max(1, Number(prev.order) - 1) }))}
        className="flex-1 hover:bg-gray-100 flex items-center justify-center"
      >
        <svg width="8" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
  <p className="text-[13px] text-gray-400 mt-3 font-medium">* 숫자가 낮을수록 리스트 상단에 노출됩니다.</p>
</div>

            <div className="flex items-center gap-5 pt-2">
              <label className="font-bold text-[16px] text-[#111]">사용 여부</label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setIsRegistered(!isRegistered)} className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-all duration-300 ${isRegistered ? 'bg-[#2563EB]' : 'bg-gray-300'}`}>
                  <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${isRegistered ? 'translate-x-[26px]' : 'translate-x-0'}`} />
                </button>
                <span className={`text-[14px] font-bold ${isRegistered ? 'text-[#2563EB]' : 'text-gray-400'}`}>{isRegistered ? '사용' : '미사용'}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-2 mt-12 max-w-[1000px]">
          <button type="button" onClick={handleCancel} className="px-8 py-3.5 border border-gray-300 bg-white text-gray-500 rounded-lg font-bold text-[16px] hover:bg-gray-50 transition-colors shadow-sm">취소</button>
          <button type="button" onClick={handleSaveClick} className="px-8 py-3.5 bg-[#2563EB] text-white rounded-lg font-bold text-[16px] hover:bg-blue-700 shadow-md transition-colors">저장</button>
        </div>
      </main>

      <AdminConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmSave} title="그룹코드를 저장하시겠습니까?" message="작성하신 내용이 즉시 저장됩니다" type="save" />
      <AdminConfirmModal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} onConfirm={confirmCancel} title="등록을 취소하시겠습니까?" message="작성 중인 내용이 저장되지 않고 목록으로 이동합니다." type="delete" />
    </div>
  );
};

export default AdminGroupCodeAdd;