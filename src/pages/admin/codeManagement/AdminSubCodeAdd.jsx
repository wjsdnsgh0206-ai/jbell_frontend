import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { codeService } from '@/services/api';
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

  const fetchGroups = useCallback(async () => {
    try {
      const response = await codeService.getCodeGroups();
      const data = response.data || response;
      setGroupOptions(data);
    } catch (error) {
      console.error('그룹 코드 로드 실패:', error);
    }
  }, []);

  // [수정] 이탈 방지 핸들러를 하나로 고정
  const handleBeforeUnload = useCallback((e) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = ""; 
    }
  }, [isDirty]);

  // [수정] useEffect 통합 (중복 제거)
  useEffect(() => {
    fetchGroups();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [fetchGroups, handleBeforeUnload]);

  // 중복 체크 로직
  useEffect(() => {
    if (!formData.groupCode || (!formData.subCode.trim() && !formData.subName.trim())) {
      setIsDuplicate({ subCode: false, subName: false });
      return;
    }

    const checkDuplicate = async () => {
      try {
        const params = { groupCode: formData.groupCode };
        if (formData.subCode.trim()) params.subCode = formData.subCode.trim();
        if (formData.subName.trim()) params.subName = formData.subName.trim();

        const res = await codeService.checkSubDup(params);
        const data = res.data || res;
        
        setIsDuplicate({
          subCode: data.isCodeDup || false, 
          subName: data.isNameDup || false
        });
      } catch (err) { 
        console.error("중복 체크 실패:", err); 
      }
    };

    const timer = setTimeout(checkDuplicate, 400);
    return () => clearTimeout(timer);
  }, [formData.groupCode, formData.subCode, formData.subName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "subCode") {
      // 상세 코드 ID: 50자 제한 (기존 20자에서 변경)
      const transformedValue = value.toUpperCase().replace(/[^A-Z0-9_]/g, "").slice(0, 50);
      setFormData(prev => ({ ...prev, [name]: transformedValue }));
      setErrors(prev => ({ ...prev, subCode: false }));
    } else if (name === "subName") {
      // 상세 코드 명: 100자 제한 (기존 20자에서 변경)
      if (value.length <= 100) {
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, subName: false }));
      }
    } else if (name === "desc") {
      // 상세 코드 설명: 200자 제한 (기존 50자에서 변경)
      if (value.length <= 200) setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (value !== "") setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleCancel = () => {
    if (isDirty) setIsCancelModalOpen(true);
    else navigate(-1);
  };

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
    setIsModalOpen(false);
    try {
      const saveData = {
        groupCode: formData.groupCode,
        subCode: formData.subCode,
        subName: formData.subName,
        desc: formData.desc,
        order: Number(formData.order) || 1,
        visible: isVisible 
      };

      await codeService.addItem(formData.groupCode, saveData);

      setToastMessage('상세코드가 성공적으로 등록되었습니다.');
      setShowToast(true);
      
      // [중요] 정확한 함수 참조로 리스너 제거
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      setTimeout(() => {
        navigate('/admin/system/commonCodeList');
      }, 1500);
      
    } catch (error) {
      console.error('저장 실패 상세:', error);
      const serverMsg = error.response?.data?.message || "저장 중 오류가 발생했습니다. 관리자에게 문의하세요.";
      setToastMessage(serverMsg);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
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
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            {!toastMessage.includes("오류") && !toastMessage.includes("취소") && <SuccessIcon fill="#4ADE80" />}
            {toastMessage.includes("오류") && <ErrorIcon />}
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
                    <option key={opt.groupCode} value={opt.groupCode}>{`${opt.groupCode} (${opt.groupName})`}</option>
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
              <input 
                name="subCode"
                value={formData.subCode}
                onChange={handleChange}
                autoComplete="off"
                placeholder="예: AUTH_USER"
                className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${
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
                    <div className="text-[#2563EB] text-sm flex items-center gap-2 font-medium"><SuccessIcon fill="#2563EB" /> 사용 가능한 코드 ID입니다.</div>
                  ) : (
                    <p className="text-[13px] text-gray-400 font-medium">* 영문 대문자, 숫자, 언더바(_)만 사용 가능</p>
                  )}
                </div>
                <span className="text-[12px] text-gray-400 font-medium ml-4 shrink-0">{formData.subCode.length} / 50</span>
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
                placeholder="예: 일반 사용자 권한"
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
                    <div className="text-[#2563EB] text-sm flex items-center gap-2 font-medium"><SuccessIcon fill="#2563EB" /> 사용 가능한 명칭입니다.</div>
                  ) : (
                    <p className="text-[13px] text-gray-400 font-medium">* 최대 100자까지 입력 가능</p>
                  )}
                </div>
                <span className="text-[12px] text-gray-400 font-medium ml-4 shrink-0">{formData.subName.length} / 100</span>
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
                placeholder="상세 코드에 대한 설명을 입력해주세요."
                className="w-full bg-white border border-gray-300 rounded-lg px-5 py-4 text-[#111] outline-none focus:border-[#2563EB] resize-none leading-relaxed transition-all font-medium"
              />
              <div className="flex justify-end mt-2">
                <span className="text-[12px] text-gray-400 font-medium">{formData.desc.length} / 200</span>
              </div>
            </div>

            {/*  상세 코드 순서 영역 아직 구현 X  @@*/}        
            {/* 5. 순서 섹션 - AdminSubCodeAdd.jsx */}
<div className="mb-10 w-full group">
  <label className="block font-bold text-[16px] mb-3 text-[#111]">순서</label>
  <div className="relative w-[100px]">
    <input 
      type="text" 
      name="order"
      value={formData.order}
      readOnly // 키보드 입력 차단
      className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-center font-medium text-gray-400 cursor-not-allowed outline-none transition-all"
    />
    
    {/* 증감 버튼에서 onClick 제거 및 비활성화 스타일 적용 */}
    <div className="absolute right-[1px] top-[1px] bottom-[1px] flex flex-col w-[24px] opacity-0 group-hover:opacity-100 transition-opacity bg-gray-50 rounded-r-lg overflow-hidden border-l border-gray-100">
      <div className="flex-1 flex items-center justify-center border-b border-gray-100 cursor-not-allowed">
        <svg width="8" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 5L5 1L9 5" stroke="#CCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <div className="flex-1 flex items-center justify-center cursor-not-allowed">
        <svg width="8" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#CCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
  </div>
  <div className="mt-3 space-y-1">
    <p className="text-[12px] text-gray-400 mt-2 font-medium">* 자동으로 마지막 순서로 지정됩니다.</p>
              <p className="text-[13px] text-gray-400 font-medium">* 숫자가 낮을수록 리스트 상단에 노출됩니다.</p>
  </div>
</div>

            {/* 5. 순서 */}
            {/* <div className="mb-10 w-full group">
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
            </div> */}
            
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
        message="작성하신 내용이 즉시 저장됩니다." 
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