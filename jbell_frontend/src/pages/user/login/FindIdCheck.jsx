import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, ShieldCheck, ArrowRight, Home, CheckCircle, Copy, Check, Key, ChevronRight, Clock } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const FindIdCheck = () => {
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [foundId, setFoundId] = useState('');
  const [copied, setCopied] = useState(false);
  
  // 타이머 상태 추가
  const [timer, setTimer] = useState(0);

  // 인증번호 타이머 로직 (useEffect)
  useEffect(() => {
    let interval;
    if (timer > 0 && !isVerified) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, isVerified]);

  // 시간 포맷팅 함수 (mm:ss)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendCode = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return alert('올바른 이메일 형식을 입력해주세요.');
    }
    
    setIsSent(true);
    setTimer(180); // 3분 설정
    alert('인증번호가 발송되었습니다. (테스트 번호: 123456)');
  };

  const handleVerify = () => {
    if (timer === 0) return alert('인증 시간이 만료되었습니다. 다시 시도해주세요.');
    
    // 예시용 코드: 123456 입력 시 인증 성공
    if (authCode === '123456') { 
      setIsVerified(true);
      setFoundId('korea_user_example');
      setTimer(0); // 인증 성공 시 타이머 정지
    } else {
      alert('인증번호가 일치하지 않습니다.');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(foundId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex justify-center py-12 px-5 sm:py-20 font-sans text-gray-900">
      <div className="max-w-2xl w-full">
        {/* 상단 타이틀 */}
        <div className="flex items-center gap-2 mb-10 group cursor-pointer" onClick={() => navigate(-1)}>
          <ArrowLeft className="text-gray-400 group-hover:text-blue-600 transition-colors" size={24} />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-left">
            아이디 찾기
          </h1>
        </div>

        <div className="border border-gray-200 rounded-2xl p-8 sm:p-12 mb-8 shadow-sm">
          {!isVerified ? (
            /* 1단계: 본인 인증 폼 */
            <div className="space-y-8 text-left animate-in fade-in duration-500">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Mail size={14} /> 이메일
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="이메일을 입력해주세요"
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    className="px-6 py-4 bg-white border border-gray-800 rounded-xl font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    {isSent ? '재전송' : '번호전송'}
                  </button>
                </div>
              </div>

              <div className={`space-y-3 transition-opacity duration-500 ${isSent ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <ShieldCheck size={14} /> 인증번호 입력
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={authCode}
                      onChange={(e) => setAuthCode(e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="인증번호 6자리를 입력하세요"
                    />
                    {/* 타이머 표시 UI */}
                    {timer > 0 && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-medium text-sm flex items-center gap-1">
                        <Clock size={14} /> {formatTime(timer)}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={!authCode}
                    className="px-6 py-4 bg-gray-800 text-white border border-transparent rounded-xl font-medium hover:bg-gray-700 disabled:bg-gray-200 transition-colors whitespace-nowrap"
                  >
                    인증하기
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* 2단계: 결과 화면 */
            <div className="py-2 text-center space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                  <CheckCircle size={40} />
                </div>
              </div>
              
              <div className="text-left">
                <p className="text-gray-500 mb-4 text-center">입력하신 이메일과 일치하는 아이디입니다.</p>
                <div className="flex items-center gap-3 bg-slate-100 rounded-xl p-5 group transition-colors hover:bg-slate-200/70">
                  <span className="text-xl font-semibold text-slate-700 flex-1 break-all">
                    {foundId}
                  </span>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      copied 
                      ? 'bg-green-500 text-white scale-105' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600'
                    }`}
                  >
                    {copied ? (
                      <><Check size={16} /> 복사됨</>
                    ) : (
                      <><Copy size={16} /> 복사</>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                아이디를 확인하신 후 로그인을 진행해 주세요.
              </p>
            </div>
          )}
        </div>

        {/* 하단 버튼 및 추가 액션 */}
        <div className="space-y-10">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            {isVerified ? (
              <button
                onClick={() => navigate('/idPwLogin')}
                className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
              >
                로그인하러 가기 <ArrowRight size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/#')}
                className="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <Home size={18} /> 메인화면
              </button>
            )}
          </div>

          {isVerified && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-6 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-lg">
                <Key size={18} className="text-blue-500" />
                <span>비밀번호도 잊으셨나요?</span>
              </div>
              <button 
                onClick={() => navigate('/findPwCheck')}
                className="group flex items-center text-gray-500 hover:text-blue-600 transition-colors text-base font-medium"
              >
                비밀번호 찾기 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindIdCheck;