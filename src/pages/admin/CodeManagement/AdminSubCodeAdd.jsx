import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from '@/components/Admin/board/BreadCrumb';
import { AdminCommonCodeData } from './AdminCommonCodeData';


// 상세코드 등록 페이지 //

const SuccessIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="8" fill="#2563EB"/>
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
  const [isVisible, setIsVisible] = useState(false); 
  const [formData, setFormData] = useState({ 
    groupCodeId: '', 
    subCodeId: '', 
    subName: '', 
    desc: '', 
    order: 1 
  });
  const [errors, setErrors] = useState({ groupCodeId: false, subCodeId: false, subName: false });

  // 1. 그룹 코드 목록 추출 (Select Box용)
  const groupOptions = useMemo(() => {
    const uniqueGroups = Array.from(new Map(AdminCommonCodeData.map(item => [item.groupCode, item.groupName])));
    return uniqueGroups.map(([code, name]) => ({ code, name }));
  }, []);

  // 2. 중복 체크 (subCodeId 기준)
  const checkDuplicate = useMemo(() => {
    const isIdDup = AdminCommonCodeData.some(item => item.subCode !== '-' && item.subCode.toLowerCase() === formData.subCodeId.trim().toLowerCase());
    return { id: isIdDup };
  }, [formData.subCodeId]);

  const isInvalidId = useMemo(() => {
    if (!formData.subCodeId) return false;
    return !/^[a-zA-Z0-9_]*$/.test(formData.subCodeId);
  }, [formData.subCodeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === "order" ? (value === "" ? "" : parseInt(value)) : value }));
    if (value.trim() !== "") setErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleSave = () => {
    const newErrors = {
      groupCodeId: !formData.groupCodeId,
      subCodeId: !formData.subCodeId.trim(),
      subName: !formData.subName.trim()
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean) || checkDuplicate.id || isInvalidId) {
      alert("입력 항목을 확인해주세요.");
      return;
    }

    const selectedGroup = groupOptions.find(g => g.code === formData.groupCodeId);

    const newEntry = {
      id: Date.now(),
      groupCode: formData.groupCodeId,
      groupName: selectedGroup?.name || '',
      subCode: formData.subCodeId.trim(),
      subName: formData.subName.trim(),
      desc: formData.desc,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      order: formData.order,
      visible: isVisible
    };

    AdminCommonCodeData.unshift(newEntry);
    alert("상세코드가 성공적으로 등록되었습니다.");
    navigate('/admin/adminCommonCodeList');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      <main className="p-10 text-left">
        <BreadCrumb />
        <h2 className="text-[32px] font-bold mt-2 mb-10 tracking-tight">상세 코드 등록</h2>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <h3 className="text-[20px] font-extrabold mb-10 text-[#111] border-b border-gray-100 pb-3">상세 코드 등록</h3>
          
          <div className="flex flex-col gap-8">
            {/* 그룹 코드 선택 */}
            <div>
              <label className="block font-bold text-[16px] mb-3">그룹 코드 (필수)</label>
              <div className="relative max-w-[500px]">
                <select 
                  name="groupCodeId"
                  value={formData.groupCodeId}
                  onChange={handleChange}
                  className={`w-full appearance-none border rounded-lg px-5 py-4 outline-none ${errors.groupCodeId ? 'border-[#E15141]' : 'border-gray-300 focus:border-[#2563EB]'}`}
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
              {errors.groupCodeId && <div className="text-[#E15141] text-sm mt-3 flex items-center gap-2"><ErrorIcon /> 그룹코드를 선택해주세요</div>}
            </div>

            {/* 상세 코드 ID */}
            <div>
              <label className="block font-bold text-[16px] mb-3">상세 코드 ID (필수)</label>
              <input 
                name="subCodeId"
                value={formData.subCodeId}
                onChange={handleChange}
                placeholder="내용을 입력하세요"
                className={`w-full max-w-[500px] border rounded-lg px-5 py-4 outline-none ${errors.subCodeId || checkDuplicate.id || isInvalidId ? 'border-[#E15141]' : 'border-gray-300 focus:border-[#2563EB]'}`}
              />
              {isInvalidId && <div className="text-[#E15141] text-sm mt-3 flex items-center gap-2"><ErrorIcon /> 영문, 숫자, _만 가능합니다.</div>}
              {!isInvalidId && formData.subCodeId && (
                <div className={`text-sm mt-3 flex items-center gap-2 ${checkDuplicate.id ? 'text-[#E15141]' : 'text-[#2563EB]'}`}>
                  {checkDuplicate.id ? <><ErrorIcon /> 이미 존재하는 코드입니다</> : <><SuccessIcon /> 사용 가능한 코드입니다</>}
                </div>
              )}
            </div>

            {/* 상세 코드명 */}
            <div>
              <label className="block font-bold text-[16px] mb-3">상세 코드명 (필수)</label>
              <input 
                name="subName"
                value={formData.subName}
                onChange={handleChange}
                placeholder="내용을 입력하세요"
                className={`w-full max-w-[500px] border rounded-lg px-5 py-4 outline-none ${errors.subName ? 'border-[#E15141]' : 'border-gray-300 focus:border-[#2563EB]'}`}
              />
              {errors.subName && <div className="text-[#E15141] text-sm mt-3 flex items-center gap-2"><ErrorIcon /> 내용을 입력하세요</div>}
            </div>

            {/* 상세 코드 설명 */}
            <div>
              <label className="block font-bold text-[16px] mb-3">상세 코드 설명</label>
              <input 
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                placeholder="최대 50 글자 이내로 내용을 입력해주세요."
                className="w-full border border-gray-300 rounded-lg px-5 py-4 outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* 순서 */}
            <div>
              <label className="block font-bold text-[16px] mb-3">순서</label>
              <input 
                type="number" 
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="w-[100px] border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#2563EB] text-center"
              />
              <p className="text-[13px] text-gray-400 mt-2">* 숫자가 낮을수록 상위에 위치합니다</p>
            </div>

            {/* 노출 여부 스위치 */}
            <div className="flex items-center gap-5">
              <label className="font-bold text-[16px]">노출 여부</label>
              <button 
                type="button"
                onClick={() => setIsVisible(!isVisible)}
                className={`w-[50px] h-[24px] flex items-center rounded-full p-1 transition-colors ${isVisible ? 'bg-[#2563EB]' : 'bg-gray-300'}`}
              >
                <div className={`bg-white w-[18px] h-[18px] rounded-full shadow-md transform transition-transform ${isVisible ? 'translate-x-[26px]' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-2 mt-10 max-w-[1000px]">
          <button type="button" onClick={() => navigate(-1)} className="px-8 py-3 border border-gray-300 rounded-lg font-bold bg-white hover:bg-gray-50">취소</button>
          <button type="button" onClick={handleSave} className="px-8 py-3 bg-[#2563EB] text-white rounded-lg font-bold hover:bg-blue-700">저장</button>
        </div>
      </main>
    </div>
  );
};

export default AdminSubCodeAdd;