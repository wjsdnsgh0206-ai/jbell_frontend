import React, { useState, useEffect } from 'react';
import { Search, Menu, MapPin, Navigation, Info, User, Layers, ChevronDown } from 'lucide-react';


  
  /*<=========================================== const SelectBox ===========================================> */  
    // 1. 셀렉트 박스 부품 정의
    const SelectBox = ({ label, value, options = [], onChange, disabled }) => {
      return (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500 ml-1">{label}</label>
          <select
            disabled={disabled}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full p-3 border rounded-md text-sm transition-all ${
              disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-900'
            }`}
          >
            <option value="">{label}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    };
  /*<=========================================== const SelectBox ===========================================> */



  /*<=========================================== const UserMap ===========================================> */
  const UserMap = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [addressType, setAddressType] = useState('road'); // 'road' 또는 'jibun'

    // 1. 어떤 메인 메뉴가 선택되었는지 (기본값: 주소검색)
    const [activeMenu, setActiveMenu] = useState('address'); 
    
    // 2. 시도/구 선택 드롭다운이 열렸는지
    const [isSidoOpen, setIsSidoOpen] = useState(false);
    const [isSigunOpen, setIsSigunOpen] = useState(false);
    const [isGooOpen, setIsGooOpen] = useState(false);

    // 3. 선택된 값들
    const [selectedSido, setSelectedSido] = useState('시도 선택');
    const [selectedSigun, setSelectedSigun] = useState('시군 선택');
    const [selectedGoo, setSelectedGoo] = useState('구 선택');

    // [추가] 도로명 주소 검색용 상태
    const [selectedInitial, setSelectedInitial] = useState(''); // 초성 선택
    const [selectedRoad, setSelectedRoad] = useState('');       // 도로명 선택

    // [추가] 지번 주소 검색용 상태
    const [selectedDong, setSelectedDong] = useState('읍면동 선택');
  /*<=========================================== const UserMap ===========================================> */



  /*<=========================================== 셀렉트 내부에서 나오는 지역 리스트 관련 ===========================================> */
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
  // 시군 -> 구 -> 읍면동까지 이어지는 계층 데이터
  // 근데 이건 API 연결을 하지 않으면 엄청난 노가다 예상...(읍면동을 언제 수기로 다 적어...)
      const DETAILED_DATA = {
        '전주시': {
          '완산구': ['중앙동', '풍남동', '노송동', '완산동'],
          '덕진구': ['우아동', '호성동', '송천동', '덕진동'],
        },
        '군산시': {
          '기본': ['해신동', '월명동', '신풍동', '조촌동'] // 구가 없는 지역은 '기본' 키를 활용
        },
        '익산시': {
          '기본': ['중앙동', '인화동', '마동', '남중동']
        }
      };
  /*<=========================================== 셀렉트 내부에서 나오는 지역 리스트 관련 ===========================================> */



  /*<=========================================== 셀렉트 내부에서 나오는 지역 리스트 관련 ===========================================> */
      // ... 컴포넌트 내부
      const handleSigunSelect = (city) => {
        setSelectedSigun(city);
        setIsSigunOpen(false);
        setSelectedGoo('구 선택'); // 시도가 바뀌면 구 선택은 초기화
        
        // 구가 없는 지역이면 아예 구 선택창을 닫아두거나 로직 처리
          setSelectedGoo('구 선택');   
          setIsGooOpen(false);
      };
      // 읍면동 목록을 결정하는 로직
      const getDongOptions = () => {
        if (selectedSigun === '시군 선택') return [];

        // 전주시처럼 구가 있는 경우
        if (REGION_DATA[selectedSigun]?.length > 0) {
          if (selectedGoo === '구 선택') return [];
          return DETAILED_DATA[selectedSigun][selectedGoo] || [];
        } 
        
        // 군산시처럼 구가 없는 경우
        return DETAILED_DATA[selectedSigun]?.['기본'] || [];
      };
  /*<=========================================== 셀렉트 내부에서 나오는 지역 리스트 관련 ===========================================> */


      
  /*<=========================================== 카카오 맵 API ===========================================> */
      const useEffect = (() => {
        // kakao 객체가 로드되었는지 확인하는 안전장치
        if (window.kakao && window.kakao.maps) {
          const container = document.getElementById('map'); // 지도를 담을 영역
          const options = {
            center: new window.kakao.maps.LatLng(35.8242238, 127.1479532),  // 전주 시청 기준
            level: 3  // 확대 레벨
          };

          const map = new window.kakao.maps.Map(container, options);
        } else {
          console.error("카카오 맵 API가 아직 로드되지 않았어요!");
        }

         // 나중에 검색 기능 등을 위해 map 객체를 상태로 저장
        // setMapObj(map);
      }, []);
  /*<=========================================== 카카오 맵 API ===========================================> */

  

  return (
    <>
      <div className="flex flex-1 relative overflow-hidden">
        {/* 2. 좌측 사이드바 */}
        <aside className="w-[380px] bg-white border-r z-10 flex flex-col shadow-xl">
        
        {/* 좌측 사이드바 최상단 고정 메뉴 */}
        {/* [최상단 고정 영역] 검색창 & 대표 3개 메뉴 */}
        <div className="p-4 border-b space-y-4 bg-white">
          
          {/* 홈으로 돌아가는 버튼, 좌측 사이드 바 축소 버튼 추가?? */}
          
          {/* 1. 통합 검색창 */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="장소, 주소, 건물 명을 입력해주세요." 
              className="w-full p-3 pr-10 border rounded-md text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-3 text-slate-400" size={18} />
          </div>

          {/* 2. 대표 3개 메뉴 아이콘 (피그마 스타일) */}
          <div className="flex justify-around items-center pt-2">
            <button 
              onClick={() => setActiveMenu('path')}
              className={`flex flex-col items-center gap-1 group ${activeMenu === 'path' ? 'text-blue-600' : 'text-slate-500'}`}
            >
              <Navigation size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-medium">길 찾기</span>
            </button>

            <button 
              onClick={() => setActiveMenu('address')}
              className={`flex flex-col items-center gap-1 group px-4 py-1 rounded-md ${activeMenu === 'address' ? 'text-blue-600 bg-blue-50' : 'text-slate-500'}`}
            >
              <MapPin size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-medium">주소검색</span>
            </button>

            <button 
              onClick={() => setActiveMenu('shelter')}
              className={`flex flex-col items-center gap-1 group ${activeMenu === 'shelter' ? 'text-blue-600' : 'text-slate-500'}`}
            >
              <Layers size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-medium">대피소</span>
            </button>
          </div>
        </div>

        {/* 상단 탭 (도로명 검색 / 지번 검색) */}
            <div className="flex border-b text-sm font-medium">
              <button 
                onClick={() => setAddressType('road')}
                className={`flex-1 py-3 ${addressType === 'road' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}
              >
                도로명 주소
              </button>
              <button 
                onClick={() => setAddressType('jibun')}
                className={`flex-1 py-3 ${addressType === 'jibun' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}
              >
                지번 주소
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* 도로명 검색 섹션 */}
              {addressType === 'road' && (
                <div className="space-y-4">
                  <SelectBox 
                    label="시도 선택" 
                    value={selectedSido} 
                    options={['전북특별자치도']} // 예시 데이터
                    onChange={setSelectedSido} 
                  />
                    <SelectBox 
                    label="시군 선택" 
                    value={selectedSigun} 
                    options={['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', 
                      '완주군', '고창군', '부안군', '순창군', '임실군', '무주군', '진안군', '장수군']} // 선택할 모든 전북 행정지역 목록
                    onChange={handleSigunSelect} 
                  />
                  <SelectBox 
                    label="구 선택" 
                    value={selectedGoo} 
                    options={REGION_DATA[selectedSido] || []}
                    disabled={REGION_DATA[selectedSido]?.length === 0}
                    onChange={setSelectedGoo}
                  />
                  <SelectBox label="초성 선택" value={selectedInitial} onChange={setSelectedInitial} />
                  <SelectBox label="도로명 선택" value={selectedRoad} onChange={setSelectedRoad} />
                </div>
              )}

            {/* 지번 검색 섹션 */}
  
                

                
                {addressType === 'jibun' && (
                  <div className="space-y-5">
                    {/* 시군 선택 */}
                    <SelectBox 
                      label="시군 선택" 
                      value={selectedSigun} 
                      options={Object.keys(REGION_DATA)} 
                      onChange={handleSigunSelect} 
                    />

                    {/* 구 선택 (전주시일 때만 활성화) */}
                    <SelectBox 
                      label="구 선택" 
                      value={selectedGoo} 
                      options={REGION_DATA[selectedSigun] || []}
                      disabled={!REGION_DATA[selectedSigun] || REGION_DATA[selectedSigun].length === 0}
                      onChange={setSelectedGoo}
                    />

                    {/* 읍면동 선택 (상위 지역이 골라졌을 때만 활성화) */}
                    <SelectBox
                      label="읍면동 선택" 
                      value={selectedDong} 
                      options={getDongOptions()} // 위에서 만든 함수 실행!
                      disabled={getDongOptions().length === 0}
                      onChange={setSelectedDong}
                    />
                  </div>
                )}
            </div>

            {/* 하단 검색 버튼 (고정) */}
            <div className="p-4 border-t bg-slate-50">
              <button className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 transition-all">
                검색하기
              </button>
            </div>
        </aside>



        
        <main className="flex-1 relative bg-slate-200">
          {/* 실제 지도가 들어갈 자리 */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all grayscale-[20%] brightness-90"
            style={{ backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/127.1,36.5,7,0/1200x800?access_token=YOUR_TOKEN')` }}
          >
            {/* 오버레이 효과 */}
            <div className="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>
          </div>

          {/* 지도 위 컨트롤 버튼들 */}
          <div className="absolute right-3 sm:right-4 lg:right-6 bottom-6 sm:bottom-8 lg:bottom-10 flex flex-col gap-2 sm:gap-3">
            <div className="flex flex-col bg-white rounded-lg sm:rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
              <button className="p-2 sm:p-3 hover:bg-slate-50 border-b text-slate-600 text-sm sm:text-base">+</button>
              <button className="p-2 sm:p-3 hover:bg-slate-50 text-slate-600 text-sm sm:text-base">-</button>
            </div>

            <button className="p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl shadow-2xl border border-slate-200 text-slate-600 hover:text-blue-600">
              <User size={18} className="sm:w-5 sm:h-5" />
            </button>

            <button className="p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl shadow-2xl border border-slate-200 text-slate-600 hover:text-blue-600">
              <Navigation size={18} className="sm:w-5 sm:h-5 rotate-45" />
            </button>
          </div>

          {/* 행정 구역 표시 태그 */}
          <div className="absolute top-16 sm:top-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg border border-white/50 font-semibold text-xs sm:text-sm">
            전북특별자치도
          </div>
        </main>
      </div>
    </>
  );
};

export default UserMap;
