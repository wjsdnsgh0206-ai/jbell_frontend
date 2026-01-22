// src/pages/admin/customerservice/faq/AdminFAQData.js

/**
 * [관리자] FAQ 카테고리 목록 (상세 페이지 수정 모드에서 사용)
 */
export const FAQ_CATEGORIES = [
  '회원/계정',
  '결제/환불',
  '이용문의',
  '시스템',
  '기타'
];

/**
 * [관리자] FAQ(자주 묻는 질문) 관리 더미 데이터
 * * * [데이터 구조 규칙]
 * 1. faqId           : <id column="faq_id" property="faqId" />
 * 2. faqCategory     : <result column="category" property="faqCategory"/>
 * 3. faqTitle        : <result column="title" property="faqTitle"/>
 * 4. faqContent      : <result column="content" property="faqContent"/> (DB에는 JSON String, DTO에서는 객체/배열)
 * 5. faqWrite        : <result column="write_id" property="faqWrite"/>
 * 6. faqCreatedAt    : <result column="created_at" property="faqCreatedAt"/>
 * 7. faqUpdatedAt    : <result column="updated_at" property="faqUpdatedAt"/>
 * 8. faqViewCount    : <result column="view_count" property="faqViewCount"/>
 * 9. faqVisibleYn    : <result column="visible_yn" property="faqVisibleYn"/>
 * 10. faqDisplayOrder: <result column="display_order" property="faqDisplayOrder"/>
 */

export const AdminFAQData = [
  // 1. 회원/계정 관련
  { 
    faqId: 1, 
    faqCategory: '회원/계정', 
    faqTitle: '비밀번호를 분실했습니다. 어떻게 찾나요?', 
    faqContent:[
      { type: 'text', value: '비밀번호를 분실하셨을 경우 아래 절차를 따라 재설정이 가능합니다.' },
      { type: 'list', style: 'ordered', items: [
          '로그인 화면 하단의 [비밀번호 찾기] 버튼을 클릭합니다.',
          '가입 시 등록한 이메일 주소를 입력합니다.',
          '해당 이메일로 발송된 인증번호 6자리를 입력합니다.',
          '새로운 비밀번호를 설정하시면 즉시 로그인하실 수 있습니다.'
        ] 
      },
      { type: 'note', value: '※ 이메일이 도착하지 않을 경우 스팸 메일함을 확인해 주세요.' }
    ],
    faqWrite: '관리자', 
    faqCreatedAt: '2025-01-08 09:30:00',
    faqUpdatedAt: '2025-01-08 14:20:00',
    faqViewCount: 120, 
    faqVisibleYn: true, 
    faqDisplayOrder: 1 
  },
  { 
    faqId: 4, 
    faqCategory: '회원/계정', 
    faqTitle: '회원 탈퇴는 어디서 하나요?', 
    faqContent: [
      { type: 'text', value: '회원 탈퇴는 마이페이지 > 회원정보 수정 메뉴 하단에서 진행하실 수 있습니다.\n탈퇴 시 유의사항은 다음과 같습니다.' },
      { type: 'list', style: 'unordered', items: [
          '보유하고 계신 포인트 및 쿠폰은 모두 소멸됩니다.',
          '작성하신 게시물은 자동으로 삭제되지 않으므로, 탈퇴 전 직접 삭제해 주시기 바랍니다.',
          '탈퇴 후 30일간은 동일한 이메일로 재가입이 불가능합니다.'
        ] 
      }
    ],
    faqWrite: '관리자', 
    faqCreatedAt: '2025-01-04 10:00:00',
    faqUpdatedAt: '2025-01-04 10:00:00',
    faqViewCount: 55, 
    faqVisibleYn: false, 
    faqDisplayOrder: 10 
  },
  { 
    faqId: 9, 
    faqCategory: '회원/계정', 
    faqTitle: '개명으로 인한 이름 변경 요청', 
    faqContent: [
      { type: 'text', value: '개명으로 인해 회원 정보의 이름을 변경해야 할 경우, 본인 확인 절차가 필요합니다.' },
      { type: 'text', value: '고객센터 1:1 문의 게시판에 [주민등록초본] 사본을 첨부하여 접수해 주시면 담당자 확인 후 2~3일(영업일 기준) 내에 변경 처리가 완료됩니다.' }
    ],
    faqWrite: '관리자', 
    faqCreatedAt: '2024-12-20 13:15:00',
    faqUpdatedAt: '2024-12-21 09:00:00',
    faqViewCount: 33, 
    faqVisibleYn: true, 
    faqDisplayOrder: 7 
  },

  // 2. 결제/환불 관련
  { 
    faqId: 2, 
    faqCategory: '결제/환불', 
    faqTitle: '카드 결제 영수증은 어디서 출력하나요?', 
    faqContent: [
      { type: 'text', value: '카드 결제 영수증(매출전표)은 결제 대행사(PG) 페이지 또는 마이페이지에서 출력 가능합니다.' },
      { type: 'text', value: '[출력 방법]', isBold: true },
      { type: 'list', style: 'ordered', items: [
          '마이페이지 > 결제 내역 메뉴로 이동',
          '해당 주문 건의 상세보기 클릭',
          '우측 상단의 [영수증 출력] 버튼 클릭'
        ]
      }
    ],
    faqWrite: '운영팀', 
    faqCreatedAt: '2025-01-07 11:00:00',
    faqUpdatedAt: '2025-01-07 11:00:00',
    faqViewCount: 85, 
    faqVisibleYn: true, 
    faqDisplayOrder: 2 
  },
  {
    faqId: 6,
    faqCategory: '결제/환불',
    faqTitle: '환불 규정이 궁금합니다.',
    faqContent: [
      { type: 'text', value: '서비스 이용 약관 제 15조에 의거한 환불 규정입니다.' },
      {
        type: 'table',
        headers: ['환불 요청 시점', '환불 가능 금액'],
        rows: [
          ['결제 후 7일 이내 (미사용)', '전액 환불'],
          ['서비스 이용 시작 후', '잔여 기간 일할 계산 후 차감 환불 (위약금 10% 발생)']
        ]
      }
    ],
    faqWrite: '운영팀',
    faqCreatedAt: '2024-12-30 09:00:00',
    faqUpdatedAt: '2025-01-02 15:30:00',
    faqViewCount: 210,
    faqVisibleYn: true,
    faqDisplayOrder: 4
  },

  // 3. 이용문의 관련
  { 
    faqId: 3, 
    faqCategory: '이용문의', 
    faqTitle: '서비스 이용 시간은 어떻게 되나요?', 
    faqContent: [
      { type: 'text', value: '저희 웹 서비스는 연중무휴 24시간 언제든지 이용 가능합니다.' },
      { type: 'text', value: '단, 시스템 점검 시에는 이용이 일시적으로 제한될 수 있으며, 점검 일정은 공지사항을 통해 사전에 안내해 드립니다.' },
      { type: 'note', value: '※ 고객센터 운영 시간: 평일 09:00 ~ 18:00 (주말/공휴일 휴무)' }
    ],
    faqWrite: 'CS팀', 
    faqCreatedAt: '2025-01-05 08:30:00',
    faqUpdatedAt: '2025-01-05 08:30:00',
    faqViewCount: 340, 
    faqVisibleYn: true, 
    faqDisplayOrder: 3 
  },
  { 
    faqId: 8, 
    faqCategory: '이용문의', 
    faqTitle: '모바일 앱 설치가 안됩니다.', 
    faqContent: [
      { type: 'text', value: '모바일 앱 설치가 원활하지 않을 경우, 다음 사항을 체크해 주세요.' },
      { type: 'list', style: 'unordered', items: [
          '스마트폰의 저장 공간이 충분한지 확인해 주세요.',
          'OS 버전이 최신인지 확인해 주세요. (Android 10 이상, iOS 14 이상 권장)',
          '네트워크(Wi-Fi/LTE) 연결 상태가 불안정할 경우 설치가 중단될 수 있습니다.'
        ]
      },
      { type: 'text', value: '지속적으로 문제가 발생할 경우, 오류 화면을 캡처하여 고객센터로 문의 바랍니다.' }
    ],
    faqWrite: 'CS팀', 
    faqCreatedAt: '2024-12-25 14:00:00',
    faqUpdatedAt: '2024-12-25 14:00:00',
    faqViewCount: 90, 
    faqVisibleYn: true, 
    faqDisplayOrder: 6 
  },

  // 4. 시스템 관련
  { 
    faqId: 5, 
    faqCategory: '시스템', 
    faqTitle: '사이트 접속이 원활하지 않습니다.', 
    faqContent: [
      { type: 'text', value: '일시적인 트래픽 증가 또는 브라우저 캐시 문제일 수 있습니다. 아래 방법으로 조치 후 다시 시도해 보시기 바랍니다.' },
      { type: 'text', value: '[브라우저 캐시 삭제 방법 (Chrome 기준)]', isBold: true },
      { type: 'list', style: 'ordered', items: [
          'Ctrl + Shift + Delete 키를 동시에 누릅니다.',
          "'캐시된 이미지 및 파일'을 체크하고 '데이터 삭제'를 클릭합니다.",
          '브라우저를 완전히 종료 후 재접속합니다.'
        ]
      }
    ],
    faqWrite: '개발팀', 
    faqCreatedAt: '2025-01-02 10:20:00',
    faqUpdatedAt: '2025-01-03 09:10:00',
    faqViewCount: 12, 
    faqVisibleYn: true, 
    faqDisplayOrder: 5 
  },
  { 
    faqId: 10, 
    faqCategory: '시스템', 
    faqTitle: '화면이 깨져서 보입니다.', 
    faqContent:[
      { type: 'text', value: '본 서비스는 Chrome, Edge, Safari 브라우저에 최적화되어 있습니다.' },
      { type: 'text', value: 'Internet Explorer(IE) 등 구형 브라우저에서는 화면이 정상적으로 표시되지 않을 수 있습니다. 최신 브라우저로 업데이트 후 이용해 주시길 권장드립니다.' }
    ],
    faqWrite: '개발팀', 
    faqCreatedAt: '2024-12-15 09:00:00',
    faqUpdatedAt: '2024-12-15 09:00:00',
    faqViewCount: 18, 
    faqVisibleYn: true, 
    faqDisplayOrder: 8 
  },

  // 5. 기타
  { 
    faqId: 7, 
    faqCategory: '기타', 
    faqTitle: '제휴 문의는 어떻게 하나요?', 
    faqContent: [
      { type: 'text', value: '서비스 제휴 및 파트너십 제안은 아래 이메일로 제안서를 보내주시기 바랍니다.' },
      { type: 'table', headers: ['부서', '이메일'], rows: [['마케팅팀', 'partnership@example.com']] },
      { type: 'text', value: '검토 후 긍정적인 제안에 한해 1주일 이내로 회신 드립니다.' }
    ],
    faqWrite: '마케팅', 
    faqCreatedAt: '2024-12-28 16:45:00',
    faqUpdatedAt: '2024-12-28 16:45:00',
    faqViewCount: 40, 
    faqVisibleYn: false, 
    faqDisplayOrder: 99 
  },
  { 
    faqId: 11, 
    faqCategory: '기타', 
    faqTitle: '페이지네이션 테스트용 데이터 1', 
    faqContent: [{ type: 'text', value: '페이지네이션 기능을 테스트하기 위한 임시 데이터입니다.' }],
    faqWrite: '테스터', 
    faqCreatedAt: '2024-12-10 12:00:00',
    faqUpdatedAt: '2024-12-10 12:00:00',
    faqViewCount: 5, 
    faqVisibleYn: true, 
    faqDisplayOrder: 9 
  },
  { 
    faqId: 12, 
    faqCategory: '기타', 
    faqTitle: '페이지네이션 테스트용 데이터 2', 
    faqContent: [{ type: 'text', value: '페이지네이션 기능을 테스트하기 위한 임시 데이터입니다.' }],
    faqWrite: '테스터', 
    faqCreatedAt: '2024-12-10 12:01:00',
    faqUpdatedAt: '2024-12-10 12:01:00',
    faqViewCount: 3, 
    faqVisibleYn: true, 
    faqDisplayOrder: 11 
  },
];