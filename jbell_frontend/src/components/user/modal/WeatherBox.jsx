import React, { useEffect, useState } from "react";
import { api } from "@/utils/axiosConfig";

const WeatherBox = () => {
  const weatherKey = import.meta.env.VITE_API_WEATHER_KEY;

  const [weather, setWeather] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      error("이 브라우저는 위치 정보를 지원하지 않아요 😢");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { latitude, longitude } = coords;

          /* 1️⃣ 좌표 → 주소 (Kakao) */
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.coord2Address(
            longitude,
            latitude,
            (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const roadAddr = result[0].road_address?.address_name;
                const jibunAddr = result[0].address.address_name;
                setAddress(roadAddr || jibunAddr);
              }
            }
          );

          /* 2️⃣ 날씨 API (OpenWeatherMap) */
          const response = await api.external("/weather-api", {
            params: {
              lat: latitude,
              lon: longitude,
              appid: weatherKey,
              units: "metric",
              lang: "kr",
            },
          });

          setWeather(response.data);
        } catch (err) {
          setError("날씨 정보를 불러오지 못했어요 😢");
          console.error(err);
        }
      },
      () => setError("위치 접근이 거부됐어요 😢"),
      { enableHighAccuracy: true }
    );
  }, []);

  if (error) return <p className="text-white">{error}</p>;
  if (!weather) return <p className="text-white">로딩중...</p>;

  // 최저/최고 기온 제외하고 네가 준 데이터 위주로 구성
  const details = [
    { label: "체감온도", value: `${Math.round(weather.main.feels_like)}°`, color: "text-white" },
    { label: "습도", value: `${weather.main.humidity}%`, color: "text-white" },
    { label: "풍속", value: `${weather.wind.speed} m/s`, color: "text-white" },
    { label: "구름", value: `${weather.clouds.all}%`, color: "text-white" },
  ];

  return (
    <>
      {/* 상단: 지역 및 핵심 정보 */}
      <div className="flex justify-between items-end pb-4 border-b border-white/10">
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center justify-between gap-1.5">
            {/* 주소 영역 */}
            <span className="text-white text-body-m-bold font-semibold truncate mr-2">
              {address || "위치 확인 중"}
            </span>
            {/* 현재위치 뱃지 - 오른쪽 끝 정렬 */}
            <span className="text-[10px] px-1.5 py-0.5 bg-white/20 text-white rounded font-medium whitespace-nowrap">
              현재위치
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-light text-white">
              {Math.round(weather.main.temp)}°
            </span>
            <span className="text-detail-m text-white/60 font-medium">
              {weather.weather[0].description}
            </span>
          </div>
        </div>
      </div>

      {/* 하단: 상세 정보 (최저/최고 기온 제외) */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-4">
        {details.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-detail-m text-white/50 font-medium">
              {item.label}
            </span>
            <span className={`text-detail-m font-semibold ${item.color}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default WeatherBox;