import React, { useState, useEffect } from 'react';
import { Search, MapPin, Navigation, User, Layers, Home, RotateCcw } from 'lucide-react';

/* <================ SelectBox 부품 (기존과 동일) ================> */
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
/* <======================================== 상태 관리 =======================================> */
/* <================ 상태 관리 (여기가 중요!) ================> */
  // 초기 상태를 null로 설정해서 처음엔 아무 메뉴도 안 나오게 합니다.
  const [activeMenu, setActiveMenu] = useState(null); 
  const [addressType, setAddressType] = useState('road');

  // 주소 선택 값들
  const [selectedSido, setSelectedSido] = useState('');
  const [selectedSigun, setSelectedSigun] = useState('');
  const [selectedGoo, setSelectedGoo] = useState('');
  const [selectedDong, setSelectedDong] = useState('');
  const [selectedInitial, setSelectedInitial] = useState('');
  const [selectedRoad, setSelectedRoad] = useState('');

  /* 대피소 메뉴용 추가 상태 (상단에 추가하세요) */
  const [shelterSearchType, setShelterSearchType] = useState('category'); // 'category' 또는 'name'
  const [shelterResults, setShelterResults] = useState([]); // 검색 결과 리스트 저장용
  const [selectedShelter, setSelectedShelter] = useState(null); // 선택된 대피소 상세 정보

/* <======================================== 상태 관리 =======================================> */
/* <======================================== 데이터 정의 =======================================> */
  /* <================ 데이터 정의 (기존과 동일) ================> */
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
/* <======================================== 데이터 정의 =======================================> */


/* <======================================== 핸들러 함수들 =======================================> */
  // 홈으로 돌아가기 (모든 상태 초기화)
  const handleGoHome = () => {
    setActiveMenu(null);
    setSelectedSido('');
    setSelectedSigun('');
    setSelectedGoo('');
    setSelectedDong('');
    setSelectedInitial('');
    setSelectedRoad('');
  };

  const handleSigunSelect = (city) => {
    setSelectedSigun(city);
    setSelectedGoo(''); // 시군이 바뀌면 구는 초기화
  };

  const getDongOptions = () => {
    if (!selectedSigun || selectedSigun === '시군 선택') return [];
    if (REGION_DATA[selectedSigun]?.length > 0) {
      if (!selectedGoo || selectedGoo === '구 선택') return [];
      return DETAILED_DATA[selectedSigun][selectedGoo] || [];
    } 
    return DETAILED_DATA[selectedSigun]?.['기본'] || [];
  };
/* <======================================== 핸들러 함수들 =======================================> */
/* <======================================== 카카오 맵 API, 네이버 연동 =======================================> */
    // 카카오 맵 API 연동
    const searchPlaces = (keyword) => {
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(keyword, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setShelterResults(data); // 검색 결과를 상태에 저장 -> 사이드바 리스트 갱신
          // 지도에 마커 찍는 함수 호출
        }
      });
    };


    // 길 찾기 연동 함수 예시
    // ★ 길 찾기 메뉴
    const openNaverMapDirections = (destName, destLat, destLng) => {
      // destName: 목적지 이름 (예: '전주풍남초등학교')
      // destLat, destLng: 목적지의 위도, 경도 좌표 (카카오 맵 API에서 받은 좌표)
      
      const url = `https://map.naver.com/v5/directions/-/` + 
                  `${destLng},${destLat},${encodeURIComponent(destName)}/-/walk`; 
                  // '-'는 현재 위치를 출발지로 사용하겠다는 의미입니다.
                  // walk는 도보 모드, car는 자동차 모드입니다.

      window.open(url, '_blank'); // 새 탭에서 네이버 지도 실행
    };
/* <======================================== 카카오 맵 API, 네이버 연동 =======================================> */
/* <======================================== 대피소(민방위, 지진 등) 상세 정보 팝업 창 =======================================> */
    // 이 팝업 창 코드의 경우에는 html, css에도 코드 작성해야 함(2026년 1월 2일 오후 9시 35분 기준, 아직 작성 안 함)
    // 1. 대피소 데이터 예시 (디자인이 조금씩 다르므로 객체 형태로 관리)
      const shelterData = {
          
          
        shelter1: {
              title: "민방위대피소 세부정보",
              fields: [
                  { label: "시설명", value: "전주초등학교(운동장)" },
                  { label: "위치", value: "전북특별자치도 전주시 완산구 풍남로 60" },
                  { label: "면적", value: "2455㎡" },
                  { label: "수용가능인원", value: "1,637명" }
              ]
          },
        shelter2: {
              title: "비상급수시설 세부정보",
              fields: [
                  { label: "시설명", value: "전주초등학교(운동장)" },
                  { label: "위치", value: "전북특별자치도 전주시 완산구 풍남로 60" },
              ]
          },
          shelter3: {
              title: "지진옥외대피장소 세부정보",
              fields: [
                  { label: "시설명", value: "전주초등학교(운동장)" },
                  { label: "위치", value: "전북특별자치도 전주시 완산구 풍남로 60" },
                  { label: "면적", value: "2455㎡" },
              ]
          },
          shelter4: {
              title: "이재민임시주거시설(임시겸용) 세부정보",
              fields: [
                  { label: "시설명", value: "안산구청" },
                  { label: "위치", value: "전북특별자치도 전주시 선비로 232" },
                  { label: "면적", value: "1,370㎡" }
              ]
          },
          shelter5: {
              title: "이재민임시주거시설 세부정보",
              fields: [
                  { label: "시설명", value: "안산구청" },
                  { label: "위치", value: "전북특별자치도 전주시 선비로 232" },
                  { label: "면적", value: "1,370㎡" }
              ]
          },
          shelter6: {
              title: "빗물펌프장 세부정보",
              fields: [
                  { label: "시설명", value: "안산구청" },
                  { label: "위치", value: "전북특별자치도 전주시 선비로 232" },
                  { label: "설치일", value: "" },
                  { label: "펌프용량", value: "" }
              ]
          },
          shelter7: {
              title: "빗물저류조 세부정보",
              fields: [
                  { label: "시설명", value: "안산구청" },
                  { label: "위치", value: "전북특별자치도 전주시 선비로 232" },
                  { label: "시설현황", value: "" },
                  { label: "규모", value: "1,370㎡" }
              ]
          },
          shelter2: {
              title: "이재민임시주거시설(안산구청) 세부정보",
              fields: [
                  { label: "시설명", value: "안산구청" },
                  { label: "위치", value: "전북특별자치도 전주시 선비로 232" },
                  { label: "면적", value: "1,370㎡" }
              ]
          }
      };

      // 2. 팝업을 열고 데이터를 채우는 함수
      function openPopup(shelterId) {
          const data = shelterData[shelterId];
          if (!data) return;

          // 제목 설정
          document.getElementById('popup-title').innerText = data.title;

          // 테이블 내용 생성 (항목이 다를 수 있으므로 반복문 사용)
          const table = document.getElementById('info-table');
          table.innerHTML = ''; // 기존 내용 초기화

          data.fields.forEach(field => {
              const row = `<tr>
                  <th>${field.label}</th>
                  <td>${field.value}</td>
              </tr>`;
              table.innerHTML += row;
          });

          // 팝업 표시
          document.getElementById('info-popup').style.display = 'block';
      }

      // 3. 팝업 닫기 함수
      function closePopup() {
          document.getElementById('info-popup').style.display = 'none';
      }

      // 테스트용: 페이지 로드 후 1번 대피소 팝업 띄우기
      // 나중에 지도 마커 클릭 이벤트에 이 함수를 연결하면 됩니다!
      window.onload = () => {
          openPopup('shelter1'); 
      };
/* <======================================== 대피소(민방위, 지진 등) 상세 정보 팝업 창 =======================================> */


  return (
    /* <==================================================================================================> */
    /* <======================================== 좌측 사이드 바 전체 =======================================> */
    <div className="flex h-screen w-full overflow-hidden">
      {/* 좌측 사이드바 전체 */}
      <aside className="w-[380px] bg-white border-r z-10 flex flex-col shadow-xl">
        
        {/* [1. 최상단 고정 영역] 홈 버튼 + 검색창 + 메뉴버튼 */}
        <div className="p-4 border-b space-y-4 bg-white">
          {/* 홈 버튼 (서비스 로고 역할) */}
          <div className="flex items-center justify-between">
            <button 
              onClick={handleGoHome}
              className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
            >
              <Home size={20} />
              <span className="font-bold text-lg text-slate-800">전북안전누리</span>
            </button>
            {activeMenu && (
               <button onClick={handleGoHome} className="text-slate-400 hover:text-red-500 transition-colors">
                 <RotateCcw size={16} />
               </button>
            )}
          </div>

          {/* 통합 검색창 */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="장소, 주소, 건물 명을 입력해주세요." 
              className="w-full p-3 pr-10 border rounded-md text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-3 text-slate-400" size={18} />
          </div>

          {/* 메인 메뉴 3개 */}
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

        
            
        {/* 3개 대표 메뉴 기능 동작 모음 */}
        <div className="flex-1 overflow-y-auto">
          
            
          {activeMenu === 'path' ? (
             <div className="p-4 space-y-6">
              {/* 안내 문구 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong>현재 위치</strong>를 기준으로 <br/>
                  네이버 지도를 통해 길 찾기를 시작합니다.
                </p>
              </div>

              {/* 목적지 설정 부분 (대피소 검색 결과와 연동 가능) */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 ml-1">목적지</label>
                <div className="p-3 border rounded-md bg-slate-50 text-slate-400 text-sm">
                  대피소를 먼저 선택해주세요.
                </div>
              </div>

              {/* 네이버 연동 버튼 */}
              <button 
                onClick={() => {
                  // 실제 구현 시: selectedShelter의 좌표와 이름을 넣습니다.
                  const url = `https://map.naver.com/v5/directions/-/127.1,35.8,전주역/-/walk`;
                  window.open(url, '_blank');
                }}
                className="w-full bg-[#03C75A] text-white py-3 rounded-md font-bold hover:bg-[#02b351] transition-all flex items-center justify-center gap-2"
              >
                <span>N</span> 네이버 지도로 길 찾기
              </button>
            </div>
          ) : activeMenu === 'shelter' ? (
            <div className="flex flex-col h-full">
              {/* [2. 중단 가변 영역] 내 대피소 조건부 렌더링 부분 */}
              {/* 탭 메뉴 (기획안 1~2번 참고) */}
              <div className="flex border-b text-sm font-medium sticky top-0 bg-white z-10">
                <button 
                  onClick={() => setShelterSearchType('category')}
                  className={`flex-1 py-3 ${shelterSearchType === 'category' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}
                >지역 선택</button>
                <button 
                  onClick={() => setShelterSearchType('name')}
                  className={`flex-1 py-3 ${shelterSearchType === 'name' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}
                >대피소명 검색</button>
              </div>

              <div className="p-4 space-y-4 overflow-y-auto flex-1">
                {shelterSearchType === 'category' ? (
                  /* 기획안 2번: 지역별 선택 */
                  <div className="space-y-4">
                    <SelectBox label="시도 선택" value={selectedSido} options={['전북특별자치도']} onChange={setSelectedSido} />
                    <SelectBox label="시군구" value={selectedSigun} options={Object.keys(REGION_DATA)} onChange={handleSigunSelect} />
                    <button 
                      onClick={() => { /* 카카오 API 검색 로직 실행 */ }}
                      className="w-full bg-blue-600 text-white py-3 rounded-md font-bold mt-2"
                    >검색</button>
                  </div>
                ) : (
                  /* 기획안 4번: 이름 검색 */
                  <div className="space-y-4">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="대피소 이름을 입력하세요." 
                        className="w-full p-3 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button className="absolute right-2 top-2 bg-blue-600 text-white p-1.5 rounded-md">
                        <Search size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* 기획안 3, 5번: 검색 결과 리스트 (예시 데이터) */}
                <div className="mt-6 space-y-3">
                  <p className="text-xs text-slate-500 font-medium">검색 결과 {shelterResults.length}건</p>
                  
                  {/* 리스트 아이템 예시 - 나중에 shelterResults.map(...)으로 돌리시면 됩니다 */}
                  <div 
                    onClick={() => setSelectedShelter({name: '전주풍남초등학교(운동장)', addr: '전북특별자치도 전주시 완산구 관선3길 15'})}
                    className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group"
                  >
                    <h4 className="font-bold text-slate-800 group-hover:text-blue-700">전주풍남초등학교(운동장)</h4>
                    <p className="text-xs text-slate-500 mt-1">지진해일대피소</p>
                    <div className="flex items-center gap-1 mt-2 text-slate-400 text-[11px]">
                      <MapPin size={12} />
                      <span>전북특별자치도 전주시 완산구...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeMenu === 'address' ? (
            // ★ 주소 검색
            /* 주소 검색 메뉴를 눌렀을 때만 나타나는 내용 */
            <>
              <div className="flex border-b text-sm font-medium sticky top-0 bg-white z-10">
                <button 
                  onClick={() => setAddressType('road')}
                  className={`flex-1 py-3 ${addressType === 'road' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}
                >도로명 주소</button>
                <button 
                  onClick={() => setAddressType('jibun')}
                  className={`flex-1 py-3 ${addressType === 'jibun' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}
                >지번 주소</button>
              </div>

              <div className="p-4 space-y-4">
                {addressType === 'road' ? (
                  <div className="space-y-4">
                    <SelectBox label="시도 선택" value={selectedSido} options={['전북특별자치도']} onChange={setSelectedSido} />
                    <SelectBox label="시군 선택" value={selectedSigun} options={Object.keys(REGION_DATA)} onChange={handleSigunSelect} />
                    <SelectBox label="구 선택" value={selectedGoo} options={REGION_DATA[selectedSigun] || []} disabled={!REGION_DATA[selectedSigun]?.length} onChange={setSelectedGoo} />
                    <SelectBox label="초성 선택" value={selectedInitial} onChange={setSelectedInitial} />
                    <SelectBox label="도로명 선택" value={selectedRoad} onChange={setSelectedRoad} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <SelectBox label="시도 선택" value={selectedSido} options={['전북특별자치도']} onChange={setSelectedSido} />
                    <SelectBox label="시군 선택" value={selectedSigun} options={Object.keys(REGION_DATA)} onChange={handleSigunSelect} />
                    <SelectBox label="구 선택" value={selectedGoo} options={REGION_DATA[selectedSigun] || []} disabled={!REGION_DATA[selectedSigun]?.length} onChange={setSelectedGoo} />
                    <SelectBox label="읍면동 선택" value={selectedDong} options={getDongOptions()} disabled={getDongOptions().length === 0} onChange={setSelectedDong} />
                  </div>
                )}
              </div>
            </>
          ) : activeMenu === null ? (
            /* 초기 홈 화면 (아무것도 안 눌렀을 때) */
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                 <MapPin size={32} className="text-slate-200" />
              </div>
              <p className="text-sm leading-relaxed">상단의 메뉴를 선택하여<br/>전라북도의 안전 정보를 검색해보세요.</p>
            </div>
          ) : (
            /* 길찾기, 대피소 등 다른 메뉴 (아직 기능 안넣었을 때) */
            <div className="p-10 text-center text-slate-400">해당 기능은 준비 중입니다.</div>
          )}
        </div>

        {/* [3. 하단 고정 영역] 메뉴가 선택되었을 때만 검색하기 버튼 표시 */}
        {activeMenu === 'address' && (
          <div className="p-4 border-t bg-slate-50">
            <button className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95">
              검색하기
            </button>
          </div>
        )}
      </aside>

      {/* 오른쪽 지도 영역 (기존 내용 유지) */}
      <main className="flex-1 relative bg-slate-200">
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale-[20%] brightness-90"
          style={{ backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/127.1,35.8,9,0/1200x800?access_token=YOUR_TOKEN')` }}
        />
        {/* 행정 구역 표시 태그 */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-white/50 font-semibold text-sm">
          전북특별자치도
        </div>
        
        {/* 컨트롤 버튼 (우측 하단) */}
        <div className="absolute right-6 bottom-10 flex flex-col gap-3">
          <div className="flex flex-col bg-white rounded-xl shadow-2xl border overflow-hidden">
            <button className="p-3 hover:bg-slate-50 border-b text-slate-600">+</button>
            <button className="p-3 hover:bg-slate-50 text-slate-600">-</button>
          </div>
          <button className="p-3 bg-white rounded-xl shadow-2xl border text-slate-600 hover:text-blue-600"><User size={20} /></button>
          <button className="p-3 bg-white rounded-xl shadow-2xl border text-slate-600 hover:text-blue-600"><Navigation size={20} className="rotate-45" /></button>
        </div>
      </main>
    </div>
    /* <==================================================================================================> */
  );
};

export default UserMap;