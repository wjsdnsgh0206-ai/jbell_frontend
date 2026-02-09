import React, { useState, useEffect, useMemo } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import CommonMap from "@/components/user/modal/CommonMap"; 
import useColdWave from "@/hooks/user/useColdWave"; 
import useEarthquake from "@/hooks/user/useEarthquake";
import useShelter from "@/hooks/user/useShelter";

const DisasterSummarySection = () => {
  const [activeTab, setActiveTab] = useState("실시간 특보");
  
  const { disasterStatus, markers: waveMarkers, isLoading: isWaveLoading, fetchColdWaveData } = useColdWave();
  const { eqMarkers, fetchEarthquakeData, clearMarkers: clearEqMarkers, isLoading: isEqLoading } = useEarthquake();
  const { shelterMarkers, fetchShelters, setShelterMarkers } = useShelter();

  const mapTabs = ["실시간 특보", "대피소"];

  // 1. 데이터 로드 로직
  useEffect(() => {
    if (activeTab === "실시간 특보") {
      setShelterMarkers([]);
      fetchColdWaveData();
      fetchEarthquakeData();
    } else if (activeTab === "대피소") {
      clearEqMarkers();
      fetchShelters("EARTHQUAKE_SHELTER");
    }
  }, [activeTab]);

  // 2. 마커 색상별 이미지 경로 설정 (카카오 기본 리소스나 외부 CDN 활용)
  const MARKER_IMAGES = {
    EARTHQUAKE: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png", // 지진 (빨강)
    COLDWAVE: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_blue.png",  // 한파 (파랑)
    SHELTER: "https://t1.daumcdn.net/localimg/localimages/07/2018/pc/img/marker_spot.png", // 대피소 (기본/노랑계열)
  };

  // 3. 통합 마커 생성 및 색상 주입
  const displayMarkers = useMemo(() => {
    if (activeTab === "실시간 특보") {
      // 한파 마커에 파란색 이미지 주입
      const blueWaves = waveMarkers.map(m => ({ ...m, image: MARKER_IMAGES.COLDWAVE }));
      // 지진 마커에 빨간색 이미지 주입
      const redEqs = eqMarkers.map(m => ({ ...m, image: MARKER_IMAGES.EARTHQUAKE }));
      
      return [...blueWaves, ...redEqs];
    }
    
    // 대피소 마커 주입
    return shelterMarkers.map(m => ({ ...m, image: MARKER_IMAGES.SHELTER }));
  }, [activeTab, waveMarkers, eqMarkers, shelterMarkers]);

  // 4. 지도 중심 및 레벨 설정
  const mapCenter = useMemo(() => {
    if (activeTab === "실시간 특보" && eqMarkers.length > 0) {
      return { lat: Number(eqMarkers[0].lat), lng: Number(eqMarkers[0].lng) };
    }
    return { lat: 35.82422, lng: 127.14795 };
  }, [activeTab, eqMarkers]);

  const mapLevel = useMemo(() => (activeTab === "대피소" ? 5 : 8), [activeTab]);
  const isLoading = isWaveLoading || isEqLoading;

  return (
    <section className="flex-1 h-[416px] relative rounded-xl border border-solid border-gray-200 bg-slate-50 overflow-hidden shadow-sm flex flex-col">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/30 z-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      <div className="w-full h-full relative">
        {/* CommonMap 내부에서 marker.image가 있으면 적용하도록 구현되어 있어야 함 */}
        <CommonMap 
          markers={displayMarkers} 
          regionStatus={activeTab === "실시간 특보" ? disasterStatus : null} 
          center={mapCenter}
          level={mapLevel}
        />

        {/* 탭 버튼 */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 w-[110px]">
          {mapTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2.5 rounded-lg text-detail-m font-bold shadow-md transition-all border ${
                activeTab === tab
                  ? "bg-blue-600 text-white border-blue-600 shadow-blue-100"
                  : "bg-white/95 text-gray-600 border-gray-100 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default DisasterSummarySection;