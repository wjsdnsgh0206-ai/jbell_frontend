// src/components/user/modal/WeatherBox.jsx
import React, { useEffect, useState } from "react";
import { api } from "@/utils/axiosConfig";

const WeatherBox = () => {
  const weatherKey = import.meta.env.VITE_API_WEATHER_KEY;
  const [weather, setWeather] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  const normalizeAddress = (addr) => {
    if (!addr) return addr;
    // '전북특별자치도' 또는 '전라북도'를 제거
    return addr.replace(/전북특별자치도|전라북도/g, "").trim();
  };

  const fetchWeather = async (lat, lon, addr = null) => {
    try {
      const response = await api.external("/weather-api", {
        params: {
          lat: lat,
          lon: lon,
          appid: weatherKey,
          units: "metric",
          lang: "kr",
        },
      });
      setWeather(response.data);
      if (addr) setAddress(normalizeAddress(addr));
    } catch {
      setError("날씨 정보를 불러오지 못했어요 😢");
    }
  };

  useEffect(() => {
    // 1. 카카오 맵 라이브러리 로드 대기
    if (!window.kakao || !window.kakao.maps) {
      setError("지도 라이브러리 로드 실패");
      return;
    }

    window.kakao.maps.load(() => {
      if (!navigator.geolocation) {
        // 위치 권한 미지원 시 기본값(전주)
        fetchWeather(35.8204, 127.1087, "지역 정보 없음");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // 역지오코딩 실행
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.coord2Address(longitude, latitude, (result, status) => {
            let finalAddr = "위치 확인 불가";
            if (status === window.kakao.maps.services.Status.OK) {
              finalAddr = result[0].road_address?.address_name || result[0].address.address_name;
            }
            // 주소 판별 후 날씨 정보 가져오기
            fetchWeather(latitude, longitude, finalAddr);
          });
        },
        (err) => {
          // 위치 권한 거부 시 기본값(전주)
          console.warn("위치 권한 거부:", err.message);
          fetchWeather(35.8204, 127.1087, "지역 정보 없음");
        },
        { timeout: 10000, maximumAge: 300000 } // 타임아웃 10초로 연장
      );
    });
  }, [weatherKey]);

  // 에러/로딩 렌더링 생략 (기존과 동일)
  if (error) return <div className="h-full flex items-center justify-center text-white text-detail-m">{error}</div>;
  if (!weather) return <div className="h-full flex items-center justify-center text-white text-detail-m animate-pulse">날씨 확인 중...</div>;

  const details = [
    { label: "체감온도", value: `${Math.round(weather.main.feels_like)}°` },
    { label: "습도", value: `${weather.main.humidity}%` },
    { label: "풍속", value: `${weather.wind.speed}m/s` },
    { label: "구름", value: `${weather.clouds.all}%` },
  ];

  return (
    <div className="relative h-full flex flex-col justify-between">
      <div className="absolute top-0 right-0 z-10">
        <span className="text-detail-s px-2.5 py-1 bg-white/25 text-white rounded-md font-bold whitespace-nowrap backdrop-blur-md border border-white/20">
          {address && address !== "지역 정보 없음" ? "실시간 위치" : "기본위치"}
        </span>
      </div>

      <div className="flex flex-col flex-1 justify-center pb-2 border-b border-white/10">
        <div className="pr-20">
          <span className="text-white text-body-m-bold truncate block">
            {address || "위치 계산 중..."}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-title-xl mt-1 text-white">
              {Math.round(weather.main.temp)}°
            </span>
            <span className="text-body-s text-white/80 font-medium">
              {weather.weather[0].description}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-4">
        {details.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-detail-m text-white/60 font-medium">{item.label}</span>
            <span className="text-detail-m font-bold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherBox;