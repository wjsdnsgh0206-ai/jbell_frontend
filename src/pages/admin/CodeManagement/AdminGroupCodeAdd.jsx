import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from '@/components/Admin/board/BreadCrumb';
import { AdminCommonCodeData } from './AdminCommonCodeData';

// [디자인] 성공(파란 원) 및 에러(빨간 원) 아이콘 컴포넌트
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
  
  // [상태 관리] 등록 여부(기존 노출 여부), 폼 데이터, 에러 상태
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

  // [로직] 중복 체크 (ID와 명칭 실시간 감시)
  const checkDuplicate = useMemo(() => {
    const isIdDup = AdminCommonCodeData.some(
      item => item.groupCode.toLowerCase() === formData.groupCodeId.trim().toLowerCase()
    );
    const isNameDup = AdminCommonCodeData.some(
      item => item.groupName.trim() === formData.groupName.trim()
    );
    return { id: isIdDup, name: isNameDup };
  }, [formData.groupCodeId, formData.groupName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (value.trim() !== "") {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  // [저장 함수]
  const handleSave = () => {
    // 1. 유효성 검사
    const newErrors = {
      groupCodeId: !formData.groupCodeId.trim(),
      groupName: !formData.groupName.trim()
    };
    setErrors(newErrors);

    if (newErrors.groupCodeId || newErrors.groupName || checkDuplicate.id || checkDuplicate.name) {
      alert("입력 항목의 중복 여부나 필수 입력값을 확인해주세요.");
      return;
    }

    /**
     * [나중에 백엔드(Spring Boot) 연결 시 처리할 내용]
     * - 순서(order)가 겹칠 경우 기존 데이터들을 뒤로 밀어내는(Shift) 로직은 서버 트랜잭션 내에서 처리 권장.
     * - API: axios.post('/api/codes/group', { ...formData, visible: isRegistered })
     */

    // 2. 가짜 데이터 생성 (시뮬레이션)
    const newEntry = {
      id: AdminCommonCodeData.length + 1,
      groupCode: formData.groupCodeId,
      groupName: formData.groupName,
      detailCode: "-",
      detailName: "-",
      desc: formData.desc,
      date: new Date().toISOString().split('T')[0],
      order: Number(formData.order),
      visible: isRegistered // 등록 여부 상태 반영
    };

    // 3. 임시 데이터 저장 (새로고침 전까지 유지)
    AdminCommonCodeData.unshift(newEntry);

    alert("성공적으로 등록되었습니다.");
    
    // 4. 목록으로 이동
    navigate('/admin/adminCommonCodeList');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      <main className="p-10">
        <BreadCrumb />
        <h2 className="text-[32px] font-bold mt-2 mb-10 tracking-tight text-left">그룹 코드 등록</h2>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          {/* 헤더 강조 */}
          <h3 className="text-[24px] font-extrabold mb-10 text-[#111] tracking-tight text-left">그룹코드 등록</h3>
          
          <div className="space-y-12">
            {/* 그룹 코드 ID */}
            <div className="text-left">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 ID (필수)</label>
              <input 
                name="groupCodeId"
                value={formData.groupCodeId}
                onChange={handleChange}
                placeholder="예시 : Category-2"
                className={`w-full max-w-[500px] border rounded-lg px-5 py-4 outline-none transition-all ${
                  errors.groupCodeId || checkDuplicate.id 
                  ? 'border-[#E15141] ring-1 ring-red-50' 
                  : formData.groupCodeId ? 'border-[#2563EB] ring-1 ring-blue-50' : 'border-gray-300 focus:border-[#2563EB]'
                }`}
              />
              {formData.groupCodeId && (
                <div className={`text-sm mt-3 flex items-center gap-2 font-medium ${checkDuplicate.id ? 'text-[#E15141]' : 'text-[#2563EB]'}`}>
                  {checkDuplicate.id ? <ErrorIcon /> : <SuccessIcon />}
                  {checkDuplicate.id ? "이미 존재하는 코드입니다" : "사용 가능한 코드입니다"}
                </div>
              )}
            </div>

            {/* 그룹 코드 명 */}
            <div className="text-left">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 명 (필수)</label>
              <input 
                name="groupName"
                value={formData.groupName}
                onChange={handleChange}
                placeholder="예시 : 카테고리1"
                className={`w-full max-w-[500px] border rounded-lg px-5 py-4 outline-none transition-all ${
                  errors.groupName || checkDuplicate.name 
                  ? 'border-[#E15141] ring-1 ring-red-50' 
                  : formData.groupName ? 'border-[#2563EB] ring-1 ring-blue-50' : 'border-gray-300 focus:border-[#2563EB]'
                }`}
              />
              {(errors.groupName || (formData.groupName && checkDuplicate.name)) && (
                <div className="text-[#E15141] text-sm mt-3 flex items-center gap-2 font-medium">
                  <ErrorIcon />
                  {errors.groupName ? "필수 입력 항목입니다" : "이미 존재하는 코드명입니다"}
                </div>
              )}
            </div>

            {/* 그룹 코드 설명 */}
            <div className="text-left">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 설명</label>
              <textarea 
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                placeholder="최대 50 글자 이내로 내용을 입력해주세요."
                rows="2"
                className="w-full max-w-[600px] border border-gray-300 rounded-lg px-5 py-4 outline-none focus:border-[#2563EB] resize-none transition-all font-medium"
              />
            </div>

            {/* 순서 및 등록 여부 */}
            <div className="flex flex-col gap-10 text-left">
              <div>
                <label className="block font-bold text-[16px] mb-3 text-[#111]">순서</label>
                <input 
                  type="number" 
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="w-[100px] border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#2563EB] text-center font-medium"
                />
                <p className="text-[#999] text-[13px] mt-3 font-medium">* 숫자가 낮을 수록 상위 위치합니다</p>
              </div>

              {/* [수정] 등록 여부 섹션 */}
              <div className="flex items-center gap-5 pt-2">
                <label className="font-bold text-[16px] text-[#111]">등록 여부</label>
                <button 
                  onClick={() => setIsRegistered(!isRegistered)}
                  className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-colors duration-300 ${isRegistered ? 'bg-[#2563EB]' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${isRegistered ? 'translate-x-[26px]' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 하단 버튼 영역 */}
        <div className="flex justify-end gap-2 mt-12 max-w-[1000px]">
          <button 
            onClick={() => navigate(-1)}
            className="px-5 py-3 border border-gray-300 rounded-lg font-bold text-[15px] text-gray-500 bg-white hover:bg-gray-50 transition-all shadow-sm"
          >
            취소
          </button>
          <button 
            onClick={handleSave}
            className="px-5 py-3 bg-[#2563EB] text-white rounded-lg font-bold text-[15px] hover:bg-blue-700 shadow-md transition-all"
          >
            저장
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminGroupCodeAdd;