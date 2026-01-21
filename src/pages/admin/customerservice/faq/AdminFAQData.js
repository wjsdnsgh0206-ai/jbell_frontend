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
 * 1. id: 고유 식별자 (Number)
 * 2. category: 질문 분류 (회원/계정, 결제/환불, 이용문의, 시스템, 기타)
 * 3. title: 질문 제목 (Q)
 * 4. content: 답변 내용 (A) - HTML 태그 포함 가능
 * 5. author: 작성자 (관리자, 운영팀, CS팀 등)
 * 6. date: 목록 노출용 날짜 (YYYY-MM-DD)
 * 7. createdAt: 실제 등록 일시 (상세페이지용)
 * 8. updatedAt: 최종 수정 일시 (상세페이지용)
 * 9. views: 조회수
 * 10. status: 공개 여부 (true: 공개/사용, false: 비공개/미사용)
 * 11. order: 정렬 순서 (낮을수록 상위 노출)
 */

export const AdminFAQData = [
  // 1. 회원/계정 관련
  { 
    id: 1, 
    category: '회원/계정', 
    title: '비밀번호를 분실했습니다. 어떻게 찾나요?', 
    content:[
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
    author: '관리자', 
    date: '2025-01-08',
    createdAt: '2025-01-08 09:30:00',
    updatedAt: '2025-01-08 14:20:00',
    views: 120, 
    status: true, 
    order: 1 
  },
  { 
    id: 4, 
    category: '회원/계정', 
    title: '회원 탈퇴는 어디서 하나요?', 
    content: [
      { type: 'text', value: '회원 탈퇴는 마이페이지 > 회원정보 수정 메뉴 하단에서 진행하실 수 있습니다.\n탈퇴 시 유의사항은 다음과 같습니다.' },
      { type: 'list', style: 'unordered', items: [
          '보유하고 계신 포인트 및 쿠폰은 모두 소멸됩니다.',
          '작성하신 게시물은 자동으로 삭제되지 않으므로, 탈퇴 전 직접 삭제해 주시기 바랍니다.',
          '탈퇴 후 30일간은 동일한 이메일로 재가입이 불가능합니다.'
        ] 
      }
    ],
    author: '관리자', 
    date: '2025-01-04', 
    createdAt: '2025-01-04 10:00:00',
    updatedAt: '2025-01-04 10:00:00',
    views: 55, 
    status: false, 
    order: 10 
  },
  { 
    id: 9, 
    category: '회원/계정', 
    title: '개명으로 인한 이름 변경 요청', 
    content: [
      { type: 'text', value: '개명으로 인해 회원 정보의 이름을 변경해야 할 경우, 본인 확인 절차가 필요합니다.' },
      { type: 'text', value: '고객센터 1:1 문의 게시판에 [주민등록초본] 사본을 첨부하여 접수해 주시면 담당자 확인 후 2~3일(영업일 기준) 내에 변경 처리가 완료됩니다.' }
    ],
    author: '관리자', 
    date: '2024-12-20', 
    createdAt: '2024-12-20 13:15:00',
    updatedAt: '2024-12-21 09:00:00',
    views: 33, 
    status: true, 
    order: 7 
  },

  // 2. 결제/환불 관련
  { 
    id: 2, 
    category: '결제/환불', 
    title: '카드 결제 영수증은 어디서 출력하나요?', 
    content: [
      { type: 'text', value: '카드 결제 영수증(매출전표)은 결제 대행사(PG) 페이지 또는 마이페이지에서 출력 가능합니다.' },
      { type: 'text', value: '[출력 방법]', isBold: true },
      { type: 'list', style: 'ordered', items: [
          '마이페이지 > 결제 내역 메뉴로 이동',
          '해당 주문 건의 상세보기 클릭',
          '우측 상단의 [영수증 출력] 버튼 클릭'
        ]
      }
    ],
    author: '운영팀', 
    date: '2025-01-07', 
    createdAt: '2025-01-07 11:00:00',
    updatedAt: '2025-01-07 11:00:00',
    views: 85, 
    status: true, 
    order: 2 
  },
  { 
    id: 6, 
    category: '결제/환불', 
    title: '환불 규정이 궁금합니다.', 
    content: [
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
    author: '운영팀', 
    date: '2024-12-30', 
    createdAt: '2024-12-30 09:00:00',
    updatedAt: '2025-01-02 15:30:00',
    views: 210, 
    status: true, 
    order: 4 
  },

  // 3. 이용문의 관련
  { 
    id: 3, 
    category: '이용문의', 
    title: '서비스 이용 시간은 어떻게 되나요?', 
    content: [
      { type: 'text', value: '저희 웹 서비스는 연중무휴 24시간 언제든지 이용 가능합니다.' },
      { type: 'text', value: '단, 시스템 점검 시에는 이용이 일시적으로 제한될 수 있으며, 점검 일정은 공지사항을 통해 사전에 안내해 드립니다.' },
      { type: 'note', value: '※ 고객센터 운영 시간: 평일 09:00 ~ 18:00 (주말/공휴일 휴무)' }
    ],
    author: 'CS팀', 
    date: '2025-01-05', 
    createdAt: '2025-01-05 08:30:00',
    updatedAt: '2025-01-05 08:30:00',
    views: 340, 
    status: true, 
    order: 3 
  },
  { 
    id: 8, 
    category: '이용문의', 
    title: '모바일 앱 설치가 안됩니다.', 
    content: [
      { type: 'text', value: '모바일 앱 설치가 원활하지 않을 경우, 다음 사항을 체크해 주세요.' },
      { type: 'list', style: 'unordered', items: [
          '스마트폰의 저장 공간이 충분한지 확인해 주세요.',
          'OS 버전이 최신인지 확인해 주세요. (Android 10 이상, iOS 14 이상 권장)',
          '네트워크(Wi-Fi/LTE) 연결 상태가 불안정할 경우 설치가 중단될 수 있습니다.'
        ]
      },
      { type: 'text', value: '지속적으로 문제가 발생할 경우, 오류 화면을 캡처하여 고객센터로 문의 바랍니다.' }
    ],
    author: 'CS팀', 
    date: '2024-12-25', 
    createdAt: '2024-12-25 14:00:00',
    updatedAt: '2024-12-25 14:00:00',
    views: 90, 
    status: true, 
    order: 6 
  },

  // 4. 시스템 관련
  { 
    id: 5, 
    category: '시스템', 
    title: '사이트 접속이 원활하지 않습니다.', 
    content: [
      { type: 'text', value: '일시적인 트래픽 증가 또는 브라우저 캐시 문제일 수 있습니다. 아래 방법으로 조치 후 다시 시도해 보시기 바랍니다.' },
      { type: 'text', value: '[브라우저 캐시 삭제 방법 (Chrome 기준)]', isBold: true },
      { type: 'list', style: 'ordered', items: [
          'Ctrl + Shift + Delete 키를 동시에 누릅니다.',
          "'캐시된 이미지 및 파일'을 체크하고 '데이터 삭제'를 클릭합니다.",
          '브라우저를 완전히 종료 후 재접속합니다.'
        ]
      }
    ],
    author: '개발팀', 
    date: '2025-01-02', 
    createdAt: '2025-01-02 10:20:00',
    updatedAt: '2025-01-03 09:10:00',
    views: 12, 
    status: true, 
    order: 5 
  },
  { 
    id: 10, 
    category: '시스템', 
    title: '화면이 깨져서 보입니다.', 
    content:[
      { type: 'text', value: '본 서비스는 Chrome, Edge, Safari 브라우저에 최적화되어 있습니다.' },
      { type: 'text', value: 'Internet Explorer(IE) 등 구형 브라우저에서는 화면이 정상적으로 표시되지 않을 수 있습니다. 최신 브라우저로 업데이트 후 이용해 주시길 권장드립니다.' }
    ],
    author: '개발팀', 
    date: '2024-12-15', 
    createdAt: '2024-12-15 09:00:00',
    updatedAt: '2024-12-15 09:00:00',
    views: 18, 
    status: true, 
    order: 8 
  },

  // 5. 기타
  { 
    id: 7, 
    category: '기타', 
    title: '제휴 문의는 어떻게 하나요?', 
    content: [
      { type: 'text', value: '서비스 제휴 및 파트너십 제안은 아래 이메일로 제안서를 보내주시기 바랍니다.' },
      { type: 'table', headers: ['부서', '이메일'], rows: [['마케팅팀', 'partnership@example.com']] },
      { type: 'text', value: '검토 후 긍정적인 제안에 한해 1주일 이내로 회신 드립니다.' }
    ],
    author: '마케팅', 
    date: '2024-12-28', 
    createdAt: '2024-12-28 16:45:00',
    updatedAt: '2024-12-28 16:45:00',
    views: 40, 
    status: false, 
    order: 99 
  },
  { 
    id: 11, 
    category: '기타', 
    title: '페이지네이션 테스트용 데이터 1', 
    content: [{ type: 'text', value: '페이지네이션 기능을 테스트하기 위한 임시 데이터입니다.' }],
    author: '테스터', 
    date: '2024-12-10', 
    createdAt: '2024-12-10 12:00:00',
    updatedAt: '2024-12-10 12:00:00',
    views: 5, 
    status: true, 
    order: 9 
  },
  { 
    id: 12, 
    category: '기타', 
    title: '페이지네이션 테스트용 데이터 2', 
    content: [{ type: 'text', value: '페이지네이션 기능을 테스트하기 위한 임시 데이터입니다.' }],
    author: '테스터', 
    date: '2024-12-10', 
    createdAt: '2024-12-10 12:01:00',
    updatedAt: '2024-12-10 12:01:00',
    views: 3, 
    status: true, 
    order: 11 
  },
];