import React, { useState, useEffect } from 'react';
import { Mail, User, ShieldCheck, ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, Home, Clock } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const FindPwCheck = () => {
  const navigate = useNavigate();
  
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [timer, setTimer] = useState(0);
  
  // 비밀번호 재설정 관련 상태
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetComplete, setIsResetComplete] = useState(false);

  // 인증번호 타이머 로직
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

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendCode = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!userId) return alert('아이디를 입력해주세요.');
    if (!email || !emailRegex.test(email)) return alert('올바른 이메일 형식을 입력해주세요.');
    
    setIsSent(true);
    setTimer(180); // 3분 설정
    alert('인증번호가 발송되었습니다. (테스트 번호: 123456)');
  };

  const handleVerify = () => {
    if (timer === 0) return alert('인증 시간이 만료되었습니다. 다시 시도해주세요.');
    
    // 예시용 코드: 123456 입력 시 인증 성공
    if (authCode === '123456') {
      setIsVerified(true);
      setTimer(0);
    } else {
      alert('인증번호가 일치하지 않습니다.');
    }
  };

  const handleResetPassword = () => {
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    
    if (!pwRegex.test(newPassword)) {
      return alert('비밀번호는 영문, 숫자, 특수문자 포함 8~16자여야 합니다.');
    }
    if (newPassword !== confirmPassword) {
      return alert('비밀번호가 일치하지 않습니다.');
    }
    
    // API 통신 후 성공 처리
    setIsResetComplete(true);
  };

  return (
    <div className="min-h-screen bg-white flex justify-center py-12 px-5 sm:py-20 font-sans text-gray-900">
      <div className="max-w-2xl w-full">
        {/* 상단 타이틀 */}
        <div className="flex items-center gap-2 mb-10 group cursor-pointer" onClick={() => navigate(-1)}>
          <ArrowLeft className="text-gray-400 group-hover:text-blue-600 transition-colors" size={24} />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-left">
            비밀번호 찾기
          </h1>
        </div>

        <div className="border border-gray-200 rounded-2xl p-8 sm:p-12 mb-8 shadow-sm">
          {!isVerified ? (
            /* 1단계: 인증 폼 */
            <div className="space-y-8 text-left animate-in fade-in duration-500">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <User size={14} /> 아이디
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="아이디를 입력하세요"
                />
              </div>

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

              <div className={`space-y-3 transition-all duration-500 ${isSent ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
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
                    className="px-6 py-4 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 disabled:bg-gray-200 transition-colors"
                  >
                    인증하기
                  </button>
                </div>
              </div>
            </div>
          ) : !isResetComplete ? (
            /* 2단계: 새 비밀번호 입력 */
            <div className="space-y-8 text-left animate-in slide-in-from-right-4 duration-500">
              <div className="bg-blue-50 p-4 rounded-xl text-blue-700 text-sm font-medium">
                본인 인증이 완료되었습니다. 새로운 비밀번호를 설정해주세요.
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Lock size={14} /> 새 비밀번호
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="8~16자, 영문+숫자+특수문자"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-500">새 비밀번호 확인</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-4 border rounded-xl focus:ring-2 outline-none transition-all ${
                        confirmPassword && newPassword === confirmPassword 
                        ? 'border-green-500 focus:ring-green-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="다시 한번 입력하세요"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1 ml-1">비밀번호가 일치하지 않습니다.</p>
                  )}
                </div>
              </div>

              <button
                onClick={handleResetPassword}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                비밀번호 변경하기
              </button>
            </div>
          ) : (
            /* 3단계: 변경 완료 */
            <div className="py-6 text-center space-y-6 animate-in zoom-in duration-500">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 border border-green-100">
                  <CheckCircle2 size={48} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">변경이 완료되었습니다!</h2>
                <p className="text-gray-500">새로운 비밀번호로 다시 로그인해주세요.</p>
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-3">
          {isResetComplete ? (
            <button
              onClick={() => navigate('/idPwLogin')}
              className="w-full px-12 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
            >
              로그인 화면으로 <ArrowLeft size={18} className="rotate-180" />
            </button>
          ) : (
            <button
              type="button"
              className="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              onClick={() => navigate('/#')}
            >
              <Home size={18} /> 메인화면
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindPwCheck;