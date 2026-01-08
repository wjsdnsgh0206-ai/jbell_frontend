import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Lock, Unlock } from 'lucide-react';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';



const QnAFormPage = () => {
  const navigate = useNavigate();
// --- Breadcrumb 데이터 설정 ---
  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "고객센터", path: "/qna", hasIcon: false },
    { label: "1:1문의", path: "/qna", hasIcon: false },
    { label: "1:1문의하기", path: "/qna/form", hasIcon: false },
  ];
// 상태 관리
  const [isPublic, setIsPublic] = useState(true); // 공개: true, 비공개: false
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false); // 성공 메시지 표시 여부

// == 핸들러
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0].name);
        }
    };

    const handleSubmit = () => {
        if (!title || !content || !category) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
// API 호출 로직 시뮬레이션
    console.log({ isPublic, category, title, content, file });
    
// 성공 메시지 보여주기
    setShowSuccess(true);

// 2초 뒤 목록으로 자동 이동
    setTimeout(() => {
      navigate('/qna');
    }, 2000);
    
  };

  return (
    <div className="w-full bg-white font-sans text-graygray-90">
      <main className="max-w-[1280px] mx-auto px-4 lg:px-0">
        
        {/* 페이지 타이틀 */}
         <PageBreadcrumb items={breadcrumbItems} />
        <h1 className="text-heading-xl pb-10 text-graygray-90">1:1문의 작성</h1>

        {/* 상단 안내 및 폼 컨테이너 */}
        <div className="border-t border-graygray-90 pt-8">
          
          <div className="space-y-6">
            
            {/* 1. 옵션 행 (공개여부 & 카테고리) */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* 카테고리 선택 */}
              <div className="flex-1">
                <label className="block text-title-m text-graygray-90 mb-2">
                  문의 유형 <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border border-graygray-30 rounded focus:outline-none focus:border-secondary-50 text-body-m text-graygray-70 bg-white"
                >
                  <option value="" disabled>유형을 선택해주세요</option>
                  <option value="service">서비스 이용 문의</option>
                  <option value="account">회원정보/계정</option>
                  <option value="payment">결제/환불</option>
                  <option value="error">시스템 오류</option>
                  <option value="etc">기타</option>
                </select>
              </div>

              {/* 공개 여부 */}
              <div className="flex-1">
                <label className="block text-title-m text-graygray-90 mb-2">
                  공개 설정
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsPublic(true)}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded transition-all text-body-m ${
                      isPublic
                        ? 'bg-secondary-50 border-secondary-50 text-white font-bold'
                        : 'bg-white border-graygray-30 text-graygray-50 hover:bg-graygray-5'
                    }`}
                  >
                    <Unlock size={18} />
                    공개
                  </button>
                  <button
                    onClick={() => setIsPublic(false)}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded transition-all text-body-m ${
                      !isPublic
                        ? 'bg-secondary-50 border-secondary-50 text-white font-bold'
                        : 'bg-white border-graygray-30 text-graygray-50 hover:bg-graygray-5'
                    }`}
                  >
                    <Lock size={18} />
                    비공개
                  </button>
                </div>
              </div>
            </div>

            {/* 2. 제목 입력 */}
            <div>
              <label className="block text-title-m text-graygray-90 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="제목을 입력해주세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-graygray-30 rounded placeholder-graygray-40 focus:outline-none focus:border-secondary-50 text-body-m"
              />
            </div>

            {/* 3. 내용 입력 */}
            <div className="relative">
              <label className="block text-title-m text-graygray-90 mb-2">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="문의하실 내용을 자세히 기재해주시면 더욱 빠르고 정확한 답변이 가능합니다."
                value={content}
                onChange={(e) => {
                  if (e.target.value.length <= 1000) setContent(e.target.value);
                }}
                className="w-full p-4 min-h-[300px] border border-graygray-30 rounded resize-none placeholder-graygray-40 focus:outline-none focus:border-secondary-50 text-body-m leading-relaxed"
              />
              <div className="absolute bottom-4 right-4 text-detail-m text-graygray-40">
                <span className="text-secondary-50 font-bold">{content.length}</span> / 1000자
              </div>
            </div>

            {/* 4. 파일 첨부 */}
            <div>
              <label className="block text-title-m text-graygray-90 mb-2">
                첨부파일
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-4 py-2 border border-graygray-30 rounded bg-white text-graygray-70 hover:bg-graygray-5 transition text-body-m">
                  파일 선택
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </label>
                <span className="text-detail-m text-graygray-50">
                  {file ? file : '선택된 파일 없음 (최대 10MB)'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex justify-center gap-4 mt-12 pt-8 border-t border-graygray-10">
          <button 
            onClick={() => navigate('/qna')}
            className="w-32 py-3 border border-graygray-30 rounded text-graygray-70 bg-white hover:bg-graygray-5 transition-colors text-body-m"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="w-32 py-3 bg-secondary-50 text-white rounded hover:bg-opacity-90 transition-colors text-body-m-bold"
          >
            문의하기
          </button>
        </div>

        {/* 성공 메시지 (Toast 형태) */}
        {showSuccess && (
          <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-graygray-90 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-up z-50">
             <div className="bg-green-500 rounded-full p-0.5">
              <Check size={16} strokeWidth={3} />
            </div>
            <div>
              <p className="font-bold text-body-m">문의가 등록되었습니다.</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default QnAFormPage;