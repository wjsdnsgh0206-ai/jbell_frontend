// src/routest/user/navigationItem.jsx
const navigationItems = [
  {
    label: "재난사고속보",
    path: window.location.hostname === 'localhost' ? "/disaster/accident" : "/disaster/earthquake", // 상위 메뉴 클릭 시 이동할 경로
    children: [
      // 하위 메뉴 추가
      { label: "지진", path: "/disaster/earthquake" },
      { label: "태풍", path: "/disaster/typhoon" },
      { label: "홍수", path: "/disaster/flood" },
      { label: "산사태", path: "/disaster/landslide" },
      { label: "산불", path: "/disaster/forestFire" },
    ],
  },
  {
    label: "행동요령",
    path: "/behaviorMethod/earthQuake",
    children: [
      { label: "자연재난행동요령", path: "/behaviorMethod/earthQuake" },
      { label: "사회재난행동요령", path: "/trafficAccidentBehaviorMethod" },
      { label: "생활안전행동요령", path: "/firstAidBehaviorMethod" },
    ],
  },
  {
    label: "안전정보 지도",
    path: "/map",
    // 하위 메뉴가 없는 경우 children 생략 가능
  },
  {
    label: "대피소 소개",
    path: "/facilityList",
  },
  {
    label: "주요 안전정책",
    path: "/citySafetyMasterPlan",
    children: [
      { label: "도시안전기본계획", path: "/citySafetyMasterPlan" },
      { label: "재난별 안전정책", path: "/earthquakeSafetyPolicy" },
      { label: "시민 안전보험", path: "/citizenSafetyInsurance" },
      { label: "풍수해 안전보험", path: "/stormAndFloodInsurance" },
    ],
  },
  {
    label: "열린마당",
    path: "/userNoticeList",
    children: [
      { label: "공지사항", path: "/userNoticeList" },
      { label: "보도자료", path: "/userPressRelList" },
      { label: "시민안전교육", path: "/userSafetyEducation" },
    ],
  },
  {
    label: "고객센터",
    path: "/faq",
    children: [
      { label: "FAQ", path: "/faq" },
      { label: "1대1 문의", path: "/qna" },
    ],
  },
];

export default navigationItems;
