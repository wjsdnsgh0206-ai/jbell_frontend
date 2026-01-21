import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { AdminCommonCodeData } from './AdminCommonCodeData';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import { Calendar } from 'lucide-react';

//  토스트용 성공 아이콘 컴포넌트 
const SuccessIcon = ({ fill = "#4ADE80" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={fill}/>
    <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AdminGroupCodeDetail = () => {
  const { id } = useParams();
  const { setBreadcrumbTitle } = useOutletContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 삭제 진행 중 및 토스트 노출 여부
  const [isDeleting, setIsDeleting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
      const found = AdminCommonCodeData.find(item => item.id === parseInt(id));
      if (found) {
        // 레이아웃의 breadcrumbTitle 상태를 업데이트 -> 브레드크럼이 즉시 바뀜
        setBreadcrumbTitle(found.groupName); 
      }
      
      // 페이지를 나갈 때는 초기화 (Clean-up)
      return () => setBreadcrumbTitle("");
    }, [id, setBreadcrumbTitle]);

  useEffect(() => {
    const detailData = AdminCommonCodeData.find(item => item.id === parseInt(id));
    if (detailData) {
      setFormData(detailData);
    }
  }, [id]);

  if (!formData) return null;

  const handleDelete = () => {
    setIsDeleting(true); // 버튼 비활성화 시작
    setIsDeleteModalOpen(false); // 모달 닫기

    // 실제 데이터 배열에서 제거 (더미 데이터인 경우)
    const index = AdminCommonCodeData.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
      AdminCommonCodeData.splice(index, 1);
    }

    setShowToast(true); // 토스트 띄우기

    // 1.5초 후 목록으로 이동
    setTimeout(() => {
      setShowToast(false);
      navigate('/admin/system/commonCodeList');
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      {/* ✅ 토스트 알림 UI */}
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            <SuccessIcon />
            <span className="font-bold text-[16px]">그룹 코드가 삭제되었습니다.</span>
          </div>
        </div>
      )}

      <main className="p-10 text-left">
        {/* 상단 제목 */}
        <h2 className="text-[32px] font-bold mt-2 mb-2 tracking-tight">공통코드관리</h2>
        
        {/* 상단 버튼 영역 (제목 아래, 본문 위) */}
        <div className="flex justify-end gap-2 mb-6 max-w-[1000px]">
          <button 
            onClick={() => navigate('/admin/system/commonCodeList')}
            className="px-6 py-2 border border-gray-300 bg-white text-[#333] rounded-md font-bold text-[15px] hover:bg-gray-50 shadow-sm transition-all disabled:opacity-50"
             disabled={isDeleting} 
          >
            목록
          </button>
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-6 py-2 bg-[#E1421F] text-white rounded-md font-bold text-[15px] hover:bg-[#c1381a] shadow-sm transition-all disabled:opacity-50"
            disabled={isDeleting}
          >
            삭제
          </button>
          <button 
            onClick={() => navigate(`/admin/system/groupCodeEdit/${id}`)}
            className="px-6 py-2 bg-[#2563EB] text-white rounded-md font-bold text-[15px] hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50"
            disabled={isDeleting}
          >
            수정
          </button>
        </div>

        {/* 메인 정보 카드 섹션 (p-14 적용) */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] tracking-tight border-b-2 border-gray-100 pb-3">
            그룹 코드 정보
          </h3>
          
          <div className="flex flex-col space-y-10">
            {/* 그룹 코드 ID: 보더를 gray-300으로 조금 더 진하게 조정 */}
            <div>
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 ID</label>
              <input 
                value={formData.groupCode} 
                readOnly 
                className="w-full max-w-[500px] bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#666] outline-none cursor-default transition-all" 
              />
            </div>

            {/* 그룹 코드 명 */}
            <div>
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 명</label>
              <input 
                value={formData.groupName} 
                readOnly 
                className="w-full max-w-[500px] bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#666] outline-none cursor-default transition-all" 
              />
            </div>

            {/* 그룹 코드 설명 */}
            <div>
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 설명</label>
              <textarea 
                value={formData.desc || '설명이 없습니다.'} 
                readOnly 
                rows="2" 
                className="w-full max-w-[600px] bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#666] outline-none resize-none leading-[22px] cursor-default transition-all" 
              />
            </div>

            {/* 순서 (수직 배치) */}
            <div>
              <label className="block font-bold text-[16px] mb-3 text-[#111]">순서</label>
              <input 
                value={formData.order} 
                readOnly 
                className="w-[100px] bg-[#F9FAFB] border border-gray-300 rounded-lg px-4 py-3 text-[#666] text-center outline-none cursor-default" 
              />
              <p className="text-[13px] text-gray-400 mt-3 font-medium">* 숫자가 낮을수록 리스트 상단에 노출됩니다.</p>
            </div>

            {/* 그룹코드 상세페이지 - 등록 여부 (가로 배치) */}
            <div className="flex items-center gap-5 pt-2">
            <label className="font-bold text-[16px] text-[#111]">사용 여부</label>
            {/* 상세페이지이므로 button 대신 div 사용, transition-colors duration-300 추가 */}
            <div className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-colors duration-300 ${formData.visible ? 'bg-[#2563EB]' : 'bg-gray-300'}`}>
                <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${formData.visible ? 'translate-x-[26px]' : 'translate-x-0'}`}></div>
            </div>
            <span className={`text-[14px] font-bold ${formData.visible ? 'text-[#2563EB]' : 'text-gray-400'}`}>
                {formData.visible ? '사용' : '미사용'}
            </span>
            </div>
            {/* 로그 정보 영역 (등록/수정 일시 스타일 통일) */}
            <div className="pt-10 border-t border-gray-100 flex flex-col space-y-8">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-gray-400">등록 일시</label>
                <div className="flex items-center gap-2 text-[#999] font-medium px-1">
                  <Calendar size={16} className="text-gray-300" /> 
                  {formData.date || '2025-05-20 06:00'}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-gray-400">수정 일시</label>
                <div className="flex items-center gap-2 text-[#999] font-medium px-1">
                  <Calendar size={16} className="text-gray-300" /> 
                  {formData.editDate || formData.date || '2025-05-20 06:00'}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AdminConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="그룹 코드를 삭제하시겠습니까?"
        message="삭제된 데이터는 복구할 수 없으며 즉시 삭제됩니다."
        type="delete"
      />
    </div>
  );
};

export default AdminGroupCodeDetail;