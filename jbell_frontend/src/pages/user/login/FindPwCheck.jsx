import React, { useState, useEffect } from 'react';
import { Mail, User, ShieldCheck, ArrowLeft } from 'lucide-react';

const FindPwCheck = () => {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [timer, setTimer] = useState(0);

  // 인증번호 타이머 로직
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendCode = () => {
    // 실제 API 호출 로직이 들어갈 자리
    setIsSent(true);
    setTimer(180); // 3분 타이머 설정
    alert('인증번호가 발송되었습니다.');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-white flex justify-center py-12 px-5 sm:py-20 font-sans text-gray-900">
      <div className="max-w-2xl w-full">
        {/* 상단 타이틀 */}
        <div className="flex items-center gap-2 mb-10 group cursor-pointer" onClick={() => window.history.back()}>
          <ArrowLeft className="text-gray-400 group-hover:text-blue-600 transition-colors" size={24} />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-left">
            비밀번호 찾기
          </h1>
        </div>

        <div className="border border-gray-200 rounded-2xl p-8 sm:p-12 mb-8 shadow-sm">
          <div className="space-y-8 text-left">
            
            {/* 아이디 입력 */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <User size={14} /> 아이디
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="아이디를 입력하세요"
              />
            </div>

            {/* 이메일 입력 및 인증번호 전송 */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <Mail size={14} /> 이메일
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="이메일 주소를 입력하세요"
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="px-6 py-4 bg-white border border-gray-800 rounded-xl font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  {isSent ? '재발송' : '번호전송'}
                </button>
              </div>
            </div>

            {/* 인증번호 입력 */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <ShieldCheck size={14} /> 인증번호 입력
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="인증번호 6자리를 입력하세요"
                  />
                  {timer > 0 && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-medium text-sm">
                      {formatTime(timer)}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  disabled={!authCode}
                  className="px-6 py-4 bg-white border border-gray-800 rounded-xl font-medium hover:bg-gray-50 disabled:border-gray-200 disabled:text-gray-300 transition-colors whitespace-nowrap"
                >
                  인증하기
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 하단 메인 액션 */}
        <div className="flex justify-end">
          <button
            type="button"
            className="w-full sm:w-auto px-12 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            onClick={() => window.location.href = '/'}
          >
            메인화면으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindPwCheck;