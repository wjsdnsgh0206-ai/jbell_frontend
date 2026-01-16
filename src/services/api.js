// src/services/api.js
import axios from "axios";

// 1. 기본 백엔드 인스턴스 (8080 서버용)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

// 2. 외부 API 인스턴스 (반드시 함수 사용 전 선언되어야 함)
const safetyApi = axios.create({ baseURL: "/safety-api" });
const weatherApi = axios.create({ baseURL: "/weather-api" }); // 날씨 api
const messageApi = axios.create({ baseURL: "/message-api" }); // 재난문자 api
const earthquakeApi = axios.create({ baseURL: "/earthquake-api" }); // 지진 특보 api
const earthquakeLevelApi = axios.create({ baseURL: "/earthquakeLevel-api" }); // 지진 진도 정보 api
const floodTraceApi = axios.create({ baseURL: "/floodTrace-api" }); // 호우홍수 침수흔적도 api
const sluiceApi = axios.create({ baseURL: "/sluice-api"});

// 기상청 지진·지진특보용
const kmaApi = axios.create({ baseURL: "/kma-api/api" });

export const userService = {
  // 유저 정보 가져오기 (기존 8080 서버)
  getUsers: async (params) => {
    const response = await api.get("/users", { params });
    return response.data;
  },

  // 회원가입
  signup: async (userData) => {
    // Vite 프록시 설정에 의해 /api/auth/signup -> http://localhost:8080/api/auth/signup으로 전달됩니다.
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  checkId: async (userId) => {
    // try-catch를 여기서 하지 않고 호출하는 곳(Component)에서 처리하도록 내보냅니다.
    const response = await api.get('/auth/checkid', { params: { userId } });
    // 정상 응답(200)일 때 서버 응답의 data 필드(false)를 반환
    return response.data.data; 
  },
};

export const shelterService = {
  getShelters: async (params) => {
    // Vite 프록시 설정 덕분에 /safety-api/DSSP-IF-10941 로 요청하면 됩니다.
    const response = await safetyApi.get("/DSSP-IF-10941", { params });
    return response.data;
  },
};

export const facilityService = {
  // 백엔드 리스트 호출 (최대 1000개씩 조회)
  getFacilityList: async (params) => {
    // params: { ctpvNm, sggNm, fcltNm, page }
    const response = await api.get('/facility/list', { params });
    return response.data; // Flux는 JSON 배열 형태로 들어옵니다.
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
    const response = await messageApi.get("/DSSP-IF-00247", { params });
    return response.data;
  },

  /* -----------------------------
     지진 발생 정보 (행안부)
  ----------------------------- */
  getEarthquake: async (params) => {
    // /safety-api/DSSP-IF-00706
    const response = await safetyApi.get("/DSSP-IF-00706", { params });
    return response.data;
  },

  /* -----------------------------
     지진 옥외대피소 (행안부)
  ----------------------------- */
  getEarthquakeOutdoors: async (params) => {
    // /safety-api/DSSP-IF-00103
    const response = await safetyApi.get("/DSSP-IF-00103", { params });
    return response.data;
  },

  /* -----------------------------
      지진 특보 (기상청)
     https://apihub.kma.go.kr
  ----------------------------- */
  getEarthquakeWarning: async (params) => {
    const response = await kmaApi.get("/typ09/url/eqk/urlNewNotiEqk.do", {
      params: {
        authKey: import.meta.env.VITE_API_VITE_KMA_EARTHQUAKE_WARING_KEY,
        orderTy: "xml", // 기상청은 기본 XML
        ...params,
      },
    });
    return response.data;
  },

  /* -----------------------------
      지진 진도 정보 조회 (전국)
  ----------------------------- */
  getEarthquakeLevel: async (params) => {
    const response = await earthquakeLevelApi.get("/DSSP-IF-00109", {
      params: {
        serviceKey: import.meta.env.VITE_API_DISATER_EARTHQUAKE_HISTORY_KEY,
        pageNo: 1,
        numOfRows: 100, // 전국 데이터를 위해 넉넉히 설정
        ...params,
      },
    });
    return response.data;
  },

  /* -----------------------------
호우홍수 침수흔적도 api
  ----------------------------- */
  getFloodTrace: async (params) => {
    const response = await floodTraceApi.get("/DSSP-IF-00117", {
      params: {
        serviceKey: import.meta.env.VITE_API_DISATER_FLOODING_TRACES_KEY,
        pageNo: 1,
        numOfRows: 100, // 전국 데이터를 위해 넉넉히 설정
        ...params,
      },
    });
    return response.data;
  },
/* -----------------------------
   수문 api - 호우홍수탭에서 사용할 api
----------------------------- */
getSluice: async (params) => {
  // axios 인스턴스(sluiceApi)의 baseURL이 "/sluice-api"여야 해!
  const response = await sluiceApi.get("/B500001/dam/sluicePresentCondition/mntlist", {
    params: {
      // 훅에서 넘겨받은 serviceKey를 우선 사용하고, 없으면 env 사용
      serviceKey: params.serviceKey || import.meta.env.VITE_API_DISATER_SLUICE_KEY,
      pageNo: params.pageNo || 1,
      numOfRows: params.numOfRows || 10,
      damcode: params.damcode, // 필수
      stdt: params.stdt,       // 필수 (YYYY-MM-DD)
      eddt: params.eddt,       // 필수 (YYYY-MM-DD)
      _type: 'json',           // 필수
    },
  });
  return response.data;
},
};
