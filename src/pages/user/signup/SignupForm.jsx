import React, { useState, useEffect } from 'react'; 
import { useForm } from 'react-hook-form';
import { 
  User, MapPin, Mail, Lock, Eye, EyeOff, AlertCircle, Check, CalendarDays
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
// 가이드하신 임포트 형식으로 수정
import { userService, commonService } from '@/services/api'; 
import EmailAuthSection from '@/components/user/auth/EmailAuthSection';


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
  const userEmail = watch('userEmail');
  const authCode = watch('authCode');


  const [sggList, setSggList] = useState([]);

 useEffect(() => {
  const fetchRegions = async () => {
    try {
      // 백엔드에서 AREA_JB(전북) 그룹 코드를 불러옵니다.
      const response = await commonService.getCodeList('AREA_JB');
      if (response && response.data) {
        setSggList(response.data);
      }
    } catch (error) {
      console.error("지역 코드 로드 실패:", error);
    }
  };
  fetchRegions();
}, []);
  

  // 아이디 중복 확인 API 연동
  const handleIdCheck = async () => {
  if (!userId) {
    alert("아이디를 입력해주세요.");
    return;
  }

  try {
    // 백엔드에서 성공(200) 응답 시 데이터 본문의 false가 넘어옵니다.
    // 즉, isDuplicated(중복여부)가 false라는 뜻입니다.
    const isDuplicated = await userService.checkId(userId); 
    
    // 중복이 아닐 때 (false일 때) 사용 가능한 아이디입니다.
    if (isDuplicated === false) { 
      alert("사용 가능한 아이디입니다.");
      setIsIdChecked(true);
    } else {
      // 혹시 백엔드에서 200 OK이면서 true를 보내는 예외 케이스 대응
      alert("이미 사용 중인 아이디입니다.");
      setIsIdChecked(false);
    }
  } catch (error) {
    // 백엔드에서 409 Conflict 에러를 던지면 catch 블록으로 들어옵니다.
    if (error.response && error.response.status === 409) {
      alert("이미 사용 중인 아이디입니다.");
    } else {
      alert("중복 확인 중 오류가 발생했습니다.");
    }
    setIsIdChecked(false);
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

      const requestData = {
        userId: data.userId,
      userPw: data.userPw,
      userName: data.userName,
      userBirthDate: data.userBirthDate,
      userEmail: data.userEmail,
      userResidenceArea: data.userResidenceArea, // 선택한 '전주시' 등의 값만 전송
      userGender: data.userGender
    };

      // 백엔드 /api/auth/signup 호출
      const response = await userService.signup(requestData);
      
      if (response.status === "SUCCESS") {
        alert("회원가입이 성공적으로 완료되었습니다!");
        navigate('/signupSuccess', { 
        replace: true, 
        state: { 
          user: {
            userName: data.userName,
            userBirthDate: data.userBirthDate,
            userId: data.userId, 
            userEmail: data.userEmail
          } 
        } 
      });
      } else {
        alert(response.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert(error.response?.data?.message || "회원가입 중 서버 오류가 발생했습니다.");
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
              <MapPin size={20} className="text-blue-600" /> 거주 지역
            </h2>
            <div className="flex gap-3">
              {/* '전북특별자치도'는 고정 텍스트로 표시 */}
              <div className="flex-1 h-12 flex items-center px-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm font-medium">
                전북특별자치도
              </div>
              
              <select 
                {...register('userResidenceArea', { required: '거주 지역을 선택해주세요.' })}
                className="flex-1 h-12 px-4 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">시/군 선택</option>
                {sggList.map((item) => (
                  // 백엔드에 코드값을 저장하도록 설정 (예: 52110)
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <ErrorMsg name="userResidenceArea" />
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
                {...register('userName', { 
                  required: '이름을 입력해주세요.',
                  minLength: { value: 2, message: '이름은 2자 이상이어야 합니다.' }
                })}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500" 
              />
              <ErrorMsg name="userName" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <CalendarDays size={14}/> 생년월일
              </label>
              <input 
                type="date" 
                {...register('userBirthDate', { required: '생년월일을 선택해주세요.' })}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500 bg-white" 
              />
              <ErrorMsg name="userBirthDate" />
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

          <EmailAuthSection 
        register={register}
        watch={watch}
        errors={errors}
        userEmail={userEmail}
        isAuthVerified={isAuthVerified}
        setIsAuthVerified={setIsAuthVerified}
        userService={userService}
      />

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