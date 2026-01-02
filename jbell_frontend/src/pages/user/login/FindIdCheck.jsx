import React, { useState } from 'react';
import { Mail, ShieldCheck, ArrowRight, Home, CheckCircle } from 'lucide-react';

const FindIdCheck = () => {
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [foundId, setFoundId] = useState(''); // 찾은 아이디 저장

  const handleSendCode = () => {
    if (!email) return alert('이메일을 입력해주세요.');
    setIsSent(true);
    alert('인증번호가 발송되었습니다.');
  };

  const handleVerify = () => {
    // 실제로는 API 통신 후 결과 처리
    if (authCode === '123456') { // 예시용 코드
      setIsVerified(true);
      setFoundId('korea_user****');
    } else {
      alert('인증번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center py-12 px-5 sm:py-20 font-sans text-gray-900">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-10 text-left">
          아이디 찾기
        </h1>

        <div className="border border-gray-200 rounded-2xl p-8 sm:p-12 mb-8 shadow-sm">
          {!isVerified ? (
            /* 1단계: 본인 인증 폼 */
            <div className="space-y-8 text-left">
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
                  <input
                    type="text"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    className="flex-1 px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="인증번호를 입력하세요"
                  />
                  <button
                    type="button"
                    onClick={handleVerify}
                    className="px-6 py-4 bg-gray-800 text-white border border-transparent rounded-xl font-medium hover:bg-gray-700 transition-colors whitespace-nowrap"
                  >
                    인증하기
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* 2단계: 결과 화면 */
            <div className="py-6 text-center space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <CheckCircle size={40} />
                </div>
              </div>
              <div>
                <p className="text-gray-500 mb-2">입력하신 이메일과 일치하는 아이디입니다.</p>
                <h2 className="text-2xl font-bold text-blue-600 tracking-wide bg-blue-50 inline-block px-6 py-2 rounded-full">
                  {foundId}
                </h2>
              </div>
              <p className="text-sm text-gray-400">
                개인정보 보호를 위해 아이디의 일부를 별표(*)로 표시하였습니다.
              </p>
            </div>
          )}
        </div>

        {/* 하단 버튼 액션 */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          {isVerified && (
            <button
              onClick={() => window.location.href = '/login'}
              className="px-8 py-4 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              로그인하러 가기 <ArrowRight size={18} />
            </button>
          )}
          <button
            type="button"
            onClick={() => window.location.href = '/'}
            className={`px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              isVerified ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Home size={18} /> 메인화면
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindIdCheck;