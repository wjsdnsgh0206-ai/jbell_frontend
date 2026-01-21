import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import { noticeData } from './BoardData';
import { Button } from '@/components/shared/Button';

// 공지사항 상세페이지 //

const UserNoticeDetail = () => {
  // --- 훅 및 변수 설정 --- //
  const { id } = useParams(); // URL 파라미터에서 게시글의 ID를 가져옴
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // 페이지가 처음 렌더링될 때 스크롤을 최상단(0,0)으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 데이터 원본(noticeData)에서 URL의 id와 일치하는 게시글 찾기
  const data = noticeData.find(item => item.id === Number(id));

  // --- 파일 다운로드 로직 --- //
  const handleDownload = (file) => {
    if (!file.url || file.url === "#") {
      alert("다운로드 가능한 파일 경로가 없습니다.");
      return;
    }

    const link = document.createElement('a');
    link.href = file.url;
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // --- 예외 처리 (데이터가 없는 경우) --- //
  if (!data) {
    return (
      <div className="py-20 text-center font-sans">
        <p className="text-gray-500">게시글을 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/userNoticeList')} className="mt-4 text-blue-600 underline">목록으로 돌아가기</button>
      </div>
    );
  }
  // 브레드크럼(현재 경로) 구성 데이터
  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "열린마당", path: "/userNoticeList", hasIcon: false },
    { label: "공지사항", path: "/userNoticeList", hasIcon: false },
  ];

  return (
    <div className="w-full px-5 md:px-0">
      <PageBreadcrumb items={breadcrumbItems} />
      <main className="w-full">
        <h1 className="text-heading-xl text-graygray-90 pb-10">공지사항</h1>
        {/* --- 상단 헤더 영역 (제목/등록정보) --- */}
        <div className="border-t border-gray-200">
          <div className="py-8 px-2 text-left">
            <h2 className="text-[20px] font-bold text-black mb-6">제목 : {data.title}</h2>
            {/* 등록정보 (기존 유지: 등록자, 등록일자만 노출) */}
            <div className="flex items-center gap-x-6 text-[14px] text-[#222]">
              <div><span className="text-[#444]">등록자 :</span> {data.author}</div>
              <div className="w-[1px] h-3 bg-gray-300"></div>
              <div><span className="text-[#444]">등록일 :</span> {data.date}</div>
            </div>

            {/* --- 첨부파일 영역 --- */}
            {data.files && data.files.length > 0 && (
              <div className="mt-6 flex items-start gap-2 text-[16px]">
                <span className="font-bold text-[#333] shrink-0 flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  [첨부파일]
                </span>
                <div className="flex flex-wrap items-center">
                  {data.files.map((file, idx) => (
                    <React.Fragment key={idx}>
                      <button 
                        onClick={() => handleDownload(file)} 
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {file.name}
                      </button>
                      {idx < data.files.length - 1 && (
                        <span className="text-gray-400 mx-1.5">,</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* --- 본문 영역 --- */}
        <div className="border-t border-black"></div>
        <div className="py-12 px-2 min-h-[400px] text-left">
          <div className="text-[16px] leading-[1.8] text-[#222] whitespace-pre-wrap font-normal">
            {data.content}
          </div>
        </div>
        
        <div className="border-t border-gray-200"></div>

        {/* 하단 목록 버튼 영역 */}
        <div className="flex justify-center md:justify-end pt-10 border-t border-graygray-20">
          <Button 
            variant="tertiary"
            onClick={() => navigate('/userNoticeList')}
            className="px-8" 
          >
            목록으로
          </Button>
        </div>
      </main>
    </div>
  );
};

export default UserNoticeDetail;