import React, { useEffect, useState } from "react";
import { api } from "@/utils/axiosConfig";

/*
  MainWeather 컴포넌트
  > 작성자 : 최지영 (API 연동 버전)
  > 컴포넌트 이름 : 메인화면의 날씨
  > 컴포넌트 설명 : OpenWeather API 및 카카오 로컬 API를 사용하여 실시간 날씨와 주소를 표시.
*/

const MainWeather = () => {
  const weatherKey = import.meta.env.VITE_API_WEATHER_KEY;
  const [weather, setWeather] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  // 주소 정규화 함수
  const normalizeAddress = (addr) => {
    if (!addr) return addr;
    return addr.replace("전북특별자치도", "").replace("전라북도", "").trim();
  };

  // 날씨 호출 실패 시 폴백 (전북도청 기준)
  const fetchFallbackWeather = async () => {
    try {
      const response = await api.external("/weather-api", {
        params: {
          lat: 35.8204,
          lon: 127.1087,
          appid: weatherKey,
          units: "metric",
          lang: "kr",
        },
      });
      setWeather(response.data);
      setAddress(normalizeAddress("전북특별자치도"));
    } catch {
      setError("날씨 정보를 불러오지 못했어요 😢");
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        
        // 날씨 API 호출
        api.external("/weather-api", {
          params: {
            lat: latitude,
            lon: longitude,
            appid: weatherKey,
            units: "metric",
            lang: "kr",
          },
        })
        .then((res) => setWeather(res.data))
        .catch(() => setError("날씨 정보를 불러오지 못했어요 😢"));

        // 카카오 지도를 통한 주소 변환
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            const geocoder = new window.kakao.maps.services.Geocoder();
            const coord = new window.kakao.maps.LatLng(latitude, longitude);

            geocoder.coord2Address(
              coord.getLng(),
              coord.getLat(),
              (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                  const rawAddress =
                    result[0].road_address?.address_name ||
                    result[0].address.address_name;
                  setAddress(normalizeAddress(rawAddress));
                } else {
                  setAddress("위치 확인 불가");
                }
              }
            );
          });
        } else {
          setAddress("지도 라이브러리 로드 실패");
        }
      },
      () => fetchFallbackWeather(),
      { timeout: 50, maximumAge: 2000 }
    );
  }, [weatherKey]);

  // 로딩 상태 디자인
  if (!weather && !error) {
    return (
      <div className="flex-1 bg-gradient-to-br from-[#70a8e9] to-[#426cb9] rounded-xl flex items-center justify-center text-white animate-pulse min-h-[300px]">
        날씨 정보를 연결 중입니다...
      </div>
    );
  }

  // 에러 상태 디자인
  if (error) {
    return (
      <div className="flex-1 bg-gradient-to-br from-[#70a8e9] to-[#426cb9] rounded-xl flex items-center justify-center text-white min-h-[300px] p-8 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* === 날씨 메인 카드 === */}
      <div className="flex-1 bg-gradient-to-br from-[#70a8e9] to-[#426cb9] rounded-xl border border-white/20 p-5 sm:p-8 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
        
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <p className="text-body-m-bold flex items-center gap-1.5 text-white">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {address || "위치 확인 중..."}
              </p>
              <p className="text-detail-m text-white/70 font-bold">
                {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 기준
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white text-detail-m font-bold shadow-sm">
              Live
            </div>
          </div>

          <div className="flex items-center gap-6 mt-8 mb-4">
            <span className="text-6xl font-black tracking-tighter text-white drop-shadow-md">
              {Math.round(weather.main.temp)}°
            </span>
            <div className="flex flex-col">
              <span className="text-title-m font-black text-white">
                {weather.weather[0].description}
              </span>
              <span className="text-detail-m text-white/80 font-bold">
                체감 {Math.round(weather.main.feels_like)}°
              </span>
            </div>
          </div>
        </div>

        {/* 대기질 정보 영역 (현재 API 구조상 풍속/습도로 대체하거나 하드코딩 유지) */}
        <div className="grid grid-cols-1 gap-2.5 relative z-10">
          {[
            { label: "습도", value: `${weather.main.humidity}%`, statusColor: "text-white", barColor: "bg-white", percent: `${weather.main.humidity}%` },
            { label: "풍속", value: `${weather.wind.speed}m/s`, statusColor: "text-amber-200", barColor: "bg-amber-200", percent: `${Math.min(weather.wind.speed * 10, 100)}%` }
          ].map((item, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 shadow-sm">
              <div className="flex justify-between text-detail-m font-bold mb-2">
                <span className="text-white/90">
                  {item.label} <span className={`${item.statusColor} ml-1`}>{item.value}</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className={`${item.barColor} h-full transition-all duration-700 ease-out`} 
                  style={{ width: item.percent }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === 하단 경보 카드 === */}
      <div className="bg-white border-l-4 border border-[var(--graygray-10)] rounded-xl p-4 flex items-center gap-4 hover:translate-y-[-1px] transition-all">
        <div className="bg-orange-500 text-white w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold">
          <span className="text-[9px] opacity-80 leading-none mb-0.5">LV</span>
          <span className="text-xl leading-none">03</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-detail-m font-bold text-orange-600 mb-0.5">태풍 주의보 발령</p>
          <h4 className="text-body-m-bold text-[var(--graygray-90)] truncate">강풍 동반 집중호우 주의</h4>
        </div>
      </div>
    </div>
  );
};

export default MainWeather;