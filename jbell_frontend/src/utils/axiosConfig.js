import axios from 'axios';

// 기본 설정
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const TIMEOUT = 10000;

// 공공데이터 API용 별도 인스턴스
const safetyApiClient = axios.create({
  baseURL: '/safety-api', // Vite 프록시를 통해 요청
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  // 개발 환경에서 외부 API 호출 시 withCredentials를 false로 설정
  withCredentials: false,
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url}`, response.status);
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // CORS 에러 처리
    if (error.message === 'Network Error' && !error.response) {
      console.error('[CORS Error] 외부 API 요청이 차단되었습니다. Vite 프록시 설정을 확인하세요.');
      return Promise.reject({
        status: 0,
        message: 'CORS 정책으로 인해 요청이 차단되었습니다. 프록시 설정이 필요합니다.',
        isCorsError: true,
      });
    }

    // 401 에러 처리 (토큰 만료)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          localStorage.setItem('accessToken', data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 에러 메시지 처리
    const errorMessage = error.response?.data?.message || error.message || '요청 처리 중 오류가 발생했습니다.';
    console.error('[API Error]', errorMessage);
    
    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
    });
  }
);

// API 메서드들
export const api = {
  // GET 요청
  get: (url, config = {}) => {
    return apiClient.get(url, config);
  },

  // POST 요청
  post: (url, data = {}, config = {}) => {
    return apiClient.post(url, data, config);
  },

  // PUT 요청
  put: (url, data = {}, config = {}) => {
    return apiClient.put(url, data, config);
  },

  // PATCH 요청
  patch: (url, data = {}, config = {}) => {
    return apiClient.patch(url, data, config);
  },

  // DELETE 요청
  delete: (url, config = {}) => {
    return apiClient.delete(url, config);
  },

  // 파일 업로드
  uploadFile: (url, file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    });
  },

  // 여러 파일 업로드
  uploadFiles: (url, files, onUploadProgress) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },

  // 외부 API 직접 호출 (프록시 우회)
  external: (url, config = {}) => {
    return axios({
      url,
      ...config,
      withCredentials: false,
    });
  },
};

// 공공데이터 API 전용 메서드
export const safetyApi = {
  // 안전보건공단 API 조회
  get: (path, params = {}) => {
    return safetyApiClient.get(path, { params });
  },

};

// 설정 관리 유틸리티
export const configUtils = {
  // baseURL 변경
  setBaseURL: (newBaseURL) => {
    apiClient.defaults.baseURL = newBaseURL;
    console.log(`[API Config] baseURL 변경: ${newBaseURL}`);
  },

  // 현재 baseURL 조회
  getBaseURL: () => {
    return apiClient.defaults.baseURL;
  },

  // timeout 변경
  setTimeout: (newTimeout) => {
    apiClient.defaults.timeout = newTimeout;
    console.log(`[API Config] timeout 변경: ${newTimeout}ms`);
  },

  // withCredentials 설정 변경
  setWithCredentials: (value) => {
    apiClient.defaults.withCredentials = value;
    console.log(`[API Config] withCredentials 변경: ${value}`);
  },

  // 기본 헤더 추가/변경
  setHeader: (key, value) => {
    apiClient.defaults.headers.common[key] = value;
  },

  // 기본 헤더 삭제
  removeHeader: (key) => {
    delete apiClient.defaults.headers.common[key];
  },

  // 설정 초기화
  resetConfig: () => {
    apiClient.defaults.baseURL = BASE_URL;
    apiClient.defaults.timeout = TIMEOUT;
    apiClient.defaults.withCredentials = false;
    apiClient.defaults.headers = {
      'Content-Type': 'application/json',
    };
    console.log('[API Config] 설정 초기화 완료');
  },
};

// 토큰 관리 유틸리티
export const authUtils = {
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  },

  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },

  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },
};

export default api;