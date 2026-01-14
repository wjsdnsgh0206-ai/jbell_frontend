// src/hooks/useWeather.js
import { useState, useEffect, useCallback } from "react";
import { api } from "@/utils/axiosConfig";

// 날씨 코드별 한글 매핑
const weatherDescKo = {
  200: "번개를 동반한 비", 201: "번개를 동반한 가벼운 비", 202: "번개를 동반한 강한 비",
  230: "가벼운 번개", 231: "번개", 300: "가랑비", 301: "가랑비",
  500: "약간의 비", 501: "비", 502: "강한 비", 503: "매우 강한 비",
  600: "가벼운 눈", 601: "눈", 602: "강한 눈", 701: "옅은 안개", 741: "안개",
  800: "맑음", 801: "구름 조금", 802: "구름 많음", 803: "흐림", 804: "매우 흐림",
};

const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // .env 키 정의 (훅 내부로 이동)
  const weatherKey = import.meta.env.VITE_API_WEATHER_KEY;

  const normalizeAddress = (addr) => {
    if (!addr) return addr;
    return addr.replace("전북특별자치도", "").replace("전라북도", "").trim();
  };

  const getWeatherDesc = (id, defaultDesc) => weatherDescKo[id] || defaultDesc;

  // fetchWeather를 useCallback으로 감싸서 무한 루프 방지
  const fetchWeather = useCallback(async (lat, lon, isFallback = false) => {
    try {
      setIsLoading(true);
      const res = await api.external("/weather-api", {
        params: { lat, lon, appid: weatherKey, units: "metric", lang: "kr" },
      });
      setWeather(res.data);
      if (isFallback) setAddress(normalizeAddress("전북특별자치도"));
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError("날씨 정보를 불러오지 못했어요 😢");
    } finally {
      setIsLoading(false);
    }
  }, [weatherKey]);

  useEffect(() => {
    if (!weatherKey) {
      setError("API 키가 설정되지 않았습니다.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        fetchWeather(latitude, longitude);
        
        if (window.kakao?.maps) {
          window.kakao.maps.load(() => {
            const geocoder = new window.kakao.maps.services.Geocoder();
            const coord = new window.kakao.maps.LatLng(latitude, longitude);
            geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const raw = result[0].road_address?.address_name || result[0].address.address_name;
                setAddress(normalizeAddress(raw));
              } else {
                setAddress("위치 확인 불가");
              }
            });
          });
        }
      },
      () => fetchWeather(35.8204, 127.1087, true),
      { timeout: 5000, maximumAge: 300000 }
    );
  }, [weatherKey, fetchWeather]);

  return { weather, address, isLoading, error, getWeatherDesc };
};

export default useWeather;