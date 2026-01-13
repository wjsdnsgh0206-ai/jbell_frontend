import React, { useState, useEffect, useCallback } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import MapControlBtn from "@/components/user/modal/MapControlBtn";
import CommonMap from "@/components/user/modal/CommonMap";
import Papa from "papaparse";

const Earthquake = () => {
  const [activeTab, setActiveTab] = useState("기상특보");
  const [mapMarkers, setMapMarkers] = useState([]);
  const [facilities, setFacilities] = useState({
    shelter: false,
    hospital: false,
    pharmacy: false,
  });

  // 🌟 1. useCallback으로 함수 메모이제이션 (무한 리렌더링 방지)
  const loadShelterData = useCallback(async () => {
    try {
      const response = await fetch("/data/shelter_data.csv");
      if (!response.ok) throw new Error("파일 로드 실패");

      const arrayBuffer = await response.arrayBuffer();
      const decoder = new TextDecoder("euc-kr"); // 엑셀 한글 깨짐 방지
      const csvText = decoder.decode(arrayBuffer);

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rawData = results.data;
          
          // 전북/전주 필터링 (컬럼명: 주소, 위도, 경도 등이 엑셀과 일치해야 함)
          const filtered = rawData.filter(item => {
            const addr = item.주소 || item.ADDR || item.소재지전체주소 || "";
            return addr.includes("전북") || addr.includes("전주") || addr.includes("전라");
          });

          // 마커 데이터 생성
          const formatted = filtered.map((item) => ({
            lat: parseFloat(item.위도 || item.LAT || item.lat),
            lng: parseFloat(item.경도 || item.LOT || item.lng),
            title: item.대피소명 || item.SHLT_NM || "지진대피소",
            content: item.주소 || item.ADDR || item.소재지전체주소
          })).filter(m => !isNaN(m.lat) && !isNaN(m.lng)); // 좌표 없는 데이터 제외

          setMapMarkers(formatted);
          console.log("마커 로드 완료:", formatted.length, "개");
        }
      });
    } catch (error) {
      console.error("데이터 로딩 중 에러:", error);
    }
  }, []);

  // 🌟 2. useEffect 내부에서는 로직을 직접 실행하지 않고 상태 변화만 감시
  useEffect(() => {
    let isMounted = true;

    if (activeTab === "재난안전시설" && facilities.shelter) {
      // 비동기 함수 호출 시 메모리 누수 방지 처리
      if (isMounted) {
        loadShelterData();
      }
    } else {
      setMapMarkers([]);
    }

    return () => { isMounted = false; };
  }, [activeTab, facilities.shelter, loadShelterData]);

  const handleTabClick = (tabId) => setActiveTab((prev) => (prev === tabId ? null : tabId));
  const handleCheck = (key) => setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6">
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="md:text-body-m-bold lg:text-title-m text-body-s-bold text-gray-900">실시간 지진정보</h3>
            <span className="rounded-xl font-bold bg-gray-100 text-gray-500 text-[10px] px-2.5 py-1">특보없음</span>
          </div>
        </div>

        <div className="relative flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden min-h-[400px]">
          <CommonMap markers={mapMarkers} />
          
          <div className="absolute top-3 left-0 right-0 px-3 flex gap-2 z-20 overflow-x-auto no-scrollbar">
            {[{ id: "기상특보", label: "기상특보" }, { id: "지진특보", label: "지진특보" }, { id: "진도정보조회", label: "진도정보조회" }, { id: "재난안전시설", label: "재난안전시설" }].map((tab) => (
              <div key={tab.id} className="relative flex-shrink-0">
                <button
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-4 py-2 rounded-xl border transition-colors ${
                    activeTab === tab.id ? "bg-blue-600 text-white" : "bg-white text-gray-600 border-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
                {tab.id === "재난안전시설" && activeTab === "재난안전시설" && (
                  <div className="absolute top-12 left-0">
                    <FacilityCheckGroup
                      items={[{ id: "shelter", label: "지진옥외대피장소" }, { id: "hospital", label: "병원" }, { id: "pharmacy", label: "약국" }]}
                      facilities={facilities}
                      onCheck={handleCheck}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="absolute bottom-5 right-5 z-20"><MapControlBtn /></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 border border-gray-100 flex-shrink-0">
        <ActionTipBox type="지진" />
      </div>
    </div>
  );
};

export default Earthquake;