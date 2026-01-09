import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import { pressData } from './BoardData';
import { Button } from '@/components/shared/Button';

// 보도자료 상세페이지 //

const UserPressRelDetail = () => {
  // --- 1. 훅 및 파라미터 설정 --- //
  const { id } = useParams(); // URL 경로에서 게시글 ID 추출 (예: /press/1)
  const navigate = useNavigate(); // 페이지 이동(목록으로 돌아가기 등)을 위한 함수

  // 컴포넌트가 마운트될 때(처음 나타날 때) 스크롤을 맨 위로 올림
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- 2. 데이터 매칭 --- //
  // 전체 보도자료 데이터(pressData) 중 URL ID와 일치하는 항목을 찾음
  const data = pressData.find(item => item.id === Number(id));

  // --- 3. 파일 다운로드 핸들러 --- //
  const handleDownload = (file) => {
    if (!file.url || file.url === "#") {
      // 파일 URL 정보가 유효하지 않을 경우 차단
      alert("다운로드 가능한 파일 경로가 없습니다.");
      return;
    }

    // 가상의 <a> 태그를 생성하여 브라우저의 다운로드 기능 강제 실행
    const link = document.createElement('a');
    link.href = file.url;
    link.setAttribute('download', file.name); // 저장될 파일명 지정
    document.body.appendChild(link);
    link.click();
    link.remove(); // 실행 후 생성했던 태그 삭제
  };

  // --- 4. 예외 처리 --- //
  // 일치하는 데이터가 없을 경우 표시할 화면 (잘못된 접근 등)
  if (!data) {
    return (
      <div className="py-20 text-center font-sans">
        <p className="text-gray-500">게시글을 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/userPressRelList')} className="mt-4 text-blue-600 underline">목록으로 돌아가기</button>
      </div>
    );
  }
  // 브레드크럼(네비게이션 경로) 설정
  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "열린마당", path: "/userPressRelList", hasIcon: false },
    { label: "보도자료", path: "/userPressRelList", hasIcon: false },
  ];

  return (
    // 전체 컨테이너: 모바일에서 px-5 여백, 데스크탑(md) 이상에서 여백 제거
    <div className="w-full px-5 md:px-0">
      <PageBreadcrumb items={breadcrumbItems} />
      <main className="w-full">
        <h1 className="text-heading-xl text-graygray-90 pb-10">보도자료</h1>

        {/* --- 상단 헤더 영역 --- */}        
        <div className="border-t border-gray-200">
          <div className="py-8 px-2 text-left">
            <h3 className="text-[20px] font-bold text-black mb-6">제목 : {data.title}</h3>
            {/* 게시글 메타 정보 (등록자, 등록일) */}
            <div className="flex items-center gap-x-6 text-[14px] text-[#222]">
              <div><span className="text-[#444]">등록자 :</span> {data.author}</div>
              <div className="w-[1px] h-3 bg-gray-300"></div> {/* 세로 구분선 */}
              <div><span className="text-[#444]">등록일 :</span> {data.date}</div>
            </div>

            {/* --- 첨부파일 영역 (데이터가 있을 때만 렌더링) --- */}
            {data.files && data.files.length > 0 && (
              <div className="mt-6 flex items-start gap-2 text-[16px]">
                {/* 제목 및 아이콘 */}
                <span className="font-bold text-[#333] shrink-0 flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  [첨부파일]
                </span>

                {/* 파일 리스트 반복 출력 */}    
                <div className="flex flex-wrap items-center">
                  {data.files.map((file, idx) => (
                    <React.Fragment key={idx}>
                      <button 
                        onClick={() => handleDownload(file)} 
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {file.name}
                      </button>
                      {/* 파일이 여러 개일 때 파일 사이에만 쉼표 표시 */}
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

        {/* --- 본문 내용 영역 --- */}
        <div className="border-t border-black"></div>
        <div className="py-12 px-2 min-h-[400px] text-left">
          <div className="text-[16px] leading-[1.8] text-[#222] whitespace-pre-wrap font-normal">
            {data.content}
          </div>
        </div>
        
        <div className="border-t border-gray-200"></div>
        
        {/* 하단 목록 버튼 영역 */}
        <div className="flex justify-center md:justify-end pt-10 border-t border-graygray-20">
          <div className="flex justify-center md:justify-end">
            <Button 
              variant="tertiary"
              onClick={() => navigate('/userPressRelList')}
              className="px-8" 
            >
              목록으로
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserPressRelDetail;



// 상세 페이지에서는  whitespace-pre-wrap 속성이 중요한데, 
// 이 속성 덕분에 게시판 관리자가 입력한 줄바꿈이나 공백이 깨지지 않고 사용자에게 그대로 보이게 됩니다.