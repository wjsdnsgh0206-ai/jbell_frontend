// src/pages/user/customerservice/data.js

export const faqData = [
  { id: 1, question: "사람은 어떻게 태어나는 건가요?", answer: "사람은 태어나는 것이 아닌 하늘에서 비를 뿌리면...", date: "2023.10.01", modifiedDate: "2023.10.01", tag: "질문 유형" },
  { id: 2, question: "비밀번호를 변경하고 싶어요.", answer: "마이페이지 > 회원정보 수정 메뉴에서 변경 가능합니다.", date: "2023.10.02", modifiedDate: "2023.10.02", tag: "계정 관리" },
  { id: 3, question: "환불 규정이 어떻게 되나요?", answer: "결제 후 7일 이내에는 100% 환불이 가능합니다.", date: "2023.10.03", modifiedDate: "2023.10.03", tag: "결제/환불" },
  { id: 4, question: "서비스 이용 시간이 궁금해요.", answer: "24시간 언제든지 이용 가능합니다.", date: "2023.10.04", modifiedDate: "2023.10.04", tag: "이용 문의" },
  { id: 5, question: "사람은 어떻게 태어나는 건가요?", answer: "답변 내용...", date: "2023.10.05", modifiedDate: "2023.10.05", tag: "질문 유형" },
  { id: 6, question: "비밀번호를 변경하고 싶어요.", answer: "답변 내용...", date: "2023.10.06", modifiedDate: "2023.10.06", tag: "계정 관리" },
  { id: 7, question: "환불 규정이 어떻게 되나요?", answer: "답변 내용...", date: "2023.10.07", modifiedDate: "2023.10.07", tag: "결제/환불" },
  { id: 8, question: "서비스 이용 시간이 궁금해요.", answer: "답변 내용...", date: "2023.10.08", modifiedDate: "2023.10.08", tag: "이용 문의" },
  { id: 9, question: "질문 9", answer: "답변 9", date: "2023.10.09", modifiedDate: "2023.10.09", tag: "질문 유형" },
  { id: 10, question: "질문 10", answer: "답변 10", date: "2023.10.10", modifiedDate: "2023.10.10", tag: "계정 관리" },
  { id: 11, question: "질문 11", answer: "답변 11", date: "2023.10.11", modifiedDate: "2023.10.11", tag: "결제/환불" },
  { id: 12, question: "질문 12", answer: "답변 12", date: "2023.10.12", modifiedDate: "2023.10.12", tag: "이용 문의" },
  { id: 13, question: "질문 13", answer: "답변 13", date: "2023.10.13", modifiedDate: "2023.10.13", tag: "질문 유형" },
  { id: 14, question: "질문 14", answer: "답변 14", date: "2023.10.14", modifiedDate: "2023.10.14", tag: "계정 관리" },
  { id: 15, question: "질문 15", answer: "답변 15", date: "2023.10.15", modifiedDate: "2023.10.15", tag: "결제/환불" },
  { id: 16, question: "질문 16", answer: "답변 16", date: "2023.10.16", modifiedDate: "2023.10.16", tag: "이용 문의" },
  { id: 17, question: "질문 17", answer: "답변 17", date: "2023.10.17", modifiedDate: "2023.10.17", tag: "질문 유형" },
  { id: 18, question: "질문 18", answer: "답변 18", date: "2023.10.18", modifiedDate: "2023.10.18", tag: "계정 관리" },
  { id: 19, question: "질문 19", answer: "답변 19", date: "2023.10.19", modifiedDate: "2023.10.19", tag: "결제/환불" },
  { id: 20, question: "질문 20", answer: "답변 20", date: "2023.10.20", modifiedDate: "2023.10.20", tag: "이용 문의" },
  { id: 21, question: "질문 21", answer: "답변 21", date: "2023.10.21", modifiedDate: "2023.10.21", tag: "질문 유형" },
  { id: 22, question: "질문 22", answer: "답변 22", date: "2023.10.22", modifiedDate: "2023.10.22", tag: "계정 관리" },
  { id: 23, question: "질문 23", answer: "답변 23", date: "2023.10.23", modifiedDate: "2023.10.23", tag: "결제/환불" },
  { id: 24, question: "질문 24", answer: "답변 24", date: "2023.10.24", modifiedDate: "2023.10.24", tag: "이용 문의" },
  { id: 25, question: "질문 25", answer: "답변 25", date: "2023.10.25", modifiedDate: "2023.10.25", tag: "질문 유형" },
];

/**
 * ID로 FAQ 상세 정보를 가져오는 함수
 * @param {string | number} id 
 * @returns {object | undefined}
 */
export const getFAQDetail = (id) => {
  return faqData.find(d => d.id === parseInt(id, 10));
};