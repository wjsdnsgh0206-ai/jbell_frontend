import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios'; // API 연동 추가
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import { Calendar } from 'lucide-react';

// 토스트용 성공 아이콘 컴포넌트 (유지)
const SuccessIcon = ({ fill = "#4ADE80" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={fill}/>
    <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AdminGroupCodeDetail = () => {
  const { id } = useParams(); // 목록에서 navigate 시 id로 groupCode를 넘겨줌
  const { setBreadcrumbTitle } = useOutletContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // 날짜의 'T'를 공백으로 치환하는 함수
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '-';
    return dateTimeStr.replace('T', ' ');
  };

  // 데이터 로드 로직 (DB 연동)
  const fetchDetail = useCallback(async () => {
    try {
      // 서버에서 특정 그룹 코드 정보를 가져오는 API (엔드포인트는 환경에 맞게 조정)
      const response = await axios.get(`/api/common/code/groups/${id}`);
      const data = response.data;
      setFormData(data);
      setBreadcrumbTitle(data.groupName);
    } catch (error) {
      console.error("그룹코드 상세 로드 실패:", error);
      alert("데이터를 불러오는데 실패했습니다.");
    }
  }, [id, setBreadcrumbTitle]);

  useEffect(() => {
    fetchDetail();
    return () => setBreadcrumbTitle("");
  }, [fetchDetail, setBreadcrumbTitle]);

  if (!formData) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setIsDeleteModalOpen(false);

    try {
      // [수정] 실제 DB 삭제 API 호출
      await axios.delete(`/api/common/code/groups/${id}`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/admin/system/commonCodeList');
      }, 1500);
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            <SuccessIcon />
            <span className="font-bold text-[16px]">그룹 코드가 삭제되었습니다.</span>
          </div>
        </div>
      )}

      <main className="p-10 text-left">
        <h2 className="text-[32px] font-bold mt-2 mb-2 tracking-tight">공통코드관리</h2>
        
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

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] tracking-tight border-b-2 border-gray-100 pb-3">
            그룹 코드 정보
          </h3>
          
          <div className="flex flex-col space-y-10">
            <div>
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 ID</label>
              <input 
                value={formData.groupCode || ''} 
                readOnly 
                className="w-full max-w-[500px] bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#666] outline-none cursor-default transition-all" 
              />
            </div>

            <div>
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 명</label>
              <input 
                value={formData.groupName || ''} 
                readOnly 
                className="w-full max-w-[500px] bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#666] outline-none cursor-default transition-all" 
              />
            </div>

            <div>
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 설명</label>
              <textarea 
                value={formData.desc || '설명이 없습니다.'} 
                readOnly 
                rows="2" 
                className="w-full max-w-[600px] bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#666] outline-none resize-none leading-[22px] cursor-default transition-all" 
              />
            </div>

            <div>
              <label className="block font-bold text-[16px] mb-3 text-[#111]">순서</label>
              <input 
                value={formData.order || '0'} 
                readOnly 
                className="w-[100px] bg-[#F9FAFB] border border-gray-300 rounded-lg px-4 py-3 text-[#666] text-center outline-none cursor-default" 
              />
              <p className="text-[13px] text-gray-400 mt-3 font-medium">* 숫자가 낮을수록 리스트 상단에 노출됩니다.</p>
            </div>

            <div className="flex items-center gap-5 pt-2">
              <label className="font-bold text-[16px] text-[#111]">사용 여부</label>
              <div className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-colors duration-300 ${formData.visible ? 'bg-[#2563EB]' : 'bg-gray-300'}`}>
                  <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${formData.visible ? 'translate-x-[26px]' : 'translate-x-0'}`}></div>
              </div>
              <span className={`text-[14px] font-bold ${formData.visible ? 'text-[#2563EB]' : 'text-gray-400'}`}>
                  {formData.visible ? '사용' : '미사용'}
              </span>
            </div>

            <div className="pt-10 border-t border-gray-100 flex flex-col space-y-8">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-gray-400">등록 일시</label>
                <div className="flex items-center gap-2 text-[#999] font-medium px-1">
                  <Calendar size={16} className="text-gray-300" /> 
                  {/* [수정] formatDateTime 적용 */}
                  {formatDateTime(formData.createdAt)}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-gray-400">수정 일시</label>
                <div className="flex items-center gap-2 text-[#999] font-medium px-1">
                  <Calendar size={16} className="text-gray-300" /> 
                  {/* [수정] formatDateTime 적용 */}
                  {formatDateTime(formData.updatedAt || formData.createdAt)}
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