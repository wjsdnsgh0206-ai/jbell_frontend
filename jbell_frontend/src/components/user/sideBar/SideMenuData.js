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
  BEHAVIORALGUIDE: [
    { 
      title: '자연재난행동요령', 
      items: [
        { name: '지진', path: '/earthquakeActionGuide' },
        { name: '태풍', path: '/typhoonActionGuide' },
        { name: '홍수', path: '/floodActionGuide' },
        { name: '호우', path: '/heavyRainActionGuide' },
        { name: '산사태', path: '/landslideActionGuide' },
      ] 
    },
    { 
      title: '사회재난행동요령', 
      items: [
        { name: '교통사고', path: '/trafficAccidentActionGuide' },
        { name: '화재', path: '/#' },
        { name: '산불', path: '/#' },
        { name: '건축물붕괴', path: '/#' },
        { name: '전기, 가스 사고', path: '/#' },
        { name: '도로터널사고', path: '/#' },
        { name: '철도, 지하철 사고', path: '/#' },
      ] 
    },
    { 
      title: '생활안전행동요령', 
      items: [
        { name: '응급처치', path: '/#' },
        { name: '심페소생술', path: '/#' },
        { name: '식중독', path: '/#' },
        { name: '승강기 안전사고', path: '/#' },
        { name: '산행안전사고', path: '/#' },
      ] 
    },
  ],
  FACILITY : [
    {
        title: '대피소소개',
        path: '/facilityList',
        items: []
    },
  ],
};