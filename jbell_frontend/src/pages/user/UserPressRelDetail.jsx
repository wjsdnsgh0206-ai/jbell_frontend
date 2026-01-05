import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserPressRelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 페이지 진입 시 스크롤을 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 1. 보도자료용 데이터 리스트 (이미지 시안 데이터 반영)
  const allNotices = [
    { 
      id: 1, 
      title: "전북특별자치도 지진방재 국제세미나 개최", 
      author: "관리자", 
      date: "2025-11-11", 
      files: [
        { name: "전북특별자치도_지진방재국제세미나계획.hwp", url: "/files/press_01.hwp" }
      ],
      content: `전북특별자치도 지진방재 국제세미나 개최

□ 개요
 ○ (행사주제) 지진위험을 고려한 내진설계와 단층조사의 실질적 해법 모색
 ○ (일시/장소) '25.11.22.(수) 13:40~17:00 / 공연장
 ○ (주최/주관) 행정안전부, (사)한국지진공학회 공동 주최
    - 국립재난안전연구원, 전북특별자치도, 한국지질자원연구원, (주)한국지진공학회
 ○ (참석자) 국외(일본, 캐나다, 뉴질랜드) 내진/단층 전문가, 국내 중앙 및 시·군 공무원, 대학, 연구기관 및 기업 관계자 등 200여명

출처 : 전북재난안전대책본부 (https://safe.jeonbuk.go.kr/index.php?menu=page&menu_id=notice_view&idx=12345)`
    }, 
    { 
      id: 2, 
      title: "전북특별자치도, 2026년 재해예방사업 국비 1,054억 확보", 
      author: "관리자", 
      date: "2025-11-11", 
      files: [
        { name: "2026년_재해예방사업_국비확보내역.pdf", url: "/files/press_02.pdf" }
      ],
      content: `전북특별자치도가 2026년 재해예방사업을 위한 국비 1,054억 원을 확보했습니다.

이번 예산 확보를 통해 도내 기습 폭우 및 상습 침수 구역에 대한 정비 사업이 가속화될 전망입니다. 
도민들의 생명과 재산을 보호하기 위해 노후 위험 시설 보강에 최선을 다하겠습니다.` 
    },
    { 
      id: 3, 
      title: "전북특별자치도 여름철 자연재난 인명피해 '0명'", 
      author: "관리자", 
      date: "2025-11-11", 
      files: [{ name: "여름철_자연재난_대응실적보고.pdf", url: "/files/press_03.pdf" }],
      content: `전북특별자치도는 올 여름철 자연재난 대책 기간 동안 철저한 상황 관리와 
선제적인 통제를 통해 단 한 명의 인명피해도 발생하지 않았음을 알려드립니다.

민·관이 합심하여 이루어낸 결과이며, 앞으로도 재난 없는 전북을 위해 노력하겠습니다.` 
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
          onClick={() => navigate('/userPressLi')} 
          className="mt-4 text-blue-600 underline"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 상단 브레드크럼: 보도자료로 텍스트 변경 */}
      <div className="bg-white py-3 border-b border-gray-100 font-sans">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-2 text-[13px] text-gray-600">
          <span className="cursor-pointer" onClick={() => navigate('/')}>🏠 홈</span>
          <span className="text-gray-300 text-[10px]">&gt;</span>
          <span>열린마당</span>
          <span className="text-gray-300 text-[10px]">&gt;</span>
          <span className="font-medium text-gray-800 cursor-pointer" onClick={() => navigate('/userPressLi')}>보도자료</span>
        </div>
      </div>

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 tracking-tight">보도자료</h2>

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

        {/* 하단 목록 버튼: 보도자료 목록 페이지로 이동 */}
        <div className="flex justify-center mt-12 pt-8 border-t border-gray-100">
          <button 
            onClick={() => navigate('/userPressLi')}
            className="bg-[#2b79f3] text-white px-12 py-2.5 rounded text-[15px] font-medium hover:bg-blue-700 transition shadow-sm"
          >
            목록
          </button>
        </div>
      </main>
    </div>
  );
};

export default UserPressRelDetail;