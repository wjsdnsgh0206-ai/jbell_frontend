import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal'; 
import { Calendar, Link as LinkIcon, Info, School, Flame, MapPin } from 'lucide-react';

// React-Quill 설정
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const Block = Quill.import('blots/block');
Block.tagName = 'P'; 
Quill.register(Block, true);

const AdminSafetyEduEdit = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();
  
  const [showToast, setShowToast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // 무한 루프 방지를 위해 초기값 고정
  const [formData, setFormData] = useState({
    introTitle: "전북특별자치도민 안전 교육",
    introContent: "전북특별자치도에서는 도민의 안전의식을 높이고 재난 대응 능력을 기르기 위해 다양한 시민 안전 교육 및 체험 프로그램을 운영하고 있습니다.\n주요 교육 정보 및 신청 방법은 다음과 같습니다.",
    summary119: "태풍, 교통사고, 화재, 지진 등 다양한 재난 상황을 직접 체험하며 위기 탈출 방법을 배울 수 있는 종합 안전 체험 시설입니다.",
    summaryStudent: "유아부터 중학생, 일반 시민까지 폭넓은 연령층을 대상으로 실습 중심의 안전교육을 운영합니다.",
    safety119: {
      usageInfo: `<p><strong>체험객 복장 유의사항</strong></p><p>치마, 구두, 리본, 레이스옷 등의 옷차림 착용 시 체험이 어렵습니다.</p>`,
      mainUrl: "https://www.sobang.kr/safe119/index.sobang?contentsId=40",
      reserveUrl: "https://www.sobang.kr/safe119/index.sobang?menuCd=DOM_000001803003001000"
    },
    studentSafety: {
      guide: `<p><strong>운영 대상 및 신청 방법</strong></p><p>전주 시민 누구나(최소 4명 ~ 최대 10명)</p>`,
      contact: "총무과 안전체험 담당 ☎ 270-1672"
    },
    updatedAt: "2025-05-20 14:30:22"
  });

  useEffect(() => {
    setBreadcrumbTitle("시민안전교육 관리");
    return () => setBreadcrumbTitle("");
  }, [setBreadcrumbTitle]);

  // [에러 해결] handleCancel 함수 정의
  const handleCancel = () => {
    if (isDirty) setIsCancelModalOpen(true);
    else navigate(-1);
  };

  const handleSave = () => setIsModalOpen(true);

  const confirmSave = () => {
    setIsDirty(false);
    setIsModalOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const modules = useMemo(() => ({
    toolbar: [['bold', 'underline'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['clean']],
  }), []);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased">
      {/* 토스트 알림 */}
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span className="font-bold text-[16px]">성공적으로 수정되었습니다.</span>
        </div>
      )}

      {/* 보도자료 스타일: p-10 및 text-left */}
      <main className="p-10 text-left">
        <h2 className="text-[32px] font-bold mb-10 tracking-tight text-[#111]">시민안전교육 수정</h2>

        {/* 상하 배열을 위해 max-w-[1000px] 설정 및 flex-col 유지 */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden max-w-[1000px]">
          <div className="p-10 border-b border-gray-100 bg-gray-50/30">
            <h3 className="text-[22px] font-extrabold text-[#111]">콘텐츠 관리</h3>
          </div>

          <div className="p-10 space-y-12">
            {/* 섹션 1: 도입부 */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#0055aa] border-b border-gray-100 pb-2">
                <Info size={18} />
                <span className="font-bold text-[18px]">공통 도입부</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[14px] font-bold text-gray-400 mb-2 uppercase">메인 타이틀</label>
                  <input className="w-full border border-gray-300 rounded-lg px-5 py-4 font-bold text-[18px] focus:border-[#2563EB] outline-none transition-all" 
                         value={formData.introTitle} onChange={(e) => {setFormData({...formData, introTitle: e.target.value}); setIsDirty(true);}} />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-gray-400 mb-2 uppercase">설명 문구</label>
                  <textarea className="w-full border border-gray-300 rounded-lg px-5 py-4 h-28 resize-none leading-relaxed focus:border-[#2563EB] outline-none transition-all" 
                            value={formData.introContent} onChange={(e) => {setFormData({...formData, introContent: e.target.value}); setIsDirty(true);}} />
                </div>
              </div>
            </div>

            {/* 섹션 2: 요약 정보 (무조건 상하 배열) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-gray-700 border-b border-gray-100 pb-2">
                <MapPin size={18} />
                <span className="font-bold text-[18px]">주요 시설 요약</span>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[14px] font-bold text-gray-400 mb-2 uppercase">전북119안전체험관 요약</label>
                  <textarea className="w-full border border-gray-300 rounded-lg p-4 h-24 text-[15px] focus:border-[#2563EB] outline-none"
                            value={formData.summary119} onChange={(e) => {setFormData({...formData, summary119: e.target.value}); setIsDirty(true);}} />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-gray-400 mb-2 uppercase">전주학생교육문화관 요약</label>
                  <textarea className="w-full border border-gray-300 rounded-lg p-4 h-24 text-[15px] focus:border-[#2563EB] outline-none"
                            value={formData.summaryStudent} onChange={(e) => {setFormData({...formData, summaryStudent: e.target.value}); setIsDirty(true);}} />
                </div>
              </div>
            </div>

            {/* 섹션 3: 119안전체험관 상세 */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#e15141] border-b border-gray-100 pb-2">
                <Flame size={18} />
                <span className="font-bold text-[18px]">전북소방119안전체험관 상세</span>
              </div>
              <div className="space-y-6">
                <div className="custom-quill">
                  <label className="block text-[15px] font-bold mb-3 text-gray-700">이용안내 에디터</label>
                  <ReactQuill theme="snow" value={formData.safety119.usageInfo} modules={modules} 
                              onChange={(val) => { if(val !== formData.safety119.usageInfo) { setFormData({...formData, safety119: {...formData.safety119, usageInfo: val}}); setIsDirty(true); }}} />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[14px] font-bold text-gray-400 mb-1 uppercase tracking-tight">공식 홈페이지 주소</label>
                    <input className="w-full border border-gray-300 rounded-lg px-4 py-3 text-blue-600 focus:border-[#2563EB] outline-none font-medium" 
                           value={formData.safety119.mainUrl} onChange={(e) => {setFormData({...formData, safety119: {...formData.safety119, mainUrl: e.target.value}}); setIsDirty(true);}} />
                  </div>
                  <div>
                    <label className="block text-[14px] font-bold text-gray-400 mb-1 uppercase tracking-tight">체험예약 주소</label>
                    <input className="w-full border border-gray-300 rounded-lg px-4 py-3 text-blue-600 focus:border-[#2563EB] outline-none font-medium" 
                           value={formData.safety119.reserveUrl} onChange={(e) => {setFormData({...formData, safety119: {...formData.safety119, reserveUrl: e.target.value}}); setIsDirty(true);}} />
                  </div>
                </div>
              </div>
            </div>

            {/* 섹션 4: 학생교육문화관 상세 */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#2563EB] border-b border-gray-100 pb-2">
                <School size={18} />
                <span className="font-bold text-[18px]">전주학생교육문화관 상세</span>
              </div>
              <div className="space-y-6">
                <div className="custom-quill">
                  <label className="block text-[15px] font-bold mb-3 text-gray-700">운영 안내 에디터</label>
                  <ReactQuill theme="snow" value={formData.studentSafety.guide} modules={modules} 
                              onChange={(val) => { if(val !== formData.studentSafety.guide) { setFormData({...formData, studentSafety: {...formData.studentSafety, guide: val}}); setIsDirty(true); }}} />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-gray-400 mb-2 uppercase">운영 문의 연락처</label>
                  <input className="w-full border border-gray-300 rounded-lg px-5 py-4 font-bold text-gray-700 focus:border-[#2563EB] outline-none" 
                         value={formData.studentSafety.contact} onChange={(e) => {setFormData({...formData, studentSafety: {...formData.studentSafety, contact: e.target.value}}); setIsDirty(true);}} />
                </div>
              </div>
            </div>
          </div>

          {/* 푸터 영역 */}
          <div className="p-10 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-400 font-medium text-[14px]">
              <Calendar size={16} /> 최종 업데이트: {formData.updatedAt}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={handleCancel} className="px-8 py-3.5 border border-gray-300 bg-white text-gray-500 rounded-lg font-bold hover:bg-gray-50 transition-all">취소</button>
              <button type="button" onClick={handleSave} className="px-10 py-3.5 bg-[#2563EB] text-white rounded-lg font-bold shadow-lg shadow-blue-100 hover:bg-[#1d4ed8] transition-all">설정 저장하기</button>
            </div>
          </div>
        </div>
      </main>

      {/* 모달 */}
      <AdminConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={confirmSave} title="설정을 저장하시겠습니까?" message="사용자 페이지에 즉시 적용됩니다." type="save" />
      <AdminConfirmModal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} onConfirm={() => navigate(-1)} title="수정을 취소하시겠습니까?" message="작성 중인 내용은 저장되지 않습니다." type="delete" />
    </div>
  );
};

export default AdminSafetyEduEdit;