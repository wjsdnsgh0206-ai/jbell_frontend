import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, User, Layers, Home, RotateCcw, Menu, X } from 'lucide-react';
import { api, configUtils, authUtils } from '@/utils/axiosConfig';

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

const UserMap = () => {

  /* <================ 상태 관리 ================> */
  const shelterServiceKey = import.meta.env.VITE_API_OPEN_SHELTER_SERVICE_KEY;


  /* <================ 상태 관리 ================> */
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); 
  const [addressType, setAddressType] = useState('road');

  // 주소 선택 값
  const [selectedSido, setSelectedSido] = useState('');
  const [selectedSigun, setSelectedSigun] = useState('');
  const [selectedGoo, setSelectedGoo] = useState('');
  const [selectedDong, setSelectedDong] = useState('');
  const [selectedInitial, setSelectedInitial] = useState('');
  const [selectedRoad, setSelectedRoad] = useState('');

  // 대피소 및 검색 결과
  const [shelterResults, setShelterResults] = useState([]); 
  const [selectedShelter, setSelectedShelter] = useState(null);

  // 재난 메뉴
  const [civilSelect, setCivilSelect] = useState('');
  const [weatherSelect, setWeatherSelect] = useState('');
  const [mountainSelect, setMountainSelect] = useState('');
  const [sortType, setSortType] = useState('distance');

  // ★ [카카오맵 관련 상태]
  const mapRef = useRef(null);          // 지도를 담을 DOM 레퍼런스
  const [mapInstance, setMapInstance] = useState(null); // 지도 객체 저장
  const [markers, setMarkers] = useState([]); // 현재 표시된 마커들 관리

  /* <================ 데이터 정의 (동일) ================> */
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
  const JB_REGIONS_FOR_SELECTS = { '전주시 완산구':[], '전주시 덕진구':[], '군산시':[], '익산시':[], '정읍시':[], '남원시':[], '김제시':[], '완주군':[], '고창군':[], '부안군':[], '순창군':[], '임실군':[], '무주군':[], '진안군':[], '장수군':[] };

  /* <================ 핸들러 함수들 ================> */
  const handleGoHome = () => {
    setActiveMenu(null);
    setShelterResults([]);
    // 마커 제거
    removeMarkers();
  };

  const handleSigunSelect = (city) => { setSelectedSigun(city); setSelectedGoo(''); };
  const getDongOptions = () => {
    if (!selectedSigun || selectedSigun === '시군 선택') return [];
    if (REGION_DATA[selectedSigun]?.length > 0) {
      if (!selectedGoo || selectedGoo === '구 선택') return [];
      return DETAILED_DATA[selectedSigun][selectedGoo] || [];
    } 
    return DETAILED_DATA[selectedSigun]?.['기본'] || [];
  };

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

  // 결과 클릭 시 지도 이동
  const handleResultClick = (item) => {
    setSelectedShelter(item);
    if (!mapInstance) return;
    
    // 해당 위치로 지도 이동
    const moveLatLon = new window.kakao.maps.LatLng(item.y, item.x);
    mapInstance.panTo(moveLatLon);
    
    // 모바일이면 메뉴 닫기
    if(window.innerWidth < 768) setIsMobileMenuOpen(false);
  };


  /* <================ ★ api 요청 시작 ★ ================> */
  /**
   * <================ ★ 외부 api 요청 작성요령 ★ ================>
   * 1. /safety-api 주소요청 시 => vite.config.js 파일 proxy 부분에 설정
   * '/safety-api': {
   *    target: 'https://www.safetydata.go.kr/V2/api',
   *    changeOrigin: true,
   *    rewrite: (path) => path.replace(/^\/safety-api/, ''),
   *    secure: false,
   *    configure: (proxy, options) => {
   *      proxy.on('proxyReq', (proxyReq, req, res) => {
   *        console.log('Proxy Request:', req.method, req.url);
   *      });
   *      proxy.on('proxyRes', (proxyRes, req, res) => {
   *        console.log('Proxy Response:', proxyRes.statusCode, req.url);
   *      });
   *    }
   *  }
   * 2. api.external(URL, config) 메소드 호출
   */
  const shelterRequest = async () => {
    
    const response = await api.external('/safety-api/DSSP-IF-10941', {
      method: 'get',
      params: {
        serviceKey : shelterServiceKey,
        returnType : 'json',
        pageNo : 1,
        numOfRows : 10,
        shlt_se_cd : 3
      }
    });
    console.log(response);
    
  } 

  /* <================ ★ 카카오맵 로직 시작 ★ ================> */

  // 1. 지도 초기화
  useEffect(() => {
    shelterRequest();

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
        setShelterResults(data); // 사이드바 리스트 업데이트
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
        setShelterResults([]);
      }
    });
  };

  // 3. 마커 표시 및 갱신 (shelterResults가 바뀔 때마다 실행)
  useEffect(() => {
    if (!mapInstance || !window.kakao) return;

    // 기존 마커 제거
    removeMarkers();

    // 새 마커 생성
    const newMarkers = shelterResults.map((place) => {
      const markerPosition = new window.kakao.maps.LatLng(place.y, place.x);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        map: mapInstance, // 지도에 올림
        clickable: true
      });

      // 마커 클릭 이벤트 (인포윈도우 or 사이드바 연동)
      window.kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedShelter(place); // 상태 업데이트
        mapInstance.panTo(markerPosition); // 지도 중심 이동
      });

      return marker;
    });

    setMarkers(newMarkers);

    // 검색 결과가 있으면 지도 범위를 결과에 맞게 재설정
    if (shelterResults.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();
      shelterResults.forEach((place) => {
        bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
      });
      mapInstance.setBounds(bounds);
    }
  }, [shelterResults, mapInstance]);

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

  // 정렬 로직
  const sortedResults = [...shelterResults].sort((a, b) => {
    if (sortType === 'name') return a.place_name?.localeCompare(b.place_name);
    // 거리순은 현재 위치 기준이 필요하므로 생략하거나 API에서 제공하는 distance 사용
    return 0;
  });


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
          fixed inset-y-0 left-0 z-50 w-full bg-white shadow-xl flex flex-col transition-transform duration-300 ease-in-out
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
               <div className="mt-4">
                  <p className="text-xs text-slate-500 mb-2">검색 결과 {shelterResults.length}건</p>
                    <div className="flex gap-2 mt-4">
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
            <div className="p-4 space-y-4">
               <SelectBox label="시군" value={selectedSigun} options={Object.keys(REGION_DATA)} onChange={handleSigunSelect} />
            </div>
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