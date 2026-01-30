// src/services/api.js
import axios from "axios";
import { JEONBUK_CODE_MAP } from "@/components/user/disaster/disasterCodes";
import dayjs from 'dayjs';

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
const floodTraceApi = axios.create({ baseURL: "/flood Trace-api" }); // 호우홍수 침수흔적도 api
const kmaApi = axios.create({ baseURL: "/kma-api/api" }); // 기상청 지진·지진특보용
const sluiceApi = axios.create({ baseURL: "/sluice-api" }); // 댐수문 api
const landSlideWarningApi = axios.create({ baseURL: "/landSlideWarning-api" });
const weatherWarningApi = axios.create({ baseURL: "/weatherWarning-api" }); // 기상특보 api
const forestFireWarningApi = axios.create({
  baseURL: "/forestFireWarning-api",
}); // 산불위험예보정보 api
const kmaWarningApi = axios.create({ baseURL: "/kma-warning-api" });
const accidentNewsApi = axios.create({ baseURL: "/accidentNews-api" }); // 도로교통 정보 api


export const noticeApi = {
  // 공지사항 전체 목록 조회
  getNoticeDTOList: async () => {
    const response = await api.get("/notice");
    return response.data;
  },

  // 공지사항 상세 조회
  getNoticeDetail: async (id) => {
    const response = await api.get(`/notice/${id}`);
    return response.data;
  },

  // 공지사항 등록
  createNotice: async (noticeData) => {
    // 백엔드 NoticeController의 @PostMapping과 연결
    const response = await api.post("/notice", noticeData);
    return response.data;
  },

  // 공지사항 수정
  updateNotice: async (id, noticeData) => {
    // 백엔드 NoticeController의 @PutMapping("/{id}")과 연결
    const response = await api.put(`/notice/${id}`, noticeData);
    return response.data;
  },

  // 공지사항 삭제
  deleteNotice: async (id) => {
    // 백엔드 NoticeController의 @DeleteMapping("/{id}")과 연결
    const response = await api.delete(`/notice/${id}`);
    return response.data;
  },
};

export const commonService = {
  /**
   * 공통 코드 조회
   * @param {string} groupId - 조회할 그룹 아이디 (예: 'AREA_JB')
   */
  getCodeList: async (groupId) => {
    try {
      // api 인스턴스를 사용하여 백엔드의 /api/common/codes/AREA_JB 호출
      const response = await api.get(`/common/codes/${groupId}`);
      return response.data; // { status: "SUCCESS", data: [{code: '...', name: '...'}, ...] }
    } catch (error) {
      console.error(`코드(${groupId}) 조회 중 에러:`, error);
      throw error;
    }
  }
};



export const userService = {

  // 로그인
  login: async (loginData) => {
    // loginData = { userId, userPw }
    return await axios.post(`/api/auth/login`, loginData);
  },
  // 비밀번호 확인
  verifyPassword: async (verifyData) => {
    return await axios.post(`/api/auth/verify-password`, verifyData);
  },
  // 로그아웃
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    sessionStorage.clear();
    window.location.href = '/';
  },

  // 회원가입
  signup: async (userData) => {
    // Vite 프록시 설정에 의해 /api/auth/signup -> http://localhost:8080/api/auth/signup으로 전달됩니다.
    const response = await api.post("/auth/signup", userData);
    return response.data;
  },


  // 중복 id 체크
  checkId: async (userId) => {
    // try-catch를 여기서 하지 않고 호출하는 곳(Component)에서 처리하도록 내보냅니다.
    const response = await api.get("/auth/checkid", { params: { userId } });
    // 정상 응답(200)일 때 서버 응답의 data 필드(false)를 반환
    return response.data.data;
  },

  // 이메일 인증번호 발송
  requestEmailAuth: async (email) => {
    // 이제 두 번째 인자에 { email }을 직접 넣습니다. (URL 파라미터 아님)
    const response = await axios.post(`/api/auth/email-send`, { email });
    return response.data;
  },

  // 인증번호 확인
  verifyEmailAuth: async (email, code) => {
    const response = await axios.post(`/api/auth/email-verify`, { email, code });
    return response.data.data === true;
  },
  // 회원 상세 정보 조회
    getUserInfo: async (userId) => {
        const response = await api.get(`/auth/userinfo`, {
            params: { userId }
        });
        return response.data; // ApiResponse 객체 반환
    },

    // 회원 정보 수정
    updateProfile: async (data) => {
        const response = await api.post(`/auth/update`, data);
        return response.data;
    },

// ==========================================ID, PW 찾기 =====================
// 3. 아이디 찾기 (인증 성공 후 호출)
  findId: async (email) => {
    // GET /api/auth/find-id?name=...&email=...
    const response = await api.get("/auth/find-id", {
      params: {email }
    });
    return response.data; // ApiResponse.success(userId) 형태
  },

  // 비밀번호 재설정 (컨트롤러: @RequestParam userId, email)
  // 현재 백엔드가 @RequestParam을 사용하므로 params로 전달해야 합니다.
  resetPassword: (userId, email, newPassword) => {
    return api.post('/auth/reset-pw', null, {
      params: { 
        userId: userId, 
        email: email,
        newPassword: newPassword
      }
    }).then(res => res.data);
  },
    checkUserExists: (userId, email) => {
    return api.get('/auth/check-user', {
      params: { userId, email }
    }).then(res => res.data);
  },
  // ==================================== 관리자 ==========================================
  // 3. 회원 목록 조회 (페이징, 검색, 정렬 포함)
  // params 예시: { page: 1, size: 10, memberRegion: '전북', keyword: '홍길동', sortOrder: 'latest' }
  getMemberList: async (params) => {
      return await api.get('/auth/list', { params });
  },

  // 4. 선택 회원 삭제 (논리 삭제 - status 업데이트)
  // ids 예시: ['user1', 'user2']
  deleteMembers: async (ids) => {
      return await api.post('/auth/delete', { ids });
  },

  // 5. 신규 회원 등록 (관리자용)
  // signupData 예시: { userId, userPw, userName, ... }
  registerMember: async (signupData) => {
      return await api.post('/auth/register', signupData);
  },

  // 6. 회원 상세 정보 조회
  getMemberDetail: async (userId) => {
      return await api.get(`/auth/detail/${userId}`);
  },
  updateMember: async (userId, payload) => {
    // payload를 그대로 넘겨야 status가 포함됩니다.
    const response = await api.put(`/auth/update/${userId}`, payload); 
    return response.data;
  }
};

/* =========================================================
   공통 코드 관리 API (System Admin) - [NEW] 추가됨
========================================================= */
export const codeService = {
  // 1. 공통코드 통합 조회
  getAllCodes: async () => {
    const response = await api.get("/common/code/all");
    return response.data;
  },

  // 2. 그룹 중복 체크
  checkGroupDup: async (params) => {
    // params: { groupCode, groupName }
    const response = await api.get("/common/code/check/group", { params });
    return response.data;
  },

  // 3. 상세 중복 체크
  checkSubDup: async (params) => {
    // params: { groupCode, subCode, subName }
    const response = await api.get("/common/code/check/sub", { params });
    return response.data;
  },

  // 4. 그룹 관리 (목록, 상세, 등록, 수정, 삭제)
  getCodeGroups: async () => {
    const response = await api.get("/common/code/groups");
    return response.data;
  },
  getCodeGroup: async (id) => {
    const response = await api.get(`/common/code/groups/${id}`);
    return response.data;
  },
  addGroup: async (data) => {
    const response = await api.post("/common/code/groups", data);
    return response.data;
  },
  updateGroup: async (id, data) => {
    const response = await api.put(`/common/code/groups/${id}`, data);
    return response.data;
  },
  deleteGroup: async (id) => {
    const response = await api.delete(`/common/code/groups/${id}`);
    return response.data;
  },

  // 5. 상세 코드 관리 (목록, 상세, 등록, 수정, 삭제)
  getCodeItems: async (groupId) => {
    const response = await api.get(`/common/code/groups/${groupId}/items`);
    return response.data;
  },
  getCodeItem: async (groupId, itemId) => {
    const response = await api.get(`/common/code/groups/${groupId}/items/${itemId}`);
    return response.data;
  },
  addItem: async (groupId, data) => {
    const response = await api.post(`/common/code/groups/${groupId}/items`, data);
    return response.data;
  },
  updateItem: async (groupId, itemId, data) => {
    const response = await api.put(`/common/code/groups/${groupId}/items/${itemId}`, data);
    return response.data;
  },
  deleteItem: async (groupId, itemId) => {
    const response = await api.delete(`/common/code/groups/${groupId}/items/${itemId}`);
    return response.data;
  }
};

export const shelterService = {
  getShelters: async (params) => {
    // Vite 프록시 설정 덕분에 /safety-api/DSSP-IF-10941 로 요청하면 됩니다.
    const response = await safetyApi.get("/DSSP-IF-10941", { params });
    return response.data;
  },
};

export const facilityService = {
  // 백엔드 리스트 호출 (최대 30개씩 조회)
  getFacilityList: async (params) => {
    // params: { ctpvNm, sggNm, fcltNm, page }
    const response = await api.get("/facility/list", { params });
    return response.data; // Flux는 JSON 배열 형태로 들어옵니다.
  },
  // 2. 시설 상세 조회
  getFacilityDetail: async (fcltId) => {
    // fcltId: 시설 고유 번호
    const response = await api.get(`/facility/${fcltId}`);
    return response.data;
  },

  // 3. 신규 시설 등록
  addFacility: async (formData) => {
    // formData: FacilityDTO 구조의 객체
    const response = await api.post("/facility/add", formData);
    return response.data;
  },

  // 4. 시설 정보 수정
  updateFacility: async (formData) => {
    // formData: fcltId를 포함한 수정 데이터 객체
    const response = await api.put("/facility/update", formData);
    return response.data;
  },

  // 5. 시설 삭제 (단건 및 다건 선택 삭제 통합)
  deleteFacilities: async (ids) => {
    try {
      // DELETE 메서드는 body 데이터를 'data' 속성에 담아서 보내야 합니다.
      const response = await axios.delete('/api/facility/delete', { 
        data: ids 
      });
      return response.data;
    } catch (error) {
      console.error("API 삭제 요청 에러:", error);
      throw error;
    }
  },

  // 6. 외부 API 데이터 동기화 (선택 사항)
  syncFacilities: async () => {
    const response = await api.get("/facility/sync");
    return response.data;
  }
};

/* =========================================================
   FAQ 관리 API (Admin)
========================================================= */
export const faqService = {
  // 1. [관리자용] 목록 조회
  getFaqList: async () => {
    // GET /api/admin/faqlist
    const response = await api.get("/admin/faqlist");
    return response.data;
  },

  // [사용자용] 목록 조회
  getPublicFaqList: async () => {
    // GET /api/faqlist (이전 답변에서 만든 사용자용 컨트롤러 주소)
    const response = await api.get("/faqlist");
    return response.data;
  },

  // 2. [관리자용] 상세 조회
  getFaqDetail: async (faqId) => {
    // GET /api/admin/faqdetail/{faqId}
    const response = await api.get(`/admin/faqdetail/${faqId}`);
    return response.data;
  },

  // [사용자용] 상세 조회
  getPublicFaqDetail: async (faqId) => {
    // GET /api/faqdetail/{faqId}
    const response = await api.get(`/faqdetail/${faqId}`);
    return response.data;
  },

  // 3. 신규 등록
  createFaq: async (payload) => {
    // POST /api/admin/faqadd
    const response = await api.post("/admin/faqadd", payload);
    return response.data;
  },

  // 4. 수정
  updateFaq: async (faqId, payload) => {
    // PUT /api/admin/faqdetail/{faqId}
    const response = await api.put(`/admin/faqdetail/${faqId}`, payload);
    return response.data;
  },

  // 5. 공개/비공개 일괄 변경
  updateFaqStatus: async (payload) => {
    // PUT /api/admin/faqstatus
    // payload: { faqIds: [1,2], visibleYn: "Y" }
    const response = await api.put("/admin/faqstatus", payload);
    return response.data;
  },

  // 6. 삭제 (단일 및 일괄)
  deleteFaq: async (payload) => {
    // POST /api/admin/faqdelete
    // payload: { faqId: [1,2] } (백엔드 DTO 변수명이 faqId 리스트임)
    const response = await api.post("/admin/faqdelete", payload);
    return response.data;
  }
};

/* =========================================================
   1:1 문의 (QnA) 관리 API (Admin & User 공용)
========================================================= */
export const qnaService = {
  // 1. 목록 조회 (관리자용)
  // GET /api/admin/qnalist
  getQnaList: async () => {
    const response = await api.get("/admin/qnalist");
    return response.data;
  },

  // 2. 상세 조회
  // GET /api/admin/qnadetail?qnaId=1
  getQnaDetail: async (qnaId) => {
    const response = await api.get(`/admin/qnadetail`, {
      params: { qnaId }
    });
    return response.data;
  },

  // 3. 문의 삭제 (단건 및 다건)
  // DELETE /api/admin/qnadelete (Body: { qnaIds: [...] })
  deleteQna: async (qnaIds) => {
    // axios.delete는 body를 보낼 때 { data: ... } 형태로 감싸야 함
    // 백엔드 DTO: QnaBulkDelete { qnaIds: List<Long>, userId: String }
    const response = await api.delete("/admin/qnadelete", {
      data: { 
        qnaIds: qnaIds,
        userId: "admin" // 세션 처리가 되어있다면 생략 가능하거나, 필요시 전달
      }
    });
    return response.data;
  },

  // 4. 답변 등록
  // POST /api/qna/answers
  createAnswer: async (payload) => {
    // payload: { qnaId, content, userId }
    const response = await api.post("/qna/answers", payload);
    return response.data;
  },

  // 5. 답변 수정
  // PATCH /api/qna/answers/{answerId}
  updateAnswer: async (answerId, content) => {
    const response = await api.patch(`/qna/answers/${answerId}`, { content });
    return response.data;
  },

  // 6. 답변 삭제
  // DELETE /api/qna/answers/{answerId}
  deleteAnswer: async (answerId) => {
    const response = await api.delete(`/qna/answers/${answerId}`);
    return response.data;
  },

  // 문의 등록
  createQna: async (payload) => {
    // POST /api/qna/add
    const response = await api.post("/qna/add", payload);
    return response.data;
  },

  // 사용자용 목록 조회
  getPublicQnaList: async () => {
    // GET /api/qna/list
    const response = await api.get("/qna/list");
    return response.data;
  },
  
  // 사용자용 상세 조회
  getPublicQnaDetail: async (qnaId) => {
    // GET /api/qna/detail/{qnaId}
    const response = await api.get(`/qna/detail/${qnaId}`);
    return response.data;
  }
};

/* =========================================================
   날씨 관련 API - 최지영 * 건드리지 말 것 *
========================================================= */
export const weatherService = {
  // 기본적인 날씨 정보
  getWeather: async (params) => {
    const response = await weatherApi.get("/weather", { params });
    return response.data;
  },
  // 미세먼지 정보
  getWeatherDust: async (params) => {
    const response = await weatherApi.get("/air_pollution", { params });
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
    const response = await sluiceApi.get(
      "/B500001/dam/sluicePresentCondition/mntlist",
      {
        params: {
          serviceKey:
            params.serviceKey || import.meta.env.VITE_API_DISATER_SLUICE_KEY,
          pageNo: params.pageNo || 1,
          numOfRows: params.numOfRows || 10,
          damcode: params.damcode,
          stdt: params.stdt,
          eddt: params.eddt,
          _type: "json",
        },
      },
    );
    return response.data;
  },

  /* -----------------------------
   기상특보 api 
----------------------------- */
  getWeatherWarning: async (params) => {
    const response = await weatherWarningApi.get("/DSSP-IF-00045", {
      params: {
        serviceKey: import.meta.env.VITE_API_SPECIAL_NOTICE_KEY,
        ...params,
      },
    });
    return response.data;
  },

  /* -----------------------------
    산불위험예보정보  api
----------------------------- */
  // 시도별 산불위험지수 조회
  getForestFireWarning: async (params) => {
    const response = await forestFireWarningApi.get(
      "/forestPointListSidoSearch",
      {
        params: {
          serviceKey: import.meta.env.VITE_FOREST_SERVICE_KEY,
          numOfRows: 20, // 전국 시도 데이터 포함을 위해 20건
          pageNo: 1,
          _type: "json", // JSON으로 요청
          excludeForecast: 0,
          ...params,
        },
      },
    );
    return response.data;
  },

  /* -----------------------------
    산사태 예보발령 api
----------------------------- */

  getLandSlideWarning: async (params) => {
    const response = await landSlideWarningApi.get("/forecastIssueList", {
      params: {
        serviceKey: import.meta.env.VITE_LANDSLIDE_WARNING_SERVICE_KEY,
        pageNo: params.pageNo || 1,
        numOfRows: params.numOfRows || 10,
        _type: "json", // JSON으로 받기 위해 설정
        ...params,
      },
    });
    return response.data;
  },

  /* -----------------------------
    사고속보(도로관련) api
----------------------------- */
  getAccidentNews: async (params) => {
    const response = await accidentNewsApi.get("/eventInfo", {
      params: {
        apiKey: import.meta.env.VITE_API_DISATER_ACCIDENTNEWS_KEY,
        type: params?.type || "all", // 도로 유형 (기본값: 전체)
        eventType: params?.eventType || "all", // 이벤트 유형 (기본값: 전체)
        getType: "json", // 결과 형식 (JSON 고정)
        ...params, // 추가적인 파라미터(minX, minY 등) 대응
      },
    });
    return response.data;
  },

  /* -----------------------------
     [NEW] 특보코드조회 (getPwnCd) - 태풍/한파/호우 등
     params: warningType(2: 호우, 3:한파, 7:태풍), areaCode(선택)
  ----------------------------- */
  getDisasterSpecials: async (params) => {
    const response = await kmaWarningApi.get("/getPwnCd", {
      params: {
        serviceKey: import.meta.env.VITE_API_KMA_WARNING_KEY, // .env에 키 추가 필요
        numOfRows: 500, // 전북 전체 시군구를 커버하기 위해 넉넉히
        pageNo: 1,
        dataType: "JSON",
        fromTmFc: dayjs().subtract(5, 'day').format('YYYYMMDD'), // 오늘 기준 6일 전까지만 조회 가능
        ...params, // warningType 등 넘어옴
      },
    });
    return response.data;
  },
};

export const behaviorMethodService = {
  // [사용자용]
  getUserBehaviorList: async (contentType) => {
    const params = { 
        contentType,
        visibleYn: 'Y',   
        onlyLatest: 'Y'   
    };
    const response = await api.get("/behaviorMethod/list", { params });
    return response.data;
  },

  // [관리자용]
  getAdminBehaviorList: async (params) => {
      // 관리자 페이지에서 넘겨주는 page, size, contentType, onlyLatest 등을 그대로 전달
      const response = await api.get("/behaviorMethod/list", { params });
      return response.data;
  },

  // [상세 조회] - NEW
  getBehaviorMethodDetail: async (contentId) => {
    const response = await api.get(`/behaviorMethod/${contentId}`);
    return response.data;
  },

  // [단건 수정] - NEW
  updateBehaviorMethod: async (contentId, data) => {
    const response = await api.put(`/behaviorMethod/${contentId}`, data);
    return response.data;
  },

  // 2. 행동요령 삭제
  deleteBehaviorMethods: async (ids) => {
    const response = await api.delete("/behaviorMethod", {
      data: { ids } 
    });
    return response.data;
  },

  // 3. 노출 여부 변경
  updateVisibility: async (ids, visibleYn) => {
    const response = await api.patch("/behaviorMethod/visibility", {
      ids,
      visibleYn
    });
    return response.data;
  },

  // [추가] 과거 데이터 정리
  cleanupOldData: async () => {
    const response = await api.delete("/behaviorMethod/admin/cleanup");
    return response.data;
  },
};

export const fileService = {
  // 에디터 이미지 업로드
  uploadEditorImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // [수정 포인트] 3번째 인자에 headers 설정 추가
    const response = await api.post('/file/upload/editor', formData, {
        headers: {
            // 중요: Content-Type을 undefined로 설정해야 
            // 브라우저가 알아서 'multipart/form-data; boundary=...'를 붙여줍니다.
            // 만약 'multipart/form-data'라고 직접 적으면 boundary가 없어서 또 에러가 납니다.
            'Content-Type': undefined 
        }
    });
    return response.data;
  }
};
