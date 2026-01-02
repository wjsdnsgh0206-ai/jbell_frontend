import React, { useState } from 'react';
import { User, MapPin, Mail, Lock, Eye, EyeOff, AlertCircle, Check, Home } from 'lucide-react';
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
  
  // 비밀번호 보이기 상태 관리
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    if (name === 'name' && value.length < 2) error = "이름을 2자 이상 입력해주세요.";
    if (name === 'userId') {
      setIsIdChecked(false);
      if (!/^[a-z0-9]{5,12}$/.test(value)) error = "5~12자의 영문 소문자, 숫자만 가능합니다.";
    }
    if (name === 'password') {
      if (!/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/.test(value)) 
        error = "영문, 숫자, 특수문자 포함 8~16자여야 합니다.";
    }
    if (name === 'confirmPassword') {
      if (value !== formData.password) error = "비밀번호가 일치하지 않습니다.";
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleIdCheck = () => {
    if (!formData.userId || errors.userId) return alert("유효한 아이디를 입력해주세요.");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.city) return alert("필수 정보를 입력해주세요.");
    if (!isIdChecked) return alert("아이디 중복 확인을 해주세요.");
    if (!isAuthVerified) return alert("이메일 인증을 완료해주세요.");
    
    console.log("가입 데이터:", formData);
    alert("회원가입이 완료되었습니다!");
    navigate('/login');
  };

  const ErrorMsg = ({ name }) => (
    errors[name] ? <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors[name]}</p> : null
  );

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-10 px-4 font-sans text-slate-900">
      <div className="max-w-[550px] w-full">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">회원가입</h1>
          <p className="text-slate-500 mt-2">안전한 서비스 이용을 위해 정보를 입력해주세요.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 거주지 정보 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3 text-gray-800">
              <MapPin size={20} className="text-blue-600" /> 거주 지역
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <select name="city" value={formData.city} onChange={handleChange} className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option value="">시/도 선택</option>
                <option value="seoul">서울특별시</option>
                <option value="gyeonggi">경기도</option>
              </select>
              <select name="district" className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none text-sm">
                <option value="">시/군/구 선택</option>
              </select>
            </div>
          </section>

          {/* 회원 정보 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 text-left">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3 text-gray-800">
              <User size={20} className="text-blue-600" /> 기본 정보
            </h2>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1">이름</label>
              <input type="text" name="name" placeholder="실명을 입력하세요" onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" />
              <ErrorMsg name="name" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500">아이디</label>
              <div className="flex gap-2">
                <input type="text" name="userId" placeholder="5~12자 영문, 숫자" onChange={handleChange} className={`flex-1 h-12 px-4 rounded-xl border ${isIdChecked ? 'border-green-500 bg-green-50' : 'border-slate-200'} focus:border-blue-500 outline-none`} />
                <button type="button" onClick={handleIdCheck} className={`px-4 rounded-xl text-xs font-bold transition-all ${isIdChecked ? 'bg-green-600 text-white' : 'bg-slate-800 text-white'}`}>
                  {isIdChecked ? '확인완료' : '중복확인'}
                </button>
              </div>
              <ErrorMsg name="userId" />
            </div>

            {/* 새 비밀번호 - 아이콘 추가 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1"><Lock size={14}/> 비밀번호</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password" 
                  placeholder="영문, 숫자, 특수문자 조합 8자 이상"
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <ErrorMsg name="password" />
            </div>

            {/* 비밀번호 확인 - 아이콘 추가 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500">비밀번호 확인</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword" 
                  placeholder="비밀번호를 다시 입력하세요"
                  onChange={handleChange}
                  className={`w-full h-12 px-4 rounded-xl border ${formData.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-slate-200'} focus:border-blue-500 outline-none`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <ErrorMsg name="confirmPassword" />
            </div>
          </section>

          {/* 이메일 인증 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3 text-gray-800">
              <Mail size={20} className="text-blue-600" /> 연락처 인증
            </h2>
            <div className="flex gap-2">
              <input type="email" name="email" placeholder="example@mail.com" onChange={handleChange} className="flex-1 h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500" />
              <button type="button" className="px-4 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-200 transition-colors">번호전송</button>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input type="text" name="authCode" placeholder="인증번호 6자리" onChange={handleChange} className={`w-full h-12 px-4 rounded-xl border ${isAuthVerified ? 'border-green-500 bg-green-50' : 'border-slate-200'} outline-none`} />
                {isAuthVerified && <Check className="absolute right-3 top-3.5 text-green-600" size={18} />}
              </div>
              <button type="button" onClick={handleVerifyCode} className="px-4 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">인증확인</button>
            </div>
          </section>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => navigate(-1)} className="flex-1 h-14 bg-white border border-slate-300 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
               취소
            </button>
            <button type="submit" className="flex-1 h-14 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all">
              가입하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;