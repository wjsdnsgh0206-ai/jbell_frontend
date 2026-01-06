import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import { noticeData } from './BoardData';

// 공지사항 상세페이지 //

const UserNoticeDetail = () => {
  // --- 훅 및 변수 설정 --- //
  const { id } = useParams(); // URL 파라미터에서 게시글의 ID를 가져옴 (예: /detail/12)
  const navigate = useNavigate(); // // 페이지 이동을 위한 훅

  // 페이지가 처음 렌더링될 때 스크롤을 최상단(0,0)으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 데이터 원본(noticeData)에서 URL의 id와 일치하는 게시글 찾기
  const data = noticeData.find(item => item.id === Number(id));

  // --- 파일 다운로드 로직 --- //
  const handleDownload = (file) => {
    // 파일 URL이 없거나 '#'인 경우 경고창 띄우기
    if (!file.url || file.url === "#") {
      alert("다운로드 가능한 파일 경로가 없습니다.");
      return;
    }

    // 임시 <a> 태그를 생성하여 프로그래밍 방식으로 다운로드 실행
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
    // 전체 레이아웃: 모바일 좌우 여백(px-5), 데스크탑 여백 없음(md:px-0)
    <div className="w-full px-5 md:px-0">
      <PageBreadcrumb items={breadcrumbItems} />
      <main className="w-full">
        <h2 className="text-3xl font-bold mb-10 text-gray-900 tracking-tight text-left">공지사항</h2>
        {/* --- 상단 헤더 영역 (제목/등록정보) --- */}
        <div className="border-t border-gray-200">
          <div className="py-8 px-2 text-left">
            <h3 className="text-[20px] font-bold text-black mb-6">제목 : {data.title}</h3>
            {/* 등록정보 (등록자, 등록일) */}
            <div className="flex items-center gap-x-6 text-[14px] text-[#222]">
              <div><span className="text-[#444]">등록자 :</span> {data.author}</div>
              <div className="w-[1px] h-3 bg-gray-300"></div>
              <div><span className="text-[#444]">등록일 :</span> {data.date}</div>
            </div>

            {/* --- 첨부파일 영역 --- */}
            {data.files && data.files.length > 0 && (
              <div className="mt-6 flex items-start gap-2 text-[16px]">
                <span className="font-bold text-[#333] shrink-0 flex items-center gap-1">
                  {/* 클립 아이콘 SVG */}
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  [첨부파일]
                </span>
                {/* 파일 목록 렌더링 */}
                <div className="flex flex-wrap items-center">
                  {data.files.map((file, idx) => (
                    <React.Fragment key={idx}>
                      <button 
                        onClick={() => handleDownload(file)} 
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {file.name}
                      </button>
                      {/* 파일이 여러 개일 경우 쉼표(,) 표시 */}
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
        <div className="border-t border-black"></div> {/* 본문 시작 강조선 */}
        <div className="py-12 px-2 min-h-[400px] text-left">
          {/* whitespace-pre-wrap: 데이터의 줄바꿈을 그대로 유지해서 보여줌 */}
          <div className="text-[16px] leading-[1.8] text-[#222] whitespace-pre-wrap font-normal">
            {data.content}
          </div>
        </div>
        
        <div className="border-t border-gray-200"></div>

        {/* --- 하단 버튼 영역 --- */}
        <div className="flex justify-end mt-8">
          <button 
            onClick={() => navigate('/userNoticeList')} 
            className="bg-[#2b79f3] text-white px-5 py-2.5 rounded-md text-[15px] font-semibold hover:bg-[#1a65d6] transition-all duration-200"
          >
            목록
          </button>
        </div>
      </main>
    </div>
  );
};

export default UserNoticeDetail;





// 상세 페이지에서는  whitespace-pre-wrap 속성이 중요한데, 
// 이 속성 덕분에 게시판 관리자가 입력한 줄바꿈이나 공백이 깨지지 않고 사용자에게 그대로 보이게 됩니다.