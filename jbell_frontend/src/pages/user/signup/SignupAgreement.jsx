import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, Info, CheckCircle2, Check, Circle } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const SignupAgreement = () => {
  const [agreements, setAgreements] = useState({
    service: false,
    privacy: false,
    marketing: 'N',
  });

  const [isAllChecked, setIsAllChecked] = useState(false);
  const navigate = useNavigate();

  const handleTermChange = (e) => {
    const { name, checked } = e.target;
    setAgreements(prev => ({ ...prev, [name]: checked }));
  };

  const handleMarketingChange = (e) => {
    setAgreements(prev => ({ ...prev, marketing: e.target.value }));
  };

  const handleAllAgree = (e) => {
    const checked = e.target.checked;
    setIsAllChecked(checked);
    setAgreements({
      service: checked,
      privacy: checked,
      marketing: checked ? 'Y' : 'N',
    });
  };

  useEffect(() => {
    const { service, privacy, marketing } = agreements;
    if (service && privacy && marketing === 'Y') {
      setIsAllChecked(true);
    } else {
      setIsAllChecked(false);
    }
  }, [agreements]);

  const isRequiredAgreed = agreements.service && agreements.privacy;

  return (
    <div className="min-h-screen bg-white flex justify-center py-12 px-5 font-sans text-slate-900">
      <div className="max-w-[720px] w-full animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
        
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-6 group cursor-pointer" onClick={() => navigate(-1)}>
            <ArrowLeft className="text-slate-400 group-hover:text-blue-600 transition-colors" size={24} />
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">회원가입</h1>
          </div>
          <p className="text-slate-500">정부 서비스 이용을 위해 약관에 동의해 주세요.</p>
        </header>

        {/* 안내 문구 */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2 text-blue-800 font-bold mb-4">
            <Info size={20} />
            <span>이용 안내</span>
          </div>
          <ul className="space-y-2.5 text-sm text-blue-900/70">
            <li className="flex gap-2"><span className="text-blue-300">•</span> 본 서비스는 통합 회원 계정으로 이용 가능합니다.</li>
            <li className="flex gap-2"><span className="text-blue-300">•</span> 필수 약관에 동의하셔야 회원가입 진행이 가능합니다.</li>
          </ul>
        </div>

        {/* 필수 약관 */}
        <TermCard 
          title="서비스 이용약관" 
          isRequired={true}
          label="주요 항목"
          content="서비스 이용 권리와 의무, 책임사항을 규정합니다."
          checked={agreements.service}
          name="service"
          onChange={handleTermChange}
        />

        <TermCard 
          title="개인정보 수집 및 이용 동의" 
          isRequired={true}
          label="수집 항목"
          content="성명, 아이디, 비밀번호, 생년월일, 이메일 주소"
          checked={agreements.privacy}
          name="privacy"
          onChange={handleTermChange}
        />

       {/* 마케팅 정보 수신 동의 (체크박스 스타일로 통일) */}
      <div className={`bg-white border rounded-2xl p-6 mb-6 shadow-sm transition-all hover:shadow-md ${agreements.marketing === 'Y' ? 'border-blue-600 ring-1 ring-blue-600/10' : 'border-slate-200'}`}>
        <h2 className="text-lg font-bold flex items-center gap-2 mb-5">
          마케팅 정보 수신 동의
          <span className="text-xs font-medium text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full">선택</span>
        </h2>
        
        <div className="bg-slate-50 p-4 rounded-lg flex gap-4 text-sm mb-5 text-slate-500">
          <span className="font-bold text-slate-800 shrink-0">혜택 안내</span>
          <p>정부 정책 및 맞춤형 서비스 정보를 이메일로 받아보실 수 있습니다.</p>
        </div>

        <div className="flex gap-10">
          {/* 동의 버튼 */}
          <label className="flex items-center gap-2 cursor-pointer group w-fit">
            <div className="relative flex items-center justify-center">
              <input 
                type="radio" 
                name="marketing" 
                value="Y" 
                checked={agreements.marketing === 'Y'} 
                onChange={handleMarketingChange} 
                className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" 
              />
              <Check size={16} className={`absolute transition-all pointer-events-none ${agreements.marketing === 'Y' ? 'text-white scale-110 opacity-100' : 'text-transparent scale-50 opacity-0'}`} strokeWidth={4} />
            </div>
            <span className={`text-[15px] font-semibold transition-colors ${agreements.marketing === 'Y' ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}`}>
              동의
            </span>
          </label>

          {/* 비동의 버튼 */}
          <label className="flex items-center gap-2 cursor-pointer group w-fit">
            <div className="relative flex items-center justify-center">
              <input 
                type="radio" 
                name="marketing" 
                value="N" 
                checked={agreements.marketing === 'N'} 
                onChange={handleMarketingChange} 
                className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" 
              />
              <Check size={16} className={`absolute transition-all pointer-events-none ${agreements.marketing === 'N' ? 'text-white scale-110 opacity-100' : 'text-transparent scale-50 opacity-0'}`} strokeWidth={4} />
            </div>
            <span className={`text-[15px] font-semibold transition-colors ${agreements.marketing === 'N' ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}`}>
              비동의
            </span>
          </label>
        </div>
      </div>

        {/* 전체 동의 바 */}
        <div className={`mt-10 mb-10 p-6 rounded-2xl border transition-all duration-300 ${isAllChecked ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative flex items-center justify-center">
              <input 
                type="checkbox" 
                checked={isAllChecked}
                onChange={handleAllAgree}
                className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-md checked:bg-white checked:border-white transition-all cursor-pointer" 
              />
              <Check size={16} className={`absolute transition-colors ${isAllChecked ? 'text-blue-600' : 'text-transparent'}`} strokeWidth={4} />
            </div>
            <span className="text-lg font-bold">약관 전체 동의하기</span>
          </label>
        </div>

        {/* 버튼 섹션 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => navigate('/')} className="flex-1 h-14 bg-white border border-slate-300 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors order-2 sm:order-1">
            메인으로
          </button>
          <button 
            onClick={() => navigate('/signupForm')}
            disabled={!isRequiredAgreed}
            className={`flex-1 h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all order-1 sm:order-2 ${isRequiredAgreed ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            다음으로 <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// TermCard (기존 체크박스 디자인 유지)
const TermCard = ({ title, isRequired, label, content, checked, name, onChange }) => (
  <div className={`bg-white border rounded-2xl p-6 mb-6 shadow-sm transition-all ${checked ? 'border-blue-600 ring-1 ring-blue-600/10' : 'border-slate-200'}`}>
    <div className="flex justify-between items-start mb-5">
      <h2 className="text-lg font-bold flex items-center gap-2">
        {title} {isRequired && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded ml-1 font-bold">필수</span>}
      </h2>
    </div>
    <div className="bg-slate-50 p-4 rounded-lg flex gap-4 text-sm mb-5 text-slate-500">
      <span className="font-bold text-slate-800 shrink-0">{label}</span>
      <p>{content}</p>
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
        <Check size={16} className={`absolute transition-all pointer-events-none ${checked ? 'text-white scale-110 opacity-100' : 'text-transparent scale-50 opacity-0'}`} strokeWidth={4} />
      </div>
      <span className={`text-[15px] font-semibold transition-colors ${checked ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}`}>
        동의
      </span>
    </label>
  </div>
);

export default SignupAgreement;