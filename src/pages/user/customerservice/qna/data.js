// src/pages/user/customerservice/qna/data.js

export const qnaData = [
  {
    id: 1,
    status: 'progress',
    statusText: '답변대기',
    title: '비밀번호 변경이 되지 않습니다.',
    content: '마이페이지에서 비밀번호 변경을 시도했는데 오류가 발생합니다...',
    date: '2024.04.30',
    category: '계정 및 회원정보',
    answer: null
  },
  {
    id: 2,
    status: 'complete',
    statusText: '답변완료',
    title: '서비스 이용 관련 문의드립니다.',
    content: '주말에도 고객센터 상담이 가능한가요?',
    date: '2024.05.01',
    category: '결제 및 서비스 이용',
    answer: {
      title: '안녕하세요. 고객센터입니다.',
      content: '네, 주말 상담은 오전 10시부터 오후 5시까지 가능합니다.\n감사합니다.',
      date: '2024.05.02'
    }
  },
  {
    id: 3,
    status: 'receipt',
    statusText: '접수완료',
    title: '결제 취소 요청',
    content: '어제 결제한 내역을 취소하고 싶습니다.',
    date: '2024.06.01',
    category: '결제 및 서비스 이용',
    answer: null
  },
  {
    id: 4,
    status: 'waiting',
    statusText: '처리중',
    title: '기관 연동이 안돼요',
    content: '타기관 인증서 등록 시 오류가 뜹니다.',
    date: '2025.11.01',
    category: '시스템 및 장애',
    answer: null
  },
  // ... 나머지 id 5~25 데이터는 이 형식에 맞춰 추가하시면 됩니다.
];

/**
 * ID로 QnA 상세 정보를 가져오는 함수
 */
export const getQnADetail = (id) => {
  return qnaData.find(d => d.id === parseInt(id, 10));
};

// 문의 유형 매핑 (Select Value -> 한글 라벨)
export const categoryMap = {
  account: '계정 및 회원정보',
  system: '시스템 및 장애',
  payment_service: '결제 및 서비스 이용',
  proposal: '기능 제안 및 개선',
  etc: '기타'
};

/**
 * 신규 문의 등록 시뮬레이션 (실제 프로젝트에서는 API post 후 re-fetch)
 */
export const createInquiryObject = (formData) => {
  const today = new Date();
  const dateString = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
  
  return {
    id: Date.now(), // 임시 ID
    status: 'receipt', // 초기 상태: 접수완료
    statusText: '접수완료',
    title: formData.title,
    content: formData.content,
    date: dateString,
    category: categoryMap[formData.category] || '기타',
    isPublic: formData.isPublic,
    file: formData.file,
    answer: null
  };
};