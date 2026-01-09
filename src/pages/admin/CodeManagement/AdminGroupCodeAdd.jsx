import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from '@/components/Admin/board/BreadCrumb';
import { AdminCommonCodeData } from './AdminCommonCodeData';

// 그룹코드 등록 페이지 //

// 아이콘 컴포넌트
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

const AdminGroupCodeAdd = () => {
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(true); 
  const [formData, setFormData] = useState({ groupCodeId: '', groupName: '', desc: '', order: 1 });
  const [errors, setErrors] = useState({ groupCodeId: false, groupName: false });

  const checkDuplicate = useMemo(() => {
    const isIdDup = AdminCommonCodeData.some(item => item.groupCode.toLowerCase() === formData.groupCodeId.trim().toLowerCase());
    const isNameDup = AdminCommonCodeData.some(item => item.groupName.trim() === formData.groupName.trim());
    return { id: isIdDup, name: isNameDup };
  }, [formData.groupCodeId, formData.groupName]);

  const isInvalidId = useMemo(() => {
    if (!formData.groupCodeId) return false;
    const regex = /^[a-zA-Z0-9_]*$/;
    return !regex.test(formData.groupCodeId);
  }, [formData.groupCodeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "order") {
      const val = value.replace(/[^0-9]/g, "");
      setFormData(prev => ({ ...prev, [name]: val === "" ? "" : parseInt(val) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (value.trim() !== "") {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSave = () => {
    const hasFormatError = isInvalidId;
    const newErrors = {
      groupCodeId: !formData.groupCodeId.trim(),
      groupName: !formData.groupName.trim()
    };
    setErrors(newErrors);

    if (newErrors.groupCodeId || newErrors.groupName || checkDuplicate.id || checkDuplicate.name || hasFormatError) {
      alert("입력 항목의 형식이나 중복 여부를 확인해주세요.");
      return;
    }

    // [수정] detail -> sub 명칭 변경
    const newEntry = {
      id: Date.now(), 
      groupCode: formData.groupCodeId.trim(),
      groupName: formData.groupName.trim(),
      subCode: '-', 
      subName: '-',
      desc: formData.desc,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16), 
      order: formData.order,
      visible: isRegistered
    };

    AdminCommonCodeData.unshift(newEntry); 

    alert("성공적으로 등록되었습니다.");
    navigate('/admin/adminCommonCodeList');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      <main className="p-10 text-left">
        <BreadCrumb />
        <h2 className="text-[32px] font-bold mt-2 mb-10 tracking-tight text-left">그룹 코드 등록</h2>
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] tracking-tight border-b-2 border-gray-100 pb-3">그룹코드 정보 입력</h3>
          <div className="flex flex-col">
            <div className="mb-10">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 ID (필수)</label>
              <input 
                name="groupCodeId"
                value={formData.groupCodeId}
                onChange={handleChange}
                placeholder="예: CATEGORY_01"
                className={`w-full max-w-[500px] border rounded-lg px-5 py-4 outline-none transition-all ${
                  errors.groupCodeId || checkDuplicate.id || isInvalidId
                  ? 'border-[#E15141] ring-1 ring-red-50' 
                  : formData.groupCodeId ? 'border-[#2563EB] ring-1 ring-blue-50' : 'border-gray-300 focus:border-[#2563EB]'
                }`}
              />
              {isInvalidId ? (
                <div className="text-[#E15141] text-sm mt-3 flex items-center gap-2 font-medium">
                  <ErrorIcon />
                  영문 대소문자, 숫자, 언더바(_)만 입력 가능합니다. (한글/기타 특수문자 불가)
                </div>
              ) : (
                <>
                  <p className="text-[13px] text-gray-400 mt-3 font-medium">* 영문 대소문자, 숫자, 언더바(_)만 사용 가능합니다.</p>
                  {formData.groupCodeId && (
                    <div className={`text-sm mt-3 flex items-center gap-2 font-medium ${checkDuplicate.id ? 'text-[#E15141]' : 'text-[#2563EB]'}`}>
                      {checkDuplicate.id ? <ErrorIcon /> : <SuccessIcon />}
                      {checkDuplicate.id ? "이미 존재하는 코드 ID입니다" : "사용 가능한 코드 ID입니다"}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="mb-10">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 명 (필수)</label>
              <input 
                name="groupName"
                value={formData.groupName}
                onChange={handleChange}
                placeholder="예: 공통-카테고리"
                className={`w-full max-w-[500px] border rounded-lg px-5 py-4 outline-none transition-all ${
                  errors.groupName || checkDuplicate.name 
                  ? 'border-[#E15141] ring-1 ring-red-50' 
                  : formData.groupName ? 'border-[#2563EB] ring-1 ring-blue-50' : 'border-gray-300 focus:border-[#2563EB]'
                }`}
              />
              {(errors.groupName || (formData.groupName && checkDuplicate.name)) && (
                <div className="text-[#E15141] text-sm mt-3 flex items-center gap-2 font-medium">
                  <ErrorIcon />
                  {errors.groupName ? "필수 입력 항목입니다" : "이미 존재하는 그룹명입니다"}
                </div>
              )}
            </div>
            <div className="mb-6">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 설명</label>
              <textarea 
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                maxLength={50}
                rows="2"
                placeholder="최대 50 글자 이내로 입력해주세요."
                className="w-full max-w-[600px] border border-gray-300 rounded-lg px-5 py-4 outline-none focus:border-[#2563EB] resize-none transition-all font-medium leading-[22px]"
              />
              <div className="text-[12px] text-gray-400 mt-1.5 text-right max-w-[600px]">
                {formData.desc.length} / 50
              </div>
            </div>
            <div className="mb-10">
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
            <div className="flex items-center gap-5 pt-2">
              <label className="font-bold text-[16px] text-[#111]">등록 여부</label>
              <button 
                type="button"
                onClick={() => setIsRegistered(!isRegistered)}
                className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-colors duration-300 ${isRegistered ? 'bg-[#2563EB]' : 'bg-gray-300'}`}
              >
                <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${isRegistered ? 'translate-x-[26px]' : 'translate-x-0'}`}></div>
              </button>
              <span className={`text-[14px] font-bold ${isRegistered ? 'text-[#2563EB]' : 'text-gray-400'}`}>
                {isRegistered ? '등록' : '미등록'}
              </span>
            </div>
          </div>
        </section>
        <div className="flex justify-end gap-2 mt-12 max-w-[1000px]">
          <button type="button" onClick={() => navigate(-1)} className="px-8 py-3.5 border border-gray-300 rounded-lg font-bold text-[16px] text-gray-500 bg-white hover:bg-gray-50 transition-all shadow-sm">취소</button>
          <button type="button" onClick={handleSave} className="px-8 py-3.5 bg-[#2563EB] text-white rounded-lg font-bold text-[16px] hover:bg-blue-700 shadow-md transition-all">저장</button>
        </div>
      </main>
    </div>
  );
};

export default AdminGroupCodeAdd;