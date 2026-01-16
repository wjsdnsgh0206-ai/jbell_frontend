// src/hooks/useWeather.js
import { useState, useEffect, useCallback } from "react";
import { api } from "@/utils/axiosConfig";

const weatherDescKo = {
  200: "번개를 동반한 비", 201: "번개를 동반한 가벼운 비", 202: "번개를 동반한 강한 비",
  230: "가벼운 번개", 231: "번개", 300: "가랑비", 301: "가랑비",
  500: "약간의 비", 501: "비", 502: "강한 비", 503: "매우 강한 비",
  600: "가벼운 눈", 601: "눈", 602: "강한 눈", 701: "옅은 안개", 741: "안개",
  800: "맑음", 801: "구름 조금", 802: "구름 많음", 803: "흐림", 804: "매우 흐림",
};

// 전주시청 기본 좌표
const JEONJU_FALLBACK = {
  lat: 35.8204,
  lon: 127.1087,
  address: "전라북도 전주시"
};

const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const weatherKey = import.meta.env.VITE_API_WEATHER_KEY;

  const normalizeAddress = useCallback((addr) => {
    if (!addr) return addr;
    return addr
      .replace("전북특별자치도", "")
      .replace("전라북도", "")
      .replace("대한민국", "")
      .trim();
  }, []);

  const getWeatherDesc = (id, defaultDesc) => weatherDescKo[id] || defaultDesc;

  // 날씨 API 호출
  const fetchWeather = useCallback(async (lat, lon) => {
    console.log(`[날씨 호출] 좌표: ${lat}, ${lon}`);
    try {
      setIsLoading(true);
      const res = await api.external("/weather-api", {
        params: { lat, lon, appid: weatherKey, units: "metric", lang: "kr" },
      });
      setWeather(res.data);
    } catch (err) {
      console.error("날씨 호출 실패:", err);
      setError("날씨 정보를 불러오지 못했어 😢");
    } finally {
      setIsLoading(false);
    }
  }, [weatherKey]);

  // 좌표를 주소로 변환하고, 전북이 아니면 전주로 강제 전환
  const fetchAddressAndCheckRegion = useCallback((lat, lon) => {
    if (!window.kakao?.maps) return;

    window.kakao.maps.load(() => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      const coord = new window.kakao.maps.LatLng(lat, lon);

      geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const raw = result[0].road_address?.address_name || result[0].address.address_name;
          console.log(`[현재 위치 확인] ${raw}`);

          // 주소에 '전북' 또는 '전라북도'가 포함되어 있는지 확인
          if (raw.includes("전북") || raw.includes("전라북도")) {
            setAddress(normalizeAddress(raw));
          } else {
            // 전북이 아니면 전주 좌표로 날씨 재요청 및 주소 고정
            console.warn(`[지역 이탈] ${raw} -> 전주 데이터로 강제 전환합니다.`);
            fetchWeather(JEONJU_FALLBACK.lat, JEONJU_FALLBACK.lon);
            setAddress(JEONJU_FALLBACK.address);
          }
        } else {
          setAddress("위치 확인 불가");
        }
      });
    });
  }, [normalizeAddress, fetchWeather]);

  useEffect(() => {
    if (!weatherKey) {
      setError("API 키가 설정되지 않았습니다.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        console.log(`[Step 1] 브라우저 좌표: ${latitude}, ${longitude}`);
        
        // 일단 날씨를 불러오고, 주소 확인 후 지역이 다르면 재호출함
        fetchWeather(latitude, longitude);
        fetchAddressAndCheckRegion(latitude, longitude);
      },
      (err) => {
        console.warn(`[Step 1] 좌표 획득 실패: ${err.message}`);
        fetchWeather(JEONJU_FALLBACK.lat, JEONJU_FALLBACK.lon);
        setAddress(JEONJU_FALLBACK.address);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [weatherKey, fetchWeather, fetchAddressAndCheckRegion]);

  return { weather, address, isLoading, error, getWeatherDesc };
};

export default useWeather;