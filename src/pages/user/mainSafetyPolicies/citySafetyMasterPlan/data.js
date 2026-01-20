// src/pages/user/mainSafetyPolicies/citySafetyMasterPlan/data.js
export const citySafetyMasterPlanData = {
  // 1. 페이지 메타 정보
  meta: {
    title: "도시안전기본계획",
    lastUpdated: "2025년 12월 16일",
    breadcrumbs: [
      { label: "홈", path: "/", hasIcon: true },
      { label: "주요안전정책", path: "/safetyPolicy", hasIcon: false },
      { label: "도시안전기본계획", path: "/citySafetyMasterPlan", hasIcon: false },
    ],
    // 탭 구성 (서울안전누리 기준)
    tabs: [
      { label: "개요" },
      { label: "안전관리기구" },
      { label: "재난안전대책본부" },
    ]
  },

  // 2. 탭별 상세 컨텐츠
  contents: [
    // [Tab 0] 개요
    {
      type: "overview",
      subTitle: "개요",
      sections: [
        {
          title: "계획의 정의",
          description: "재난 및 안전관리에 관한 중장기 종합계획",
          boxContent: {
            title: "「재난 및 안전관리 기본조례」 제48조(도시안전 기본계획)",
            items: [
              "① 시장의 시의 재난 및 안전관리 사업의 종합적·체계적 추진을 위하여 5년마다 도시안전에 관한 기본계획을 수립한다.",
              "② 시의 분야별 기본계획 수립 시 재난 및 안전관리와 관련한 사항에 대해서는 제1항의 기본계획을 반영하여야 한다."
            ]
          },
          summary: "금번에 수립된 「제3차 도시안전 기본계획」은 1,2차 도시안전기본계획에 이어 2023-2027까지 5개년 간 도시안전 분야별 중장기 목표를 제시하고 있음"
        },
        {
          title: "계획의 위상 및 역할",
          description: "재난 및 안전관리에 관한 최상위 지침적 종합계획",
          // 다이어그램 구조 데이터
          diagram: [
            {
              title: "선제적 계획",
              desc: "중·장기 관점에서 도시안전 정책방향 및 핵심적인 대책 제시"
            },
            {
              title: "종합적 계획",
              desc: "市의 다양한 재난 및 안전관리 분야/영역 포괄"
            },
            {
              title: "전략적 계획",
              desc: "재난 및 안전관리 분야의 우선순위 및 효율적 자원배분 도모"
            },
            {
              title: "지침적 계획",
              desc: "매년 안전관리계획 및 분야별 계획/사업에 지침 제시"
            }
          ]
        },
        {
          title: "계획의 범위",
          list: [
            { label: "시간적 범위", text: "2023 ~ 2027 (5년)" },
            { label: "공간적 범위", text: "전북특별자치도 전역" }, // 전북 컨텍스트로 수정
            { label: "내용적 범위", text: "재난 및 안전관리 기본법 상 자연재난, 사회재난 및 안전사고 등 도시안전 전 분야 포괄" }
          ]
        }
      ]
    },

    // [Tab 1] 안전관리기구 (더미 데이터)
    {
      type: "organization",
      subTitle: "안전관리기구",
      description: "재난안전 관리를 위한 조직 및 기구 구성 현황입니다.",
      content: "준비 중인 컨텐츠입니다." 
    },

    // [Tab 2] 재난안전대책본부 (더미 데이터)
    {
      type: "headquarters",
      subTitle: "재난안전대책본부",
      description: "비상시 재난안전대책본부의 구성 및 운영 체계입니다.",
      content: "준비 중인 컨텐츠입니다."
    }
  ]
};