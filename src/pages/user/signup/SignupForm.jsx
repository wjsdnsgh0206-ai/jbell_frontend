import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, 
  MapPin, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Check, 
  CalendarDays
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    mode: 'onChange'
  });

  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isAuthVerified, setIsAuthVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch('password');
  const userId = watch('userId');
  const email = watch('email');

  const handleSendCode = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }
    alert(`${email}로 인증번호가 발송되었습니다.`);
  };

  const handleIdCheck = () => {
    if (!userId) {
      alert("아이디를 입력해주세요.");
      return;
    }
    if (userId.length < 5) {
      alert("아이디는 5자 이상이어야 합니다.");
      return;
    }
    alert("사용 가능한 아이디입니다.");
    setIsIdChecked(true);
  };

  const handleVerifyCode = () => {
    const authCode = watch('authCode');
    if (authCode === "123456") {
      alert("인증되었습니다.");
      setIsAuthVerified(true);
    } else {
      alert("인증번호가 일치하지 않습니다.");
    }
  };

  const onSubmit = (data) => {
    if (!isIdChecked) {
      alert("아이디 중복 확인을 해주세요.");
      return;
    }
    if (!isAuthVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }
    
    alert("회원가입이 성공적으로 완료되었습니다!");
    navigate('/login');
  };

  const ErrorMsg = ({ name }) => (
    errors[name] ? (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle size={12}/>
        {errors[name]?.message}
      </p>
    ) : null
  );

  return (
    <div className="min-h-screen bg-white flex justify-center py-10 px-4 font-sans text-slate-900 text-left">
      <div className="max-w-[550px] w-full">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">회원가입</h1>
          <p className="text-slate-500 mt-2">간단한 정보 입력으로 가입을 완료하세요.</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 거주지 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3">
              <MapPin size={20} className="text-blue-600" /> 거주 지역
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <select 
                  {...register('residenceArea', { required: '지역을 선택해주세요.' })}
                  className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full"
                >
                  <option value="">시/도 선택</option>
                  <option value="seoul">서울특별시</option>
                  <option value="busan">부산광역시</option>
                </select>
                <ErrorMsg name="residenceArea" />
              </div>
              <select 
                {...register('district')}
                className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none text-sm"
              >
                <option value="">시/군/구 선택</option>
                <option value="gangnam">강남구</option>
              </select>
            </div>
          </section>

          {/* 기본 정보 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3">
              <User size={20} className="text-blue-600" /> 기본 정보
            </h2>
            
            {/* 이름 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500">이름</label>
              <input 
                type="text" 
                placeholder="실명을 입력하세요"
                {...register('name', { 
                  required: '이름을 입력해주세요.',
                  minLength: { value: 2, message: '이름은 2자 이상이어야 합니다.' }
                })}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500" 
              />
              <ErrorMsg name="name" />
            </div>

            {/* 생년월일 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <CalendarDays size={14}/> 생년월일
              </label>
              <input 
                type="date" 
                {...register('birthDate', { 
                  required: '생년월일을 선택해주세요.',
                  validate: (value) => {
                    const today = new Date();
                    const birthDate = new Date(value);
                    const age = today.getFullYear() - birthDate.getFullYear();
                    return age >= 14 || '만 14세 이상만 가입 가능합니다.';
                  }
                })}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500 bg-white" 
              />
              <ErrorMsg name="birthDate" />
            </div>

            {/* 성별 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500">성별</label>
              <div className="flex gap-4">
                {['male', 'female'].map((g) => (
                  <label 
                    key={g} 
                    className={`flex-1 h-12 flex items-center justify-center rounded-xl border cursor-pointer transition-all font-medium text-sm ${
                      watch('gender') === g 
                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' 
                        : 'border-slate-200 text-slate-500 bg-white'
                    }`}
                  >
                    <input 
                      type="radio" 
                      value={g} 
                      {...register('userGender', { required: '성별을 선택해주세요.' })}
                      className="hidden" 
                    />
                    {g === 'male' ? '남' : '여'}
                  </label>
                ))}
              </div>
              <ErrorMsg name="userGender" />
            </div>

            {/* 아이디 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500">아이디</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="5~12자 영문, 숫자"
                  {...register('userId', { 
                    required: '아이디를 입력해주세요.',
                    minLength: { value: 5, message: '아이디는 5자 이상이어야 합니다.' },
                    maxLength: { value: 12, message: '아이디는 12자 이하여야 합니다.' },
                    pattern: { 
                      value: /^[a-zA-Z0-9]+$/, 
                      message: '영문과 숫자만 사용 가능합니다.' 
                    },
                    onChange: () => setIsIdChecked(false)
                  })}
                  className={`flex-1 h-12 px-4 rounded-xl border ${
                    isIdChecked ? 'border-green-500 bg-green-50' : 'border-slate-200'
                  } outline-none`} 
                />
                <button 
                  type="button" 
                  onClick={handleIdCheck} 
                  className={`px-4 rounded-xl text-xs font-bold transition-all ${
                    isIdChecked ? 'bg-green-600 text-white' : 'bg-slate-800 text-white'
                  }`}
                >
                  {isIdChecked ? '확인완료' : '중복확인'}
                </button>
              </div>
              <ErrorMsg name="userId" />
            </div>

            {/* 비밀번호 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <Lock size={14}/> 비밀번호
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="조합 8~16자"
                  {...register('userPw', { 
                    required: '비밀번호를 입력해주세요.',
                    minLength: { value: 8, message: '비밀번호는 8자 이상이어야 합니다.' },
                    maxLength: { value: 16, message: '비밀번호는 16자 이하여야 합니다.' },
                    pattern: { 
                      value: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/, 
                      message: '영문, 숫자, 특수문자를 포함해야 합니다.' 
                    }
                  })}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <ErrorMsg name="userPw" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500">비밀번호 확인</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "userPw"} 
                  placeholder="비밀번호 재입력"
                  {...register('confirmPassword', { 
                    required: '비밀번호 확인을 입력해주세요.',
                    validate: (value) => value === password || '비밀번호가 일치하지 않습니다.'
                  })}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <ErrorMsg name="confirmPassword" />
            </div>
          </section>

          {/* 인증 섹션 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3">
              <Mail size={20} className="text-blue-600" /> 연락처 인증
            </h2>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="example@mail.com"
                {...register('email', { 
                  required: '이메일을 입력해주세요.',
                  pattern: { 
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                    message: '올바른 이메일 형식이 아닙니다.' 
                  }
                })}
                className="flex-1 h-12 px-4 rounded-xl border border-slate-200 outline-none" 
              />
              <button 
                type="button" 
                onClick={handleSendCode} 
                className="px-4 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-200"
              >
                번호전송
              </button>
            </div>
            <ErrorMsg name="email" />
            
            <div className="flex gap-2 mt-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="인증번호 6자리"
                  {...register('authCode')}
                  className={`w-full h-12 px-4 rounded-xl border ${
                    isAuthVerified ? 'border-green-500 bg-green-50' : 'border-slate-200'
                  } outline-none`} 
                />
                {isAuthVerified && <Check className="absolute right-3 top-3.5 text-green-600" size={18} />}
              </div>
              <button 
                type="button" 
                onClick={handleVerifyCode} 
                className="px-4 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                인증확인
              </button>
            </div>
          </section>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="flex-1 h-14 bg-white border border-slate-300 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors"
            >
              취소
            </button>
            <button 
              type="submit" 
              className="flex-1 h-14 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all"
            >
              가입하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;