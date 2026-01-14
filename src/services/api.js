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
const messageApi = axios.create({ baseURL: '/message-api'});
const earthquakeApi = axios.create({ baseURL: '/earthquake-api'});
// 기상청 지진·지진특보용
const kmaApi = axios.create({ baseURL: '/kma-api/api',});

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


/* =========================================================
   재난 · 지진 관련 API - 최지영 * 건드리지 말 것 *
========================================================= */
export const disasterModalService = {

  /* -----------------------------
     재난문자 (CBS)
  ----------------------------- */
  getDisasters: async (params) => {
    // /message-api/DSSP-IF-00247
    const response = await messageApi.get('/DSSP-IF-00247', { params });
    return response.data;
  },

  /* -----------------------------
     지진 발생 정보 (행안부)
  ----------------------------- */
  getEarthquake: async (params) => {
    // /safety-api/DSSP-IF-00706
    const response = await safetyApi.get('/DSSP-IF-00706', { params });
    return response.data;
  },

  /* -----------------------------
     지진 옥외대피소 (행안부)
  ----------------------------- */
  getEarthquakeOutdoors: async (params) => {
    // /safety-api/DSSP-IF-00103
    const response = await safetyApi.get('/DSSP-IF-00103', { params });
    return response.data;
  },

  /* -----------------------------
     ⭐ 지진 특보 (기상청)
     https://apihub.kma.go.kr
  ----------------------------- */
  getEarthquakeWarning: async (params) => {
    const response = await kmaApi.get(
      '/typ09/url/eqk/urlNewNotiEqk.do',
      {
        params: {
          authKey: import.meta.env.VITE_API_VITE_KMA_EARTHQUAKE_WARING_KEY,
          orderTy: 'xml',      // 기상청은 기본 XML
          ...params,
        },
      }
    );
    return response.data;
  },
};