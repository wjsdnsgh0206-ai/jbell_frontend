import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminCommonCodeData } from './AdminCommonCodeData';
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
  const [toastMessage, setToastMessage] = useState(""); // 토스트 메시지 상태 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // 취소 모달 상태 
  const [isRegistered, setIsRegistered] = useState(true);

  const [formData, setFormData] = useState({
    groupCodeId: '',
    groupName: '',
    desc: '',
    order: 1
  });

  const [errors, setErrors] = useState({
    groupCodeId: false,
    groupName: false
  });
  
  // 페이지 이탈 방지 로직 @@
  // [변경] 입력값이 있는지 체크하는 변수
  const isDirty = useMemo(() => {
    return !!(formData.groupCodeId.trim() || formData.groupName.trim() || formData.desc.trim());
  }, [formData]);

  // 뒤로가기 시 실행될 함수
const handlePopState = useCallback(() => {
  // isDirty 상태일 때만 모달을 띄우고 히스토리를 유지
  if (isDirty) {
    window.history.pushState(null, "", window.location.href);
    setIsCancelModalOpen(true);
  }
}, [isDirty]); // isDirty가 바뀔 때마다 함수 갱신

  // 1. 브라우저 뒤로가기 버튼 차단 로직 수정
useEffect(() => {
  if (!isDirty) {
    // 값이 비워지면 리스너를 제거하여 일반적인 뒤로가기가 가능하게 함
    window.removeEventListener('popstate', handlePopState);
    return;
  }

  window.history.pushState(null, "", window.location.href);
  window.addEventListener('popstate', handlePopState);

  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}, [isDirty, handlePopState]); // handlePopState도 의존성에 추가

  // 2. [변경] 새로고침/탭 닫기 차단 (기존 로직 유지)
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

  // 중복 체크 로직
  const checkDuplicate = useMemo(() => {
    const targetId = formData.groupCodeId.trim().toUpperCase();
    const targetName = formData.groupName.trim();
    const isIdDup = AdminCommonCodeData.some(item => item.groupCode.toUpperCase() === targetId);
    const isNameDup = AdminCommonCodeData.some(item => item.groupName.trim() === targetName);
    return { id: isIdDup, name: isNameDup };
  }, [formData.groupCodeId, formData.groupName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "groupCodeId") {
      //  한글 입력 원천 차단 + 영문 대문자/숫자/_만 허용 + 20자 제한
      const transformedValue = value.toUpperCase().replace(/[^A-Z0-9_]/g, "").slice(0, 20);
      setFormData(prev => ({ ...prev, [name]: transformedValue }));
      setErrors(prev => ({ ...prev, groupCodeId: false }));
    } 
    else if (name === "groupName") {
      //  그룹명 최대 20자 제한
      if (value.length <= 20) {
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, groupName: false }));
      }
    } 
    else if (name === "order") {
      // 숫자 이외 제거
      const val = value.replace(/[^0-9]/g, "");
      let numVal = val === "" ? "" : parseInt(val);
      if (numVal !== "" && numVal < 1) numVal = 1;
      setFormData(prev => ({ ...prev, [name]: numVal }));
    } 
    else if (name === "desc") {
      //  설명 최대 50자 제한
      if (value.length <= 50) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  //  취소 실행 로직
 // 3. [변경] 취소 실행 로직 (확인 버튼 클릭 시)
  const confirmCancel = () => {
  // 이동하기 전에 이탈 방지 리스너를 미리 제거 (안전장치)
  window.removeEventListener('popstate', handlePopState); 
  
  setIsCancelModalOpen(false);
  setToastMessage("등록이 취소되었습니다.");
  setShowToast(true);
  
  setTimeout(() => {
    navigate('/admin/system/commonCodeList');
  }, 1000);
};

  // 4. [변경] 모달에서 '아니오' 클릭 시 (현재 페이지 유지)
  const handleModalClose = () => {
    setIsCancelModalOpen(false);
  };

  // 5. [변경] 하단 취소 버튼 핸들러
  const handleCancel = () => {
    if (isDirty) {
      setIsCancelModalOpen(true);
    } else {
      navigate(-1);
    }
  };

  const handleSaveClick = () => {
    // 필수값 체크
    const newErrors = {
      groupCodeId: !formData.groupCodeId.trim(),
      groupName: !formData.groupName.trim()
    };
    setErrors(newErrors);

    if (newErrors.groupCodeId || newErrors.groupName || checkDuplicate.id || checkDuplicate.name) {
      alert("필수 입력 사항을 모두 작성해주세요.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmSave = () => {
    setIsModalOpen(false);

    // 가짜 히스토리를 정리하기 위해 뒤로가기를 한 번 실행하거나, 
  // 리스너를 확실히 제거합니다.
  window.removeEventListener('popstate', handlePopState);
    
    // 데이터 저장 시 앞뒤 공백 제거(trim) 적용
    const newEntry = {
      id: Date.now(),
      groupCode: formData.groupCodeId.trim().toUpperCase(),
      groupName: formData.groupName.trim(),
      subCode: '-',
      subName: '-',
      desc: formData.desc.trim(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      order: formData.order,
      visible: isRegistered
    };

    AdminCommonCodeData.unshift(newEntry);
    setToastMessage("그룹코드가 성공적으로 등록되었습니다."); // 메시지 설정
    setShowToast(true);
    // replace: true를 사용하여 히스토리 스택이 꼬이지 않게 합니다.
  setTimeout(() => navigate('/admin/system/commonCodeList', { replace: true }), 1500);
};

  return (
    <div className="relative flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
          <SuccessIcon fill="#4ADE80" />
          <span className="font-bold text-[16px]">{toastMessage}</span>
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
                name="groupCodeId"
                value={formData.groupCodeId}
                onChange={handleChange}
                autoComplete="off"
                placeholder="예: SYSTEM_AUTH (영문 대문자, 숫자, _만 가능)"
                className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${
                  errors.groupCodeId || checkDuplicate.id 
                  ? 'border-[#E15141] ring-1 ring-red-50' 
                  : formData.groupCodeId ? 'border-[#2563EB] ring-1 ring-blue-50' : 'border-gray-300 focus:border-[#2563EB]'
                }`}
              />
              <div className="flex justify-between mt-2">
                <p className="text-[13px] text-gray-400 font-medium">* 영문 대문자, 숫자, 언더바(_)만 사용 가능</p>
                <span className="text-[12px] text-gray-400 font-medium">{formData.groupCodeId.length} / 20</span>
              </div>
              {formData.groupCodeId && (
                <div className={`text-sm mt-3 flex items-center gap-2 font-medium ${checkDuplicate.id ? 'text-[#E15141]' : 'text-[#2563EB]'}`}>
                  {checkDuplicate.id ? <ErrorIcon /> : <SuccessIcon />}
                  {checkDuplicate.id ? "이미 존재하는 코드 ID입니다" : "사용 가능한 코드 ID입니다"}
                </div>
              )}
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
                  errors.groupName || checkDuplicate.name
                  ? 'border-[#E15141] ring-1 ring-red-50' 
                  : formData.groupName ? 'border-[#2563EB] ring-1 ring-blue-50' : 'border-gray-300 focus:border-[#2563EB]'
                }`}
              />
              <div className="flex justify-between mt-2">
                <p className="text-[13px] text-gray-400 font-medium">* 최대 20자까지 입력 가능</p>
                <span className="text-[12px] text-gray-400 font-medium">{formData.groupName.length} / 20</span>
              </div>
              {formData.groupName && checkDuplicate.name && (
                <div className="text-[#E15141] text-sm mt-3 flex items-center gap-2 font-medium">
                  <ErrorIcon /> 이미 존재하는 그룹명입니다
                </div>
              )}
            </div>

            {/* 그룹 코드 설명 */}
            <div className="w-full max-w-[600px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 설명</label>
              <textarea 
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                rows="2"
                placeholder="예: 시스템 전반에 사용되는 권한 분류 그룹 코드입니다. (최대 50자)"
                className="w-full bg-white border border-gray-300 rounded-lg px-5 py-4 text-[#111] outline-none focus:border-[#2563EB] resize-none leading-relaxed transition-all font-medium"
              />
              <div className="flex justify-end mt-2">
                <span className="text-[12px] text-gray-400 font-medium">{formData.desc.length} / 50</span>
              </div>
            </div>

            {/* 순서 (화살표 복구) */}
            <div className="w-full">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">순서</label>
              <input 
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="1"
                className="w-[100px] border border-gray-300 rounded-lg px-4 py-3 text-center outline-none focus:border-[#2563EB] font-medium"
              />
              <p className="text-[13px] text-gray-400 mt-3 font-medium">* 숫자가 낮을수록 리스트 상단에 노출됩니다.</p>
            </div>

            {/* 사용 여부 (가로 배치) */}
            <div className="flex items-center gap-5 pt-2">
              <label className="font-bold text-[16px] text-[#111]">사용 여부</label>
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setIsRegistered(!isRegistered)}
                  className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-all duration-300 ${isRegistered ? 'bg-[#2563EB]' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${isRegistered ? 'translate-x-[26px]' : 'translate-x-0'}`} />
                </button>
                <span className={`text-[14px] font-bold ${isRegistered ? 'text-[#2563EB]' : 'text-gray-400'}`}>
                  {isRegistered ? '사용' : '미사용'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 하단 버튼 구역 수정 */}
        <div className="flex justify-end gap-2 mt-12 max-w-[1000px]">
          <button type="button" onClick={handleCancel} className="px-8 py-3.5 border border-gray-300 bg-white text-gray-500 rounded-lg font-bold text-[16px] hover:bg-gray-50 transition-colors shadow-sm">취소</button>
          <button type="button" onClick={handleSaveClick} className="px-8 py-3.5 bg-[#2563EB] text-white rounded-lg font-bold text-[16px] hover:bg-blue-700 shadow-md transition-colors">저장</button>
        </div>
      </main>

      <AdminConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmSave} 
        title="그룹코드를 저장하시겠습니까?" 
        message="작성하신 내용이 즉시 저장됩니다" 
        type="save" 
      />
      {/* [변경] 취소 확인 모달 */}
      <AdminConfirmModal 
        isOpen={isCancelModalOpen} 
        onClose={handleModalClose} // 👈 handleModalClose로 변경
        onConfirm={confirmCancel} 
        title="등록을 취소하시겠습니까?" 
        message="작성 중인 내용이 저장되지 않고 목록으로 이동합니다." 
        type="delete" 
      />
    </div>
  );
};

export default AdminGroupCodeAdd;