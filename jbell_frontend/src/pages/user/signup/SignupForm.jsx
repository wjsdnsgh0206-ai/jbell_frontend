import React, { useState } from 'react';
import { User, MapPin, Mail, Lock, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    city: '', district: '', name: '', 
    userId: '', password: '', confirmPassword: '',
    email: '', authCode: ''
  });

  const [errors, setErrors] = useState({});
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isAuthVerified, setIsAuthVerified] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 실시간 입력 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 아이디 수정 시 중복확인 초기화
    if (name === 'userId') setIsIdChecked(false);
    
    // 에러 메시지 실시간 초기화 (입력 시작하면 에러 삭제)
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 1. 이메일 검증 및 번호 전송
  const handleSendCode = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: "이메일을 입력해주세요." }));
      return;
    }
    
    if (!emailRegex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: "올바른 이메일 형식이 아닙니다." }));
      return;
    }

    // 검증 통과 시
    setErrors(prev => ({ ...prev, email: "" }));
    alert(`${formData.email}로 인증번호가 발송되었습니다.`);
    // 여기에 실제 API 호출 로직 추가
  };

  const handleIdCheck = () => {
    if (!formData.userId) return alert("아이디를 입력해주세요.");
    if (formData.userId.length < 5) return alert("아이디는 5자 이상이어야 합니다.");
    alert("사용 가능한 아이디입니다.");
    setIsIdChecked(true);
  };

  const handleVerifyCode = () => {
    if (formData.authCode === "123456") {
      alert("인증되었습니다.");
      setIsAuthVerified(true);
    } else {
      alert("인증번호가 일치하지 않습니다.");
    }
  };

  // 2. 가입 시 비밀번호 및 전체 검증
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // 이름/지역 검증
    if (!formData.name) newErrors.name = "이름을 입력해주세요.";
    if (!formData.city) newErrors.city = "지역을 선택해주세요.";

    // 비밀번호 상세 검증
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (!pwRegex.test(formData.password)) {
      newErrors.password = "영문, 숫자, 특수문자 포함 8~16자로 입력해주세요.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 필수 체크사항 확인
    if (!isIdChecked) return alert("아이디 중복 확인을 해주세요.");
    if (!isAuthVerified) return alert("이메일 인증을 완료해주세요.");
    
    alert("회원가입이 성공적으로 완료되었습니다!");
    navigate('/login');
  };

  const ErrorMsg = ({ name }) => (
    errors[name] ? <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors[name]}</p> : null
  );

  return (
    <div className="min-h-screen bg-white flex justify-center py-10 px-4 font-sans text-slate-900 text-left">
      <div className="max-w-[550px] w-full">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">회원가입</h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 거주지 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3"><MapPin size={20} className="text-blue-600" /> 거주 지역</h2>
            <div className="grid grid-cols-2 gap-3">
              <select name="city" value={formData.city} onChange={handleChange} className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option value="">시/도 선택</option>
                <option value="seoul">서울특별시</option>
              </select>
              <select name="district" className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none text-sm">
                <option value="">시/군/구 선택</option>
              </select>
            </div>
            <ErrorMsg name="city" />
          </section>

          {/* 기본 정보 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3"><User size={20} className="text-blue-600" /> 기본 정보</h2>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500">이름</label>
              <input type="text" name="name" placeholder="실명을 입력하세요" onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500" />
              <ErrorMsg name="name" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500">아이디</label>
              <div className="flex gap-2">
                <input type="text" name="userId" placeholder="5~12자 영문, 숫자" onChange={handleChange} className={`flex-1 h-12 px-4 rounded-xl border ${isIdChecked ? 'border-green-500 bg-green-50' : 'border-slate-200'} outline-none`} />
                <button type="button" onClick={handleIdCheck} className={`px-4 rounded-xl text-xs font-bold transition-all ${isIdChecked ? 'bg-green-600 text-white' : 'bg-slate-800 text-white'}`}>
                  {isIdChecked ? '확인완료' : '중복확인'}
                </button>
              </div>
            </div>

            {/* 비밀번호 섹션 - 가입 버튼 클릭 시 검증 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1"><Lock size={14}/> 비밀번호</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" placeholder="영문, 숫자, 특수문자 조합 8자 이상" onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <ErrorMsg name="password" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500">비밀번호 확인</label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="비밀번호 재입력" onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <ErrorMsg name="confirmPassword" />
            </div>
          </section>

          {/* 인증 섹션 - 번호전송 클릭 시 이메일 검증 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3"><Mail size={20} className="text-blue-600" /> 연락처 인증</h2>
            <div className="flex gap-2">
              <input type="email" name="email" placeholder="example@mail.com" onChange={handleChange} className="flex-1 h-12 px-4 rounded-xl border border-slate-200 outline-none" />
              <button type="button" onClick={handleSendCode} className="px-4 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-200">번호전송</button>
            </div>
            <ErrorMsg name="email" />
            
            <div className="flex gap-2 mt-2">
              <div className="relative flex-1">
                <input type="text" name="authCode" placeholder="인증번호 6자리" onChange={handleChange} className={`w-full h-12 px-4 rounded-xl border ${isAuthVerified ? 'border-green-500 bg-green-50' : 'border-slate-200'} outline-none`} />
                {isAuthVerified && <Check className="absolute right-3 top-3.5 text-green-600" size={18} />}
              </div>
              <button type="button" onClick={handleVerifyCode} className="px-4 bg-blue-600 text-white rounded-xl text-xs font-bold">인증확인</button>
            </div>
          </section>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => navigate(-1)} className="flex-1 h-14 bg-white border border-slate-300 text-slate-600 rounded-2xl font-bold hover:bg-slate-50">취소</button>
            <button onClick={() => navigate('/signupSuccess')}
                    type="submit" className="flex-1 h-14 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all">가입하기</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;