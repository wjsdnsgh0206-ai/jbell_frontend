import React, { useEffect, useState } from "react";
import { api } from "@/utils/axiosConfig";

const WeatherBox = () => {
  const weatherKey = import.meta.env.VITE_API_WEATHER_KEY;
  const [weather, setWeather] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

 // ✅ 먼저 선언 (중요)
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
      setAddress("전북특별자치도");
    } catch (e) {
      setError("날씨 정보를 불러오지 못했어요 😢");
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("이 브라우저는 위치 정보를 지원하지 않아요 😢");
      fetchFallbackWeather();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;

        // 🌤 날씨
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

        // 📍 주소 (카카오)
        if (window.kakao?.maps?.services) {
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.coord2Address(longitude, latitude, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              setAddress(
                result[0].road_address?.address_name ||
                result[0].address.address_name
              );
            } else {
              setAddress("위치 확인 불가");
            }
          });
        } else {
          setAddress("위치 정보 없음");
        }
      },
      () => {
        fetchFallbackWeather(); // 위치 거부 시
      },
      {
        timeout: 5000,
        maximumAge: 300000,
      }
    );
  }, [weatherKey]);

  if (error) return <div className="p-4 text-white text-detail-m">{error}</div>;
  if (!weather) return <div className="p-4 text-white text-detail-m">날씨 확인 중...</div>;

  const details = [
    { label: "체감온도", value: `${Math.round(weather.main.feels_like)}°`, color: "text-white" },
    { label: "습도", value: `${weather.main.humidity}%`, color: "text-white" },
    { label: "풍속", value: `${weather.wind.speed} m/s`, color: "text-white" },
    { label: "구름", value: `${weather.clouds.all}%`, color: "text-white" },
  ];

  return (
    <>
      <div className="flex justify-between items-end pb-4 border-b border-white/10">
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-white text-body-m-bold font-semibold truncate mr-2">
              {address || "위치 계산 중..."}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 bg-white/20 text-white rounded font-medium whitespace-nowrap">
              {address === "전북특별자치도" ? "기본위치" : "현재위치"}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-light text-white">{Math.round(weather.main.temp)}°</span>
            <span className="text-detail-m text-white/60 font-medium">{weather.weather[0].description}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-4">
        {details.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-detail-m text-white/50 font-medium">{item.label}</span>
            <span className={`text-detail-m font-semibold ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default WeatherBox;