import React, { useState, useEffect } from 'react';
import { ChevronRight, Info, User, Lock, Check } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import { userService } from '@/services/api'; 
import { useAuth } from '@/contexts/AuthContext';


const IdPwLogin = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberId, setRememberId] = useState(false); // 아이디 저장 및 자동 로그인 통합 상태
  const navigate = useNavigate();
  const location = useLocation(); // location 객체 초기화
  const { login } = useAuth();

  // 3. 포털에서 넘어온 state 확인 및 '아이디 저장' 로직 통합
  useEffect(() => {
    // 포트폴리오 메인(Portal)에서 전달한 자동입력 데이터가 최우선
    if (location.state?.autoId && location.state?.autoPw) {
      setUserId(location.state.autoId);
      setPassword(location.state.autoPw);
    } else {
      // 페이지 로드 시 '아이디 저장'이 되어 있다면 불러오기
      // 일반적인 접근 시 로컬 스토리지의 아이디 불러오기
      const savedId = localStorage.getItem('rememberedId');
      if (savedId) {
        setUserId(savedId);
        setRememberId(true);
      }
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!userId || !password) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await userService.login({
        userId: userId,
        userPw: password
      });

      if (response.data && response.data.data) {
        const { accessToken, refreshToken, userName, userGrade } = response.data.data;

        if (rememberId) {
          localStorage.setItem('rememberedId', userId);
        } else {
          localStorage.removeItem('rememberedId');
        }

        // 1. 토큰 및 세션 정보 저장 (localStorage는 새 탭과 공유됨)
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        sessionStorage.setItem('isLoggedIn', 'true');

        // 2. AuthContext 상태 업데이트
        login(userId, userName || userId, userGrade);

        alert(`환영합니다, ${userName || userId}님!`);

        // -----------------------------------------------------
        // 4. 권한(userGrade)에 따른 페이지 이동 로직 개선 (새 창 띄우기)
        // -----------------------------------------------------
        if (userGrade === 'ADMIN') {
          // 관리자 화면은 새 탭(_blank)으로 엽니다.
          window.open('/admin/realtime/realtimeDashboard', '_blank');
          
          // 현재 창은 사용자 화면 메인으로 이동합니다.
          navigate('/');
        } else {
          // 일반 사용자는 현재 창에서 메인으로 이동합니다.
          navigate('/');
        }
        // -----------------------------------------------------

      }
    } catch (error) {
      const serverMsg = error.response?.data?.message;
      const isTechnicalError = /MyBatis|BindingException|Parameter|SqlSession/i.test(serverMsg);
      
      if (isTechnicalError || !serverMsg) {
          alert("로그인 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
      } else {
          alert(serverMsg);
      }
      setPassword('');
    }
  };
  
  return (
    <div className="min-h-screen bg-white flex justify-center py-10 px-5 sm:py-20 font-sans text-gray-900">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <header className="mb-8 text-left">
          <p className="text-sm text-gray-500 mb-2 font-medium">전북안전누리 사용자 로그인</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            아이디/비밀번호 로그인
          </h1>
        </header>

        <hr className="border-t border-gray-200 my-8" />

        <div className="flex flex-col md:flex-row gap-10 lg:gap-16 mb-10">
          <div className="flex-1 order-1">
            <form onSubmit={handleLogin} className="space-y-5 text-left">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 ml-1">아이디</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="아이디를 입력하세요"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 ml-1">비밀번호</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="비밀번호를 입력하세요"
                  />
                </div>
              </div>

              {/* 아이디 저장 (자동 로그인 기능 통합) */}
              <div className="py-2">
                <label className="flex items-center gap-2 cursor-pointer group w-fit">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      id="saveId" 
                      checked={rememberId} 
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setRememberId(isChecked);
                        // 체크 해제 시 즉시 삭제
                        if (!isChecked) {
                          localStorage.removeItem('rememberedId');
                        }
                      }} 
                      className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" 
                    />
                    <Check 
                      size={16} 
                      className={`absolute transition-all pointer-events-none ${
                        rememberId ? 'text-white scale-110 opacity-100' : 'text-transparent scale-50 opacity-0'
                      }`} 
                      strokeWidth={4} 
                    />
                  </div>
                  <span className={`text-[15px] font-semibold transition-colors ${
                    rememberId ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                  }`}>
                    아이디 저장
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 active:scale-[0.99] transition-all shadow-lg shadow-blue-100"
              >
                로그인
              </button>

              <div className="flex justify-center gap-4 text-sm text-gray-500 font-medium pt-2">
                <button onClick={() => navigate('/findIdCheck')} type="button" className="hover:text-blue-600">아이디 찾기</button>
                <span className="text-gray-200">|</span>
                <button onClick={() => navigate('/findPwCheck')} type="button" className="hover:text-blue-600">비밀번호 찾기</button>
                <span className="text-gray-200">|</span>
                <button onClick={() => navigate('/signupAgreement')} type="button" className="hover:text-blue-600">회원가입</button>
              </div>
            </form>
          </div>

          <div className="flex-1 md:border-l border-gray-100 md:pl-10 order-2">
            <ul className="space-y-6 text-left">
              {[
                "본인 인증이 필요한 서비스 이용시 별도의 간편 인증, 공동·금융 인증이 진행됩니다.",
                "개인정보 보호를 위해 비밀번호 5회 이상 오류 시, 비밀번호 재설정이 필요합니다.",
                "비밀번호는 주기적(6개월)으로 변경하시고, 서비스 이용 후 반드시 로그아웃 하시기 바랍니다."
              ].map((text, i) => (
                <li key={i} className="relative pl-5 text-[14px] text-gray-500 leading-relaxed break-keep">
                  <span className="absolute left-0 top-1 text-blue-400 font-bold">•</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-gray-200 my-8" />

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-8 text-left">
          <h3 className="text-lg font-bold">원하는 로그인 방법이 아니신가요?</h3>
          <button onClick={() => navigate('/loginMain')}
                  className="text-gray-500 hover:text-blue-600 font-medium flex items-center group">
            다른 로그인 방법 보기 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left">
          <div className="flex items-center gap-2 font-bold text-blue-900 mb-4">
            <Info size={18} />
            <span>로그인에 어려움이 있으신가요?</span>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-2"><span className="text-blue-300">•</span> 이전에 이용한 로그인 수단이 안 보인다면 상단 <button className="underline text-blue-600">통합 로그인 사용</button>을 꺼보세요.</li>
            <li className="flex gap-2"><span className="text-blue-300">•</span> 로그인 관련 <button className="underline text-blue-600">도움말</button>이나 <button className="underline text-blue-600">자주 찾는 질문</button>을 확인해보세요.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IdPwLogin;