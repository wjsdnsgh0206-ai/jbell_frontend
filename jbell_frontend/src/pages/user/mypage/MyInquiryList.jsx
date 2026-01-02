import React, { useState } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight, MessageSquare, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const MyInquiryList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // 상태별 스타일 맵핑
  const statusConfig = {
    received: { text: '접수대기', bg: 'bg-gray-100', textCol: 'text-gray-600', icon: <Clock size={14} /> },
    ongoing: { text: '진행단계', bg: 'bg-emerald-50', textCol: 'text-emerald-600', icon: <Clock size={14} /> },
    complete: { text: '답변완료', bg: 'bg-blue-50', textCol: 'text-blue-600', icon: <CheckCircle2 size={14} /> },
    urgent: { text: '추가대응 필요', bg: 'bg-red-50', textCol: 'text-red-600', icon: <AlertCircle size={14} /> },
  };

  const inquiries = [
    {
      id: 1,
      status: 'ongoing',
      date: '2024.04.30',
      title: '디지털 서비스 이용 방법 관련 문의드립니다.',
      excerpt: '로그인 후 메인 페이지에서 특정 메뉴가 보이지 않는 현상이 발생합니다. 브라우저 문제인지 확인 부탁드립니다...',
      category: '시스템 이용문의',
      isNewReply: false,
    },
    {
      id: 2,
      status: 'complete',
      date: '2023.11.01',
      title: '회원정보 수정 시 인증번호가 오지 않습니다.',
      excerpt: '이메일 인증을 시도했으나 스팸함에도 메일이 와있지 않습니다. 조치 부탁드립니다.',
      category: '회원/계정',
      isNewReply: true,
    },
    {
      id: 3,
      status: 'received',
      date: '2023.11.01',
      title: '정책 알림 설정 범위 질문',
      excerpt: '거주지 외의 다른 지역 정책 알림도 받을 수 있는 방법이 있는지 궁금합니다.',
      category: '정책알림',
      isNewReply: false,
    },
    {
      id: 4,
      status: 'urgent',
      date: '2023.10.15',
      title: '서류 제출 확인 요청',
      excerpt: '첨부파일 용량 제한으로 인해 일부 서류가 누락되었습니다. 추가 제출 경로를 안내받고 싶습니다.',
      category: '증빙서류',
      isNewReply: false,
    }
  ];

  return (
    <div className="min-h-screen bg-white flex justify-center py-10 px-5 sm:py-16 font-sans text-slate-900">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b-2 border-slate-900">
          <h1 className="text-3xl font-extrabold tracking-tight">내가 문의한 목록</h1>
          
          <div className="flex flex-wrap items-center gap-3">
            <select className="h-11 px-4 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
              <option>전체 상태</option>
              <option>접수</option>
              <option>진행</option>
              <option>완료</option>
            </select>
            
            <div className="relative group flex-1 md:w-64">
              <input
                type="text"
                placeholder="제목 또는 내용 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-4 pr-10 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            </div>

            <button className="h-11 px-5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100 active:scale-95">
              <Plus size={18} /> 1:1 문의하기
            </button>
          </div>
        </header>

        {/* List Meta Section */}
        <div className="flex items-center justify-between mb-6 text-sm">
          <div className="text-slate-500 font-medium">
            전체 <span className="text-blue-600 font-bold">{inquiries.length}</span>건
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <button className="text-slate-900 font-bold underline underline-offset-4">최신순</button>
              <span className="text-slate-200">|</span>
              <button className="hover:text-slate-600 transition-colors">오래된순</button>
            </div>
            <select className="bg-transparent text-slate-500 cursor-pointer outline-none">
              <option>10개씩 보기</option>
              <option>20개씩 보기</option>
            </select>
          </div>
        </div>

        {/* Inquiry List */}
        <div className="space-y-4">
          {inquiries.map((item) => {
            const config = statusConfig[item.status];
            return (
              <div 
                key={item.id}
                className={`group p-6 border rounded-2xl bg-white transition-all hover:shadow-xl hover:shadow-slate-100 hover:border-blue-200 cursor-pointer text-left
                  ${item.status === 'urgent' ? 'border-l-4 border-l-red-500' : 'border-slate-100'}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold ${config.bg} ${config.textCol}`}>
                    {config.icon}
                    {config.text}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">등록일 {item.date}</span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors truncate">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-2 break-keep">
                  {item.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">
                    {item.category}
                  </span>
                  {item.isNewReply && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                      <MessageSquare size={14} /> 답변이 등록되었습니다.
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <nav className="flex justify-center items-center gap-2 mt-12">
          <button className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">
            <ChevronLeft size={20} />
          </button>
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all
                ${num === 1 ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              {num}
            </button>
          ))}
          <button className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">
            <ChevronRight size={20} />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default MyInquiryList;