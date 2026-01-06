import React, { useEffect, useState } from "react";
import axios from "axios";

const WeatherBox = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherByLocation = () => {
      if (!navigator.geolocation) {
        setError("이 브라우저는 위치 정보를 지원하지 않아요 😢");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            // OpenWeatherMap에서 발급받은 api키
            const API_KEY = "75417221f6cc71ddcab1eb8beedd8d8a";

            const response = await axios.get(
              // api 요청할 주소
              "https://api.openweathermap.org/data/2.5/weather",
              {
                params: {
                  lat: latitude,
                  lon: longitude,
                  appid: API_KEY,
                  units: "metric",
                  lang: "kr",
                },
              }
            );

            setWeather(response.data);
          } catch (err) {
            setError("날씨 정보를 불러오지 못했어요 😢");
            console.error(err);
          }
        },
        () => {
          setError("위치 접근이 거부됐어요 😢");
        }
      );
    };

    fetchWeatherByLocation();
  }, []);

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc" }}>
      <h2>내 위치 현재 날씨</h2>

      {error && <p>{error}</p>}
      {!weather && !error && <p>로딩중...</p>}

      {weather && (
        <>
          <p>📍 지역: {weather.name}</p>
          <p>🌡 기온: {weather.main.temp}℃</p>
          <p>💧 습도: {weather.main.humidity}%</p>
          <p>☁ 날씨: {weather.weather[0].description}</p>
          <p>🌬 풍속: {weather.wind.speed} m/s</p>
        </>
      )}
    </div>
  );
};

export default WeatherBox;
