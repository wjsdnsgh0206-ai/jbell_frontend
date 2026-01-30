import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 앱 시작 시 로컬 스토리지에서 모든 정보를 읽어옴
    const savedUserId = localStorage.getItem('userId');
    const savedUserName = localStorage.getItem('userName');
    const savedUserGrade = localStorage.getItem('userGrade'); // 추가됨

    if (savedUserId && savedUserName) {
      setUser({ 
        userId: savedUserId, 
        userName: savedUserName,
        userGrade: savedUserGrade // 객체에 등급 추가
      });
    }
    setLoading(false);
  }, []);

  // 2. 로그인 처리 (userGrade 매개변수 추가)
  const login = (userId, userName, userGrade) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
    localStorage.setItem('userGrade', userGrade); // 로컬 스토리지 저장
    
    setUser({ 
      userId, 
      userName, 
      userGrade // 상태 업데이트
    });
  };

  // 3. 로그아웃 처리
  const logout = () => {
    // localStorage.clear(); 
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);