import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminCommonCodeData } from './AdminCommonCodeData';
import AdminCodeConfirmModal from './AdminCodeConfirmModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      // ⭐️ 한글 입력 원천 차단 + 영문 대문자/숫자/_만 허용 + 20자 제한
      const transformedValue = value.toUpperCase().replace(/[^A-Z0-9_]/g, "").slice(0, 20);
      setFormData(prev => ({ ...prev, [name]: transformedValue }));
      setErrors(prev => ({ ...prev, groupCodeId: false }));
    } 
    else if (name === "groupName") {
      // ⭐️ 그룹명 최대 20자 제한
      if (value.length <= 20) {
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, groupName: false }));
      }
    } 
    else if (name === "order") {
      // ⭐️ 숫자 이외 제거
      const val = value.replace(/[^0-9]/g, "");
      let numVal = val === "" ? "" : parseInt(val);
      if (numVal !== "" && numVal < 1) numVal = 1;
      setFormData(prev => ({ ...prev, [name]: numVal }));
    } 
    else if (name === "desc") {
      // ⭐️ 설명 최대 50자 제한
      if (value.length <= 50) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
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
      alert("입력 항목을 다시 확인해주세요.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmSave = () => {
    setIsModalOpen(false);
    
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
    setShowToast(true);
    setTimeout(() => navigate('/admin/system/commonCodeList'), 1500);
  };

  return (
    <div className="relative flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
          <SuccessIcon fill="#4ADE80" />
          <span className="font-bold text-[16px]">그룹코드가 성공적으로 등록되었습니다.</span>
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
              <label className="font-bold text-[16px] text-[#111]">노출 여부</label>
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setIsRegistered(!isRegistered)}
                  className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-all duration-300 ${isRegistered ? 'bg-[#2563EB]' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${isRegistered ? 'translate-x-[26px]' : 'translate-x-0'}`} />
                </button>
                <span className={`text-[14px] font-bold ${isRegistered ? 'text-[#2563EB]' : 'text-gray-400'}`}>
                  {isRegistered ? '노출' : '미노출'}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-2 mt-12 max-w-[1000px]">
          <button type="button" onClick={() => navigate(-1)} className="px-8 py-3.5 border border-gray-300 bg-white text-gray-500 rounded-lg font-bold text-[16px] hover:bg-gray-50 transition-colors shadow-sm">취소</button>
          <button type="button" onClick={handleSaveClick} className="px-8 py-3.5 bg-[#2563EB] text-white rounded-lg font-bold text-[16px] hover:bg-blue-700 shadow-md transition-colors">저장</button>
        </div>
      </main>

      <AdminCodeConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmSave} 
        title="그룹코드를 저장하시겠습니까?" 
        message="작성하신 내용이 즉시 저장됩니다" 
        type="save" 
      />
    </div>
  );
};

export default AdminGroupCodeAdd;