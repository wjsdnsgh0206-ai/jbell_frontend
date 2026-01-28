import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { codeService } from '@/services/api'; // codeService 임포트
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import { Calendar } from 'lucide-react';

const SuccessIcon = ({ fill = "#4ADE80" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={fill}/>
    <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AdminSubCodeDetail = () => {
  // route-sh.jsx의 설정에 맞춰 groupId와 itemId를 가져옵니다.
  const { groupId, itemId } = useParams(); 
  const { setBreadcrumbTitle } = useOutletContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '-';
    return dateTimeStr.replace('T', ' ').split('.')[0]; 
  };

  const fetchDetail = useCallback(async () => {
    // 이제 groupId와 itemId가 정상적으로 출력될 것입니다.
    console.log("현재 파라미터:", { groupId, itemId });
    
    if (!groupId || !itemId) {
        console.error("groupId 또는 itemId가 없습니다.");
        return;
    }
    
    try {
      setIsLoading(true); // 로딩 상태 변수명 확인 (loading 인지 setIsLoading 인지)
      
      // 서비스 호출 시 인자 2개 전달
      const response = await codeService.getCodeItem(groupId, itemId);
      
      console.log("서버 응답 데이터:", response);

      // codeService에서 이미 response.data를 반환한다면 바로 response 사용
      const actualData = response.data || response; 
      
      if (actualData) {
        setFormData(actualData);
        setBreadcrumbTitle(actualData.subName || "상세 코드 정보");
      }
    } catch (error) {
      console.error("상세코드 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [groupId, itemId, setBreadcrumbTitle]);

  useEffect(() => {
    fetchDetail();
    return () => setBreadcrumbTitle("");
  }, [fetchDetail]);

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-[#F8F9FB]">
        <div className="text-lg font-bold text-gray-400">데이터를 불러오는 중...</div>
      </div>
    );
  }

  // 데이터 로드 실패 시 표시
  if (!formData) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-[#F8F9FB]">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-400 mb-4">데이터를 찾을 수 없습니다.</p>
          <button onClick={() => navigate(-1)} className="text-blue-500 font-bold underline">뒤로 가기</button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    setIsDeleting(true); 
    setIsDeleteModalOpen(false);

    try {
      // axios 대신 codeService.deleteItem 사용
      await codeService.deleteItem(groupId, itemId);
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
            <span className="font-bold text-[16px]">상세 코드가 삭제되었습니다.</span>
          </div>
        </div>
      )}

      <main className="p-10 text-left">
        <h2 className="text-[32px] font-bold mt-2 mb-2 tracking-tight">공통 코드 관리</h2>
        
        <div className="flex justify-end gap-2 mb-6 max-w-[1000px]">
          <button 
            onClick={() => navigate('/admin/system/commonCodeList')}
            className="px-6 py-2 border border-gray-300 bg-white text-[#333] rounded-md font-bold text-[15px] hover:bg-gray-50 shadow-sm transition-all"
            disabled={isDeleting}
          >
            목록
          </button>
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-6 py-2 bg-[#E1421F] text-white rounded-md font-bold text-[15px] hover:bg-[#c1381a] shadow-sm transition-all"
            disabled={isDeleting}
          >
            삭제
          </button>
          <button 
            // 수정 페이지로 이동 시 groupId와 itemId를 함께 넘겨줍니다.
            onClick={() => navigate(`/admin/system/subCodeEdit/${groupId}/${itemId}`)}
            className="px-6 py-2 bg-[#2563EB] text-white rounded-md font-bold text-[15px] hover:bg-blue-700 shadow-sm transition-all"
            disabled={isDeleting}
          >
            수정
          </button>
        </div>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] tracking-tight border-b-2 border-gray-100 pb-3">
            상세 코드 정보
          </h3>
          
          <div className="flex flex-col space-y-10">
            <div>
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드</label>
              <div className="w-full max-w-[500px] bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#666] font-medium">
                {formData.groupCode} ({formData.groupName || '명칭 없음'})
              </div>
            </div>

            <div>
              <label className="block font-bold text-[16px] mb-3 text-[#111]">상세 코드 ID</label>
              <div className="w-full max-w-[500px] bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#666] font-medium">
                {formData.subCode}
              </div>
            </div>

            <div>
              <label className="block font-bold text-[16px] mb-3 text-[#111]">상세 코드명</label>
              <div className="w-full max-w-[500px] bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#666] font-medium">
                {formData.subName}
              </div>
            </div>

            <div>
              <label className="block font-bold text-[16px] mb-3 text-[#111]">상세 코드 설명</label>
              <div className="w-full max-w-[600px] bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#666] min-h-[80px] whitespace-pre-wrap leading-relaxed font-medium">
                {formData.desc || '설명이 없습니다.'}
              </div>
            </div>

            <div>
              <label className="block font-bold text-[16px] mb-3 text-[#111]">순서</label>
              <div className="w-[100px] bg-[#F9FAFB] border border-gray-300 rounded-lg px-4 py-3 text-[#666] text-center font-medium">
                {formData.order}
              </div>
            </div>

            <div className="flex items-center gap-5 pt-2">
              <label className="font-bold text-[16px] text-[#111]">사용 여부</label>
              <div className="flex items-center gap-3">
                <div className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-colors duration-300 ${formData.visible ? 'bg-[#2563EB]' : 'bg-gray-300'}`}>
                  <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${formData.visible ? 'translate-x-[26px]' : 'translate-x-0'}`}></div>
                </div>
                <span className={`text-[14px] font-bold ${formData.visible ? 'text-[#2563EB]' : 'text-gray-400'}`}>
                  {formData.visible ? '사용' : '미사용'}
                </span>
              </div>
            </div>

            <div className="pt-10 border-t border-gray-100 flex flex-col space-y-8">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-gray-400">등록 일시</label>
                <div className="flex items-center gap-2 text-[#999] font-medium px-1">
                  <Calendar size={16} className="text-gray-300" /> 
                  {formatDateTime(formData.createdAt)}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-gray-400">수정 일시</label>
                <div className="flex items-center gap-2 text-[#999] font-medium px-1">
                  <Calendar size={16} className="text-gray-300" /> 
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
        title="상세 코드를 삭제하시겠습니까?"
        message="삭제된 데이터는 복구할 수 없으며 즉시 삭제됩니다."
        type="delete"
      />
    </div>
  );
};

export default AdminSubCodeDetail;