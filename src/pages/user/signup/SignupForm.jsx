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
import { userService } from '../../../services/api'; 
import axios from 'axios'; // axios가 설치되어 있다고 가정합니다.

const SignupForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    mode: 'onChange'
  });

  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isAuthVerified, setIsAuthVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const userPw = watch('userPw');
  const userId = watch('userId');
  const email = watch('email');

  // [기능 추가] 아이디 중복 확인 API 연동
  const handleIdCheck = async () => {
    if (!userId || userId.length < 5) {
      alert("아이디를 5자 이상 입력해주세요.");
      return;
    }

    try {
      // 제시해주신 URL 형식으로 호출
      // 만약 userService.checkId가 이미 구현되어 있다면 그것을 사용하세요.
      const response = await axios.get(`http://localhost:8080/api/auth/checkid?userId=${userId}`);
      
      // 서버 응답 조건에 맞춰 수정하세요 (예: response.data가 true면 사용 가능)
      if (response.data === true || response.data.available === true) {
        alert("사용 가능한 아이디입니다.");
        setIsIdChecked(true);
      } else {
        alert("이미 사용 중인 아이디입니다.");
        setIsIdChecked(false);
      }
    } catch (error) {
      console.error("ID Check Error:", error);
      alert("중복 확인 중 오류가 발생했습니다.");
      setIsIdChecked(false);
    }
  };

  const handleSendCode = () => {
    if (!email || errors.email) {
      alert("올바른 이메일을 입력해주세요.");
      return;
    }
    setIsAuthVerified(false);
    alert(`${email}로 인증번호가 발송되었습니다. (테스트용: 123456)`);
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

  const onSubmit = async (data) => {
    if (!isIdChecked) {
      alert("아이디 중복 확인을 해주세요.");
      return;
    }
    if (!isAuthVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    try {
      const area = data.residenceArea || "";
      const dist = data.district || "";
      const fullAddress = `${area} ${dist}`.trim();

      const requestData = {
        userId: data.userId,
        userPw: data.userPw,
        name: data.name,
        birthDate: data.birthDate,
        email: data.email,
        residenceArea: fullAddress || null,
        userGender: data.userGender
      };

      await userService.signup(requestData);
      alert("회원가입이 성공적으로 완료되었습니다!");
      navigate('/signupSuccess');
    } catch (error) {
      console.error("Signup Error:", error);
      alert(error.response?.data?.message || "회원가입에 실패했습니다.");
    }
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
          {/* 거주 지역 (선택사항) */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3">
              <MapPin size={20} className="text-blue-600" /> 거주 지역 <span className="text-xs font-normal text-slate-400 ml-1">(선택사항)</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <select 
                  {...register('residenceArea')}
                  className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full"
                >
                  <option value="">시/도 선택</option>
                  <option value="서울특별시">서울특별시</option>
                  <option value="부산광역시">부산광역시</option>
                </select>
              </div>
              <select 
                {...register('district')}
                className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none text-sm"
              >
                <option value="">시/군/구 선택</option>
                <option value="강남구">강남구</option>
                <option value="해운대구">해운대구</option>
              </select>
            </div>
          </section>

          {/* 기본 정보 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3">
              <User size={20} className="text-blue-600" /> 기본 정보
            </h2>
            
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

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <CalendarDays size={14}/> 생년월일
              </label>
              <input 
                type="date" 
                {...register('birthDate', { required: '생년월일을 선택해주세요.' })}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500 bg-white" 
              />
              <ErrorMsg name="birthDate" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500">성별</label>
              <div className="flex gap-4">
                {[
                  { label: '남', value: 'M' },
                  { label: '여', value: 'F' }
                ].map((g) => (
                  <label 
                    key={g.value} 
                    className={`flex-1 h-12 flex items-center justify-center rounded-xl border cursor-pointer transition-all font-medium text-sm ${
                      watch('userGender') === g.value 
                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' 
                        : 'border-slate-200 text-slate-500 bg-white'
                    }`}
                  >
                    <input 
                      type="radio" 
                      value={g.value} 
                      {...register('userGender', { required: '성별을 선택해주세요.' })}
                      className="hidden" 
                    />
                    {g.label}
                  </label>
                ))}
              </div>
              <ErrorMsg name="userGender" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500">아이디</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="5~12자 영문, 숫자"
                  {...register('userId', { 
                    required: '아이디를 입력해주세요.',
                    minLength: { value: 5, message: '아이디는 5자 이상이어야 합니다.' },
                    onChange: () => setIsIdChecked(false) 
                  })}
                  className={`flex-1 h-12 px-4 rounded-xl border outline-none transition-colors ${
                    isIdChecked ? 'border-green-500 bg-green-50' : 'border-slate-200 focus:border-blue-500'
                  }`} 
                />
                <button 
                  type="button" 
                  onClick={handleIdCheck} 
                  className={`px-4 rounded-xl text-xs font-bold transition-all ${
                    isIdChecked ? 'bg-green-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
                  }`}
                >
                  {isIdChecked ? '확인완료' : '중복확인'}
                </button>
              </div>
              <ErrorMsg name="userId" />
            </div>

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
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="비밀번호 재입력"
                  {...register('confirmPassword', { 
                    required: '비밀번호 확인을 입력해주세요.',
                    validate: (value) => value === userPw || '비밀번호가 일치하지 않습니다.'
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
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '올바른 형식의 이메일을 입력해주세요.' },
                  onChange: () => {
                    if (isAuthVerified) {
                      setIsAuthVerified(false);
                      setValue('authCode', '');
                    }
                  }
                })}
                className={`flex-1 h-12 px-4 rounded-xl border outline-none transition-colors ${
                  isAuthVerified ? 'border-green-500 bg-green-50' : 'border-slate-200 focus:border-blue-500'
                }`} 
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
                  disabled={isAuthVerified}
                  className={`w-full h-12 px-4 rounded-xl border outline-none transition-colors ${
                    isAuthVerified ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 focus:border-blue-500'
                  }`} 
                />
                {isAuthVerified && <Check className="absolute right-3 top-3.5 text-green-600" size={18} />}
              </div>
              <button 
                type="button" 
                onClick={handleVerifyCode} 
                disabled={isAuthVerified}
                className={`px-4 rounded-xl text-xs font-bold transition-all ${
                  isAuthVerified ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isAuthVerified ? '인증완료' : '인증확인'}
              </button>
            </div>
            {isAuthVerified && (
              <p className="text-[11px] text-green-600 mt-1 ml-1 flex items-center gap-1">
                <Check size={12}/> 이메일 인증이 완료되었습니다. 주소 수정 시 재인증이 필요합니다.
              </p>
            )}
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