import React, { useState, useEffect } from 'react';
import { Search, Menu, MapPin, Navigation, Info, User, Layers, ChevronDown } from 'lucide-react';


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



const UserMap = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [addressType, setAddressType] = useState('road'); // 'road' 또는 'jibun'

  // 1. 어떤 메인 메뉴가 선택되었는지 (기본값: 주소검색)
  const [activeMenu, setActiveMenu] = useState('address'); 
  
  // 2. 시도/구 선택 드롭다운이 열렸는지
  // 시도 라고 하긴 했는데 그냥 시군의 개념으로 이해해주시기를 부탁드림... 이름 바꾸기에는 너무 늦은 듯...
  const [isSidoOpen, setIsSidoOpen] = useState(false);
  const [isGooOpen, setIsGooOpen] = useState(false);
  // const [] = useState(false);

  // 3. 선택된 값들
  const [selectedSido, setSelectedSido] = useState('시도 선택');
  const [selectedGoo, setSelectedGoo] = useState('구 선택');

    // [추가] 도로명 주소 검색용 상태
  const [selectedInitial, setSelectedInitial] = useState(''); // 초성 선택
  const [selectedRoad, setSelectedRoad] = useState('');       // 도로명 선택




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
          setSelectedGoo('구 선택');   
          setIsGooOpen(false);
      };
      
  
      useEffect(() => {
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

  

  return (
    <>
      <div className="flex flex-1 relative overflow-hidden">
        {/* 2. 좌측 사이드바 */}
        <aside className="w-[380px] bg-white border-r z-10 flex flex-col shadow-xl">
        
        {/* 좌측 사이드바 최상단 고정 메뉴 */}

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
                    onChange={handleSidoSelect} 
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
            </div>

            {/* 하단 검색 버튼 (고정) */}
            <div className="p-4 border-t bg-slate-50">
              <button className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 transition-all">
                검색하기
              </button>
            </div>

          
          {/* 여 아래 손 좀 보자 */}

          
   
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
