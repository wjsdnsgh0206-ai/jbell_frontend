// src/services/api.js
import axios from 'axios';


// 1. 기본 백엔드 인스턴스 (8080 서버용)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// 2. 외부 API 인스턴스 (반드시 함수 사용 전 선언되어야 함)
const safetyApi = axios.create({ baseURL: '/safety-api' });
const weatherApi = axios.create({ baseURL: '/weather-api' });

export const userService = {
  // 유저 정보 가져오기 (기존 8080 서버)
  getUsers: async (params) => {
    const response = await api.get('/users', { params });
    return response.data;
  },
};


export const shelterService = {
  getShelters: async (params) => {
    // Vite 프록시 설정 덕분에 /safety-api/DSSP-IF-10941 로 요청하면 됩니다.
    const response = await safetyApi.get('/DSSP-IF-10941', { params });
    return response.data;
  },
};