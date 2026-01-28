import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 앱 시작 시 로컬 스토리지에서 직접 값을 읽어옴
    const savedUserId = localStorage.getItem('userId');
    const savedUserName = localStorage.getItem('userName');

    if (savedUserId && savedUserName) {
      setUser({ 
        userId: savedUserId, 
        userName: savedUserName 
      });
    }
    setLoading(false);
  }, []);

  // 2. 로그인 처리 (컴포넌트에서 호출)
  const login = (userId, userName) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
    setUser({ userId, userName });
  };

  // 3. 로그아웃 처리
  const logout = () => {
    localStorage.clear(); // 모든 정보 삭제
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);