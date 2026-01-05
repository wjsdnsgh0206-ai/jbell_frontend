import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserNoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 페이지 진입 시 스크롤을 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 1. 전체 데이터 리스트 (백엔드 연동을 고려한 데이터 구조)
  const allNotices = [
    { 
      id: 7, 
      title: "행정안전부 재난안전데이터 공유플랫폼 안내", 
      author: "관리자", 
      date: "2025-04-11", 
      files: [
        { name: "재난안전데이터 공유플랫폼 리플렛.pdf", url: "/files/leaflet.pdf" }
      ],
      content: `행정안전부 재난안전데이터 공유플랫폼 안내 본문입니다.

○ 근거
가. 재난 및 안전관리 기본법 제 74조의4(재난안전데이터의 수집 등)
나. 동법 시행령 제83조의 3(재난안전데이터통합관리시스템의 운영 등)

○ 행정안전부에서는 위 법령에 근거하여 기관별 분산되어있는 재난안전데이터를 한 곳에 모아 통합 제공하고자, 재난안전유형 62종에 대한 1,800여 개의 재난안전데이터를 오픈API 방식으로 제공하는 재난안전데이터 공유플랫폼을 구축, '25년 1월부로 정식서비스를 게시하였습니다.

○ 점점 복잡하고 다양해지는 재난에 효과적으로 대응하기 위하여 데이터를 활용한 과학적이고 체계적인 재난안전 관리체계로의 전환이 필요한 시점으로, 재난안전데이터 공유플랫폼을 통해 데이터 활용을 위한 기초적인 기반을 마련하였으며 올해를 재난안전데이터 활용의 원년으로 삼아, 데이터 활용 우수 사례를 적극 발굴하여 전파하고 실효성 있는 재난안전데이터를 지속 개발·하기 위해 노력하고 있습니다.

* 기관별 파일데이터 등록 또는 API, ESB, DB2DB 방식으로 데이터 연계 및 개방 가능
○ 이에 공공·민간에서 활용*할 수 있도록 재난안전데이터 공유플랫폼(www.safetydata.go.kr)에 대하여 안내 드리오니 많은 관심부탁드립니다.
* 데이터 시각화 및 분석, 앱·시스템 개발, 논문·연구, 수업, 공부, 과제 등

출처 : 서울안전누리 (https://safecity.seoul.go.kr/board/ntcMttr/boardNtcMttrDetail.page)`
    }, 
    { 
      id: 8, 
      title: "전북특별자치도 '25년도 11월 재난 현황 정리입니다", 
      author: "관리자", 
      date: "2025-12-08", 
      files: [
        { name: "25년11월_재난현황.pdf", url: "/files/report_nov.pdf" },
        { name: "참고이미지.png", url: "/files/reference_img.png" }
      ],
      content: `2025년 11월 전북특별자치도 재난 현황 정리 내역입니다.
한 달간 발생한 주요 사건사고를 공유드립니다. 

상세 내용은 첨부된 PDF 파일을 확인해 주시기 바랍니다.` 
    },
    { 
      id: 1, 
      title: "전북특별자치도 새롭게 추가된 쉼터 목록입니다", 
      author: "관리자", 
      date: "2025-12-06", 
      files: [{ name: "25년11월_쉼터 목록.pdf", url: "/files/report_nov.pdf" },
        { name: "참고이미지_쉼터목록.png", url: "/files/reference_img.png" }],
      content: `새롭게 지정된 전북 지역 내 무더위/한파 쉼터 목록을 안내드립니다.
도민 여러분께서는 인근 쉼터 위치를 미리 확인하시어 안전한 겨울 보내시기 바랍니다.` 
    }
  ];

  // 2. 전달받은 ID와 일치하는 데이터를 찾습니다.
  const noticeData = allNotices.find(item => item.id === Number(id));

  // 3. 다운로드 실행 함수
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

  // 데이터를 찾지 못했을 경우 처리
  if (!noticeData) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">게시글을 찾을 수 없습니다.</p>
        <button 
          onClick={() => navigate('/userOpenSpaceLi')} 
          className="mt-4 text-blue-600 underline"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 상단 브레드크럼 */}
      <div className="bg-white py-3 border-b border-gray-100 font-sans">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-2 text-[13px] text-gray-600">
          <span className="cursor-pointer" onClick={() => navigate('/')}>🏠 홈</span>
          <span className="text-gray-300 text-[10px]">&gt;</span>
          <span>열린마당</span>
          <span className="text-gray-300 text-[10px]">&gt;</span>
          <span className="font-medium text-gray-800 cursor-pointer" onClick={() => navigate('/userOpenSpaceLi')}>공지사항</span>
        </div>
      </div>

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">공지사항</h2>

        {/* 게시글 헤더 영역 */}
        <div className="border-t-2 border-gray-800 py-8 px-4 bg-[#fcfcfc] border-b border-gray-200">
          <h3 className="text-[24px] font-bold text-gray-900 mb-6">
            제목 : {noticeData.title}
          </h3>
          
          <div className="flex items-center gap-x-8 text-[15px] text-gray-600">
            <div><span className="font-bold text-gray-900">등록자 :</span> {noticeData.author}</div>
            <div className="w-[1px] h-3 bg-gray-300"></div>
            <div><span className="font-bold text-gray-900">등록일 :</span> {noticeData.date}</div>
          </div>

          {/* 첨부파일 영역: 가로 나열 + 쉼표 구분 */}
          {noticeData.files && noticeData.files.length > 0 && (
            <div className="mt-6 pt-6 border-t border-dashed border-gray-300 flex items-start gap-2 text-[14px]">
              <span className="font-bold text-gray-900 shrink-0 flex items-center gap-1">
                <svg 
                  className="w-4 h-4 text-gray-700" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" 
                  />
                </svg>
                [첨부파일]
              </span>

              <div className="flex flex-wrap items-center">
                {noticeData.files.map((file, idx) => (
                  <React.Fragment key={idx}>
                    <button 
                      onClick={() => handleDownload(file)}
                      className="text-blue-600 hover:underline text-left font-medium transition-colors"
                    >
                      {file.name}
                    </button>
                    {idx < noticeData.files.length - 1 && (
                      <span className="text-gray-400 mx-1.5">,</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 본문 내용 */}
        <div className="py-12 px-2 min-h-[400px]">
          <div className="text-[16px] leading-[1.8] text-gray-800 whitespace-pre-wrap font-light">
            {noticeData.content}
          </div>
        </div>

        {/* 하단 목록 버튼 */}
        <div className="flex justify-center mt-12 pt-8 border-t border-gray-100">
          <button 
            onClick={() => navigate('/userOpenSpaceLi')}
            className="bg-[#2b79f3] text-white px-12 py-2.5 rounded text-[15px] font-medium hover:bg-blue-700 transition shadow-sm"
          >
            목록
          </button>
        </div>
      </main>
    </div>
  );
};

export default UserNoticeDetail;