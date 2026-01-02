
const NoticeDetail = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* 1. Header Area */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">대</div>
             <span className="text-xl font-bold tracking-tight text-gray-900">전북안전누리</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-semibold">
            <a href="#" className="hover:text-blue-600">민원</a>
            <a href="#" className="hover:text-blue-600">서비스신청</a>
            <a href="#" className="hover:text-blue-600">정책정보</a>
            <a href="#" className="hover:text-blue-600">기관소개</a>
          </nav>
          <div className="flex gap-3 text-xs text-gray-500">
            <span>로그인</span>
            <span>회원가입</span>
          </div>
        </div>
      </header>

      {/* 2. Breadcrumb */}
      <nav className="max-w-5xl mx-auto px-4 py-4 text-xs text-gray-500">
        <span className="hover:underline cursor-pointer">홈</span> &gt; 
        <span className="hover:underline cursor-pointer ml-1">열린마당</span> &gt; 
        <span className="font-bold text-gray-700 ml-1">공지사항</span>
      </nav>

      {/* 3. Content Body */}
      <main className="max-w-5xl mx-auto px-4 py-6 bg-white shadow-sm border border-gray-100 rounded-sm">
        <h1 className="text-2xl font-bold mb-6 pb-4 border-b-2 border-gray-800">공지사항</h1>

        {/* Post Info Table-like Header */}
        <div className="border-t border-gray-300">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              제목 : 행정안전부 재난안전데이터 공유플랫폼 안내
            </h2>
          </div>
          <div className="flex flex-wrap text-sm border-b border-gray-200">
            <div className="w-full md:w-1/2 p-3 flex border-r border-gray-100">
              <span className="font-bold w-24">등록자</span>
              <span className="text-gray-600">관리자</span>
            </div>
            <div className="w-full md:w-1/2 p-3 flex">
              <span className="font-bold w-24">등록일</span>
              <span className="text-gray-600">2025-04-11</span>
            </div>
          </div>
          <div className="p-3 text-sm flex items-center gap-2 border-b border-gray-200">
            <span className="font-bold w-20">첨부파일</span>
            <a href="#" className="text-blue-600 hover:underline flex items-center">
              💾 재난안전데이터 공유플랫폼 리플렛.pdf
            </a>
          </div>
        </div>

        {/* Text Content */}
        <div className="py-10 px-2 leading-relaxed text-gray-700 space-y-4">
          <p className="font-semibold">○ 근거</p>
          <ul className="list-none pl-4 space-y-1">
            <li>가. 재난 및 안전관리 기본법 제 74조의4(재난안전데이터의 수집 등)</li>
            <li>나. 동법 시행령 제83조의 3(재난안전데이터통합관리시스템의 운영 등)</li>
          </ul>
          <p>
            ○ 행정안전부에서는 위 법령에 근거하여 기관별 분산되어있는 재난안전데이터를 한 곳에 모아 통합 제공하고자,
            재난안전유형 62종에 대한 1,800여 개의 재난안전데이터를 오픈 API 방식으로 제공하는 
            재난안전데이터 공유플랫폼을 구축, '25년 1월부터 정식 서비스를 개시하였습니다.
          </p>
          <p>
            ○ 이에 공공·민간에서 활용할 수 있도록 재난안전데이터 공유플랫폼(www.safetydata.go.kr)에 
            대하여 안내 드리오니 많은 관심 부탁드립니다.
          </p>
        </div>

        {/* List Button */}
        <div className="flex justify-center mt-10">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md font-medium transition-colors">
            목록
          </button>
        </div>
      </main>

      {/* 4. Footer */}
      <footer className="mt-20 bg-gray-100 border-t border-gray-200 py-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex items-center gap-2 mb-4 opacity-70 grayscale">
               <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">대</div>
               <span className="text-lg font-bold">대한민국정부</span>
            </div>
            <p>(04383) 서울특별시 용산구 이태원로 22</p>
            <p>대표전화 1234-5678 | 해외이용 +82-1234-5678</p>
            <p className="pt-4 text-xs text-gray-400">© The Government of the Republic of Korea. All rights reserved.</p>
          </div>
          <div className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
            <a href="#">이용안내</a>
            <a href="#">찾아오시는 길</a>
            <div className="flex gap-4 mt-4 text-xl">
               <span>📸</span><span>📺</span><span>✖</span><span>ⓕ</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NoticeDetail;