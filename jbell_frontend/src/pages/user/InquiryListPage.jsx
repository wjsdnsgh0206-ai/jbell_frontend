import React, { useState } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Home, Menu, User, Globe } from 'lucide-react';

const InquiryListPage = () => {
  // 샘플 데이터 (이미지의 내용을 기반으로 구성)
  const inquiries = [
    {
      id: 1,
      status: 'progress', // 진행단계
      statusText: '진행단계',
      title: '질문 제목1',
      content: '질문 내용1',
      date: '2024.04.30',
      category: '청본부형',
    },
    {
      id: 2,
      status: 'complete', // 완료단계
      statusText: '완료단계',
      title: '질문 제목2',
      content: '질문 내용2',
      date: '2023.11.01',
      category: '실본부형',
    },
    {
      id: 3,
      status: 'receipt', // 접수단계
      statusText: '접수단계',
      title: '문의 제목1',
      content: '문의 내용1',
      date: '2023.11.01',
      category: '질문유형',
    },
    {
      id: 4,
      status: 'waiting', // 예비/타기관 이송 등
      statusText: '예비/타기관답변 필요',
      title: '문의 제목2',
      content: '문의 내용2',
      date: '2023.11.01',
      category: '질문유형',
    },
  ];

  // 상태에 따른 배지 스타일 반환 함수
  const getStatusStyle = (status) => {
    switch (status) {
      case 'progress':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'complete':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'receipt':
        return 'bg-gray-50 text-gray-600 border-gray-200';
      case 'waiting':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
          {/* ================= Header ================= */}
    
          {/* ================= Breadcrumb ================= */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center text-gray-500 text-sm">
              <Home size={16} />
              <ChevronRight size={16} className="mx-2" />
              <span className="font-medium text-gray-900">고객센터</span>
              <ChevronRight size={16} className="mx-2" />
              <span className="font-medium text-gray-900">1:1문의</span>
            </div>
          </div>

      {/* -------------------- Main Content -------------------- */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
          <Home size={14} />
          <ChevronRight size={14} />
          <span>홈</span>
        </div>

        {/* Page Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-10">1:1문의</h1>

        {/* Search Filter Area */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 flex gap-2">
            <div className="relative min-w-[120px]">
              <select className="w-full h-12 px-4 border border-gray-300 rounded-sm appearance-none bg-white text-gray-700 focus:outline-none focus:border-blue-500">
                <option>전체</option>
                <option>제목</option>
                <option>내용</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="검색어를 입력해주세요." 
                className="w-full h-12 pl-4 pr-12 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500"
              />
              <button className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-gray-500">
                <Search size={20} />
              </button>
            </div>
          </div>
          <button className="h-12 px-8 bg-blue-600 text-white font-medium rounded-sm hover:bg-blue-700 transition-colors">
            1:1 문의하기
          </button>
        </div>

        {/* List Info Bar */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
          <div className="text-gray-700">
            검색 결과 <span className="font-bold text-black">24</span>개
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
             <div className="flex items-center gap-1 cursor-pointer">
                목록 표시 개수 12개 <ChevronDown size={14} />
             </div>
             <span className="text-gray-300">|</span>
             <div className="flex items-center gap-2">
                <span className="font-bold text-black cursor-pointer">정렬기준</span>
                <span className="cursor-pointer">오래된순</span>
                <span className="cursor-pointer">최신순</span>
             </div>
          </div>
        </div>

        {/* Inquiry List Cards */}
        <div className="space-y-4 mb-12">
          {inquiries.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors cursor-pointer bg-white shadow-sm hover:shadow-md">
              <div className="flex flex-col gap-3">
                {/* Status Badge */}
                <div>
                   <span className={`inline-block px-2 py-1 text-xs font-medium border rounded-sm ${getStatusStyle(item.status)}`}>
                    {item.statusText}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{item.content}</p>
                </div>
                
                {/* Footer Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-700">등록일</span>
                    <span>{item.date}</span>
                  </div>
                  
                  {/* Tag Pill */}
                  <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50">
                <span className="text-xs">이전</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-blue-900 text-white rounded text-sm font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-600 hover:bg-gray-50 text-sm">2</button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-600 hover:bg-gray-50 text-sm">3</button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-600 hover:bg-gray-50 text-sm">4</button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-600 hover:bg-gray-50 text-sm">5</button>
            <span className="text-gray-400 px-2">...</span>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-600 hover:bg-gray-50 text-sm">99</button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50">
                <span className="text-xs">다음</span>
            </button>
        </div>

      </main>

      {/* -------------------- Footer -------------------- */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4">
            
            {/* Footer Links */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6 border-b border-gray-200 pb-6">
                <div className="flex-1 flex gap-6">
                    <span>소속기관(지청 및 위원회) +</span>
                    <span>업무별 누리집 +</span>
                    <span>산하기관 및 관련단체 +</span>
                    <span>정무기관 +</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Logo */}
                <div className="flex items-center gap-2 grayscale opacity-70">
                    <div className="w-6 h-6 rounded-full bg-gray-400"></div>
                    <span className="text-lg font-bold text-gray-500">대한민국정부</span>
                </div>

                {/* Address Info */}
                <div className="text-xs text-gray-500 space-y-2 flex-1">
                    <p>(04383) 서울특별시 용산구 이태원로 22</p>
                    <div className="flex gap-4">
                        <span><strong>대표전화</strong> 1234-5678 (유료, 평일 09시-18시)</span>
                        <span><strong>해외이용</strong> +82-1234-5678 (유료, 평일 09시-18시)</span>
                    </div>
                    <div className="flex gap-4 mt-2 font-medium text-gray-600">
                         <span className="cursor-pointer">이용안내 &gt;</span>
                         <span className="cursor-pointer">찾아오시는 길 &gt;</span>
                    </div>
                </div>
                
                {/* Copyright */}
                 <div className="text-xs text-gray-400 mt-auto">
                    <div className="flex gap-2 mb-2">
                        <span className="font-bold text-gray-600">개인정보처리방침</span>
                        <span>저작권정책</span>
                        <span>웹 접근성 품질인증 마크 획득</span>
                    </div>
                    © The Government of the Republic of Korea. All rights reserved.
                 </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default InquiryListPage;