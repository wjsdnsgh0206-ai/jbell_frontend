import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { AdminCommonCodeData } from './AdminCommonCodeData';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

// 아이콘 컴포넌트 (생략 없이 포함)
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

const AdminSubCodeEdit = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();
  const [showToast, setShowToast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true);
  const [originalName, setOriginalName] = useState('');

  const [formData, setFormData] = useState({
    parentGroupInfo: '', 
    subCodeId: '',
    subCodeName: '',
    desc: '',
    order: 1,
    regDate: '',
    modDate: ''
  });

  useEffect(() => {
    const found = AdminCommonCodeData.find(item => item.id === parseInt(id));
    if (found) {
      // 레이아웃의 breadcrumbTitle 상태를 업데이트 -> 브레드크럼이 즉시 바뀜
      setBreadcrumbTitle(found.subName); 
    }
    
    // 페이지를 나갈 때는 초기화 (Clean-up)
    return () => setBreadcrumbTitle("");
  }, [id, setBreadcrumbTitle]);

  useEffect(() => {
    // 1. 현재 ID에 해당하는 상세 데이터 찾기
    const detailData = AdminCommonCodeData.find(item => String(item.id) === String(id));

    if (detailData) {
      // 2. 부모 그룹 정보 가져오기 (해당 groupCode를 가지면서 subCode가 '-'인 항목)
      const parentGroup = AdminCommonCodeData.find(
        item => item.groupCode === detailData.groupCode && item.subCode === '-'
      );

      setFormData({
        parentGroupInfo: parentGroup 
          ? `${parentGroup.groupCode} (${parentGroup.groupName})` 
          : `${detailData.groupCode} (${detailData.groupName})`,
        subCodeId: detailData.subCode,
        subCodeName: detailData.subName, 
        desc: detailData.desc || '',
        order: detailData.order || 1,
        regDate: detailData.date,
        modDate: detailData.editDate || detailData.date 
      });
      setOriginalName(detailData.subName);
      setIsRegistered(detailData.visible);
    }
  }, [id]);

  // 상세 코드명 중복 체크 로직 (본인 제외)
  const checkDuplicateName = useMemo(() => {
    const currentInputName = formData.subCodeName.trim();
    if (!currentInputName || currentInputName === originalName.trim()) return false;

    return AdminCommonCodeData.some(item => 
      item.subCode !== '-' && 
      String(item.id) !== String(id) && 
      item.subName.trim() === currentInputName
    );
  }, [formData.subCodeName, originalName, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "order") {
      const val = value.replace(/[^0-9]/g, "");
      let numVal = val === "" ? "" : parseInt(val);
      if (numVal !== "" && numVal < 1) numVal = 1;
      setFormData(prev => ({ ...prev, [name]: numVal }));
    } else if (name === "desc") {
      if (value.length <= 50) setFormData(prev => ({ ...prev, [name]: value }));
    } else if (name === "subCodeName") {
      if (value.length <= 20) setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleConfirmSave = () => {
    setIsModalOpen(false);
    // 실제 데이터 반영 로직 생략 없이 (unshift 대신 findIndex 등을 통한 업데이트 시뮬레이션 가능)
    setShowToast(true);
    setTimeout(() => navigate(-1), 1500); 
  };

  return (
    <div className="relative flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      {/* 토스트 메시지 */}
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
          <SuccessIcon fill="#4ADE80" />
          <span className="font-bold text-[16px]">상세코드가 성공적으로 수정되었습니다.</span>
        </div>
      )}

      <main className="p-10 text-left">
        <h2 className="text-[32px] font-bold mt-2 mb-10 tracking-tight text-left">공통 코드 관리</h2>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] tracking-tight border-b-2 border-gray-100 pb-3">상세 코드 수정</h3>
          
          <div className="flex flex-col">
            {/* 1. 그룹 정보 (수정 불가) */}
            <div className="mb-10 w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드</label>
              <input value={formData.parentGroupInfo} readOnly className="w-full bg-[#F3F4F7] border border-gray-200 rounded-lg px-5 py-4 text-[#666] cursor-not-allowed outline-none font-medium" />
              <p className="text-[13px] text-gray-400 mt-3 font-medium">* 그룹 코드는 수정할 수 없습니다.</p>
            </div>

            {/* 2. 상세 코드 ID (수정 불가) */}
            <div className="mb-10 w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">상세 코드 ID</label>
              <input value={formData.subCodeId} readOnly className="w-full bg-[#F3F4F7] border border-gray-200 rounded-lg px-5 py-4 text-[#666] cursor-not-allowed outline-none font-medium" />
              <p className="text-[13px] text-gray-400 mt-3 font-medium">* 상세 코드 ID는 수정할 수 없습니다.</p>
            </div>

            {/* 3. 상세 코드 명 (필수) */}
            <div className="mb-10 w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">상세 코드 명 (필수)</label>
              <input 
                name="subCodeName" 
                value={formData.subCodeName} 
                onChange={handleChange} 
                autoComplete="off"
                className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${checkDuplicateName ? 'border-[#E15141] ring-1 ring-red-50' : 'border-gray-300 focus:border-[#2563EB]'}`} 
              />
              <div className="flex justify-between mt-2">
                {checkDuplicateName ? (
                  <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium">
                    <ErrorIcon /> 이미 존재하는 상세 코드명입니다.
                  </div>
                ) : (
                  <p className="text-[13px] text-gray-400 font-medium">* 최대 20자까지 입력 가능</p>
                )}
                <span className="text-[12px] text-gray-400 font-medium">{formData.subCodeName.length} / 20</span>
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
                className="w-full bg-white border border-gray-300 rounded-lg px-5 py-4 text-[#111] outline-none focus:border-[#2563EB] resize-none leading-relaxed transition-all font-medium" 
                placeholder="코드 설명을 입력해주세요."
              />
              <div className="flex justify-end mt-2">
                <span className="text-[12px] text-gray-400 font-medium">{formData.desc.length} / 50</span>
              </div>
            </div>

            {/* 5. 순서 */}
            <div className="mb-10 w-full">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">순서</label>
              <input 
                name="order" 
                type="number" 
                min="1" 
                value={formData.order} 
                onChange={handleChange} 
                className="w-[100px] border border-gray-300 rounded-lg px-4 py-3 text-center outline-none focus:border-[#2563EB] font-medium" 
              />
              <p className="text-[13px] text-gray-400 mt-3 font-medium">* 숫자가 낮을수록 상위에 위치합니다.</p>
            </div>

            {/* 6. 사용 여부 */}
            <div className="mb-10 flex items-center gap-5 pt-2">
              <label className="font-bold text-[16px] text-[#111]">사용 여부</label>
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsRegistered(!isRegistered)} 
                  className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-all ${isRegistered ? 'bg-[#2563EB]' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${isRegistered ? 'translate-x-[26px]' : 'translate-x-0'}`} />
                </button>
                <span className={`text-[14px] font-bold ${isRegistered ? 'text-[#2563EB]' : 'text-gray-400'}`}>{isRegistered ? '사용' : '미사용'}</span>
              </div>
            </div>

            {/* 7. 일시 정보 (구분선 및 가이드 텍스트 포함) */}
            <div className="pt-10 border-t border-gray-100 flex flex-col">
              <div className="mb-10 w-full max-w-[500px]">
                <label className="block font-bold text-[16px] mb-3 text-[#111]">등록 일시</label>
                <input value={formData.regDate} readOnly className="w-full bg-[#F3F4F7] border border-gray-200 rounded-lg px-5 py-4 text-[#999] cursor-not-allowed font-medium outline-none" />
                <p className="text-[13px] text-gray-400 mt-3 font-medium">* 등록 일시는 수정할 수 없습니다.</p>
              </div>
              <div className="w-full max-w-[500px]">
                <label className="block font-bold text-[16px] mb-3 text-[#111]">수정 일시</label>
                <input value={formData.modDate} readOnly className="w-full bg-[#F3F4F7] border border-gray-200 rounded-lg px-5 py-4 text-[#999] cursor-not-allowed font-medium outline-none" />
                <p className="text-[13px] text-gray-400 mt-3 font-medium">* 수정 완료 후 최종 수정 일시가 자동으로 반영됩니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 하단 버튼 구역 */}
        <div className="flex justify-end gap-2 mt-12 max-w-[1000px]">
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="px-8 py-3.5 border border-gray-300 bg-white text-gray-500 rounded-lg font-bold text-[16px] hover:bg-gray-50 transition-colors shadow-sm"
          >
            취소
          </button>
          <button 
            type="button" 
            onClick={() => setIsModalOpen(true)} 
            className="px-8 py-3.5 bg-[#2563EB] text-white rounded-lg font-bold text-[16px] hover:bg-blue-700 shadow-md transition-colors"
          >
            저장
          </button>
        </div>
      </main>

      {/* 확인 모달 */}
      <AdminConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmSave} 
        title="상세코드 내용을 수정하시겠습니까?" 
        message="작성하신 내용이 즉시 저장됩니다." 
        type="save" 
      />
    </div>
  );
};

export default AdminSubCodeEdit;