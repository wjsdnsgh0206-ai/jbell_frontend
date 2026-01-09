// src/services/api.js
import axios from 'axios';

// .env에 적은 변수를 가져옵니다.
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUsers = async (params) => {
  // 로그를 찍어서 주소가 정말 8080으로 나가는지 확인하세요!
  console.log("🚀 실제 요청 주소:", BASE_URL + '/users'); 
  
  const response = await api.get('/users', { params });
  return response.data;
};