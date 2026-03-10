import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 앱 시작 시 로컬 스토리지에서 모든 정보를 읽어옴
    const savedUserId = localStorage.getItem('userId');
    const savedUserName = localStorage.getItem('userName');
    const savedUserGrade = localStorage.getItem('userGrade');

    if (savedUserId && savedUserName) {
      setUser({ 
        userId: savedUserId, 
        userName: savedUserName,
        userGrade: savedUserGrade
      });
    }
    setLoading(false);
  }, []);

  // 2. 로그인 처리
  const login = (userId, userName, userGrade) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
    localStorage.setItem('userGrade', userGrade);
    
    setUser({ 
      userId, 
      userName, 
      userGrade 
    });
  };

  // 3. 로그아웃 처리 (수정된 부분)
  const logout = () => {
    // [1] React 상태 초기화
    setUser(null);

    // [2] AuthContext에서 세팅한 유저 메타데이터 삭제
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userGrade');

    // [3] IdPwLogin.jsx에서 세팅했던 토큰 및 세션 플래그 삭제 (매우 중요)
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('isLoggedIn');

    // ⚠️ localStorage.clear()는 'rememberedId'(아이디 저장)를 날려버리므로 절대 사용하지 마세요!
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);