import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminCommonCodeData } from './AdminCommonCodeData';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

// 아이콘까지 모두 포함 (따로 선언해두어야 나중에 아이콘만 바꾸기 편함)
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
  const [isVisible, setIsVisible] = useState(true); 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const [formData, setFormData] = useState({ 
    groupCodeId: '', 
    subCodeId: '', 
    subName: '', 
    desc: '', 
    order: 1 
  });
  
  const [errors, setErrors] = useState({ groupCodeId: false, subCodeId: false, subName: false });

  // 1. [변경] 이탈 방지 트리거 변수
  const isDirty = useMemo(() => {
    return !!(formData.groupCodeId || formData.subCodeId.trim() || formData.subName.trim() || formData.desc.trim());
  }, [formData]);

  // 2. 뒤로가기 시 실행될 함수 (useCallback으로 메모이제이션)
const handlePopState = useCallback(() => {
  if (isDirty) {
    window.history.pushState(null, "", window.location.href);
    setIsCancelModalOpen(true);
  }
}, [isDirty]);

// 3. 브라우저 뒤로가기 버튼 차단 로직 (handlePopState 의존성 추가)
useEffect(() => {
  if (!isDirty) {
    window.removeEventListener('popstate', handlePopState);
    return;
  }

  window.history.pushState(null, "", window.location.href);
  window.addEventListener('popstate', handlePopState);

  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}, [isDirty, handlePopState]);

  // 페이지 이탈 방지 로직
  // 4. [변경] 새로고침/탭 닫기 차단
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ""; 
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // 상위 그룹 코드 옵션 추출
  const groupOptions = useMemo(() => {
    const uniqueGroups = Array.from(new Map(AdminCommonCodeData.map(item => [item.groupCode, item.groupName])));
    return uniqueGroups.map(([code, name]) => ({ code, name }));
  }, []);

  // 상세 코드 ID 및 명칭 중복 체크 (수정됨)
  const checkDuplicate = useMemo(() => {
    const targetSubId = formData.subCodeId.trim().toUpperCase();
    const targetSubName = formData.subName.trim();
    const targetGroupId = formData.groupCodeId;

    if (!targetSubId || !targetGroupId) return { id: false, name: false };

    // 1. ID 중복 체크: 같은 그룹 내에서만
    const isIdDup = AdminCommonCodeData.some(item => 
      item.groupCode === targetGroupId && 
      item.subCode !== '-' && 
      item.subCode.toUpperCase() === targetSubId
    );

    // 2. 명칭 중복 체크: 같은 그룹 내에서만 (추가됨)
    const isNameDup = AdminCommonCodeData.some(item => 
      item.groupCode === targetGroupId && 
      item.subCode !== '-' && 
      item.subName.trim() === targetSubName
    );

    return { id: isIdDup, name: isNameDup };
  }, [formData.subCodeId, formData.subName, formData.groupCodeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "subCodeId") {
      const transformedValue = value.toUpperCase().replace(/[^A-Z0-9_]/g, "").slice(0, 20);
      setFormData(prev => ({ ...prev, [name]: transformedValue }));
      setErrors(prev => ({ ...prev, subCodeId: false }));
    } 
    else if (name === "subName") {
      if (value.length <= 20) {
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, subName: false }));
      }
    }
    else if (name === "order") {
      const val = value.replace(/[^0-9]/g, "");
      setFormData(prev => ({ ...prev, [name]: val === "" ? "" : parseInt(val) }));
    } 
    else if (name === "desc") {
      if (value.length <= 50) setFormData(prev => ({ ...prev, [name]: value }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (value !== "") setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  // 5. [확인] 취소 실행 로직
  const confirmCancel = () => {
    window.removeEventListener('popstate', handlePopState); // 리스너 제거
    setIsCancelModalOpen(false);
    setToastMessage("등록이 취소되었습니다.");
    setShowToast(true);
    setTimeout(() => navigate('/admin/system/commonCodeList'), 1000);
  };

  const handleCancel = () => {
    if (isDirty) {
      setIsCancelModalOpen(true);
    } else {
      navigate(-1);
    }
  };

  const handleSave = () => {
    const newErrors = {
      groupCodeId: !formData.groupCodeId,
      subCodeId: !formData.subCodeId.trim(),
      subName: !formData.subName.trim(),
    };
    setErrors(newErrors);

    // 중복 체크 조건에 이름 중복(checkDuplicate.name) 추가
    if (Object.values(newErrors).some(Boolean) || checkDuplicate.id || checkDuplicate.name) {
      alert("필수 입력 사항을 모두 확인해주세요.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmSave = () => {
    setIsModalOpen(false);

    // 저장 프로세스 시작 시 리스너 확실히 제거
  window.removeEventListener('popstate', handlePopState);
    const selectedGroup = groupOptions.find(g => g.code === formData.groupCodeId);

    const newEntry = {
      id: Date.now(),
      groupCode: formData.groupCodeId,
      groupName: selectedGroup?.name || '',
      subCode: formData.subCodeId.trim().toUpperCase(),
      subName: formData.subName.trim(),
      desc: formData.desc.trim(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      order: formData.order,
      visible: isVisible
    };

    AdminCommonCodeData.unshift(newEntry);
    setToastMessage("상세코드가 성공적으로 등록되었습니다.");
    setShowToast(true);
   // replace: true 옵션으로 히스토리 관리
  setTimeout(() => navigate('/admin/system/commonCodeList', { replace: true }), 1500);
};

  return (
    <div className="relative flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform translate-y-0">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            <SuccessIcon fill="#4ADE80" />
            <span className="font-bold text-[16px]">{toastMessage}</span>
          </div>
        </div>
      )}

      <main className="p-10 text-left">
        <h2 className="text-[32px] font-bold mt-2 mb-10 tracking-tight text-left">상세 코드 등록</h2>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] tracking-tight border-b-2 border-gray-100 pb-3">상세코드 정보 입력</h3>
          
          <div className="flex flex-col">
            {/* 1. 그룹 코드 선택 (필수) */}
            <div className="mb-10 w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 (필수)</label>
              <div className="relative">
                <select 
                  name="groupCodeId"
                  value={formData.groupCodeId}
                  onChange={handleChange}
                  className={`w-full appearance-none border rounded-lg px-5 py-4 outline-none transition-all font-medium ${
                    errors.groupCodeId ? 'border-[#E15141] ring-1 ring-red-50' : 'border-gray-300 focus:border-[#2563EB]'
                  }`}
                >
                  <option value="">그룹 코드를 선택해주세요</option>
                  {groupOptions.map(opt => (
                    <option key={opt.code} value={opt.code}>{`${opt.code} (${opt.name})`}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
              {errors.groupCodeId && <div className="text-[#E15141] text-sm mt-3 flex items-center gap-2 font-medium"><ErrorIcon /> 그룹코드를 선택해주세요.</div>}
            </div>

            {/* 2. 상세 코드 ID (필수) */}
<div className="mb-10 w-full max-w-[500px]">
  <label className="block font-bold text-[16px] mb-3 text-[#111]">상세 코드 ID (필수)</label>
  <input 
    name="subCodeId"
    value={formData.subCodeId}
    onChange={handleChange}
    autoComplete="off"
    placeholder="예: AUTH_READ (영문 대문자, 숫자, _만 가능)"
    className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${
      errors.subCodeId || checkDuplicate.id ? 'border-[#E15141] ring-1 ring-red-50' : 'border-gray-300 focus:border-[#2563EB]'
    }`}
  />
  <div className="flex justify-between items-start mt-2">
    <div className="flex-1 min-h-[20px]">
      {checkDuplicate.id ? (
        <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium">
          <ErrorIcon /> 이미 존재하는 코드 ID입니다.
        </div>
      ) : errors.subCodeId ? (
        <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium">
          <ErrorIcon /> 상세 코드 ID를 입력해주세요.
        </div>
      ) : (
        <p className="text-[13px] text-gray-400 font-medium">* 영문 대문자, 숫자, 언더바(_)만 사용 가능</p>
      )}
    </div>
    <span className="text-[12px] text-gray-400 font-medium ml-4 shrink-0">
      {formData.subCodeId.length} / 20
    </span>
  </div>
</div>

{/* 3. 상세 코드명 (필수) */}
<div className="mb-10 w-full max-w-[500px]">
  <label className="block font-bold text-[16px] mb-3 text-[#111]">상세 코드명 (필수)</label>
  <input 
    name="subName"
    value={formData.subName}
    onChange={handleChange}
    autoComplete="off"
    placeholder="예: 읽기 권한"
    className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${
      errors.subName || checkDuplicate.name ? 'border-[#E15141] ring-1 ring-red-50' : 'border-gray-300 focus:border-[#2563EB]'
    }`}
  />
  <div className="flex justify-between items-start mt-2">
    <div className="flex-1 min-h-[20px]">
      {checkDuplicate.name ? (
        <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium">
          <ErrorIcon /> 동일 그룹 내에 이미 존재하는 명칭입니다.
        </div>
      ) : errors.subName ? (
        <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium">
          <ErrorIcon /> 상세 코드명을 입력해주세요.
        </div>
      ) : (
        <p className="text-[13px] text-gray-400 font-medium">* 최대 20자까지 입력 가능</p>
      )}
    </div>
    <span className="text-[12px] text-gray-400 font-medium ml-4 shrink-0">
      {formData.subName.length} / 20
    </span>
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
                placeholder="예: 상세 코드에 대한 설명을 입력해주세요. (최대 50자)"
                className="w-full bg-white border border-gray-300 rounded-lg px-5 py-4 text-[#111] outline-none focus:border-[#2563EB] resize-none leading-relaxed transition-all font-medium"
              />
              <div className="flex justify-end mt-2">
                <span className="text-[12px] text-gray-400 font-medium">{formData.desc.length} / 50</span>
              </div>
            </div>

            {/* 5. 순서 */}
            <div className="mb-10 w-full">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">순서</label>
              <input 
                type="number" 
                name="order"
                min="1"
                value={formData.order}
                onChange={handleChange}
                className="w-[100px] border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#2563EB] text-center font-medium"
              />
              <p className="text-[13px] text-gray-400 mt-3 font-medium">* 숫자가 낮을수록 리스트 상단에 노출됩니다.</p>
            </div>

            {/* 6. 등록 여부 */}
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
                <span className={`text-[14px] font-bold ${isVisible ? 'text-[#2563EB]' : 'text-gray-400'}`}>
                  {isVisible ? '사용' : '미사용'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 하단 버튼 구역 수정 */}
      <div className="flex justify-end gap-2 mt-12 max-w-[1000px]">
        <button type="button" onClick={handleCancel} className="px-8 py-3.5 border border-gray-300 rounded-lg font-bold text-[16px] text-gray-500 bg-white hover:bg-gray-50 transition-all shadow-sm">취소</button>
        <button type="button" onClick={handleSave} className="px-8 py-3.5 bg-[#2563EB] text-white rounded-lg font-bold text-[16px] hover:bg-blue-700 shadow-md transition-all">저장</button>
      </div>
      </main>

      {/* 확인 모달 */}
      <AdminConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmSave} 
        title="상세코드를 저장하시겠습니까?" 
        message="작성하신 내용이 즉시 저장됩니다"
        type="save"
      />

      {/* 취소 확인 모달 */}
      <AdminConfirmModal 
        isOpen={isCancelModalOpen} 
        onClose={() => setIsCancelModalOpen(false)} 
        onConfirm={confirmCancel} 
        title="등록을 취소하시겠습니까?" 
        message="작성 중인 내용이 저장되지 않고 목록으로 이동합니다." 
        type="delete" 
      />
    </div>
  );
};

export default AdminSubCodeAdd;