import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { pressService } from '@/services/api'; 
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import { Paperclip, ExternalLink, Calendar, Eye, Download } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';


//  토스트용 성공 아이콘 컴포넌트 
const SuccessIcon = ({ fill = "#4ADE80" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={fill}/>
    <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AdminPressRelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();
  
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false); // 삭제 진행 중 상태 

  //  토스트 알림 상태 추가
  const [showToast, setShowToast] = useState(false);

// 데이터 불러오기 (백엔드 연동)
  // AdminPressRelDetail.jsx 수정 부분
// 1. 데이터 불러오기 (fetchDetail)
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // API 서비스 함수명이 getPressDetail인지 확인 필요
        const response = await pressService.getPressDetail(id);
        
        if (response) {
          const data = response.data || response;

          console.log(response)
          setFormData(data);
          setBreadcrumbTitle(data.title || data.contentTitle || "보도자료 상세");
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert("데이터를 불러오는데 실패했습니다.");
        navigate('/admin/contents/pressRelList');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
    return () => setBreadcrumbTitle("");
  }, [id, navigate, setBreadcrumbTitle]);

  // 2. 삭제 함수 (반드시 이 위치 - 컴포넌트 레벨에 선언되어야 함)
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // admin.delete가 배열을 받는지, id 단일 값을 받는지 확인 필요
      await pressService.admin.delete([id]); 
      
      setIsDeleteModalOpen(false);
      setShowToast(true);
      
      setTimeout(() => {
        navigate('/admin/contents/pressRelList');
      }, 1500);
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-[#F8F9FB]">
      <div className="text-[18px] font-bold text-gray-500 animate-pulse">데이터를 불러오는 중...</div>
    </div>
  );

  if (!formData) return null;

  return (
    <div className="AdminPressRelDetail relative flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            <SuccessIcon fill="#4ADE80" />
            <span className="font-bold text-[16px]">보도자료가 삭제되었습니다.</span>
          </div>
        </div>
      )}
      <main className="p-10 text-left">
        <h2 className="text-[32px] font-bold mt-2 mb-2 tracking-tight">보도자료 관리</h2>
        
        {/* 상단 버튼 영역 - 기존 스타일 유지 */}
        <div className="flex justify-end gap-2 mb-6 max-w-[1000px]">
          <button 
            onClick={() => navigate('/admin/contents/pressRelList')}
            className="px-6 py-2 border border-gray-300 bg-white text-[#333] rounded-md font-bold text-[15px] hover:bg-gray-50 shadow-sm transition-all"
            disabled={isDeleting} // 삭제 중 클릭 방지
          >
            목록
          </button>
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-6 py-2 bg-[#E1421F] text-white rounded-md font-bold text-[15px] hover:bg-[#c1381a] shadow-sm transition-all
            disabled:opacity-50"
            disabled={isDeleting} // 삭제 중일 때 버튼 비활성화
          >
            삭제
          </button>
          {/* 수정 버튼 (주석 처리 변경) */}
<button 
  onClick={() => navigate(`/admin/contents/pressRelEdit/${id}`)}
  className="px-6 py-2 bg-[#2563EB] text-white rounded-md font-bold text-[15px] hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50" // disabled:opacity-50 추가
  disabled={isDeleting}
>
  수정
</button>
        </div>

        {/* 상세 정보 카드 섹션 */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <div className="flex flex-col space-y-10">
            {/* 관리번호 (DB: contentId) */}
            <div className="flex flex-col">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">관리번호 (ID)</label>
              <div className="w-full bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#666] font-medium">
                {formData.contentId}
              </div>
            </div>

            {/* 등록 방식 (DB: regType) */}
            <div className="flex flex-col">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">등록 방식</label>
              <div className="w-full bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#666] font-medium">
                {formData.regType || '직접등록'}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">제목</label>
              <div className="w-full bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#666] font-medium leading-relaxed">
                {/* ✅ 필드명 매핑 확인 */}
                {formData.title || formData.contentTitle} 
              </div>
            </div>

            {/* 출처 */}
            <div className="flex flex-col">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">출처</label>
              <div className="w-full bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#666] font-medium">
                {formData.source}
              </div>
            </div>

            {/* 원문 링크 (DB: contentLink) */}
            <div className="flex flex-col">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">원문 링크</label>
              {formData.contentLink ? (
                <a 
                  href={formData.contentLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-start justify-between w-full bg-blue-50 border border-blue-200 rounded-lg px-5 py-4 text-[#2563EB] font-bold hover:bg-blue-100 transition-all group"
                >
                  <span className="break-all mr-4 leading-relaxed">{formData.contentLink}</span>
                  <ExternalLink size={18} className="shrink-0 group-hover:translate-x-1 transition-transform mt-1" />
                </a>
              ) : (
                <div className="w-full bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-gray-400 italic">링크 정보가 없습니다.</div>
              )}
            </div>

            <div className="flex flex-col">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">내용</label>
              <div className="w-full bg-[#F9FAFB] border border-200 rounded-xl min-h-[400px] h-auto shadow-sm overflow-hidden">
                <div className="ql-snow !border-none">
                  <div 
                    className="ql-editor !p-10 !leading-relaxed text-[17px] text-[#333]" 
                    // ✅ 필드명 매핑 확인 (body 또는 contentBody)
                    dangerouslySetInnerHTML={{ __html: formData.body || formData.contentBody }} 
                  />
                </div>
              </div>
            </div>

            {/* 첨부파일 (DB: fileList) */}
            <div className="flex flex-col">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">
                첨부파일 ({formData.fileList?.length || 0})
              </label>
              <div className="space-y-3">
                {formData.fileList && formData.fileList.length > 0 ? (
                  formData.fileList.map((file, index) => (
                    <a 
                      key={index} 
                      href={file.url} 
                      download={file.realName} 
                      className="flex items-center justify-between w-full max-w-[800px] bg-white border border-gray-200 px-5 py-4 rounded-lg shadow-sm group hover:border-blue-300 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4 flex-1 overflow-hidden">
                        <Paperclip size={20} className="text-blue-500 shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[15px] font-bold text-[#333] group-hover:text-blue-600 break-all leading-tight">
                            {file.realName}
                          </span>
                          {file.size && (
                            <span className="text-[13px] text-gray-400 mt-1 font-medium">
                              {(file.size / 1024).toFixed(1)} KB
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[13px] font-bold text-gray-400 group-hover:text-blue-500 ml-4 shrink-0">
                        <Download size={16} />
                        <span>다운로드</span>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="text-gray-400 text-[14px] italic text-left">첨부된 파일이 없습니다.</div>
                )}
              </div>
            </div>

            {/* 노출 여부 (DB: visibleYn) */}
            <div className="flex flex-col pt-4">
              <label className="font-bold text-[16px] text-[#111] mb-3">노출 여부</label>
              <div className="flex items-center gap-3">
                <div className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-colors duration-300 ${formData.visibleYn === 'Y' ? 'bg-[#2563EB]' : 'bg-gray-300'}`}>
                  <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${formData.visibleYn === 'Y' ? 'translate-x-[26px]' : 'translate-x-0'}`}></div>
                </div>
                <span className={`text-[14px] font-bold ${formData.visibleYn === 'Y' ? 'text-[#2563EB]' : 'text-gray-400'}`}>
                  {formData.visibleYn === 'Y' ? '노출' : '미노출'}
                </span>
              </div>
            </div>

            {/* 로그 정보 */}
            <div className="pt-10 border-t border-gray-100 flex flex-col space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-gray-400">등록 일시</label>
                <div className="flex items-center gap-2 text-[#666] font-medium">
                  <Calendar size={16} /> {formData.createdAt?.replace('T', ' ')}
                </div>
              </div>
              <div className="flex flex-col gap-1">
  <label className="text-[14px] font-bold text-gray-400">수정 일시</label>
  <div className="flex items-center gap-2 text-[#666] font-medium px-1">
    <Calendar size={16} /> 
    {/* DB 컬럼 last_update_date가 MyBatis를 통해 lastUpdateDate로 넘어옵니다 */}
    {(formData.lastUpdateDate || formData.createdAt)?.replace('T', ' ')}
  </div>
   </div>             
             
            </div>
          </div>
        </section>
      
        <AdminConfirmModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="보도자료를 삭제하시겠습니까?"
          message="삭제된 데이터는 복구할 수 없으며 즉시 삭제됩니다."
          type="delete"
        />
      </main>
    </div>  
  );
};

export default AdminPressRelDetail;