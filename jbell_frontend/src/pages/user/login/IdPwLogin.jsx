import React, { useState } from 'react';
import { ChevronRight, Info, User, Lock } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const IdPwLogin = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [saveId, setSaveId] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // 1. 유효성 검사
    if (!userId || !password) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    // 2. 로그인 시뮬레이션 (실제 프로젝트에서는 API 호출)
    console.log('로그인 시도:', { userId, password, saveId });

    // 3. 로그인 상태 저장 (핵심 포인트)
    // LocalStorage에 저장하면 브라우저를 새로고침해도 로그인이 유지됩니다.
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', userId); // 마이페이지 등에서 이름을 띄우기 위해 저장

    // 4. 성공 알림 및 페이지 이동
    alert(`${userId}님, 환영합니다!`);
    navigate('/'); 
    
    // 5. 상태 즉시 반영을 위한 새로고침 (헤더의 UI를 바꾸기 위함)
    window.location.reload();
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

        {/* Main Content */}
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

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="saveId"
                  checked={saveId}
                  onChange={(e) => setSaveId(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="saveId" className="text-sm text-gray-600 cursor-pointer select-none">
                  아이디 저장
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