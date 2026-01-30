// src/pages/admin/safetyEducation/AdminSafetyEduDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { safetyEduService } from '@/services/api';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import { ExternalLink, Calendar, Phone, CheckCircle, Link as LinkIcon } from 'lucide-react';

// [내부용 작은 컴포넌트]
const SuccessIcon = ({ fill = "#4ADE80" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={fill}/>
    <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/**
 * [관리자] 시민안전교육 상세 조회 페이지
 */
const AdminSafetyEduDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  // ==================================================================================
  // 1. 상태 관리 (State Management)
  // ==================================================================================
  
  // [데이터 상태]
  const [formData, setFormData] = useState(null);
  // [UI 상태] 모달 및 토스트
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // ==================================================================================
  // 2. API 호출 (API Calls)
  // ==================================================================================

  // [API 호출] 상세 조회
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await safetyEduService.getSafetyEduDetail(id);
        setFormData(data);
        setBreadcrumbTitle(data.title);
      } catch (error) {
        console.error("상세 조회 실패:", error);
        alert("해당 교육 정보를 찾을 수 없습니다.");
        navigate('/admin/contents/safetyEduList');
      }
    };
    fetchDetail();
    
    return () => setBreadcrumbTitle("");
  }, [id, navigate, setBreadcrumbTitle]);

  // [API 호출] 삭제
  const handleDelete = async () => {
    try {
      await safetyEduService.deleteSafetyEdu(id);
      setIsDeleteModalOpen(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/admin/contents/safetyEduList');
      }, 1500);
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (!formData) return null;

  // ==================================================================================
  // 3. UI 렌더링
  // ==================================================================================
  return (
    <div className="relative flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            <SuccessIcon fill="#4ADE80" />
            <span className="font-bold text-[16px]">시민안전교육 정보가 삭제되었습니다.</span>
          </div>
        </div>
      )}

      <main className="p-10 text-left">
        {/* Header Area */}
        <h2 className="text-[32px] font-bold mt-2 mb-2 tracking-tight">시민안전교육 관리</h2>
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mb-6 max-w-[1000px]">
          <button 
            onClick={() => navigate('/admin/contents/safetyEduList')}
            className="px-6 py-2 border border-gray-300 bg-white text-[#333] rounded-md font-bold text-[15px] hover:bg-gray-50 shadow-sm transition-all"
          >
            목록
          </button>
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-6 py-2 bg-[#E1421F] text-white rounded-md font-bold text-[15px] hover:bg-[#c1381a] shadow-sm transition-all"
          >
            삭제
          </button>
          <button 
            onClick={() => navigate(`/admin/contents/safetyEduEdit/${id}`)}
            className="px-6 py-2 bg-[#2563EB] text-white rounded-md font-bold text-[15px] hover:bg-blue-700 shadow-sm transition-all"
          >
            수정
          </button>
        </div>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] tracking-tight border-b-2 border-gray-100 pb-3">
            시민안전교육 정보
          </h3>
          
          <div className="flex flex-col space-y-10">
            {/* 1. 기본 정보 */}
            <div className="flex flex-col">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">관리번호 (ID)</label>
              <div className="w-full bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#666] font-medium font-mono text-[15px]">
                {formData.mgmtId}
              </div>
            </div>
            
            <div className="flex flex-col">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">시설명(교육명)</label>
              <div className="w-full bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#111] font-bold text-[18px]">
                {formData.title}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">내용 요약</label>
              <div className="w-full bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-4 text-[#444] leading-relaxed">
                {formData.summary}
              </div>
            </div>

            {/* 2. 교육 세부 내용 (Sections) */}
            <div className="flex flex-col">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">교육 세부 내용</label>
              <div className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl p-8 space-y-8">
                {formData.sections && formData.sections.map((section, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h4 className="flex items-center gap-2 text-[#0066cc] font-extrabold text-[18px] mb-4 border-b border-blue-50 pb-2">
                      <CheckCircle size={18} /> {section.subTitle}
                    </h4>
                    <div className="space-y-2">
                      {section.items && section.items.map((item, iIdx) => (
                        <p key={iIdx} className={`
                          text-[16px] leading-relaxed
                          ${item.type === 'bold' ? 'font-bold text-black' : 'text-gray-700'}
                          ${item.type === 'indent' ? 'pl-4 border-l-2 border-gray-100 ml-1' : ''}
                          ${item.type === 'gray' ? 'text-gray-400 text-[15px]' : ''}
                        `}>
                          {item.text}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. 링크 정보 */}
            <div className="grid grid-cols-1 gap-10">
              <div className="flex flex-col">
                <label className="block font-bold text-[16px] mb-3 text-[#111]">출처 및 원문</label>
                <a href={formData.sourceUrl} target="_blank" rel="noreferrer" className="flex items-start justify-between w-full bg-blue-50 border border-blue-200 rounded-lg px-5 py-4 text-[#2563EB] font-bold hover:bg-blue-100 transition-all group">
                  <div className="flex flex-col min-w-0 pr-4">
                    <span className="text-[15px] text-[#111] mb-1">{formData.source}</span>
                    <span className="break-all text-[13px] font-medium text-blue-400 font-mono italic">{formData.sourceUrl}</span>
                  </div>
                  <ExternalLink size={18} className="shrink-0 mt-1" />
                </a>
              </div>

              <div className="flex flex-col">
                <label className="block font-bold text-[16px] mb-3 text-[#111]">관련 사이트 링크 (본문)</label>
                <div className="flex flex-col gap-4 bg-[#F9FAFB] border border-gray-200 rounded-xl p-6">
                  {formData.links && formData.links.map((link, idx) => (
                    <div key={idx} className="flex flex-col pb-4 last:pb-0 border-b last:border-0 border-gray-200">
                      <a href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#0066cc] font-bold text-[17px] hover:underline w-fit">
                        <LinkIcon size={16} className="text-blue-400" /> {link.label}
                      </a>
                      <span className="text-gray-500 text-[13px] mt-1 ml-6 font-mono">{link.url}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. 기타 정보 */}
            <div className="flex flex-col">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">안내 사항</label>
              <div className="w-full bg-[#FFFBEB] border border-[#FEF3C7] rounded-lg px-5 py-4 text-[#92400E] font-medium">{formData.footerNotice}</div>
            </div>

            <div className="flex flex-col">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">문의처</label>
              <div className="w-full bg-white border border-gray-300 rounded-lg px-5 py-4 flex items-center gap-3 text-[#111] font-bold shadow-sm">
                <Phone size={18} className="text-[#2563EB]" />
                <span className="text-[17px]">{formData.contact}</span>
              </div>
            </div>

            {/* 5. 관리 정보 (순서, 노출여부, 날짜) */}
            <div className="flex flex-col pt-4 border-t border-gray-50">
              <label className="font-bold text-[16px] text-[#111] mb-3">순서</label>
              <div className="flex flex-col gap-2">
                <div className="w-[80px] bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#2563EB] font-bold text-[18px] text-center shadow-sm">
                  {formData.orderNo || "1"}
                </div>
                <p className="text-[13px] text-gray-400">
                  * 숫자가 낮을수록 리스트 상단에 노출됩니다.
                </p>
              </div>
            </div>

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

            <div className="pt-10 border-t border-gray-100 flex flex-col space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-gray-400 uppercase tracking-wider">등록 일시</label>
                <div className="flex items-center gap-2 text-[#666] font-medium">
                  <Calendar size={16} /> {formData.createdAt && formData.createdAt.replace('T', ' ')}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-gray-400 uppercase tracking-wider">수정 일시</label>
                <div className="flex items-center gap-2 text-[#666] font-medium">
                  <Calendar size={16} /> {formData.updatedAt && formData.updatedAt.replace('T', ' ')}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modal */}
        <AdminConfirmModal 
          isOpen={isDeleteModalOpen} 
          onClose={() => setIsDeleteModalOpen(false)} 
          onConfirm={handleDelete} 
          title="교육 정보를 삭제하시겠습니까?" 
          message="삭제된 데이터는 복구할 수 없으며 즉시 삭제됩니다." 
          type="delete" 
        />
      </main>
    </div>  
  );
};

export default AdminSafetyEduDetail;