import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, User, Layers, Home, RotateCcw, Menu, X } from 'lucide-react';
import DaumPostcode from 'react-daum-postcode'; // 카카오 우편번호 서비스

/* <================ SelectBox 부품 (동일) ================> */
const SelectBox = ({ label, value, options = [], onChange, disabled }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-slate-500 ml-1">{label}</label>
      <select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-3 border rounded-md text-sm transition-all appearance-none ${
          disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-900'
        }`}
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};
/* <================ SelectBox 부품 (동일) ================> */




const UserMap = () => {
/* <========================== 상태 관리(앱의 기억력) ==========================> */
  // ui 상태
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); 
  const [addressType, setAddressType] = useState('road');

  // 주소 선택 값 -> 사용자의 선택 상태
  // ( 사용자가 지금 무엇을 선택했는가 ) - 이것이 검색 키워드의 재료
  const [selectedSido, setSelectedSido] = useState('');         // 시도
  const [selectedSigun, setSelectedSigun] = useState('');       // 시군
  const [selectedGoo, setSelectedGoo] = useState('');           // 구
  const [selectedDong, setSelectedDong] = useState('');         // 읍면동
  const [selectedInitial, setSelectedInitial] = useState('');   // 초성
  const [selectedRoad, setSelectedRoad] = useState('');         // 도로명

  // 대피소 및 검색 결과 -> 핵심 데이터 상태
  // 리스트에 보여짐 / 마커로 변환됨 / 클릭 시 지도 이동 -> 상태가 바뀌면 사이드 바, 마커가 다시 그려짐
  const [shelterResults, setShelterResults] = useState([]); 
  const [selectedShelter, setSelectedShelter] = useState(null);

  // 재난 메뉴
  const [civilSelect, setCivilSelect] = useState('');
  const [weatherSelect, setWeatherSelect] = useState('');
  const [mountainSelect, setMountainSelect] = useState('');
  const [sortType, setSortType] = useState('distance');

  // 카카오 모음
  // ★ [카카오맵 관련 상태] - 지도 전용 상태
  const mapRef = useRef(null); // 지도를 담을 DOM 레퍼런스
  const [mapInstance, setMapInstance] = useState(null); // 지도 객체 저장
  const [markers, setMarkers] = useState([]); // 현재 표시된 마커들 관리
  const [searchKeyword, setSearchKeyword] = useState(''); // 검색어 상태 추가
  // 카카오 우편번호 서비스
  const [showPostcode, setShowPostcode] = useState(false);
 /* <========================== 상태 관리 ==========================> */



/* <====================== 데이터 정의 (동일) =======================> */
  const REGION_DATA = {
    '전주시': ['완산구', '덕진구'],
    '군산시': [], '익산시': [], '정읍시': [], '남원시': [], '김제시': [],
    '완주군': [], '고창군': [], '부안군': [], '순창군': [], '임실군': [],
    '무주군': [], '진안군': [], '장수군': [],
  };
  const DETAILED_DATA = {
    '전주시': {
      '완산구': ['중앙동', '풍남동', '노송동', '완산동'],
      '덕진구': ['우아동', '호성동', '송천동', '덕진동'],
    },
    '군산시': { '기본': ['해신동', '월명동', '신풍동', '조촌동'] },
    '익산시': { '기본': ['중앙동', '인화동', '마동', '남중동'] }
  };
  const MBY_SELECTS = { '민방위대피소':[], '비상급수시설':[], '지진옥외대피장소':[], '이재민임시주거시설(지진겸용)':[], '이재민임시주거시설':[] };
  const TE_SELECTS = { '빗물펌프장':[], '빗물저류장':[], '대피소정보':[] };
  const MT_SELECTS = { '산사태대피소':[], '산불대피소':[] };
  const JB_REGIONS_FOR_SELECTS = { '전주시 완산구':[], '전주시 덕진구':[], 
    '군산시':[], '익산시':[], '정읍시':[], '남원시':[], '김제시':[], 
    '완주군':[], '고창군':[], '부안군':[], '순창군':[], '임실군':[], '무주군':[], '진안군':[], '장수군':[] };
/* <====================== 데이터 정의 (동일) =======================> */



/* <================================ 핸들러 함수들 ================================> */
// handleGoHome
  const handleGoHome = () => {
    setActiveMenu(null);
    setShelterResults([]);
    // 마커 제거
    removeMarkers();
  };
//
//
//
// handleSigunSelect
  const handleSigunSelect = (city) => { 
    setSelectedSigun(city); 
    setSelectedGoo(''); 
    const value = civilSelect||'민방위대피소';
    setCivilSelect(value);
    searchPlaces(`${city} ${value}`)
  };
  const getDongOptions = () => {
    if (!selectedSigun || selectedSigun === '시군 선택') return [];
    if (REGION_DATA[selectedSigun]?.length > 0) {
      if (!selectedGoo || selectedGoo === '구 선택') return [];
      return DETAILED_DATA[selectedSigun][selectedGoo] || [];
    } 
    return DETAILED_DATA[selectedSigun]?.['기본'] || [];
  };
//
//
//
// handleCivilChange
// 재난 유형 변경 시 실제 검색 실행 (예시: 키워드로 검색)
  const handleCivilChange = (value) => { 
    setCivilSelect(value); setWeatherSelect(''); setMountainSelect('');
    if(value && selectedSigun) searchPlaces(`${selectedSigun} ${value}`);
  };
  const handleWeatherChange = (value) => { 
    setWeatherSelect(value); setCivilSelect(''); setMountainSelect('');
    if(value && selectedSigun) searchPlaces(`${selectedSigun} ${value}`);
  };
  const handleMountainChange = (value) => { 
    setMountainSelect(value); setCivilSelect(''); setWeatherSelect('');
    if(value && selectedSigun) searchPlaces(`${selectedSigun} ${value}`);
  };
//
//
//
// handleResultClick
const handleResultClick = (item) => {
  setSelectedShelter(item);
  if (!mapInstance) return;

  const lat = item.y || item.latitude;
  const lng = item.x || item.longitude;

  if (lat && lng) {
    const moveLatLng = new window.kakao.maps.LatLng(lat, lng);
    mapInstance.setCenter(moveLatLng);
    mapInstance.setLevel(3);
  }

  if (window.innerWidth < 768) setIsMobileMenuOpen(false);
};
//
//
//
// handleSearch
const handleSearch = async () => {
  // 1. 공공데이터 API URL(실제로는 API 가이드의 URL을 넣어야 함)
  const serviceKey = 'serviceKey';
  const url =`https://V2/api/DSSP-IF-10941?serviceKey=xxxx`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // 2. 받아온 데이터를 상태에 저장
    // API마다 데이터 구조가 다르니(예: data.response.body.items) 확인 필요!
    const items = data.response.body.items;
    setShelterResults(items); 

    // 3. 지도에 마커 뿌려주기
    displayMarkers(items); 
  } catch (error) {
    console.error("데이터를 못 가져오지 못 했습니다...", error);
  }
};
//
//
//
// handleComplete
 {/* 카카오 우편번호 서비스(daum.postcode) */}
    const handleComplete = (data) => {
    // 상세 주소(건물번호 등)를 제외한 기본 주소만 추출
    // 예: "전북특별자치도 전주시 완산구 효자동3가 123-4" -> "전주시 완산구 효자동3가"
    const displayAddr = data.address;
    const searchAddr = data.bname || data.address.split(' ').slice(0, 4).join(' ');

    setSelectedRoad(displayAddr); 
    
    // 주소 뒤에 '대피소'를 붙여서 검색
    searchPlaces(`${searchAddr} 대피소`); 
    
    setShowPostcode(false); 
    if (window.innerWidth < 768) setIsMobileMenuOpen(false); 
};
//
/* <================================ 핸들러 함수들 ================================> */


/* <================ ★ 카카오맵 로직 시작 ★ ================> */
  // useEffect 모음
  //
    /* <========== 지도 초기화 ==========> */
    // 1. 지도 초기화
      useEffect(() => {
        if (!window.kakao) {
          console.error("카카오맵 스크립트가 로드되지 않았습니다.");
          return;
        }

        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(35.8242238, 127.1479532), // 전주 시청 부근
          level: 7 // 확대 레벨
        };

        const map = new window.kakao.maps.Map(container, options);
        setMapInstance(map);

        // 윈도우 리사이즈 시 지도 깨짐 방지
        const handleResize = () => map.relayout();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);

      // 2. 키워드 검색 함수
      const searchPlaces = (keyword) => {
        if (!window.kakao) return;
        const ps = new window.kakao.maps.services.Places();

        ps.keywordSearch(keyword, (data, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            console.log(keyword);
            console.log(data);
            setShelterResults(data); // 사이드바 리스트 업데이트
          } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
            alert('검색 결과가 존재하지 않습니다.');
            setShelterResults([]);
          }
        });
      };
    //
    /* <========== 지도 초기화 ==========> */
    /* <========== 지도 초기화 ==========> */
    // 2
    useEffect(() => {
      if (!mapInstance || !Array.isArray(shelterResults)) return;

      // 1. 기존 마커 싹 지우기
      removeMarkers();

      if (shelterResults.length === 0) return;

      const bounds = new window.kakao.maps.LatLngBounds();
      let hasValidPoints = false;

      // 2. 새 마커 생성 및 범위 확장
      const newMarkers = shelterResults.map((place) => {
        // 카카오 API 응답 데이터는 x, y를 사용하므로 확인!
        const lat = place.y || place.latitude; 
        const lng = place.x || place.longitude;

        if (lat && lng) {
          const markerPosition = new window.kakao.maps.LatLng(lat, lng);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            map: mapInstance,
            clickable: true
          });

          window.kakao.maps.event.addListener(marker, 'click', () => {
            setSelectedShelter(place);
            mapInstance.panTo(markerPosition);
          });

          bounds.extend(markerPosition);
          hasValidPoints = true;
          return marker;
        }
        return null;
      }).filter(m => m !== null); // 좌표 없는 데이터 제외

      setMarkers(newMarkers);

      // 3. 마커가 있을 때만 지도 화면 맞춤
      if (hasValidPoints) {
        mapInstance.setBounds(bounds);
      }
    }, [shelterResults, mapInstance]);
    //
    /* <========== 지도 초기화 ==========> */
  // useEffect 최종 막줄



  // 마커 제거 헬퍼 함수
  const removeMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  };

  // 4. 지도 컨트롤 함수
  const zoomIn = () => mapInstance?.setLevel(mapInstance.getLevel() - 1);
  const zoomOut = () => mapInstance?.setLevel(mapInstance.getLevel() + 1);
  const moveToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const locPosition = new window.kakao.maps.LatLng(lat, lon);
        mapInstance?.panTo(locPosition);
      });
    }
  };

  /* <================ ★ 카카오맵 로직 끝 ★ ================> */

  // shelterResults가 배열인지 확인하고, 아니면 빈 배열로 처리
  const sortedResults = Array.isArray(shelterResults) 
    ? [...shelterResults].sort((a, b) => {
        if (sortType === 'name') return (a.place_name || "").localeCompare(b.place_name || "");
        return 0;
      })
    : []; // 배열이 아니면 그냥 빈 리스트 전달



  return (
    <div className="relative w-full h-screen overflow-hidden flex bg-slate-100">
      
      {/* 햄버거 버튼 */}
      {!isMobileMenuOpen && (
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="absolute top-4 left-4 z-40 bg-white p-3 rounded-md shadow-lg text-slate-600 md:hidden active:bg-slate-100"
        >
          <Menu size={24} />
        </button>
      )}

      {/* 좌측 사이드바 */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 bg-white shadow-xl flex flex-col transition-transform duration-300 ease-in-out
          /* 1. 너비를 화면의 80%만 차지*/
          w-[80%] 
          /* 2. 하단 버튼들이 보일 수 있게 높이를 조절하거나 스크롤 영역을 제한 */
          h-full 
          md:static md:w-[380px] md:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* 상단 헤더 */}
        <div className="p-4 border-b space-y-4 bg-white shrink-0">
          <div className="flex items-center justify-between">
            <button onClick={handleGoHome} className="flex items-center gap-2 text-slate-700 hover:text-blue-600">
              <Home size={20} />
              <span className="font-bold text-lg text-slate-800">전북안전누리</span>
            </button>
            <div className="flex items-center gap-2">
              {activeMenu && <button onClick={handleGoHome}><RotateCcw size={18} className="text-slate-400 hover:text-red-500" /></button>}
              <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-slate-700"><X size={24} /></button>
            </div>
          </div>

          <div className="relative">
            <input 
              type="text" 
              placeholder="장소, 주소 검색" 
              onKeyDown={(e) => e.key === 'Enter' && searchPlaces(e.target.value)}
              className="w-full p-3 pr-10 border rounded-md text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-3 text-slate-400" size={18} />
          </div>

          <div className="flex justify-around items-center pt-2">
            <button onClick={() => setActiveMenu('path')} className={`flex flex-col items-center gap-1 group w-1/3 ${activeMenu === 'path' ? 'text-blue-600' : 'text-slate-500'}`}>
              <Navigation size={24} />
              <span className="text-[11px] font-medium">길 찾기</span>
            </button>
            <button onClick={() => setActiveMenu('address')} className={`flex flex-col items-center gap-1 group w-1/3 ${activeMenu === 'address' ? 'text-blue-600' : 'text-slate-500'}`}>
              <MapPin size={24} />
              <span className="text-[11px] font-medium">주소검색</span>
            </button>
            <button onClick={() => setActiveMenu('shelter')} className={`flex flex-col items-center gap-1 group w-1/3 ${activeMenu === 'shelter' ? 'text-blue-600' : 'text-slate-500'}`}>
              <Layers size={24} />
              <span className="text-[11px] font-medium">대피소</span>
            </button>
          </div>
        </div>

        {/* 중단 가변 영역 */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {activeMenu === 'path' ? (
             <div className="p-4 space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">현재 위치에서 네이버 지도를 연결합니다.</div>
                <button 
                onClick={() => {
                  // 실제 구현 시: selectedShelter의 좌표와 이름을 넣습니다.
                  const url = `https://map.naver.com/v5/directions/-/127.1,35.8,전주역/-/walk`;
                  window.open(url, '_blank');
                }}
                className="w-full bg-[#03C75A] text-white py-3 rounded-md font-bold hover:bg-[#02b351] 
                transition-all flex items-center justify-center gap-2"
              >
                <span>N</span> 네이버 지도로 길 찾기
              </button>
            </div>
          ) : activeMenu === 'shelter' ? (
            <div className="p-4 space-y-4">
               <SelectBox label="지역 선택" value={selectedSigun} options={Object.keys(JB_REGIONS_FOR_SELECTS)} onChange={handleSigunSelect} />
               <div className="space-y-3 pt-2 border-t">
                  <SelectBox
                    label="민방위/지진"
                    value={civilSelect}
                    options={Object.keys(MBY_SELECTS)}
                    onChange={handleCivilChange}
                  />
                  <SelectBox
                    label="태풍/호우"
                    value={weatherSelect}
                    options={Object.keys(TE_SELECTS)}
                    onChange={handleWeatherChange}
                  />
                  <SelectBox
                    label="산사태/산불"
                    value={mountainSelect}
                    options={Object.keys(MT_SELECTS)}
                    onChange={handleMountainChange}
                  />
               </div>
               {/* 검색 결과 */}
               <div className="space-y-2 pt-2 border-t">
                  <p className="text-xs text-slate-500 mb-2">검색 결과 {shelterResults.length}건</p>
                    <div className="flex gap-2 mt-4 text-sm">
                    <button onClick={() => setSortType('distance')}>
                      거리순
                    </button>
                    <button onClick={() => setSortType('name')}>
                      가나다순
                    </button>
                  </div>
                  {shelterResults.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleResultClick(item)}
                      className="p-4 border-b hover:bg-slate-50 cursor-pointer"
                    >
                      <h4 className="font-bold text-slate-800">{item.place_name}</h4>
                      <p className="text-xs text-slate-500">{item.address_name}</p>
                    </div>
                  ))}
               </div>
            </div>
          ) : activeMenu === 'address' ? (
             <>
            <div className="p-4 space-y-4">
                 {/* 시군 버튼 */}
                <div>
                  <SelectBox label="시군 선택" value={selectedSigun} options={Object.keys(REGION_DATA)} onChange={handleSigunSelect} />
                </div>
                  {/* 안내 문구 */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-sm text-green-800 font-bold mb-1">🔍 주소로 바로 찾기</p>
                    <p className="text-xs text-green-600">동네 이름이나 주소를 입력하면 주변 대피소를 찾아드려요.</p>
                  </div>

                  {/* 주소 검색창 열기 버튼 */}
                  {!showPostcode ? (
                    <button 
                      onClick={() => setShowPostcode(true)}
                      className="w-full flex items-center justify-between p-4 bg-white border-2 border-green-500 rounded-xl text-green-600 font-bold shadow-md hover:bg-green-100 transition-all"
                    >
                      <span className="truncate mr-2">{selectedRoad || "주소를 검색하려면 클릭하세요"}</span>
                      <Search size={20} className="shrink-0" />
                    </button>
                  ) : (
                    <div className="border-2 border-green-500 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                      <div className="bg-green-500 p-2 flex justify-between items-center text-white text-xs">
                        <span>주소를 입력해주세요</span>
                        <button onClick={() => setShowPostcode(false)}><X size={18}/></button>
                      </div>
                      <DaumPostcode onComplete={handleComplete} style={{ height: '450px' }} />
                    </div>
                  )}

                {/* 검색 결과 리스트 표시 영역 */}
                <div className="mt-6">
                  {shelterResults.length > 0 ? (
                    <>
                      <p className="text-[11px] text-slate-400 mb-3 border-b pb-1">
                        📍 {selectedRoad.split(' ').slice(-1)} 주변 대피소 {shelterResults.length}건
                      </p>
                      <div className="space-y-3">
                        {shelterResults.map((item, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => handleResultClick(item)}
                            className="p-4 bg-white border rounded-xl hover:border-blue-500 hover:shadow-md cursor-pointer transition-all group"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-slate-800 group-hover:text-blue-600">{item.place_name}</h4>
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                                {item.category_group_name || '대피시설'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mb-2">{item.address_name}</p>
                            {item.phone && <p className="text-[11px] text-blue-400">{item.phone}</p>}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : selectedRoad && !showPostcode ? (
                    <div className="py-10 text-center">
                      <p className="text-slate-400 text-sm">해당 주소 주변에 검색된<br/>대피소 정보가 없습니다.</p>
                    </div>
                  ) : null}
                </div>

            </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
               <MapPin size={32} className="mb-4 text-slate-300" />
               <p>메뉴를 선택해주세요.</p>
            </div>
          )}
        </div>
      </aside>

      {/* 우측 지도 영역 (실제 카카오맵) */}
      <main className="flex-1 relative w-full h-full">
        {/* ★ 실제 지도가 렌더링될 컨테이너 */}
        <div ref={mapRef} className="w-full h-full bg-slate-200" />
        
        {/* 행정구역 배지 */}
        <div className="absolute top-16 md:top-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-white/50 font-semibold text-sm z-10 pointer-events-none">
          전북특별자치도 {selectedSigun && `> ${selectedSigun}`}
        </div>
        
        {/* 커스텀 컨트롤 버튼 */}
        <div className="absolute right-4 bottom-8 md:right-6 md:bottom-10 flex flex-col gap-3 z-10">
          <div className="flex flex-col bg-white rounded-xl shadow-xl border overflow-hidden">
            <button onClick={zoomIn} className="p-3 hover:bg-slate-50 border-b text-slate-600" aria-label="Zoom In">+</button>
            <button onClick={zoomOut} className="p-3 hover:bg-slate-50 text-slate-600" aria-label="Zoom Out">-</button>
          </div>
          <button onClick={moveToCurrentLocation} className="p-3 bg-white rounded-xl shadow-xl border text-slate-600 hover:text-blue-600"><User size={20} /></button>
        </div>
      </main>

      {/* 모바일 오버레이 */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
};

export default UserMap;