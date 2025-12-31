import { 
  Search, 
  LogIn, 
  UserPlus, 
  ChevronDown, 
  Home, 
  Plus, 
  Menu, 
  Globe, 
  MessageCircle,
} from 'lucide-react';

const FAQDetailPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      
      {/* 1. 최상단 배너 */}
      <div className="bg-gray-100 py-1 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center text-[11px] text-gray-600">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg" 
            alt="Flag" 
            className="w-4 h-3 mr-2 border border-gray-300"
          />
          이 누리집은 대한민국 공식 전자정부 누리집입니다.
        </div>
      </div>

      {/* 2. 헤더 (로고 및 유틸리티) */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* 로고 영역 */}
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-b from-red-500 to-blue-600 relative flex items-center justify-center text-white overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-red-600 rounded-t-full transform scale-110 translate-y-1"></div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-blue-700 rounded-b-full transform scale-110 -translate-y-1"></div>
                {/* 태극 문양 단순화 CSS */}
                <div className="absolute inset-0 bg-white opacity-0 z-10"></div> 
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">대한민국정부</span>
            </div>

            {/* 유틸리티 메뉴 */}
            <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
              <div className="hidden md:flex items-center gap-1 cursor-pointer hover:text-blue-700">
                <Globe size={16} /> Language <ChevronDown size={14} />
              </div>
              <div className="hidden md:flex items-center gap-1 cursor-pointer hover:text-blue-700">
                지원 <ChevronDown size={14} />
              </div>
              <div className="hidden md:flex items-center gap-1 cursor-pointer hover:text-blue-700">
                글자·화면 설정
              </div>
              
              <div className="flex items-center gap-4 border-l border-gray-300 pl-6 ml-2">
                <button className="flex flex-col items-center gap-1 hover:text-blue-700">
                  <Search size={20} />
                  <span className="text-xs">통합검색</span>
                </button>
                <button className="flex flex-col items-center gap-1 hover:text-blue-700">
                  <LogIn size={20} />
                  <span className="text-xs">로그인</span>
                </button>
                <button className="flex flex-col items-center gap-1 hover:text-blue-700">
                  <UserPlus size={20} />
                  <span className="text-xs">회원가입</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 네비게이션 메뉴 */}
        <nav className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex gap-8 text-[15px] font-semibold text-gray-700 py-4">
              <li className="flex items-center cursor-pointer hover:text-blue-700">민원 <ChevronDown size={16} className="ml-1"/></li>
              <li className="flex items-center cursor-pointer hover:text-blue-700 text-blue-800">서비스신청 <ChevronDown size={16} className="ml-1"/></li>
              <li className="flex items-center cursor-pointer hover:text-blue-700">정책정보 <ChevronDown size={16} className="ml-1"/></li>
              <li className="flex items-center cursor-pointer hover:text-blue-700">기관소개 <ChevronDown size={16} className="ml-1"/></li>
              <li className="flex items-center cursor-pointer hover:text-blue-700">고객센터 <ChevronDown size={16} className="ml-1"/></li>
            </ul>
          </div>
        </nav>
      </header>

      {/* 4. 메인 컨텐츠 */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Home size={12} />
          <span className="mx-1">&gt;</span>
          <span>서비스 신청</span>
        </div>

        {/* 타이틀 */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">FAQ</h1>

        {/* 태그 */}
        <div className="mb-8">
          <span className="inline-block px-3 py-1 rounded-full border border-gray-300 text-xs text-gray-600 bg-white">
            질문유형
          </span>
        </div>

        {/* 질문 헤더 */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold flex items-center">
            <span className="mr-2">Q</span> 질문
          </h2>
        </div>

        {/* 메타 데이터 (날짜) */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
          <span><span className="font-bold text-gray-700">등록일</span> 2023.11.01</span>
          <span><span className="font-bold text-gray-700">최종 수정일</span> 2023.11.01</span>
        </div>

        {/* 답변 내용 박스 */}
        <div className="border border-gray-400 rounded-sm p-8 min-h-[200px] text-gray-800 text-[15px] leading-relaxed mb-20">
          <p>해당 문제는 다음으로 버튼을 클릭하면 됩니다.</p>
          <p className="mt-1">자세한 사항은 아래의 가이드를 따라주세요</p>
        </div>
      </main>

      {/* 5. 푸터 링크 바 (Accordion style visual) */}
      <div className="border-t border-b border-gray-300 bg-white">
        <div className="max-w-7xl mx-auto flex flex-wrap divide-x divide-gray-300 text-sm text-gray-700">
          <div className="flex-1 py-4 px-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
            소속기관(지청 및 위원회) <Plus size={16} className="text-gray-400"/>
          </div>
          <div className="flex-1 py-4 px-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
            업무별 누리집 <Plus size={16} className="text-gray-400"/>
          </div>
          <div className="flex-1 py-4 px-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
            산하기관 및 관련단체 <Plus size={16} className="text-gray-400"/>
          </div>
          <div className="flex-1 py-4 px-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
            정부기관 <Plus size={16} className="text-gray-400"/>
          </div>
        </div>
      </div>

      {/* 6. 메인 푸터 */}
      <footer className="bg-[#F8F9FA] py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-8">
          
          {/* 왼쪽: 로고 및 주소 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
               <div className="w-6 h-6 rounded-full bg-gradient-to-b from-red-500 to-blue-600"></div>
               <span className="text-lg font-bold text-gray-700">대한민국정부</span>
            </div>
            <div className="text-xs text-gray-600 space-y-1 leading-relaxed">
              <p>(04383) 서울특별시 용산구 이태원로 22</p>
              <div className="flex gap-4 mt-2">
                <p><span className="font-bold">대표전화</span> 1234-5678 (유료, 평일 09시-18시)</p>
              </div>
              <div className="flex gap-4">
                <p><span className="font-bold">해외이용</span> +82-1234-5678 (유료, 평일 09시-18시)</p>
              </div>
            </div>
          </div>

          {/* 오른쪽: 링크 및 소셜 아이콘 */}
          <div className="flex flex-col items-end gap-6 w-full md:w-auto">
            <div className="flex gap-6 text-xs text-gray-600">
              <a href="#" className="hover:underline">이용안내 &gt;</a>
              <a href="#" className="hover:underline">찾아오시는 길 &gt;</a>
            </div>
            
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100"><Instagram size={14}/></button>
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100"><Youtube size={14}/></button>
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100"><span className="font-bold text-xs">X</span></button>
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100"><Facebook size={14}/></button>
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100"><MessageCircle size={14}/></button>
            </div>
          </div>
        </div>

        {/* 저작권 및 정책 */}
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-500">
          <div className="flex gap-4 mb-2 md:mb-0">
            <span className="cursor-pointer">이용안내</span>
            <span className="cursor-pointer font-bold text-blue-800">개인정보처리방침</span>
            <span className="cursor-pointer">저작권정책</span>
            <span className="cursor-pointer">웹 접근성 품질인증 마크 획득</span>
          </div>
          <div>
            © The Government of the Republic of Korea. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FAQDetailPage;