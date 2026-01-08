// src/pages/user/mainSafetyPolicies/citizenSafetyInsurance/data.js

export const citizenSafetyInsuranceData = {
  // 1. 페이지 메타 정보
  meta: {
    title: "시민안전보험",
    lastUpdated: "2025년 12월 16일",
    breadcrumbs: [
      { label: "홈", path: "/", hasIcon: true },
      { label: "주요안전정책", path: "/safetyPolicy", hasIcon: false },
      { label: "시민안전보험", path: "/citizenSafetyInsurance", hasIcon: false },
    ],
    tabs: [
      { label: "제도 안내 및 보장 내용" },
      { label: "청구 절차 및 서류" },
    ]
  },

  // 2. 탭별 상세 컨텐츠
  contents: [
    // [Tab 0] 제도 안내
    {
      type: "info",
      subTitle: "전 도민 자동 가입! 시민안전보험이란?",
      description: "재난, 사고, 범죄 등으로 피해를 입은 도민에게 보험금을 지급하여 생활 안정을 지원하는 제도입니다.",
      highlights: [
        "별도의 가입 절차 없이 전 도민(등록 외국인 포함) 자동 가입",
        "타 보험 가입 여부와 관계없이 중복 보장 가능",
        "전국 어디서나 사고 발생 시 보장 (일부 항목 제외)"
      ],
      // 보장 항목 리스트
      coverageItems: [
        {
          category: "자연재해",
          title: "자연재해 사망",
          amount: "최대 2,000만원",
          desc: "일사병, 열사병 포함 / 태풍, 홍수, 지진 등"
        },
        {
          category: "사회재난",
          title: "폭발·화재·붕괴 상해/사망",
          amount: "최대 2,000만원",
          desc: "사고로 인한 사망 또는 후유장해 발생 시"
        },
        {
          category: "교통",
          title: "대중교통 이용 중 상해/사망",
          amount: "최대 1,500만원",
          desc: "버스, 택시, 지하철, 기차 등 탑승 중 사고"
        },
        {
          category: "교통",
          title: "스쿨존 교통사고 부상",
          amount: "최대 1,000만원",
          desc: "만 12세 이하 / 부상등급 1~5급 판정 시"
        },
        {
          category: "생활안전",
          title: "강도 상해 사망/후유장해",
          amount: "최대 1,000만원",
          desc: "강도에 의해 신체적 피해를 입은 경우"
        },
        {
          category: "생활안전",
          title: "농기계 사고 상해/사망",
          amount: "최대 1,500만원",
          desc: "농기계 운전 또는 탑승 중 발생한 사고"
        }
      ]
    },

    // [Tab 1] 청구 절차
    {
      type: "process",
      subTitle: "보험금 청구 절차 안내",
      steps: [
        { step: 1, title: "사고 발생", desc: "사고 발생 즉시 경찰서/소방서 신고" },
        { step: 2, title: "청구서 접수", desc: "보험사 콜센터 문의 및 서류 접수 (팩스/이메일)" },
        { step: 3, title: "심사 및 지급", desc: "보험사 심사 후 계좌로 보험금 입금 (7일 이내)" }
      ],
      documents: [
        "보험금 청구서 (보험사 양식)",
        "주민등록등(초)본 (사고 당시 거주지 확인용)",
        "신분증 사본 및 통장 사본",
        "사고 입증 서류 (진단서, 사고사실확인원 등)"
      ],
      contact: {
        name: "한국지방재정공제회 콜센터",
        phone: "1577-5939",
        fax: "02-1234-5678"
      }
    }
  ]
};