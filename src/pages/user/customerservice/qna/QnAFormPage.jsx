// src/pages/user/customerservice/qna/QnAFormPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Lock, Unlock } from 'lucide-react';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import { Button } from '@/components/shared/Button';
import { categoryMap, createInquiryObject } from './data';

const QnAFormPage = () => {
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "고객센터", path: "/qna", hasIcon: false },
    { label: "1:1문의", path: "/qna", hasIcon: false },
    { label: "1:1문의하기", path: "/qna/form", hasIcon: false },
  ];

  const [formData, setFormData] = useState({
    isPublic: true,
    category: '',
    title: '',
    content: '',
    file: null
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files[0].name }));
    }
  };

  const togglePublic = (val) => {
    setFormData(prev => ({ ...prev, isPublic: val }));
  };

  const handleSubmit = () => {
    const { title, content, category } = formData;
    
    if (!title || !content || !category) {
      alert("모든 필수 항목(*)을 입력해주세요.");
      return;
    }

    const newInquiry = createInquiryObject(formData);
    console.log("전송 데이터:", newInquiry);
    
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/qna');
    }, 1000);
  };

  return (
    <div className="w-full bg-white text-graygray-90">
      <main className="max-w-[1280px] mx-auto px-4 lg:px-0">
        <PageBreadcrumb items={breadcrumbItems} />
        <h1 className="text-heading-xl pb-10 text-graygray-90">1:1문의 작성</h1>

        <div className="border-t border-graygray-90 pt-10">
          <div className="space-y-8">
            
            {/* 1. 옵션 행 */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* 문의 유형 */}
              <div className="flex-1">
                <label className="block text-title-m font-bold text-graygray-90 mb-3">
                  문의 유형 <span className="text-secondary-50">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full h-14 px-4 border border-graygray-30 rounded-lg focus:outline-none focus:border-secondary-50 text-body-m text-graygray-90 bg-white cursor-pointer appearance-none transition-colors"
                >
                  <option value="" disabled>유형을 선택해주세요</option>
                  <option value="service">서비스 이용 문의</option>
                  <option value="account">회원정보/계정</option>
                  <option value="payment">결제/환불</option>
                  <option value="error">시스템 오류</option>
                  <option value="etc">기타</option>
                </select>
              </div>

              {/* 공개 설정 */}
              <div className="flex-1">
                <label className="block text-title-m font-bold text-graygray-90 mb-3">
                  공개 설정
                </label>
                <div className="flex gap-2 h-14">
                  <button
                    type="button"
                    onClick={() => togglePublic(true)}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg border transition-all text-body-m ${
                      formData.isPublic
                        ? 'bg-secondary-50 border-secondary-50 text-white font-bold'
                        : 'bg-white border-graygray-30 text-graygray-50 hover:bg-graygray-5'
                    }`}
                  >
                    <Unlock size={18} />
                    공개
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePublic(false)}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg border transition-all text-body-m ${
                      !formData.isPublic
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
              <label className="block text-title-m font-bold text-graygray-90 mb-3">
                제목 <span className="text-secondary-50">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="제목을 입력해주세요."
                value={formData.title}
                onChange={handleInputChange}
                className="w-full h-14 px-4 border border-graygray-30 rounded-lg placeholder-graygray-40 focus:outline-none focus:border-secondary-50 text-body-m text-graygray-90 transition-colors"
              />
            </div>

            {/* 3. 내용 입력 */}
            <div className="relative">
              <label className="block text-title-m font-bold text-graygray-90 mb-3">
                내용 <span className="text-secondary-50">*</span>
              </label>
              <textarea
                name="content"
                placeholder="문의하실 내용을 자세히 기재해주시면 더욱 빠르고 정확한 답변이 가능합니다."
                value={formData.content}
                onChange={(e) => {
                  if (e.target.value.length <= 1000) handleInputChange(e);
                }}
                className="w-full p-5 min-h-[320px] border border-graygray-30 rounded-lg resize-none placeholder-graygray-40 focus:outline-none focus:border-secondary-50 text-body-m text-graygray-90 leading-relaxed transition-colors"
              />
              <div className="absolute bottom-5 right-5 text-detail-m text-graygray-40">
                <span className="text-secondary-50 font-bold">{formData.content.length}</span> / 1000자
              </div>
            </div>

            {/* 4. 파일 첨부 */}
            <div>
              <label className="block text-title-m font-bold text-graygray-90 mb-3">
                첨부파일
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer px-5 py-3 border border-graygray-30 rounded-lg bg-white text-graygray-70 hover:bg-graygray-5 transition-colors text-body-m font-medium shadow-sm">
                  파일 선택
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </label>
                <span className="text-body-s text-graygray-50">
                  {formData.file ? formData.file : '선택된 파일 없음 (최대 10MB)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 영역 - 양옆 정렬 */}
        <div className="flex justify-between items-center pt-10 mt-5 border-t border-graygray-10 pb-20">
            <Button 
              variant="tertiary"
              onClick={() => navigate('/qna')}
              className="px-8" 
            >
              취소하기
            </Button>
            <Button 
              variant="primary"
              size="default"
              onClick={handleSubmit}
              className="px-8" 
            >
              문의하기
            </Button>
        </div>

        {/* 성공 토스트 */}
        {showSuccess && (
          <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-graygray-90 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up z-50">
             <div className="bg-secondary-50 rounded-full p-1">
              <Check size={16} strokeWidth={3} className="text-white" />
            </div>
            <p className="font-bold text-body-m">문의가 성공적으로 등록되었습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default QnAFormPage;