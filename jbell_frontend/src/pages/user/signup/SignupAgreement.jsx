import React, { useState, useEffect } from 'react';
import { ChevronRight, Info, CheckCircle2, Circle } from 'lucide-react';

const SignupAgreement = () => {
  // 약관 상태 관리
  const [agreements, setAgreements] = useState({
    service: false,
    privacy: false,
    marketing: 'N', // 라디오 버튼 상태
  });

  const [isAllChecked, setIsAllChecked] = useState(false);

  // 개별 체크박스 변경 핸들러
  const handleTermChange = (e) => {
    const { name, checked } = e.target;
    setAgreements(prev => ({ ...prev, [name]: checked }));
  };

  // 마케팅 라디오 변경 핸들러
  const handleMarketingChange = (e) => {
    setAgreements(prev => ({ ...prev, marketing: e.target.value }));
  };

  // 전체 동의 핸들러
  const handleAllAgree = (e) => {
    const checked = e.target.checked;
    setIsAllChecked(checked);
    setAgreements({
      service: checked,
      privacy: checked,
      marketing: checked ? 'Y' : 'N',
    });
  };

  // 개별 항목 변경 시 전체 동의 상태 동기화
  useEffect(() => {
    const { service, privacy, marketing } = agreements;
    if (service && privacy && marketing === 'Y') {
      setIsAllChecked(true);
    } else {
      setIsAllChecked(false);
    }
  }, [agreements]);

  // 필수 항목 동의 여부 확인 (다음 단계 활성화용)
  const isRequiredAgreed = agreements.service && agreements.privacy;

  return (
    <div className="min-h-screen bg-slate-50/30 flex justify-center py-12 px-5 font-sans text-slate-900">
      <div className="max-w-[720px] w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <header className="mb-10 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">회원가입</h1>
          <p className="mt-2 text-slate-500">정부 서비스 이용을 위해 약관에 동의해 주세요.</p>
        </header>

        {/* 상단 안내 문구 */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2 text-blue-800 font-bold mb-4">
            <Info size={20} />
            <span>이용 안내</span>
          </div>
          <ul className="space-y-2.5 text-sm text-blue-900/70">
            <li className="flex gap-2">
              <span className="text-blue-300">•</span>
              본 서비스는 통합 회원 계정으로 이용 가능합니다.
            </li>
            <li className="flex gap-2">
              <span className="text-blue-300">•</span>
              필수 약관에 동의하셔야 회원가입 진행이 가능합니다.
            </li>
            <li className="flex gap-2">
              <span className="text-blue-300">•</span>
              선택 약관은 동의하지 않아도 서비스 이용이 가능하나 일부 혜택이 제한될 수 있습니다.
            </li>
          </ul>
        </div>

        {/* 필수 약관 1 */}
        <TermCard 
          title="서비스 이용약관" 
          isRequired={true}
          label="주요 항목"
          content="서비스 이용 권리와 의무, 책임사항을 규정합니다."
          checked={agreements.service}
          name="service"
          onChange={handleTermChange}
        />

        {/* 필수 약관 2 */}
        <TermCard 
          title="개인정보 수집 및 이용 동의" 
          isRequired={true}
          label="수집 항목"
          content="성명, 아이디, 비밀번호, 생년월일, 이메일 주소"
          checked={agreements.privacy}
          name="privacy"
          onChange={handleTermChange}
        />

        {/* 선택 약관 (라디오 타입) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm transition-all hover:border-blue-200">
          <div className="flex justify-between items-start mb-5">
            <h2 className="text-lg font-bold flex items-center gap-2">
              마케팅 정보 수신 동의
              <span className="text-xs font-medium text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full">선택</span>
            </h2>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg flex gap-4 text-sm mb-5">
            <span className="font-bold text-slate-800 shrink-0">혜택 안내</span>
            <p className="text-slate-500 break-keep">정부 정책 및 맞춤형 서비스 정보를 이메일로 받아보실 수 있습니다.</p>
          </div>
          <div className="flex gap-8">
            <label className="flex items-center gap-2 cursor-pointer group font-medium text-slate-700">
              <input 
                type="radio" 
                name="marketing" 
                value="Y" 
                checked={agreements.marketing === 'Y'}
                onChange={handleMarketingChange}
                className="w-5 h-5 accent-blue-600 cursor-pointer" 
              /> 동의
            </label>
            <label className="flex items-center gap-2 cursor-pointer group font-medium text-slate-700">
              <input 
                type="radio" 
                name="marketing" 
                value="N" 
                checked={agreements.marketing === 'N'}
                onChange={handleMarketingChange}
                className="w-5 h-5 accent-blue-600 cursor-pointer" 
              /> 비동의
            </label>
          </div>
        </div>

        {/* 전체 동의 바 */}
        <div className={`mt-10 mb-10 p-6 rounded-2xl border transition-all duration-300 flex items-center justify-center ${isAllChecked ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={isAllChecked}
              onChange={handleAllAgree}
              className={`w-6 h-6 rounded-md cursor-pointer ${isAllChecked ? 'accent-white ring-2 ring-white/20' : 'accent-blue-600'}`} 
            />
            <span className="text-lg font-bold">약관 전체 동의하기</span>
          </label>
        </div>

        {/* 푸터 액션 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 h-14 bg-white border border-slate-300 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors order-2 sm:order-1">
            취소하기
          </button>
          <button 
            disabled={!isRequiredAgreed}
            className={`flex-1 h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all order-1 sm:order-2 ${isRequiredAgreed ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-[0.98]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            다음으로 <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// 약관 카드 컴포넌트 재사용
const TermCard = ({ title, isRequired, label, content, checked, name, onChange }) => (
  <div className={`bg-white border rounded-2xl p-6 mb-6 shadow-sm transition-all hover:shadow-md ${checked ? 'border-blue-600 ring-1 ring-blue-600/10' : 'border-slate-200'}`}>
    <div className="flex justify-between items-start mb-5">
      <h2 className="text-lg font-bold flex items-center gap-2 leading-none">
        {title}
        {isRequired && <span className="text-xs font-bold text-blue-600 uppercase">필수</span>}
      </h2>
    </div>
    <div className="bg-slate-50 p-4 rounded-lg flex gap-4 text-sm mb-5">
      <span className="font-bold text-slate-800 shrink-0">{label}</span>
      <p className="text-slate-500 break-keep">{content}</p>
    </div>
    <label className="flex items-center gap-2 cursor-pointer group w-fit">
      <div className="relative flex items-center justify-center">
        <input 
          type="checkbox" 
          name={name}
          checked={checked}
          onChange={onChange}
          className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" 
        />
        {checked ? <CheckCircle2 size={16} className="absolute text-white pointer-events-none" /> : <Circle size={14} className="absolute text-slate-300 pointer-events-none" />}
      </div>
      <span className={`text-[15px] font-semibold transition-colors ${checked ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}`}>
        동의합니다
      </span>
    </label>
  </div>
);

export default SignupAgreement;