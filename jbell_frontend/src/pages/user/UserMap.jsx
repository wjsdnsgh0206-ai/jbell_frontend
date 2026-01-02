import React, { useState } from 'react';
import { Search, Menu, MapPin, Navigation, Info, User, Layers, ChevronDown } from 'lucide-react';

const UserMap = () => {

  // 1. 어떤 메인 메뉴가 선택되었는지 (기본값: 주소검색)
  const [activeMenu, setActiveMenu] = useState('address'); 
  
  // 2. 시도/구 선택 드롭다운이 열렸는지
  const [isSidoOpen, setIsSidoOpen] = useState(false);
  const [isGooOpen, setIsGooOpen] = useState(false);

  // 3. 선택된 값들
  const [selectedSido, setSelectedSido] = useState('시도 선택');
  const [selectedGoo, setSelectedGoo] = useState('구 선택');



  // 데이터 정의
      const REGION_DATA = {
        '전주시': ['완산구', '덕진구'],
        '군산시': [], // 구 없음 -> 전주 이외의 다른 시군들도 다 이렇게 하기
        '익산시': [],
        '정읍시': [],
        '남원시': [],
        '김제시': [],
        '완주군': [],
        '고창군': [],
        '부안군': [],
        '순창군': [],
        '임실군': [],
        '무주군': [],
        '진안군': [],
        '장수군': [],
      };

      // ... 컴포넌트 내부
      const handleSidoSelect = (city) => {
        setSelectedSido(city);
        setIsSidoOpen(false);
        setSelectedGoo('구 선택'); // 시도가 바뀌면 구 선택은 초기화
        
        // 구가 없는 지역이면 아예 구 선택창을 닫아두거나 로직 처리
        if (REGION_DATA[city].length === 0) {
          setIsGooOpen(false);
        }
      };


  return (
    <>


      


      <div className="flex flex-1 relative overflow-hidden">
        {/* 2. 좌측 사이드바 */}
        <aside className="w-[380px] bg-white border-r z-10 flex flex-col shadow-xl">
         {/* 1. 상단 타이틀 & 메뉴 버튼 영역 */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">지도 검색</h2>
              <button className="text-slate-400 hover:text-slate-600"><Info size={18}/></button>
            </div>

            {/* 검색창 - 가로로 긴 형태 */}
            <div className="relative mt-4">
              <input
                type="text"
                placeholder="장소, 주소, 건물 명을 입력해주세요."
                className="w-full h-12 pl-4 pr-12 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600">
                <Search size={22} />
              </button>
            </div>

            {/* 빠른 도구 메뉴 */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <button className="flex flex-col items-center gap-1 p-2 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all">
                <Navigation size={20} className="text-blue-600" />
                <span className="text-xs font-medium">길찾기</span>
              </button>

               <button 
                  onClick={() => setActiveMenu('address')} // 클릭하면 상태 변경!
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all 
                  ${activeMenu === 'address' ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50'}`}
                >
                <MapPin size={20} className="text-red-500" />
                <span className="text-xs font-medium">주소검색</span>
                </button>

              <button className="flex flex-col items-center gap-1 p-2 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all">
                <Layers size={20} className="text-emerald-600" />
                <span className="text-xs font-medium">대피소</span>
              </button>
            </div>
          </div>


          
          {/* 여기 */}

          {/* 2. 여기가 핵심! (밀리는 영역) */}
          <div className="flex-1 overflow-y-auto"> {/* 스크롤이 생겨야 하므로 flex-1과 overflow-y-auto 권장 */}
            
            {/* 주소 검색 버튼이 눌렸을 때만 '파바박' 나타남 */}
            {activeMenu === 'address' && (
              <div className="p-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                
                {/* 시도 선택 박스 */}
                <div>
                  <button 
                    onClick={() => setIsSidoOpen(!isSidoOpen)}
                    className="w-full flex justify-between items-center p-3 border rounded-md"
                  >
                    <span>{selectedSido}</span>
                    <ChevronDown size={16} />
                  </button>

                  {/* [중요] 이 조건부 렌더링 때문에 아래 요소들이 밀림 */}
                  {isSidoOpen && (
                    <div className="mt-2 border rounded-md shadow-lg bg-white overflow-hidden">
                      {['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', 
                      '완주군', '고창군', '부안군', '순창군', '임실군', '무주군', '진안군', '장수군'].map((city) => (
                        <div 
                          key={city}
                          className="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-0"
                          onClick={() => {
                            setSelectedSido(city);
                            setIsSidoOpen(false);
                          }}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 구 선택 박스 (시도 선택 아래에 있으므로, 위가 열리면 자동으로 아래로 밀림) */}
                <div className="mt-4">
                  <label className="text-xs text-slate-500 mb-1 block">구 선택</label>
                  <button 
                    onClick={() => {
                      // 전주시처럼 구 데이터가 있을 때만 클릭 가능하게 설정
                      if (REGION_DATA[selectedSido]?.length > 0) {
                        setIsGooOpen(!isGooOpen);
                      } else {
                        alert("해당 지역은 하위 '구'가 없습니다.");
                      }
                    }}
                    className={`w-full flex justify-between items-center p-3 border rounded-md text-sm ${
                      REGION_DATA[selectedSido]?.length === 0 ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'bg-white'
                    }`}
                  >
                    <span className={selectedGoo === '구 선택' ? 'text-slate-400' : 'text-slate-900'}>
                      {selectedGoo}
                    </span>
                    <ChevronDown size={16} />
                  </button>

                {/* 구 선택 리스트: 데이터가 있을 때만 맵 돌리기 */}
                  {isGooOpen && REGION_DATA[selectedSido]?.length > 0 && (
                    <div className="mt-2 border rounded-md shadow-lg bg-white overflow-hidden animate-in fade-in zoom-in-95">
                      {REGION_DATA[selectedSido].map((goo) => (
                        <div 
                          key={goo}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-0 text-sm"
                          onClick={() => {
                            setSelectedGoo(goo);
                            setIsGooOpen(false);
                          }}
                        >
                          {goo}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 검색 결과 영역 (스크롤 가능) */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
            <div className="text-center py-20 text-slate-400">
              <p className="text-sm">주변 정보를 찾으려면<br/>검색어를 입력해 주세요.</p>
            </div>
          </div>
        </aside>

        {/* 3. 지도 영역 (우측 전체) */}
        // 1. 최상단 부모 컨테이너에 h-screen(전체 높이)을 주어 스크롤을 방지합니다.
      <div className="flex flex-col h-screen overflow-hidden">
        {/* 여기에 기존 정부 사이트 상단 GNB(헤더)가 들어감 */}
        <header className="h-16 border-b bg-white"> ... </header>

        <div className="flex flex-1 relative">
          {/* 좌측 사이드바: 지도 위에 떠 있는 느낌을 주려면 absolute를 쓰기도 하지만, 
              보내주신 사진처럼 면을 분할하려면 현재처럼 aside 구조를 유지하는 게 맞음 */}
          <aside className="w-[380px] bg-white border-r z-10 flex flex-col shadow-xl">
            {/* ... 기존 메뉴 코드 ... */}
          </aside>

          {/* 우측 지도 영역: flex-1로 남은 공간을 모두 차지하도록 만듦 */}
          <main className="flex-1 relative bg-slate-100">
            <div id="map" className="w-full h-full"></div> 
            {/* 여기에 카카오 맵 API가 렌더링 */}
          </main>
        </div>
      </div>
        
        <main className="flex-1 relative bg-slate-200">
          {/* 실제 지도가 들어갈 자리 (배경 이미지 처리) */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all grayscale-[20%] brightness-90"
            style={{ backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/127.1,36.5,7,0/1200x800?access_token=YOUR_TOKEN')` }}
          >
            {/* 오버레이 효과 */}
            <div className="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>
          </div>

          {/* 지도 위 컨트롤 버튼들 */}
          <div className="absolute right-6 bottom-10 flex flex-col gap-3">
            <div className="flex flex-col bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
              <button className="p-3 hover:bg-slate-50 border-b text-slate-600">+</button>
              <button className="p-3 hover:bg-slate-50 text-slate-600">-</button>
            </div>

            <button className="p-3 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-600 hover:text-blue-600">
              <User size={20} />
            </button>

            <button className="p-3 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-600 hover:text-blue-600">
              <Navigation size={20} className="rotate-45" />
            </button>
          </div>

          {/* 행정 구역 표시 태그 (예시) */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-white/50 font-semibold text-sm">
            전북특별자치도
          </div>
        </main>
      </div>
    </>
  );
};

export default UserMap;