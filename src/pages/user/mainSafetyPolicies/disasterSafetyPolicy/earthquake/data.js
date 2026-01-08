export const earthquakeSafetyPolicyData = {
  // 1. 페이지 메타 정보
  meta: {
    title: "지진",
    lastUpdated: "2025년 12월 16일",
    breadcrumbs: [
      { label: "홈", path: "/", hasIcon: true },
      { label: "주요안전정책", path: "/earthquakeSafetyPolicy", hasIcon: false },
      { label: "재난별 안전정책", path: "/earthquakeSafetyPolicy", hasIcon: false },
      { label: "지진", hasIcon: false },
    ],
    tabs: [
      { label: "현황" },
      { label: "주요정책" },
    ]
  },

  // 2. 탭별 상세 컨텐츠
  contents: [
    // [Tab 0] 현황 (기존 유지)
    {
      type: "status",
      subTitle: "우리나라 지진 발생 현황 (출처 : 기상청)",
      definitions: [
        { 
          label: "규모 3.0 이상", 
          desc: "규모 3.0(실내의 일부 사람이 느낄 수 있는 정도) 이상의 지진",
          colorClass: "text-[#009900]" 
        },
        { 
          label: "체감지진", 
          desc: "사람이 지진동을 체감한 지진",
          colorClass: "text-[#FF0000]" 
        },
        { 
          label: "총 횟수", 
          desc: "국내에서 발생한 규모 2.0 이상의 지진발생횟수",
          colorClass: "text-graygray-90" 
        }
      ],
      chartImage: {
        // 실제 프로젝트에서는 import한 이미지 변수나 올바른 경로를 넣으세요.
        src: "https://c.animaapp.com/PZUA6SpP/img/chart-placeholder.png", 
        alt: "연도별 국내지진 발생추이 그래프",
        caption: "<연도별 국내지진 발생추이>"
      }
    },

    // [Tab 1] 주요정책 (서울안전누리 기반 4대 핵심 분야)
    {
      type: "policy",
      subTitle: "지진에 강한 도시를 만들기 위한 4대 핵심 분야",
      policies: [
        {
          id: 1,
          category: "공공시설물",
          title: "공공시설물 내진율 100% 조기 달성",
          description: "도로, 상하수도, 소방서 등 핵심 공공시설물의 내진 성능을 2030년까지 100% 확보하여 지진 발생 시 도시 기능을 유지합니다.",
          tags: ["2030년 목표", "인프라 강화"]
        },
        {
          id: 2,
          category: "민간건축물",
          title: "민간건축물 내진보강 활성화 지원",
          description: "내진 성능 평가 의무화 대상을 확대하고, 자발적 내진 보강 시 건폐율·용적률 완화 및 공사비 일부를 지원합니다.",
          tags: ["인센티브 제공", "안전 인증제"]
        },
        {
          id: 3,
          category: "대응시스템",
          title: "지진 조기경보 및 대응 시스템 고도화",
          description: "기상청과 연계한 즉각적인 재난 문자 발송 시스템을 구축하고, 옥외 대피소 안내 표지판을 정비하여 신속한 대피를 유도합니다.",
          tags: ["골든타임 확보", "스마트 시스템"]
        },
        {
          id: 4,
          category: "교육/훈련",
          title: "실전형 지진 대피 훈련 및 교육 확대",
          description: "단순 주입식 교육을 탈피하여 지진 체험관 운영, 찾아가는 안전 교육, 가상현실(VR) 체험 등 시민 참여형 훈련을 강화합니다.",
          tags: ["시민 참여", "체험형 교육"]
        }
      ]
    }
  ]
};