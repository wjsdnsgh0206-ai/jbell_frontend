import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

// 아이콘 컴포넌트
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

const AdminSubCodeAdd = () => {
  const navigate = useNavigate();
  
  // 1. 상태 관리
  const [formData, setFormData] = useState({ 
    groupCode: '', 
    subCode: '',   
    subName: '', 
    desc: '', 
    order: 1 
  });
  const [isVisible, setIsVisible] = useState(true);
  const [groupOptions, setGroupOptions] = useState([]); 
  
  const [errors, setErrors] = useState({ groupCode: false, subCode: false, subName: false });
  const [isDuplicate, setIsDuplicate] = useState({ subCode: false, subName: false });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // 이탈 방지 트리거 (사용자가 내용을 입력했는지 여부)
  const isDirty = useMemo(() => {
    return !!(formData.groupCode || formData.subCode.trim() || formData.subName.trim() || formData.desc.trim());
  }, [formData]);

  // 초기 그룹 목록 로드 및 브라우저 종료/새로고침 경고만 유지
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get('/api/common/code/groups');
        setGroupOptions(res.data || []);
      } catch (err) { console.error("그룹 목록 로드 실패:", err); }
    };
    fetchGroups();

    // 탭 닫기/새로고침 시에만 브라우저 기본 경고창 노출
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ""; 
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

useEffect(() => {
  // 1. 그룹코드가 없으면 체크 안 함
  if (!formData.groupCode) {
    setIsDuplicate({ subCode: false, subName: false });
    return;
  }
  
  // 2. ID와 명칭 둘 다 비어있으면 체크 안 함
  if (!formData.subCode.trim() && !formData.subName.trim()) {
    setIsDuplicate({ subCode: false, subName: false });
    return;
  }

  const checkDuplicate = async () => {
    try {
      // 값이 있는 것만 골라서 파라미터 구성
      const params = { groupCode: formData.groupCode };
      if (formData.subCode.trim()) params.subCode = formData.subCode.trim();
      if (formData.subName.trim()) params.subName = formData.subName.trim();

      const res = await axios.get('/api/common/code/check/sub', { params });
      
      setIsDuplicate({
        subCode: res.data.isCodeDup || false, 
        subName: res.data.isNameDup || false
      });
    } catch (err) { 
      console.error("중복 체크 실패:", err.response?.data || err.message); 
    }
  };

  const timer = setTimeout(checkDuplicate, 400);
  return () => clearTimeout(timer);
}, [formData.groupCode, formData.subCode, formData.subName]);

  // 입력 핸들러 (기존의 정밀 제약 조건 유지)
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "subCode") {
      const transformedValue = value.toUpperCase().replace(/[^A-Z0-9_]/g, "").slice(0, 20);
      setFormData(prev => ({ ...prev, [name]: transformedValue }));
      setErrors(prev => ({ ...prev, subCode: false }));
    } 
    else if (name === "subName") {
      if (value.length <= 20) {
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, subName: false }));
      }
    }
    else if (name === "order") {
      const val = value.replace(/[^0-9]/g, "");
      setFormData(prev => ({ ...prev, [name]: val }));
    }
    else if (name === "desc") {
      if (value.length <= 50) setFormData(prev => ({ ...prev, [name]: value }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (value !== "") setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  // 취소 처리
  const handleCancel = () => {
    if (isDirty) setIsCancelModalOpen(true);
    else navigate(-1);
  };

  // 저장 처리
  const handleSave = () => {
    const newErrors = {
      groupCode: !formData.groupCode,
      subCode: !formData.subCode.trim(),
      subName: !formData.subName.trim(),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean) || isDuplicate.subCode || isDuplicate.subName) {
      alert("입력 사항을 다시 확인해주세요.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmSave = async () => {
    try {
      const payload = { ...formData, visible: isVisible };
      await axios.post(`/api/common/code/groups/${formData.groupCode}/items`, payload);

      setToastMessage("상세코드가 성공적으로 등록되었습니다.");
      setShowToast(true);
      setTimeout(() => navigate('/admin/system/commonCodeList', { replace: true }), 1500);
    } catch (err) {
      alert(err.response?.data?.message || "저장 중 오류가 발생했습니다.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const confirmCancel = () => {
    setIsCancelModalOpen(false);
    setToastMessage("등록이 취소되었습니다.");
    setShowToast(true);
    setTimeout(() => navigate('/admin/system/commonCodeList'), 1000);
  };

  return (
    <div className="relative flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      {/* 토스트 메시지 */}
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            {/* 이 부분을 아래처럼 수정하세요 */}
            {!toastMessage.includes("취소") && <SuccessIcon fill="#4ADE80" />}
            <span className="font-bold text-[16px]">{toastMessage}</span>
          </div>
        </div>
      )}

      <main className="p-10 text-left">
        <h2 className="text-[32px] font-bold mt-2 mb-10 tracking-tight text-left">상세 코드 등록</h2>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] tracking-tight border-b-2 border-gray-100 pb-3">상세코드 정보 입력</h3>
          
          <div className="flex flex-col">
            {/* 1. 그룹 코드 선택 */}
            <div className="mb-10 w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 (필수)</label>
              <div className="relative">
                <select 
                  name="groupCode"
                  value={formData.groupCode}
                  onChange={handleChange}
                  className={`w-full appearance-none border rounded-lg px-5 py-4 outline-none transition-all font-medium ${
                    errors.groupCode ? 'border-[#E15141] ring-1 ring-red-50' : 'border-gray-300 focus:border-[#2563EB]'
                  }`}
                >
                  <option value="">그룹 코드를 선택해주세요</option>
                  {groupOptions.map(opt => (
                    <option key={opt.groupCode} value={opt.groupCode}>{`[${opt.groupCode}] ${opt.groupName}`}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                   <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
              {errors.groupCode && <div className="text-[#E15141] text-sm mt-3 flex items-center gap-2 font-medium"><ErrorIcon /> 그룹코드를 선택해주세요.</div>}
            </div>

            {/* 2. 상세 코드 ID */}
            <div className="mb-10 w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">상세 코드 ID (필수)</label>
              {/* [수정] 상세 코드 ID 입력창 (약 165라인 근처) */}
<input 
  name="subCode"
  value={formData.subCode}
  onChange={handleChange}
  autoComplete="off"
  className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${
    // 중복이거나 에러면 빨간색, 입력값이 있으면 파란색, 기본은 회색
    errors.subCode || isDuplicate.subCode ? 'border-[#E15141] ring-1 ring-red-50' : formData.subCode ? 'border-[#2563EB]' : 'border-gray-300 focus:border-[#2563EB]'
  }`}
/>
<div className="flex justify-between items-start mt-2">
  <div className="flex-1 min-h-[20px]">
    {isDuplicate.subCode ? (
      <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium"><ErrorIcon /> 이미 존재하는 코드 ID입니다.</div>
    ) : errors.subCode ? (
      <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium"><ErrorIcon /> 상세 코드 ID를 입력해주세요.</div>
    ) : formData.subCode ? (
      // 값이 있고 중복이 아닐 때 "사용 가능" 문구 노출
      <div className="text-[#2563EB] text-sm flex items-center gap-2 font-medium"><SuccessIcon fill="#2563EB" /> 사용 가능한 코드 ID입니다.</div>
    ) : (
      <p className="text-[13px] text-gray-400 font-medium">* 영문 대문자, 숫자, 언더바(_)만 사용 가능</p>
    )}
  </div>
  <span className="text-[12px] text-gray-400 font-medium ml-4 shrink-0">{formData.subCode.length} / 20</span>
</div>
            </div>

            {/* 3. 상세 코드명 */}
            <div className="mb-10 w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">상세 코드명 (필수)</label>
              <input 
  name="subName"
  value={formData.subName}
  onChange={handleChange}
  autoComplete="off"
  className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${
    errors.subName || isDuplicate.subName ? 'border-[#E15141] ring-1 ring-red-50' : formData.subName ? 'border-[#2563EB]' : 'border-gray-300 focus:border-[#2563EB]'
  }`}
/>
<div className="flex justify-between items-start mt-2">
  <div className="flex-1 min-h-[20px]">
    {isDuplicate.subName ? (
      <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium"><ErrorIcon /> 이미 존재하는 명칭입니다.</div>
    ) : errors.subName ? (
      <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium"><ErrorIcon /> 상세 코드명을 입력해주세요.</div>
    ) : formData.subName ? (
      // 이 부분을 추가해서 성공 메시지를 띄웁니다
      <div className="text-[#2563EB] text-sm flex items-center gap-2 font-medium"><SuccessIcon fill="#2563EB" /> 사용 가능한 명칭입니다.</div>
    ) : (
      <p className="text-[13px] text-gray-400 font-medium">* 최대 20자까지 입력 가능</p>
    )}
  </div>
  <span className="text-[12px] text-gray-400 font-medium ml-4 shrink-0">{formData.subName.length} / 20</span>
</div>
            </div>

            {/* 4. 상세 코드 설명 */}
            <div className="mb-10 w-full max-w-[600px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">상세 코드 설명</label>
              <textarea 
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                rows="2"
                placeholder="상세 코드에 대한 설명을 입력해주세요. (최대 50자)"
                className="w-full bg-white border border-gray-300 rounded-lg px-5 py-4 text-[#111] outline-none focus:border-[#2563EB] resize-none leading-relaxed transition-all font-medium"
              />
              <div className="flex justify-end mt-2">
                <span className="text-[12px] text-gray-400 font-medium">{formData.desc.length} / 50</span>
              </div>
            </div>

            {/* 5. 순서 */}
            <div className="mb-10 w-full group">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">순서</label>
              <div className="relative w-[100px]">
                <input 
                  type="text" 
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#2563EB] text-center font-medium transition-all"
                />
                
                <div className="absolute right-[1px] top-[1px] bottom-[1px] flex flex-col w-[24px] opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-r-lg overflow-hidden">
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, order: Number(prev.order) + 1 }))}
                    className="flex-1 hover:bg-gray-100 flex items-center justify-center border-b border-gray-100" // 버튼 사이 구분선은 유지
                  >
                    <svg width="8" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 5L5 1L9 5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, order: Math.max(1, Number(prev.order) - 1) }))}
                    className="flex-1 hover:bg-gray-100 flex items-center justify-center"
                  >
                    <svg width="8" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
              <p className="text-[13px] text-gray-400 mt-3 font-medium">* 숫자가 낮을수록 리스트 상단에 노출됩니다.</p>
            </div>
            
            {/* 6. 사용 여부 */}
            <div className="flex items-center gap-5 pt-2">
               <label className="font-bold text-[16px] text-[#111]">사용 여부</label>
               <div className="flex items-center gap-3">
                 <button 
                   type="button"
                   onClick={() => setIsVisible(!isVisible)}
                   className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-colors duration-300 ${isVisible ? 'bg-[#2563EB]' : 'bg-gray-300'}`}
                 >
                   <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${isVisible ? 'translate-x-[26px]' : 'translate-x-0'}`} />
                 </button>
                 <span className={`text-[14px] font-bold ${isVisible ? 'text-[#2563EB]' : 'text-gray-400'}`}>{isVisible ? '사용' : '미사용'}</span>
               </div>
            </div>
          </div>
        </section>

        {/* 하단 버튼 구역 */}
        <div className="flex justify-end gap-2 mt-12 max-w-[1000px]">
          <button type="button" onClick={handleCancel} className="px-8 py-3.5 border border-gray-300 bg-white text-gray-500 rounded-lg font-bold hover:bg-gray-50 transition-all shadow-sm">취소</button>
          <button type="button" onClick={handleSave} className="px-8 py-3.5 bg-[#2563EB] text-white rounded-lg font-bold hover:bg-blue-700 shadow-md transition-all">저장</button>
        </div>
      </main>

      {/* 저장 확인 모달 */}
      <AdminConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmSave} 
        title="상세코드를 저장하시겠습니까?" 
        message="작성하신 내용이 즉시 DB에 저장됩니다." 
        type="save" 
      />

      {/* 취소 확인 모달 */}
      <AdminConfirmModal 
        isOpen={isCancelModalOpen} 
        onClose={() => setIsCancelModalOpen(false)} 
        onConfirm={confirmCancel}
        title="등록을 취소하시겠습니까?" 
        message="작성 중인 내용이 저장되지 않고 이전 페이지로 이동합니다." 
        type="delete" 
      />
    </div>
  );
};

export default AdminSubCodeAdd;