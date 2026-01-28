import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, MapPin, Mail, Lock, Eye, EyeOff, AlertCircle, CalendarDays } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import { userService, commonService } from '@/services/api'; 
import EmailAuthSection from '@/components/user/auth/EmailAuthSection';
import { useAuth } from '@/contexts/AuthContext';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // 1. useForm 설정 (SignupForm의 handleSubmit과 유효성 검사 로직 적용)
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    mode: 'onChange'
  });

  const [isAuthVerified, setIsAuthVerified] = useState(true); // 기존 회원이므로 초기값 true
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sggList, setSggList] = useState([]);

  // 실시간 값 모니터링
  const userPw = watch('userPw');
  const userEmail = watch('userEmail');

  // 2. 초기 데이터 로드 (지역 코드 및 사용자 정보)
 useEffect(() => {
  const initData = async () => {
    if (!user?.userId) return;

    try {
      // [수정] 지역 코드 리스트 로드 추가
      const regionRes = await commonService.getCodeList('AREA_JB');
      if (regionRes?.data) setSggList(regionRes.data);

      const res = await userService.getUserInfo(user.userId);
      const userData = res.data?.data || res.data;

      if (userData) {
        setValue('userId', userData.userId);
        setValue('userName', userData.userName);
        setValue('userEmail', userData.userEmail);
        setValue('userGender', userData.userGender);
        setValue('userResidenceArea', userData.userResidenceArea); // 지역 코드 매칭
        
        if (userData.userBirthDate) {
          setValue('userBirthDate', userData.userBirthDate.substring(0, 10));
        }
      }
    } catch (error) {
      console.error("데이터 초기화 실패:", error);
    }
  };
  initData();
}, [user, setValue]);

  // 3. 수정 완료 처리 (SignupForm의 onSubmit 로직 참고)
  const onSubmit = async (data) => {
  // 🔍 콘솔 3: 사용자가 입력한 순수 폼 데이터 (비밀번호 포함)
  console.log("📍 [3. 수정 버튼 클릭 - 원본 데이터]:", data);

  if (!isAuthVerified) {
    alert("이메일 인증을 완료해주세요.");
    return;
  }

  try {
    const payload = { ...data };
    
    // 비밀번호가 비어있으면 전송 객체에서 삭제하는 로직 확인용
    if (!payload.userPw || payload.userPw === "") {
      console.log("💡 알림: 비밀번호 변경 없음 - 비밀번호 필드 제외");
      delete payload.userPw;
      delete payload.confirmPassword;
    }

    // 🔍 콘솔 4: 실제 서버로 날아가는 최종 JSON 객체
    console.log("📍 [4. 서버 전송 최종 Payload]:", payload);

    const response = await userService.updateProfile(payload);
    
    // 🔍 콘솔 5: 서버의 응답 결과
    console.log("📍 [5. 서버 응답 결과]:", response);

    if (response.status === "SUCCESS" || response.data === 1) {
      alert("회원 정보가 수정되었습니다.");
      navigate('/myProfile');
    }
  } catch (error) {
    console.error("❌ 수정 실패 상세 에러:", error.response?.data || error);
    alert("수정 중 오류가 발생했습니다.");
  }
};

  // 에러 메시지 컴포넌트 (SignupForm 스타일)
  const ErrorMsg = ({ name }) => (
    errors[name] ? (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle size={12}/>
        {errors[name]?.message}
      </p>
    ) : null
  );

  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "마이페이지", path: "/myProfile" },
    { label: "내 정보 수정" },
  ];

  return (
    <div className="flex flex-col items-center w-full pb-20 px-4 lg:px-0 text-left">
      <PageBreadcrumb items={breadcrumbItems} />

      <div className="max-w-[1280px] w-full">
        <header className="flex flex-col w-full gap-4 mb-16">
          <h1 className="text-heading-xl text-graygray-90">프로필 정보</h1>
          <p className="text-detail-m text-graygray-70">회원님의 등록된 정보를 수정하실 수 있습니다.</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 거주지 섹션 (디자인 유지 + Signup 로직) */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3">
              <MapPin size={20} className="text-blue-600" /> 거주 지역
            </h2>
            <div className="flex gap-3">
              <div className="flex-1 h-12 flex items-center px-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm font-medium">
                전북특별자치도
              </div>
              <select 
                {...register('userResidenceArea', { required: '거주 지역을 선택해주세요.' })}
                className="flex-1 h-12 px-4 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              >
                <option value="">시/군 선택</option>
                {/* [수정] SignupForm과 동일하게 map 처리 */}
                {sggList.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <ErrorMsg name="userResidenceArea" />
          </section>

          {/* 기본 정보 섹션 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3">
              <User size={20} className="text-blue-600" /> 기본 정보
            </h2>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">이름</label>
              <input 
                type="text" 
                {...register('userName', { required: '이름을 입력해주세요.' })}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium" 
              />
              <ErrorMsg name="userName" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1 ml-1">
                <CalendarDays size={14}/> 생년월일
              </label>
              <input 
                type="date" 
                {...register('userBirthDate', { required: '생년월일을 선택해주세요.' })}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500 bg-white font-medium" 
              />
              <ErrorMsg name="userBirthDate" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">성별</label>
              <div className="flex gap-3">
                {[ {l:'남성', v:'M'}, {l:'여성', v:'F'} ].map((g) => (
                  <label key={g.v} className={`flex-1 h-12 flex items-center justify-center rounded-xl border cursor-pointer transition-all font-bold text-sm ${watch('userGender') === g.v ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' : 'border-slate-100 text-slate-400 bg-slate-50'}`}>
                    <input type="radio" value={g.v} {...register('userGender')} className="hidden" />
                    {g.l}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2 opacity-80">
              <label className="text-xs font-bold text-gray-500 ml-1">아이디 (변경 불가)</label>
              <div className="relative">
                <input type="text" {...register('userId')} readOnly className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-100 cursor-not-allowed outline-none text-slate-500 font-medium" />
                <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* 비밀번호 변경 영역 (패턴 및 일치 확인 적용) */}
            <div className="pt-2 border-t border-dashed border-slate-200 text-left">
              <p className="text-[11px] text-slate-400 mb-4">* 비밀번호 변경 시에만 입력해주세요.</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 flex items-center gap-1 ml-1"><Lock size={14}/> 새 비밀번호</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="8~16자 영문, 숫자, 특수문자 조합"
                      {...register('userPw', {
                        pattern: { 
                          value: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/, 
                          message: '영문, 숫자, 특수문자 포함 8~16자로 입력해주세요.' 
                        }
                      })}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <ErrorMsg name="userPw" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 ml-1">새 비밀번호 확인</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="비밀번호 재입력"
                      {...register('confirmPassword', {
                        validate: (val) => {
                          if (userPw && !val) return "비밀번호 확인을 입력해주세요.";
                          if (val !== userPw) return "비밀번호가 일치하지 않습니다.";
                        }
                      })}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500" 
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <ErrorMsg name="confirmPassword" />
                </div>
              </div>
            </div>
          </section>

          {/* 인증 섹션 (SignupForm에서 호출한 이메일 공통 컴포넌트) */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3">
              <Mail size={20} className="text-blue-600" /> 연락처 수정
            </h2>
            <EmailAuthSection 
              register={register}
              watch={watch}
              errors={errors}
              userEmail={userEmail}
              isAuthVerified={isAuthVerified}
              setIsAuthVerified={setIsAuthVerified}
              userService={userService}
            />
          </section>

          {/* 버튼 영역 */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => navigate('/myProfile')} className="flex-1 h-14 bg-white border border-slate-300 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors">취소</button>
            <button type="submit" className="flex-1 h-14 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all">수정 완료</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;