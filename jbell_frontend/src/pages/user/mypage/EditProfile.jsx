import React, { useState, useEffect } from 'react';
import { User, MapPin, Mail, Lock, Eye, EyeOff, AlertCircle, Check, CalendarDays } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';

const EditProfile = () => {
  const navigate = useNavigate();

  const breadcrumbItems = [
        { label: "홈", path: "/", hasIcon: true },
        { label: "마이페이지", path: "/myProfile", hasIcon: false }, // 리스트로 이동 가능하게 path 추가
        { label: "내정보 수정", path: "", hasIcon: false },
      ];
  
  // 1. 초기 상태값 (실제로는 API에서 받아온 데이터를 넣습니다)
  const [formData, setFormData] = useState({
    city: 'seoul', 
    district: 'gangnam', 
    name: '홍길동', 
    birthDate: '1990-01-01', // 추가
    gender: 'male',          // 추가
    userId: 'hong1234', 
    password: '', 
    confirmPassword: '',
    email: 'hong@example.com', 
    authCode: ''
  });

  const [errors, setErrors] = useState({});
  const [isAuthVerified, setIsAuthVerified] = useState(true); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    console.log("기존 사용자 정보를 로드했습니다.");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSendCode = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: "올바른 이메일 형식을 입력해주세요." }));
      return;
    }
    alert(`${formData.email}로 새로운 인증번호가 발송되었습니다.`);
    setIsAuthVerified(false); 
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
    const newErrors = {};

    if (!formData.name) newErrors.name = "이름을 입력해주세요.";
    if (!formData.city) newErrors.city = "지역을 선택해주세요.";
    if (!formData.birthDate) newErrors.birthDate = "생년월일을 선택해주세요.";

    if (formData.password) {
      const pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
      if (!pwRegex.test(formData.password)) {
        newErrors.password = "영문, 숫자, 특수문자 포함 8~16자로 입력해주세요.";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!isAuthVerified) return alert("이메일 인증을 완료해주세요.");
    
    alert("회원 정보가 수정되었습니다.");
    navigate('/myProfile'); // 경로 확인 필요 (/mypage -> /myProfile로 수정)
  };

  const ErrorMsg = ({ name }) => (
    errors[name] ? <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors[name]}</p> : null
  );

  return (
    <>
    <PageBreadcrumb items={breadcrumbItems} />

    <div className="min-h-screen bg-white flex justify-center py-10 px-4 font-sans text-slate-900 text-left">
      <div className="max-w-[550px] w-full">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">프로필 수정</h1>
          <p className="text-slate-500 mt-2">회원님의 소중한 정보를 안전하게 관리하세요.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 거주지 섹션 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3"><MapPin size={20} className="text-blue-600" /> 거주 지역</h2>
            <div className="grid grid-cols-2 gap-3">
              <select name="city" value={formData.city} onChange={handleChange} className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option value="seoul">서울특별시</option>
                <option value="busan">부산광역시</option>
              </select>
              <select name="district" value={formData.district} onChange={handleChange} className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none text-sm font-medium">
                <option value="gangnam">강남구</option>
                <option value="seocho">서초구</option>
              </select>
            </div>
          </section>

          {/* 기본 정보 섹션 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3"><User size={20} className="text-blue-600" /> 기본 정보</h2>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">이름</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium" />
              <ErrorMsg name="name" />
            </div>

            {/* 생년월일 추가 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1 ml-1">
                <CalendarDays size={14}/> 생년월일
              </label>
              <input 
                type="date" 
                name="birthDate" 
                value={formData.birthDate} 
                onChange={handleChange} 
                className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500 bg-white font-medium" 
              />
              <ErrorMsg name="birthDate" />
            </div>

            {/* 성별 추가 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">성별</label>
              <div className="flex gap-3">
                {['male', 'female'].map((g) => (
                  <label key={g} className={`flex-1 h-12 flex items-center justify-center rounded-xl border cursor-pointer transition-all font-bold text-sm ${formData.gender === g ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' : 'border-slate-100 text-slate-400 bg-slate-50'}`}>
                    <input 
                      type="radio" 
                      name="gender" 
                      value={g} 
                      checked={formData.gender === g}
                      onChange={handleChange} 
                      className="hidden" 
                    />
                    {g === 'male' ? '남성' : '여성'}
                  </label>
                ))}
              </div>
            </div>

            {/* 아이디 (수정 불가) */}
            <div className="space-y-2 opacity-80">
              <label className="text-xs font-bold text-gray-500 ml-1">아이디 (변경 불가)</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="userId" 
                  value={formData.userId} 
                  readOnly 
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-100 cursor-not-allowed outline-none text-slate-500 font-medium" 
                />
                <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* 비밀번호 변경 영역 */}
            <div className="pt-2 border-t border-dashed border-slate-200">
              <p className="text-[11px] text-slate-400 mb-4">* 비밀번호 변경 시에만 입력해주세요.</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 flex items-center gap-1 ml-1"><Lock size={14}/> 새 비밀번호</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="password" placeholder="변경할 비밀번호 입력" onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <ErrorMsg name="password" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 ml-1">새 비밀번호 확인</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="비밀번호 재입력" onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <ErrorMsg name="confirmPassword" />
                </div>
              </div>
            </div>
          </section>

          {/* 인증 섹션 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3"><Mail size={20} className="text-blue-600" /> 연락처 수정</h2>
            <div className="flex gap-2">
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="flex-1 h-12 px-4 rounded-xl border border-slate-200 outline-none font-medium" />
              <button type="button" onClick={handleSendCode} className="w-24 px-4 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-200 transition-colors">인증요청</button>
            </div>
            
            {!isAuthVerified && (
              <div className="flex gap-2 mt-2 animate-in slide-in-from-top-1 duration-300">
                <div className="relative flex-1">
                  <input type="text" name="authCode" placeholder="인증번호 6자리" onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500" />
                </div>
                <button type="button" onClick={handleVerifyCode} className="w-24 px-4 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md">확인</button>
              </div>
            )}
            {isAuthVerified && <p className="text-xs text-green-600 flex items-center gap-1 font-medium ml-1"><Check size={14}/> 인증 완료된 이메일입니다.</p>}
          </section>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => navigate('/myProfile')} className="flex-1 h-14 bg-white border border-slate-300 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors">취소</button>
            <button type="submit" className="flex-1 h-14 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all">수정 완료</button>
          </div>
        </form>
      </div>
    </div>
  </>
  );
};

export default EditProfile;