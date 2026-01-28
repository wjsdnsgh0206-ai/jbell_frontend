import React, { useState, useEffect } from 'react';
import { Mail, Check } from 'lucide-react';
// 상단 import를 사용하므로 props에서는 제거합니다.
import { userService } from '@/services/api'; 

const EmailAuthSection = ({ register, watch, errors, userEmail, isAuthVerified, setIsAuthVerified }) => {
  const [timer, setTimer] = useState(180);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // 타이머 로직 (정상)
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? `0${s}` : s}`;
  };

  const handleEmailAuth = async (type) => {
    // 1. 이메일 유효성 체크
    if (!userEmail || errors.userEmail) {
      alert("올바른 이메일을 입력해주세요.");
      return;
    }

    try {
      if (type === 'SEND') {
        // 2. 번호 발송 API 호출
        await userService.requestEmailAuth(userEmail);
        setIsAuthVerified(false);
        setTimer(180);
        setIsTimerActive(true);
        alert("인증번호가 발송되었습니다.");
      } else if (type === 'VERIFY') {
        // 3. 시간 초과 체크
        if (timer === 0) {
          alert("인증 시간이 만료되었습니다. 다시 발송해주세요.");
          return;
        }
        
        const code = watch('authCode');
        // 4. 번호 검증 API 호출
        const isSuccess = await userService.verifyEmailAuth(userEmail, code);
        
        if (isSuccess) {
          alert("인증되었습니다.");
          setIsAuthVerified(true);
          setIsTimerActive(false);
        } else {
          alert("인증번호가 일치하지 않습니다.");
        }
      }
    } catch (error) {
      // 500 에러 발생 시 백엔드 로그 확인 필요
      alert(error.response?.data?.message || "오류가 발생했습니다.");
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3">
        <Mail size={20} className="text-blue-600" /> 이메일 인증
      </h2>
      
      {/* 이메일 입력 및 발송 버튼 */}
      <div className="flex gap-2">
        <input 
          type="email" 
          placeholder="example@mail.com"
          {...register('userEmail', { 
            required: '이메일을 입력해주세요.',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '올바른 형식의 이메일입니다.' }
          })}
          readOnly={isAuthVerified} // 인증 완료 후 수정 방지
          className={`flex-1 h-12 px-4 rounded-xl border outline-none transition-colors ${isAuthVerified ? 'border-green-500 bg-green-50' : 'border-slate-200 focus:border-blue-500'}`} 
        />
        <button 
          type="button" 
          onClick={() => handleEmailAuth('SEND')} 
          disabled={isAuthVerified}
          className="px-4 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border hover:bg-slate-200 disabled:opacity-50"
        >
          번호전송
        </button>
      </div>
      
      {/* 인증번호 입력 및 확인 버튼 */}
      <div className="flex gap-2 mt-2">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="인증번호 6자리"
            {...register('authCode')}
            disabled={isAuthVerified}
            className={`w-full h-12 px-4 rounded-xl border outline-none transition-colors ${isAuthVerified ? 'border-green-500 bg-green-50' : 'border-slate-200 focus:border-blue-500'}`} 
          />
          {!isAuthVerified && isTimerActive && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-red-500">
              {formatTime(timer)}
            </span>
          )}
          {isAuthVerified && (
            <Check size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600" />
          )}
        </div>
        <button 
          type="button" 
          onClick={() => handleEmailAuth('VERIFY')} 
          disabled={isAuthVerified || !isTimerActive}
          className={`px-4 rounded-xl text-xs font-bold transition-all ${isAuthVerified ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300'}`}
        >
          {isAuthVerified ? '인증완료' : '인증확인'}
        </button>
      </div>
    </section>
  );
};

export default EmailAuthSection;