// src/pages/user/mainSafetyPolicies/stormAndFloodInsurance/data.js

export const stormAndFloodInsuranceData = {
  // 1. 페이지 메타 정보
  meta: {
    title: "풍수해보험",
    lastUpdated: "2025년 12월 16일",
    breadcrumbs: [
      { label: "홈", path: "/", hasIcon: true },
      { label: "주요안전정책", path: "/safetyPolicy", hasIcon: false },
      { label: "풍수해보험", path: "/stormAndFloodInsurance", hasIcon: false },
    ],
    tabs: [
      { label: "제도 안내 및 가입 대상" },
      { label: "가입 방법 및 문의" },
    ]
  },

  // 2. 탭별 상세 컨텐츠
  contents: [
    // [Tab 0] 제도 안내
    {
      type: "info",
      subTitle: "예기치 못한 자연재해, 풍수해보험으로 미리 대비하세요!",
      description: "행정안전부가 관장하고 민영보험사가 운영하는 정책보험으로, 보험료의 일부를 국가와 지자체가 지원합니다.",
      // 핵심 포인트 (카드 형태)
      features: [
        { title: "저렴한 보험료", desc: "정부가 총 보험료의 70% ~ 92% 이상 지원" },
        { title: "실질적 보상", desc: "피해 복구 비용의 최대 90%까지 보상 가능" },
        { title: "폭넓은 대상", desc: "주택, 온실(비닐하우스), 소상공인(상가·공장)" }
      ],
      // 대상 재해 아이콘 리스트용
      disasters: ["태풍", "호우", "홍수", "강풍", "풍랑", "해일", "대설", "지진", "지진해일"],
      // 가입 대상 상세
      targets: [
        {
          category: "주택",
          desc: "단독·공동주택, 세입자 포함 (동산 포함)",
          iconType: "house"
        },
        {
          category: "온실",
          desc: "농·임업용 온실 (비닐하우스 포함)",
          iconType: "sprout"
        },
        {
          category: "소상공인",
          desc: "소상공인 보호법에 따른 상가 및 공장 (재고자산 포함)",
          iconType: "store"
        }
      ]
    },

    // [Tab 1] 가입 방법
    {
      type: "register",
      subTitle: "가입 절차 및 판매 보험사 안내",
      steps: [
        { step: 1, title: "가입 문의", desc: "보험사 콜센터 또는 지자체 재난부서 문의" },
        { step: 2, title: "청약서 작성", desc: "가입 대상물 확인 및 청약서 작성/제출" },
        { step: 3, title: "보험료 납부", desc: "자부담분 보험료 납부 (정부지원금 자동 공제)" },
        { step: 4, title: "가입 완료", desc: "보험 증권 발급 및 효력 발생" }
      ],
      partners: [
        { name: "DB손해보험", phone: "02-2100-5103" },
        { name: "현대해상", phone: "02-2100-5104" },
        { name: "삼성화재", phone: "02-2100-5105" },
        { name: "KB손해보험", phone: "02-2100-5106" },
        { name: "NH농협손해보험", phone: "02-2100-5107" },
        { name: "한화손해보험", phone: "02-2100-5108" },
        { name: "메리츠화재", phone: "02-2100-5109" }
      ]
    }
  ]
};