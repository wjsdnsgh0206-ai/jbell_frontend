import React, { useEffect, useState } from "react";
import { api } from "@/utils/axiosConfig";

const WeatherBox = () => {
  const weatherKey = import.meta.env.VITE_API_WEATHER_KEY;
  const [weather, setWeather] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  // 📍 주소 길이 정리 (전북특별자치도 / 전라북도 제거)
  const normalizeAddress = (addr) => {
    if (!addr) return addr;

    return addr
      .replace("전북특별자치도", "")
      .replace("전라북도", "")
      .trim();
  };

  // 📍 위치 권한 거부 시 기본 날씨
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
    // if (!navigator.geolocation) {
    //   setError("이 브라우저는 위치 정보를 지원하지 않아요 😢");
    //   fetchFallbackWeather();
    //   return;
    // }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;

        // 🌤 날씨
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

       // 📍 주소 (카카오 역지오코딩) 수정 부분
      if (window.kakao && window.kakao.maps) {
        // autoload=false일 때 반드시 load 콜백을 사용해야 합니다.
        window.kakao.maps.load(() => {
          const geocoder = new window.kakao.maps.services.Geocoder();
          const coord = new window.kakao.maps.LatLng(latitude, longitude);

          geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const rawAddress =
                result[0].road_address?.address_name ||
                result[0].address.address_name;

              setAddress(normalizeAddress(rawAddress));
            } else {
              setAddress("위치 확인 불가");
            }
          });
        });
      } else {
        setAddress("지도 라이브러리 로드 실패");
      }
    },
    () => {
      fetchFallbackWeather();
    },
    {
      timeout: 5000,
      maximumAge: 300000,
    }
  );
}, [weatherKey]);

  if (error)
    return (
      <div className="h-full flex items-center justify-center text-white text-detail-m">
        {error}
      </div>
    );

  if (!weather)
    return (
      <div className="h-full flex items-center justify-center text-white text-detail-m animate-pulse">
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
      {/* 위치 배지 */}
      <div className="absolute top-0 right-0 z-10">
        <span className="text-detail-s px-2.5 py-1 bg-white/25 text-white rounded-md font-bold whitespace-nowrap backdrop-blur-md border border-white/20">
          {address ? "실시간 위치" : "기본위치"}
        </span>
      </div>

      {/* 상단 */}
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

      {/* 하단 */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-4">
        {details.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-detail-m text-white/60 font-medium">
              {item.label}
            </span>
            <span className="text-detail-m font-bold text-white">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherBox;
