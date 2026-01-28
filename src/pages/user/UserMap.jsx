import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, User, Layers, Home, RotateCcw, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import DaumPostcode from 'react-daum-postcode'; // 카카오 우편번호 서비스
import { api } from '@/utils/axiosConfig';
import { facilityService, commonService } from '@/services/api';

/* <================ SelectBox 부품 (동일) ================> */
const SelectBox = ({ label, value, options = [], onChange, disabled }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-slate-500 ml-1">{label}</label>
      <select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-3 border rounded-md text-sm transition-all appearance-none ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-900'
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



//API 코드 매핑 정보
const SHELTER_TYPE_MAP = {
  '전체': '', 
  '민방위대피소(재난)': 'CIVIL_DEFENSE_DISASTER',
  '민방위대피소(원자력)': 'CIVIL_DEFENSE_COMMITTE',
  '한파쉼터': 'COLD_SHELTER',
  '무더위쉼터': 'HEAT_SHELTER',
  '지진옥외대피장소': 'EARTHQUAKE_SHELTER',
  '이재민임시주거시설': 'TEMPORARY_HOUSING'
};

const MBY_SELECT_OPTIONS = Object.keys(SHELTER_TYPE_MAP);


/* <================ SelectBox 부품 (동일) ================> */



/* <==================== 검색한 장소 누르면 사이드 바 내부에서 해당 장소와 관련된 정보 창이 등장 ====================> */
/* 상세 정보 패널 컴포넌트 */
const DetailPanel = ({ item, onClose }) => {
  if (!item) return null;

  // 1. 기본 정보 및 ID 추출
  const fcltName = item.fcltNm || "시설명 없음";
  const address = item.roadNmAddr || "주소 정보 없음";
  const fcltId = item.fcltId;

  // 2. [추가] 상세 페이지 이동 함수 정의
  const goDetailPage = () => {
    if (fcltId) {
      window.location.href = `/facility/detail/${fcltId}`;
    } else {
      alert("시설 ID 정보가 없어 상세페이지로 이동할 수 없습니다.");
    }
  };

  // 3. 유형 명칭 변환
  const typeName = Object.keys(SHELTER_TYPE_MAP).find(
    (key) => SHELTER_TYPE_MAP[key] === item.fcltSeCd
  ) || "일반 시설";

  // 4. 수용인원 및 면적 포맷팅 (0일 때 정보 없음)
  const formatValue = (value, unit) => {
    if (value === undefined || value === null || value === 0 || value === "0") {
      return "정보 없음";
    }
    return `${Number(value).toLocaleString()}${unit}`;
  };

  const capacityDisplay = formatValue(item.fcltCapacity, " 명");
  const areaDisplay = formatValue(item.fcltArea, " ㎡");

  return (
    <div className="absolute inset-0 z-[70] w-full h-full bg-white flex flex-col animate-in slide-in-from-left duration-300 shadow-xl">
      {/* 헤더 영역 */}
      <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0">
        <h3 className="font-bold text-slate-800">시설 정보</h3>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-slate-100 rounded-full text-black transition-colors flex items-center justify-center"
        >
          <X size={24} strokeWidth={3} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* 시설 타이틀 */}
        <div>
          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">
            {typeName}
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">{fcltName}</h2>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
            <MapPin size={14} /> {address}
          </p>
        </div>

        {/* 인원/면적 카드 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-600 mb-1 font-medium">수용 가능 인원</p>
            <p className={`text-lg font-bold ${capacityDisplay === "정보 없음" ? "text-slate-400" : "text-slate-800"}`}>
              {capacityDisplay}
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 mb-1 font-medium">시설 면적</p>
            <p className={`text-lg font-bold ${areaDisplay === "정보 없음" ? "text-slate-400" : "text-slate-800"}`}>
              {areaDisplay}
            </p>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="pt-4 space-y-3 pb-10">
          <button
            onClick={goDetailPage}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            대피소 상세소개 보기
          </button>
          
          <button
            onClick={() => {
              const url = `https://map.kakao.com/link/to/${fcltName},${item.lat},${item.lot}`;
              window.open(url, '_blank');
            }}
            className="w-full bg-slate-100 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <Navigation size={18} /> 길찾기
          </button>
        </div>
      </div>
    </div>
  );
};
/* <==================== 검색한 장소 누르면 사이드 바 내부에서 해당 장소와 관련된 정보 창이 등장 ====================> */


const UserMap = () => {


  // UserMap 컴포넌트 내부 상태 추가
  
  // --- [1. 전역 변수: 관제 센터] ---
  const SERVICE_KEY = {
    TEMPORARY_HOUSING: import.meta.env.VITE_API_SHELTER_TEMPORARY_HOUSING_KEY,
    EARTHQUAKE: import.meta.env.VITE_API_SHELTER_EARTHQUAKE_KEY,
  };
  /** 여기에 실제 키를 입력 
   * 1. 이재민 임시 거주 시설
   * 2. 지진 대피소
   * **/
  
  /* <========================== 상태 관리(앱의 기억력) ==========================> */
  // ui 상태
  
  /* <================ 상태 관리 ================> */
  const shelterServiceKey = import.meta.env.VITE_API_OPEN_SHELTER_SERVICE_KEY;
  
  
  /* <================ 상태 관리 ================> */
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [sggCodes, setSggCodes] = useState([]);       // DB 시군구

  // 주소 선택 값 -> 사용자의 선택 상태
  // ( 사용자가 지금 무엇을 선택했는가 ) - 이것이 검색 키워드의 재료
  const [selectedSigun, setSelectedSigun] = useState('');       // 시군
  const [selectedRoad, setSelectedRoad] = useState('');         // 도로명

  // 대피소 및 검색 결과 -> 핵심 데이터 상태
  // 리스트에 보여짐 / 마커로 변환됨 / 클릭 시 지도 이동 -> 상태가 바뀌면 사이드 바, 마커가 다시 그려짐
  const [shelterResults, setShelterResults] = useState([]);
  const [selectedShelter, setSelectedShelter] = useState(null);

  // 재난 메뉴
  const [civilSelect, setCivilSelect] = useState('');

  // 카카오 모음
  // ★ [카카오맵 관련 상태] - 지도 전용 상태
  const mapRef = useRef(null); // 지도를 담을 DOM 레퍼런스
  const [mapInstance, setMapInstance] = useState(null); // 지도 객체 저장
  const [markers, setMarkers] = useState([]); // 현재 표시된 마커들 관리
  // 카카오 우편번호 서비스
  const [showPostcode, setShowPostcode] = useState(false);
  /* <========================== 상태 관리 ==========================> */



  /* <====================== 데이터 정의 (동일) =======================> */

  const JB_REGIONS_FOR_SELECTS = {
    '전주시': [],
    '군산시': [], '익산시': [], '정읍시': [], '남원시': [], '김제시': [],
    '완주군': [], '고창군': [], '부안군': [], '순창군': [], '임실군': [], '무주군': [], '진안군': [], '장수군': []
  };
  /* <====================== 데이터 정의 (동일) =======================> */



  /* <================================ 핸들러 함수들 ================================> */
  // handleGoHome
  const handleGoHome = () => {
    setActiveMenu(null);
    setShelterResults([]);
    // 마커 제거
    removeMarkers();
  };

  // 지역(시군구) 선택 시
  const handleSigunSelect = (city) => {
    setSelectedSigun(city);
    // 지역을 바꿨을 때 이미 유형이 선택되어 있다면 바로 검색 실행
    if (civilSelect) {
      handleCivilChange(civilSelect, 1, city); 
    }
  };

  const handlePageChange = (newPage) => {
  if (newPage < 1) return;
  setCurrentPage(newPage);
  // 유형이 선택되어 있다면 해당 유형으로, 없으면 현재 선택된 값으로 재검색
  handleCivilChange(civilSelect, newPage);
};

 // 재난 유형 변경 및 검색 실행 함수 수정
  // '전체' 선택 시 빈 문자열을 보내 백엔드에서 모든 유형을 검색하게 함
  const handleCivilChange = async (value, page = 1, targetCity = selectedSigun) => {
    setCivilSelect(value);
    if (!targetCity) return;
    
    if (page === 1) setCurrentPage(1);

    const apiCode = value === '전체' ? '' : SHELTER_TYPE_MAP[value];
    
    const params = {
      ctpvNm: "전북",
      sggNm: targetCity,  
      fcltSeCd: apiCode, 
      page: page,
      size: 100
    };

    try {
      const response = await facilityService.getFacilityList(params);
      const items = response.data?.items || response.items || [];
      setShelterResults(items);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  };
 
  // handleResultClick
  const handleResultClick = (item) => {
  // item은 FacilityDTO 형태
  setSelectedShelter(item);
  
  if (mapInstance && item.lat && item.lot) {
    const pos = new window.kakao.maps.LatLng(item.lat, item.lot);
    mapInstance.setCenter(pos);
    mapInstance.setLevel(3);
  }
  
  if (window.innerWidth < 768) setIsMobileMenuOpen(false);
};
  //
  // handleComplete - 카카오 우편번호 서비스(daum.postcode)
  const handleComplete = (data) => {
  const displayAddr = data.address;
  setSelectedRoad(displayAddr);
  setShowPostcode(false);

  // 주소를 좌표로 변환하기 위한 Geocoder
  const geocoder = new window.kakao.maps.services.Geocoder();

  geocoder.addressSearch(data.address, async (result, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      const lat = result[0].y; // 위도
      const lot = result[0].x; // 경도

      // 백엔드 API 파라미터 구성 (XML의 #{userLat}, #{userLot}과 매칭)
      const params = {
        ctpvNm: "전북",
        userLat: lat,
        userLot: lot,
        page: 1,
        size: 50 // 주변 50개 우선 출력
      };

      try {
        const response = await facilityService.getFacilityList(params);
        // 응답 데이터 추출 (Response 객체 구조에 따라 조정)
        const items = response.data?.items || response.items || [];
        setShelterResults(items);
        setCurrentPage(1);

        // 지도 중심을 검색된 주소로 이동
        if (mapInstance) {
          const moveLatLon = new window.kakao.maps.LatLng(lat, lot);
          mapInstance.panTo(moveLatLon);
          mapInstance.setLevel(3);
        }
      } catch (error) {
        console.error("위치 기반 대피소 로드 실패:", error);
      }
    }
  });

  if (window.innerWidth < 768) setIsMobileMenuOpen(false);
};
  //
  /* <================================ 핸들러 함수들 ================================> */

  const shelterRequest = async (apiNum, areaCode) => {
    const response = await api.external(`/safety-api/DSSP-IF-${apiNum}`, {
      method: 'get',
      params: {
        serviceKey: shelterServiceKey,
        returnType: 'json',
        pageNo: 1,
        numOfRows: 10,
        sigunguCode: areaCode // areaCode도 인자로 받아 사용
      }
    });
    return response.data;
  };
  //
  
  /* <================ ★ 카카오맵 로직 시작 ★ ================> */
  // useEffect 모음
  //
  /* <========== 지도 초기화 ==========> */
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

  //
  /* <========== 지도 초기화 ==========> */
  /* <========== 지도 마커 생성 및 클릭 이벤트 처리 ==========> */
useEffect(() => {
  // 지도 인스턴스가 없거나 결과 데이터가 없으면 중단
  if (!mapInstance || !Array.isArray(shelterResults)) return;

  // 1. 기존에 생성된 마커들을 지도에서 제거
  removeMarkers();

  const bounds = new window.kakao.maps.LatLngBounds();
  let hasPoints = false;

  // 2. 검색 결과 데이터를 바탕으로 새로운 마커 생성
  const newMarkers = shelterResults.map((place) => {
    // DB 컬럼명 (lat, lot) 확인
    const y = place.lat; 
    const x = place.lot;

    if (y && x) {
      const pos = new window.kakao.maps.LatLng(y, x);
      const marker = new window.kakao.maps.Marker({
        position: pos,
        map: mapInstance
      });

      // [핵심] 마커 클릭 시 발생하는 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        // ① 클릭한 시설 데이터(FacilityDTO)를 상태에 저장 
        // -> 이 상태값이 변경되면 DetailPanel 컴포넌트가 왼쪽에서 나타납니다.
        setSelectedShelter(place);
        
        // ② 지도를 해당 마커 위치로 부드럽게 이동
        mapInstance.panTo(pos);
        
        // ③ 모바일 환경일 경우 결과 리스트 메뉴를 닫아 지도/상세창이 잘 보이게 함
        if (window.innerWidth < 768) {
          setIsMobileMenuOpen(false);
        }
      });

      // 지도의 범위를 재설정하기 위해 좌표 추가
      bounds.extend(pos);
      hasPoints = true;
      return marker;
    }
    return null;
  }).filter(m => m !== null); // 좌표가 없는 항목 제외

  // 3. 상태 업데이트 및 지도 범위 조정
  setMarkers(newMarkers);
  if (hasPoints) {
    mapInstance.setBounds(bounds);
  }
}, [shelterResults, mapInstance]);
  /* <========== 지도 마커 및 커스텀 오버레이 로직 ==========> */
  useEffect(() => {
    const loadRegionCodes = async () => {
      try {
        const response = await commonService.getCodeList('AREA_JB');
        if (response?.data) {
          setSggCodes(response.data);
        }
      } catch (error) {
        console.error("시군구 코드 로드 실패:", error);
        // 실패 시 대비용 기본 데이터 (Optional)
        // setSggCodes([{ code: '45110', name: '전주시' }, ...]);
      }
    };
    loadRegionCodes();
  }, []);



  // 마커 제거 헬퍼 함수
  const removeMarkers = () => {
    if (window._currentOverlay) {
      window._currentOverlay.setMap(null);
    }
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
          /* 모바일에서는 absolute로 띄워서 지도를 밀지 않게 함 */
          fixed md:relative top-0 left-0 z-[70] md:z-[0] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out
          /* 너비 설정 */
          w-[85%] md:w-[380px] h-full
          /* 수정된 부분: selectedShelter가 있어도 모바일 메뉴가 열려있어야 함 */
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
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

          <div className="pt-1">
          </div>

          <div className="flex justify-around items-center pt-2">
            <button onClick={() => setActiveMenu('address')} className={`flex flex-col items-center gap-1 group w-1/3 ${activeMenu === 'address' ? 'text-blue-600' : 'text-slate-500'}`}>
              <MapPin size={24} />
              <span className="text-[11px] font-medium">주소검색</span>
            </button>
            <button onClick={() => setActiveMenu('shelter')} className={`flex flex-col items-center gap-1 group w-1/3
              ${activeMenu === 'shelter' ? 'text-blue-600' : 'text-slate-500'}`}>
              <Layers size={24} />
              <span className="text-[11px] font-medium">대피소</span>
            </button>
          </div>
        </div>

        {/* ★★★ 상세 정보 패널 (우측에 새로운 창이 나오는 것이 아니라, 사이드바 내부에서 교체되는 방식) ★★★ */}
        {selectedShelter && (
          <DetailPanel
            item={selectedShelter}
            onClose={() => { setSelectedShelter(null) }}
          />
        )}

        {/* 길 찾기 메뉴 ★ */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">

          {activeMenu === 'shelter' ? (
            <div className="p-4 space-y-4">
    <div className="flex flex-col gap-1">
      <label className="text-xs text-slate-500 ml-1">지역 선택</label>
      <select 
        value={selectedSigun} 
        onChange={(e) => handleSigunSelect(e.target.value)}
        className="w-full p-3 border rounded-md text-sm bg-white outline-none focus:border-blue-500 transition-all appearance-none"
      >
        <option value="">지역 선택</option>
        {sggCodes.map((item) => (
          <option key={item.code} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
    </div>

    <div className="space-y-3 pt-2 border-t">
      <SelectBox
        label="대피소/쉼터 유형"
        options={MBY_SELECT_OPTIONS}
        value={civilSelect}
        onChange={(val) => handleCivilChange(val, 1)} 
        disabled={!selectedSigun}
      />
    </div>

    {/* 검색 결과 헤더 및 페이지네이션 */}
    <div className="space-y-2 pt-2 border-t">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-slate-500">검색 결과 {shelterResults.length}건</p>
        
        {/* 페이지 이동 버튼 */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-1 rounded border ${currentPage === 1 ? 'text-slate-300 bg-slate-50' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-bold text-slate-700">{currentPage} P</span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={shelterResults.length < 100} // 100개 미만이면 다음 페이지가 없음
            className={`p-1 rounded border ${shelterResults.length < 100 ? 'text-slate-300 bg-slate-50' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      {/* 리스트 렌더링 부분은 동일 */}
      <div className="space-y-2">
        {shelterResults.map((item, idx) => (
          <div key={idx} onClick={() => handleResultClick(item)} className="p-4 border-b hover:bg-slate-50 cursor-pointer transition-colors group">
            <h4 className="font-bold text-slate-800 group-hover:text-blue-600">{item.fcltNm}</h4>
            <p className="text-xs text-slate-500 mt-1">{item.roadNmAddr}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
) : activeMenu === 'address' ? (
            <>
              <div className="p-4 space-y-4">
    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
      <p className="text-sm text-blue-800 font-bold mb-1 flex items-center gap-2">
        <MapPin size={16} /> 주소로 주변 대피소 찾기
      </p>
      <p className="text-[11px] text-blue-600">입력하신 주소에서 가장 가까운 대피소를 검색합니다.</p>
    </div>

    {!showPostcode ? (
      <div className="space-y-3">
        <button
          onClick={() => setShowPostcode(true)}
          className="w-full flex items-center justify-between p-4 bg-white border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group"
        >
          <span className="text-slate-500 group-hover:text-blue-600">
            {selectedRoad || "주소를 검색하려면 클릭하세요"}
          </span>
          <Search size={20} className="text-slate-400 group-hover:text-blue-500" />
        </button>

        {/* 백엔드 검색 결과 리스트 표시 */}
        {shelterResults.length > 0 && (
          <div className="space-y-3 mt-4">
            <p className="text-[10px] text-slate-400 font-bold px-1">검색 결과 {shelterResults.length}건 (거리순)</p>
            {shelterResults.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleResultClick(item)}
                className="p-4 bg-white border rounded-xl hover:border-blue-500 shadow-sm cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-800 group-hover:text-blue-600">{item.fcltNm}</h4>
                  {item.distance > 0 && (
                    <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                      {item.distance.toFixed(1)}km
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{item.roadNmAddr}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    ) : (
      <div className="relative border rounded-xl overflow-hidden bg-white shadow-inner">
        <button
          onClick={() => setShowPostcode(false)}
          className="absolute right-2 top-2 z-10 p-1 bg-white rounded-full shadow-md border"
        >
          <X size={16} />
        </button>
        <DaumPostcode onComplete={handleComplete} style={{ height: '450px' }} />
      </div>
    )}
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