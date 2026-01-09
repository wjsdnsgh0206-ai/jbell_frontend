import React, { useEffect, useState } from "react";
import { api } from "@/utils/axiosConfig";

const WeatherBox = () => {
  const weatherKey = import.meta.env.VITE_API_WEATHER_KEY;
  const [weather, setWeather] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  const normalizeAddress = (addr) => {
    if (!addr) return addr;
    return addr.replace("전북특별자치도", "").replace("전라북도", "").trim();
  };

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
        api
          .external("/weather-api", {
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
      () => {
        fetchFallbackWeather();
      },
      { timeout: 5000, maximumAge: 300000 }
    );
  }, [weatherKey]);

  if (error)
    return (
      <div className="h-full flex items-center justify-center text-white text-[12px] md:text-detail-m">
        {error}
      </div>
    );

  if (!weather)
    return (
      <div className="h-full flex items-center justify-center text-white text-[12px] md:text-detail-m animate-pulse">
        날씨 확인 중...
      </div>
    );

  const details = [
    { label: "체감온도", value: `${Math.round(weather.main.feels_like)}°` },
    { label: "습도", value: `${weather.main.humidity}%` },
    { label: "풍속", value: `${weather.wind.speed}m/s` },
    { label: "구름", value: `${weather.clouds.all}%` },
  ];

  return (
    <div className="relative h-full flex flex-col justify-between">
      {/* 상단 섹션 */}
      <div className="flex flex-col flex-1 justify-center pb-2 border-b border-white/10">
        <div className="flex justify-between items-start mb-1 md:mb-0">
          {/* 모바일에서 주소가 너무 길면 짤릴 수 있으니 폰트 크기 미세 조정 */}
          <span className="text-white text-[14px] md:text-body-m-bold truncate block max-w-[150px] md:max-w-full font-bold">
            {address || "위치 계산 중..."}
          </span>
          <span className="text-[10px] md:text-detail-s px-2 py-0.5 md:py-1 bg-white/25 text-white rounded-md font-bold whitespace-nowrap backdrop-blur-md border border-white/20">
            {address ? "실시간 위치" : "기본위치"}
          </span>
        </div>
        
        <div className="flex items-baseline gap-2">
          {/* 모바일 온도 텍스트 크기 최적화 */}
          <span className="text-[32px] md:text-title-xl mt-1 text-white font-black">
            {Math.round(weather.main.temp)}°
          </span>
          <span className="text-[12px] md:text-body-s text-white/80 font-medium">
            {weather.weather[0].description}
          </span>
        </div>
      </div>

      {/* 하단 상세 정보 섹션 */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:gap-y-2.5 pt-3 md:pt-4">
        {details.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            {/* 모바일 라벨 폰트 크기 조정 */}
            <span className="text-[11px] md:text-detail-m text-white/60 font-medium">
              {item.label}
            </span>
            <span className="text-[11px] md:text-detail-m font-bold text-white">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherBox;