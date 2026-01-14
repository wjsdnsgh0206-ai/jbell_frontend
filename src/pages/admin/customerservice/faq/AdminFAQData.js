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
    content: `
      <p>비밀번호를 분실하셨을 경우 아래 절차를 따라 재설정이 가능합니다.</p>
      <br/>
      <ol>
        <li>로그인 화면 하단의 <strong>[비밀번호 찾기]</strong> 버튼을 클릭합니다.</li>
        <li>가입 시 등록한 이메일 주소를 입력합니다.</li>
        <li>해당 이메일로 발송된 인증번호 6자리를 입력합니다.</li>
        <li>새로운 비밀번호를 설정하시면 즉시 로그인하실 수 있습니다.</li>
      </ol>
      <br/>
      <p style="color: #888; font-size: 0.9em;">※ 이메일이 도착하지 않을 경우 스팸 메일함을 확인해 주세요.</p>
    `,
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
    content: `
      <p>회원 탈퇴는 <strong>마이페이지 > 회원정보 수정</strong> 메뉴 하단에서 진행하실 수 있습니다.</p>
      <p>탈퇴 시 유의사항은 다음과 같습니다.</p>
      <br/>
      <ul>
        <li>- 보유하고 계신 포인트 및 쿠폰은 모두 소멸됩니다.</li>
        <li>- 작성하신 게시물은 자동으로 삭제되지 않으므로, 탈퇴 전 직접 삭제해 주시기 바랍니다.</li>
        <li>- 탈퇴 후 30일간은 동일한 이메일로 재가입이 불가능합니다.</li>
      </ul>
    `,
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
    content: `
      <p>개명으로 인해 회원 정보의 이름을 변경해야 할 경우, 본인 확인 절차가 필요합니다.</p>
      <p>고객센터 1:1 문의 게시판에 <strong>[주민등록초본]</strong> 사본을 첨부하여 접수해 주시면</p>
      <p>담당자 확인 후 2~3일(영업일 기준) 내에 변경 처리가 완료됩니다.</p>
    `,
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
    content: `
      <p>카드 결제 영수증(매출전표)은 결제 대행사(PG) 페이지 또는 마이페이지에서 출력 가능합니다.</p>
      <br/>
      <p><strong>[출력 방법]</strong></p>
      <p>1. 마이페이지 > <strong>결제 내역</strong> 메뉴로 이동</p>
      <p>2. 해당 주문 건의 상세보기 클릭</p>
      <p>3. 우측 상단의 [영수증 출력] 버튼 클릭</p>
    `,
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
    content: `
      <p>서비스 이용 약관 제 15조에 의거한 환불 규정입니다.</p>
      <br/>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
        <tr style="background-color: #f9f9f9;">
          <th style="border: 1px solid #ddd; padding: 8px;">환불 요청 시점</th>
          <th style="border: 1px solid #ddd; padding: 8px;">환불 가능 금액</th>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">결제 후 7일 이내 (미사용)</td>
          <td style="border: 1px solid #ddd; padding: 8px;">전액 환불</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">서비스 이용 시작 후</td>
          <td style="border: 1px solid #ddd; padding: 8px;">잔여 기간 일할 계산 후 차감 환불 (위약금 10% 발생)</td>
        </tr>
      </table>
    `,
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
    content: `
      <p>저희 웹 서비스는 연중무휴 24시간 언제든지 이용 가능합니다.</p>
      <p>단, 시스템 점검 시에는 이용이 일시적으로 제한될 수 있으며,</p>
      <p>점검 일정은 공지사항을 통해 사전에 안내해 드립니다.</p>
      <br/>
      <p><strong>※ 고객센터 운영 시간:</strong> 평일 09:00 ~ 18:00 (주말/공휴일 휴무)</p>
    `,
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
    content: `
      <p>모바일 앱 설치가 원활하지 않을 경우, 다음 사항을 체크해 주세요.</p>
      <br/>
      <ul>
        <li>1. 스마트폰의 저장 공간이 충분한지 확인해 주세요.</li>
        <li>2. OS 버전이 최신인지 확인해 주세요. (Android 10 이상, iOS 14 이상 권장)</li>
        <li>3. 네트워크(Wi-Fi/LTE) 연결 상태가 불안정할 경우 설치가 중단될 수 있습니다.</li>
      </ul>
      <p>지속적으로 문제가 발생할 경우, 오류 화면을 캡처하여 고객센터로 문의 바랍니다.</p>
    `,
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
    content: `
      <p>일시적인 트래픽 증가 또는 브라우저 캐시 문제일 수 있습니다.</p>
      <p>아래 방법으로 조치 후 다시 시도해 보시기 바랍니다.</p>
      <br/>
      <p><strong>[브라우저 캐시 삭제 방법 (Chrome 기준)]</strong></p>
      <p>1. <code>Ctrl + Shift + Delete</code> 키를 동시에 누릅니다.</p>
      <p>2. '캐시된 이미지 및 파일'을 체크하고 '데이터 삭제'를 클릭합니다.</p>
      <p>3. 브라우저를 완전히 종료 후 재접속합니다.</p>
    `,
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
    content: `
      <p>본 서비스는 <strong>Chrome, Edge, Safari</strong> 브라우저에 최적화되어 있습니다.</p>
      <p>Internet Explorer(IE) 등 구형 브라우저에서는 화면이 정상적으로 표시되지 않을 수 있습니다.</p>
      <p>최신 브라우저로 업데이트 후 이용해 주시길 권장드립니다.</p>
    `,
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
    content: `
      <p>서비스 제휴 및 파트너십 제안은 아래 이메일로 제안서를 보내주시기 바랍니다.</p>
      <br/>
      <p><strong>담당 부서:</strong> 마케팅팀</p>
      <p><strong>이메일:</strong> partnership@example.com</p>
      <br/>
      <p>검토 후 긍정적인 제안에 한해 1주일 이내로 회신 드립니다.</p>
    `,
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
    content: '<p>페이지네이션 기능을 테스트하기 위한 임시 데이터입니다.</p>',
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
    content: '<p>페이지네이션 기능을 테스트하기 위한 임시 데이터입니다.</p>',
    author: '테스터', 
    date: '2024-12-10', 
    createdAt: '2024-12-10 12:01:00',
    updatedAt: '2024-12-10 12:01:00',
    views: 3, 
    status: true, 
    order: 11 
  },
];