import { useState, useEffect, useCallback } from "react";
import { weatherService } from '@/services/api';

// 날씨 상태 한글 매핑
const weatherDescKo = {
  200: "번개와 비", 201: "번개와 가벼운 비", 202: "번개와 강한 비",
  230: "가벼운 번개", 231: "번개", 300: "가랑비", 301: "가랑비",
  500: "약간의 비", 501: "비", 502: "강한 비", 503: "매우 강한 비",
  600: "가벼운 눈", 601: "눈", 602: "강한 눈", 701: "옅은 안개", 741: "안개",
  800: "맑음", 801: "구름 조금", 802: "구름 많음", 803: "흐림", 804: "매우 흐림",
};

const JEONJU_FALLBACK = {
  lat: 35.8204,
  lon: 127.1087,
  address: "전라북도 전주시"
};

const useWeather = () => {
  const [weatherData, setWeatherData] = useState({
    current: null,
    dust: null,
    address: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const weatherKey = import.meta.env.VITE_API_WEATHER_KEY;

  // 날씨 코드 변환 함수
  const getWeatherDesc = useCallback((id, defaultDesc) => {
    return weatherDescKo[id] || defaultDesc;
  }, []);

  const fetchAllWeatherData = useCallback(async (lat, lon, addr) => {
    try {
      setIsLoading(true);
      const params = { lat, lon, appid: weatherKey, units: "metric", lang: "kr" };

      // 날씨와 미세먼지 데이터를 동시에 호출
      const [current, dust] = await Promise.all([
        weatherService.getWeather(params),
        weatherService.getWeatherDust(params)
      ]);

      setWeatherData({
        current,
        dust,
        address: addr
      });
    } catch (err) {
      console.error("데이터 호출 실패:", err);
      setError("날씨 정보를 불러오지 못했어 😢");
    } finally {
      setIsLoading(false);
    }
  }, [weatherKey]);

  const checkRegionAndFetch = useCallback((lat, lon) => {
    if (!window.kakao?.maps) return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    const coord = new window.kakao.maps.LatLng(lat, lon);

    geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
      let finalLat = lat;
      let finalLon = lon;
      let finalAddr = "";

      if (status === window.kakao.maps.services.Status.OK) {
        const rawAddr = result[0].road_address?.address_name || result[0].address.address_name;
        
        if (rawAddr.includes("전북") || rawAddr.includes("전라북도")) {
          finalAddr = rawAddr.replace(/전북특별자치도|전라북도|대한민국/g, "").trim();
        } else {
          console.warn("지역 이탈 -> 전주 데이터로 전환");
          finalLat = JEONJU_FALLBACK.lat;
          finalLon = JEONJU_FALLBACK.lon;
          finalAddr = JEONJU_FALLBACK.address;
        }
      } else {
        finalLat = JEONJU_FALLBACK.lat;
        finalLon = JEONJU_FALLBACK.lon;
        finalAddr = JEONJU_FALLBACK.address;
      }

      fetchAllWeatherData(finalLat, finalLon, finalAddr);
    });
  }, [fetchAllWeatherData]);

  useEffect(() => {
    if (!weatherKey) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => checkRegionAndFetch(coords.latitude, coords.longitude),
      () => checkRegionAndFetch(JEONJU_FALLBACK.lat, JEONJU_FALLBACK.lon),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [weatherKey, checkRegionAndFetch]);

  return { 
    weather: weatherData.current, 
    dust: weatherData.dust, 
    address: weatherData.address, 
    isLoading, 
    error,
    getWeatherDesc 
  };
};

export default useWeather;