import React from 'react';
import { Search, LogIn, UserPlus, Globe, Type, Settings, Home, Download, Eye, Plus, Instagram, Youtube, Facebook, MessageCircle } from 'lucide-react';

const QnADetailPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* ================= Top Banner ================= */}
      <div className="bg-gray-100 border-b border-gray-200 py-1">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-4 h-3 bg-red-400/50 rounded-sm inline-block relative overflow-hidden">
               <span className="absolute top-0 left-0 w-full h-1/2 bg-red-500"></span>
               <span className="absolute bottom-0 left-0 w-full h-1/2 bg-blue-500"></span>
            </span>
            이 누리집은 대한민국 공식 전자정부 누리집입니다.
          </div>
        </div>
      </div>

      {/* ================= Header Utility Area ================= */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end items-center gap-4 text-xs text-gray-600">
          <button className="flex items-center gap-1 hover:text-blue-700"><Globe size={14} /> Language</button>
          <span className="text-gray-300">|</span>
          <button className="flex items-center gap-1 hover:text-blue-700">지원</button>
          <span className="text-gray-300">|</span>
          <button className="flex items-center gap-1 hover:text-blue-700"><Type size={14} /> 글자·화면 설정</button>
        </div>
      </div>

      {/* ================= Main Navigation ================= */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo Placeholder */}
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                태극
              </div>
              <h1 className="text-2xl font-bold text-gray-800 tracking-tighter">대한민국정부</h1>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-6 text-gray-700">
              <button className="flex flex-col items-center gap-1 text-xs hover:text-blue-700">
                <Search size={20} />
                <span>통합검색</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-xs hover:text-blue-700">
                <LogIn size={20} />
                <span>로그인</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-xs hover:text-blue-700">
                <UserPlus size={20} />
                <span>회원가입</span>
              </button>
            </div>
          </div>
          
          {/* Menu Items */}
          <nav className="mt-4 flex gap-8 text-lg font-medium text-gray-800">
            <a href="#" className="hover:text-blue-700 py-2">민원</a>
            <a href="#" className="hover:text-blue-700 py-2 border-b-2 border-blue-700 text-blue-800">서비스신청</a>
            <a href="#" className="hover:text-blue-700 py-2">정책정보</a>
            <a href="#" className="hover:text-blue-700 py-2">기관소개</a>
            <a href="#" className="hover:text-blue-700 py-2">고객센터</a>
          </nav>
        </div>
      </header>

      {/* ================= Content Body ================= */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Home size={14} className="mr-2" />
          <span className="mx-2">home</span>
          <span>&gt;</span>
          <span className="mx-2 underline cursor-pointer">서비스 신청</span>
        </div>

        {/* Page Title */}
        <h2 className="text-4xl font-bold text-gray-900 mb-6">1:1문의</h2>

        {/* Tag */}
        <div className="mb-8">
          <span className="inline-block px-3 py-1 rounded-full border border-gray-300 text-sm text-gray-600 bg-white">
            질문유형
          </span>
        </div>

        {/* --- Question Section --- */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Q. 문의제목</h3>
          
          <div className="w-full border border-gray-300 rounded-md p-6 min-h-[160px] bg-white text-gray-500">
            문의 내용
          </div>

          <div className="mt-3 flex gap-4 text-sm text-gray-500">
            <span>등록일 <span className="text-gray-800 ml-1">2023.11.01</span></span>
            <span>최종 수정일 <span className="text-gray-800 ml-1">2023.11.01</span></span>
          </div>
        </section>

        {/* --- Answer Section --- */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">A. 문의 답글 제목</h3>
          
          <div className="w-full border border-gray-300 rounded-md p-6 min-h-[160px] bg-white text-gray-500">
            문의 내용
          </div>

          {/* Attachment */}
          <div className="mt-4 border border-gray-300 rounded-md px-6 py-4 flex justify-between items-center bg-white">
            <span className="text-gray-800 font-medium">문의 답변 첨부파일</span>
            <div className="flex gap-4 text-sm text-gray-600">
              <button className="flex items-center gap-1 hover:text-blue-700">
                다운로드 <Download size={16} />
              </button>
              <button className="flex items-center gap-1 hover:text-blue-700">
                바로보기 <span className="text-lg leading-none">&gt;</span>
              </button>
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-500">
            <span>답변일 <span className="text-gray-800 ml-1">2024.04.30</span></span>
          </div>
        </section>
      </main>

      {/* ================= Footer Links ================= */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex divide-x divide-gray-200">
          {['소속기관(지청 및 위원회)', '업무별 누리집', '산하기관 및 관련단체', '정부기관'].map((item, idx) => (
            <div key={idx} className="flex-1 py-4 px-6 flex justify-between items-center bg-gray-50 cursor-pointer hover:bg-gray-100">
              <span className="text-sm font-medium text-gray-700">{item}</span>
              <Plus size={16} className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* ================= Main Footer ================= */}
      <footer className="bg-gray-100 py-10 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Footer Logo */}
          <div className="flex items-center gap-2 mb-6 opacity-70 grayscale">
             <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center text-white font-bold text-[8px]">
                태극
              </div>
            <span className="text-xl font-bold text-gray-600 tracking-tighter">대한민국정부</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-8">
            {/* Address Info */}
            <div className="text-xs text-gray-500 space-y-2 leading-relaxed">
              <p>(04383) 서울특별시 용산구 이태원로 22</p>
              <div className="flex flex-wrap gap-x-4">
                <p><strong className="text-gray-700">대표전화</strong> 1234-5678 (유료, 평일 09시-18시)</p>
                <p><strong className="text-gray-700">해외이용</strong> +82-1234-5678 (유료, 평일 09시-18시)</p>
              </div>
              <div className="flex gap-x-4 mt-1">
                 <button className="flex items-center gap-1 hover:text-gray-800">이용안내 <span className="text-[10px]">&gt;</span></button>
                 <button className="flex items-center gap-1 hover:text-gray-800">찾아오시는 길 <span className="text-[10px]">&gt;</span></button>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3">
               {[Instagram, Youtube, Settings, Facebook, MessageCircle].map((Icon, idx) => (
                 <button key={idx} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 bg-white hover:text-blue-600 hover:border-blue-600 transition-colors">
                   <Icon size={14} />
                 </button>
               ))}
            </div>
          </div>

          <hr className="border-gray-300 my-6" />

          {/* Bottom Links & Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-800">이용안내</a>
              <a href="#" className="font-bold text-blue-900 hover:underline">개인정보처리방침</a>
              <a href="#" className="hover:text-gray-800">저작권정책</a>
              <a href="#" className="hover:text-gray-800">웹 접근성 품질인증 마크 획득</a>
            </div>
            <div>
              © The Government of the Republic of Korea. All rights reserved.
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default QnADetailPage;