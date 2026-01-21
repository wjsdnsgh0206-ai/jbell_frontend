import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { pressData } from '@/pages/user/openboards/BoardData'; 
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false); // 삭제 진행 중 상태 

  //  토스트 알림 상태 추가
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // 데이터 매칭
    const detailData = pressData.find(item => item.id.toString() === id.toString());
    
    if (detailData) {
      setFormData(detailData);
      setBreadcrumbTitle(detailData.title);
    } else {
      alert("해당 보도자료를 찾을 수 없습니다.");
      navigate('/admin/contents/pressRelList');
    }
    
    return () => setBreadcrumbTitle("");
  }, [id, navigate, setBreadcrumbTitle]);

  const handleDelete = () => {
    setIsDeleting(true); // 버튼 등 추가 조작 방지
    setIsDeleteModalOpen(false); // 모달 닫기

    //  실제 데이터 삭제 로직 (더미 데이터 사용 시 인덱스 찾아서 제거)
    const index = pressData.findIndex(item => item.id.toString() === id.toString());
    if (index !== -1) {
      pressData.splice(index, 1);
    }

    setShowToast(true); // 토스트 표시
    // 1.5초 후 목록으로 이동
    setTimeout(() => {
      setShowToast(false);
      navigate('/admin/contents/pressRelList');
    }, 1500);
  };

  if (!formData) return null;

  return (
    <div className="AdminPressRelDetail relative flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
       {/* ✅ 토스트 알림 UI 추가 */}
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
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] tracking-tight border-b-2 border-gray-100 pb-3">
            보도자료 정보
          </h3>
          
          <div className="flex flex-col space-y-10">
            {/* 1단 배치 시작: 모든 항목을 flex-col로 변경 */}
            
            {/* 관리번호 */}
            <div className="flex flex-col">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">관리번호 (ID)</label>
              <div className="w-full bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#666] font-medium">
                {formData.mgmtId}
              </div>
            </div>

            {/* 등록 방식 */}
            <div className="flex flex-col">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">등록 방식</label>
              <div className="w-full bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#666] font-medium">
                {formData.regType}
              </div>
            </div>

            {/* 제목 */}
            <div className="flex flex-col">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">제목</label>
              <div className="w-full bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#111] font-bold text-[18px]">
                {formData.title}
              </div>
            </div>

            {/* 출처 */}
            <div className="flex flex-col">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">출처</label>
              <div className="w-full bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#666] font-medium">
                {formData.source}
              </div>
            </div>

            {/* 원문 링크 */}
            <div className="flex flex-col">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">원문 링크</label>
              {formData.sourceUrl ? (
                <a 
                  href={formData.sourceUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  title={formData.sourceUrl} // 마우스 호버 시 전체 주소 툴팁 표시
                  className="flex items-start justify-between w-full bg-blue-50 border border-blue-200 rounded-lg px-5 py-4 text-[#2563EB] font-bold hover:bg-blue-100 transition-all group"
                >
                  {/* truncate 대신 break-all을 쓰면 주소가 길어도 다음 줄로 넘어가며 다 보입니다 */}
                  <span className="break-all mr-4 leading-relaxed">{formData.sourceUrl}</span>
                  <ExternalLink size={18} className="shrink-0 group-hover:translate-x-1 transition-transform mt-1" />
                </a>
              ) : (
                <div className="w-full bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-gray-400">링크 없음</div>
              )}
            </div>

{/* 수정된 내용 출력 영역 */}
<div className="flex flex-col">
  <label className="block font-bold text-[16px] mb-3 text-[#111]">내용</label>
  <div className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl p-8 min-h-[300px] text-[#333] overflow-y-auto">
    {/* Quill 테마를 적용하기 위해 ql-container와 ql-snow 클래스가 필수입니다 */}
    <div className="ql-container ql-snow" style={{ border: 'none' }}>
  <div 
    className="ql-editor" //  이 클래스가 있어야 CSS 설정이 먹힙니다.
    dangerouslySetInnerHTML={{ __html: formData.content }} 
  />
</div>
  </div>
</div>

            {/* 첨부파일 - 실제 다운로드 가능하도록 수정 */}
            <div className="flex flex-col">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">
                첨부파일 ({formData.files.length})
              </label>
              <div className="space-y-3">
                {formData.files.length > 0 ? (
                  formData.files.map((file, index) => (
                    <a 
                      key={index} 
                      href={file.url} 
                      download={file.name} 
                      className="flex items-center justify-between w-full max-w-[800px] bg-white border border-gray-200 px-5 py-4 rounded-lg shadow-sm group hover:border-blue-300 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4 flex-1 overflow-hidden">
                        <Paperclip size={20} className="text-blue-500 shrink-0" />
                        <div className="flex flex-col min-w-0">
                          {/* 파일명 */}
                          <span className="text-[15px] font-bold text-[#333] group-hover:text-blue-600 break-all leading-tight">
                            {file.name}
                          </span>
                          {/* 파일 용량 표시 추가 */}
                          {file.size && (
                            <span className="text-[13px] text-gray-400 mt-1 font-medium">
                              {file.size}
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
                  <div className="text-gray-400 text-[14px] italic text-left">
                    첨부된 파일이 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* 노출 여부 */}
            <div className="flex flex-col pt-4">
              <label className="font-bold text-[16px] text-[#111] mb-3">노출 여부</label>
              <div className="flex items-center gap-3">
                <div className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-colors duration-300 ${formData.isPublic ? 'bg-[#2563EB]' : 'bg-gray-300'}`}>
                  <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${formData.isPublic ? 'translate-x-[26px]' : 'translate-x-0'}`}></div>
                </div>
                <span className={`text-[14px] font-bold ${formData.isPublic ? 'text-[#2563EB]' : 'text-gray-400'}`}>
                  {formData.isPublic ? '노출' : '미노출'}
                </span>
              </div>
            </div>

            {/* 로그 정보 (등록일/수정일/조회수) */}
            <div className="pt-10 border-t border-gray-100 flex flex-col space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-gray-400">등록 일시</label>
                <div className="flex items-center gap-2 text-[#666] font-medium">
                  <Calendar size={16} /> {formData.createdAt}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-gray-400">수정 일시</label>
                <div className="flex items-center gap-2 text-[#666] font-medium">
                  <Calendar size={16} /> {formData.updatedAt}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-gray-400">조회수</label>
                <div className="flex items-center gap-2 text-[#666] font-medium">
                  <Eye size={16} /> {formData.views.toLocaleString()}회
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