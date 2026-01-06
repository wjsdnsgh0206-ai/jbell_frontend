// src/pages/user/mainSafetyPolicies/disasterSafetyPolicy/stormAndFlood/data.js

export const stormAndFloodData = {
  // 1. 페이지 메타 정보
  meta: {
    title: "태풍·호우",
    lastUpdated: "2025년 12월 16일",
    breadcrumbs: [
      { label: "홈", path: "/", hasIcon: true },
      { label: "주요안전정책", path: "/safetyPolicy", hasIcon: false },
      { label: "재난별 안전정책", path: "/disasterSafetyPolicy", hasIcon: false },
      { label: "태풍·호우", path: "/stormAndFloodSafetyPolicy", hasIcon: false },
    ],
    tabs: [
      { label: "현황" },
      { label: "주요정책" },
    ]
  },

  // 2. 탭별 상세 컨텐츠
  contents: [
    // [Tab 0] 현황
    {
      type: "status",
      subTitle: "기상특보 발표 기준 (출처 : 기상청)",
      // 용어 설명 데이터
      definitions: [
        { 
          title: "호우 주의보/경보",
          items: [
            { label: "주의보", desc: "3시간 강우량이 60mm 이상 또는 12시간 강우량이 110mm 이상 예상될 때" },
            { label: "경보", desc: "3시간 강우량이 90mm 이상 또는 12시간 강우량이 180mm 이상 예상될 때" }
          ],
          colorClass: "text-[#0066CC]" // 파란색
        },
        { 
          title: "태풍 주의보/경보", 
          items: [
            { label: "주의보", desc: "태풍으로 인하여 강풍, 풍랑, 호우, 폭풍해일 현상 등이 주의보 기준에 도달할 것으로 예상될 때" },
            { label: "경보", desc: "태풍으로 인하여 강풍, 풍랑, 호우, 폭풍해일 현상 등이 경보 기준에 도달할 것으로 예상될 때" }
          ],
          colorClass: "text-[#E53935]" // 빨간색
        }
      ],
      // 그래프 이미지
      chartImage: {
        src: "https://c.animaapp.com/PZUA6SpP/img/chart-placeholder-storm.png", 
        alt: "최근 10년 태풍/호우 발생 및 피해 현황 그래프",
        caption: "<최근 10년 태풍/호우 발생 및 피해 현황>"
      }
    },

    // [Tab 1] 주요정책 (4대 핵심 분야)
    {
      type: "policy",
      subTitle: "풍수해로부터 안전한 도시 구현을 위한 4대 핵심 대책",
      policies: [
        {
          id: 1,
          category: "인프라 확충",
          title: "상습 침수지역 배수 개선 사업",
          description: "저지대 및 상습 침수 구역에 대용량 배수 펌프장을 증설하고, 노후 하수관로를 정비하여 집중 호우 시 배수 능력을 대폭 강화합니다.",
          tags: ["배수펌프장", "하수관로 정비"]
        },
        {
          id: 2,
          category: "취약계층 보호",
          title: "침수 취약가구 돌봄 서비스 및 차수판 설치",
          description: "반지하 주택 등 침수 우려 가구에 침수 방지 시설(물막이판) 설치를 무상 지원하고, 공무원-주민 1:1 매칭 돌봄 서비스를 운영합니다.",
          tags: ["물막이판 무상지원", "동행 파트너"]
        },
        {
          id: 3,
          category: "스마트 대응",
          title: "ICT 기반 하천 및 도로 통제 시스템",
          description: "도심 하천 수위와 지하차도 침수 여부를 실시간으로 감지하는 IoT 센서를 설치하여, 위험 감지 시 자동으로 진입 차단막을 가동합니다.",
          tags: ["IoT 센서", "자동 차단 시스템"]
        },
        {
          id: 4,
          category: "예방 점검",
          title: "산사태 및 급경사지 선제적 관리",
          description: "우기 전 산사태 취약 지역과 급경사지에 대한 합동 점검을 실시하고, 사방댐 설치 및 옹벽 보강 공사를 통해 붕괴 사고를 예방합니다.",
          tags: ["산사태 예방", "사방사업"]
        }
      ]
    }
  ]
};