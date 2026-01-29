// src/components/uuser/sideBar/SideMenuData.js
export const SIDE_MENU_DATA = {
  MY_PAGE: [
    { 
      title: '회원정보', 
      items: [
        { name: '내 정보', path: '/myProfile' },
        { name: '내 정보 수정', path: '/editProfileCheck' }
      ] 
      // items가 있으므로 클릭 시 아코디언이 열리고 화살표가 보입니다.
    },
    { 
      title: '내 문의 내역',
      path: '/myInquiryList', // ★ 타이틀 클릭 시 이동할 경로 추가
      items: [] 
      // items가 비어있으므로 화살표가 사라지고 바로 이동만 합니다.
    },
    { 
      title: '서비스 관리', 
      items: [
        { name: '회원 탈퇴', path: '/withdrawal' }
      ] 
    },
  ],
  BEHAVIOR_METHOD: [
    { 
      title: '자연재난행동요령', 
      path: '/behaviorMethod/natural',
      items: [
        { name: '지진', path: '/behaviorMethod/earthQuake' },
        { name: '태풍', path: '/behaviorMethod/typhoon' },
        { name: '홍수', path: '/behaviorMethod/flood' },
        { name: '호우', path: '/behaviorMethod/heavyRain' },
        { name: '산사태', path: '/behaviorMethod/landslide' },
      ] 
    },
    { 
      title: '사회재난행동요령', 
      path: '/behaviorMethod/social', 
      items: [
        { name: '화재', path: '/behaviorMethod/fire' },
        { name: '산불', path: '/behaviorMethod/forestFire' },
        { name: '건축물붕괴', path: '/behaviorMethod/buildingCollapse' },
        { name: '전기, 가스 사고', path: '/behaviorMethod/electricityGasAccident' },
        { name: '철도, 지하철 사고', path: '/behaviorMethod/railwaySubwayAccident' },
      ] 
    },
    { 
      title: '생활안전행동요령', 
      path: '/behaviorMethod/life',
      items: [
        { name: '응급처치', path: '/behaviorMethod/firstAid' },
        { name: '심폐소생술', path: '/behaviorMethod/cpr' },
        { name: '식중독', path: '/behaviorMethod/foodPoisoning' },
        { name: '승강기 안전사고', path: '/behaviorMethod/elevatorAccident' },
        { name: '교통사고', path: '/behaviorMethod/trafficAccident' },
        { name: '산행안전사고', path: '/behaviorMethod/mountainSafety' },
      ] 
    },
  ],
  FACILITY : [
    {
        title: '대피소 소개',
        path: '/facilityList',
        items: []
    },
  ],
  CUSTOMERSERVICE : [
    {
        title: 'FAQ',
        path: '/faq',
        items: []
    },
    {
        title: '1대1 문의',
        path: '/qna',
        items: []
    },
  ],
  COMMUNITY: [
    { 
      title: '공지사항', 
      path: '/userNoticeList',
      items: [],
    },
    { 
      title: '보도자료', 
      path: '/userPressRelList',
      items: [],
    },
    { 
      title: '시민안전교육', 
      path: '/userSafetyEducation',
      items: [],
    },
  ],
  MAIN_SAFETY_POLICIES: [
    { 
      title: '도시안전기본계획', 
      path: '/citySafetyMasterPlan',
      items: [],
    },
    { 
      title: '재난별 안전정책', 
      items: [
        { name: '지진', path: '/earthquakeSafetyPolicy' },
        { name: '태풍·호우', path: '/stormAndFloodSafetyPolicy' },
      ] 
    },
    { 
      title: '시민 안전보험', 
      path: '/citizenSafetyInsurance',
      items: [],
    },
    { 
      title: '풍수해 안전보험', 
      path: '/stormAndFloodInsurance',
      items: [],
    },
  ]
};