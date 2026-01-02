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
};