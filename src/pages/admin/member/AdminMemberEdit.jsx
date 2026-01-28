import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { User, MapPin, Mail, Lock, Eye, EyeOff, AlertCircle, ShieldCheck, UserCog } from 'lucide-react';
import { userService, commonService } from '@/services/api';

const AdminMemberEdit = () => {
    const { memberId } = useParams();
    const navigate = useNavigate();

    // 1. useForm 설정 (유효성 검사 포함)
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        mode: 'onChange'
    });

    const [sggList, setSggList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    // 실시간 값 모니터링 (비밀번호 일치 확인용)
    const userPw = watch('userPw');
    const userGrade = watch('userGrade');
    const userStatus = watch('userStatus');

    /** <================ 데이터 로드 ================> **/
    useEffect(() => {
        const initData = async () => {
            try {
                // 1. 지역 코드 로드
                const regionRes = await commonService.getCodeList('AREA_JB');
                if (regionRes?.data) setSggList(regionRes.data);

                // 2. 회원 상세 정보 로드
                const res = await userService.getMemberDetail(memberId);
                const userData = res.data?.data || res.data;

                if (userData) {
                    setValue('userId', userData.userId);
                    setValue('userName', userData.userName);
                    setValue('userEmail', userData.userEmail);
                    setValue('userResidenceArea', userData.userResidenceArea);
                    setValue('userGrade', userData.userGrade || 'USER');
                    // status가 1이면 true, 0이면 false로 변환하여 토글 연동
                    setValue('userStatus', userData.status === 1 || userData.userStatus === true);
                }
            } catch (error) {
                console.error("데이터 로드 실패:", error);
                alert("정보를 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        if (memberId) initData();
    }, [memberId, setValue]);

    /** <================ 수정 완료 처리 ================> **/
    const onSubmit = async (data) => {
        try {
            // [수정] data 객체에만 의존하지 말고, 현재 watch 중인 userStatus 값을 명시적으로 추가
            const payload = { 
                ...data,
                status: userStatus === true // Boolean 값(true/false)으로 확실히 변환
            };

            // 비밀번호 필드 처리
            if (!payload.userPw) {
                delete payload.userPw;
                delete payload.confirmPassword;
            }

            // 로그 확인용 (브라우저 콘솔에서 status가 있는지 꼭 확인하세요!)
            console.log("백엔드로 보내는 최종 데이터:", payload);

            await userService.updateMember(memberId, payload);
            alert('회원 정보가 성공적으로 수정되었습니다.');
            navigate(`/admin/member/detail/${memberId}`);
        } catch (error) {
            console.error("수정 실패:", error);
            alert('수정 중 오류가 발생했습니다.');
        }
    };

    // 에러 메시지 컴포넌트
    const ErrorMsg = ({ name }) => (
        errors[name] ? (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors[name]?.message}
            </p>
        ) : null
    );

    if (isLoading) return <div className="p-10 text-center font-medium text-gray-500">데이터를 불러오는 중입니다...</div>;

    return (
        <div className="p-6 bg-[#F8F9FB] min-h-screen flex flex-col items-center">
            <div className="max-w-[800px] w-full">
                <header className="mb-8 text-left w-full">
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <UserCog className="text-blue-600" /> 회원 정보 관리
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">관리자 권한으로 회원 정보를 수정합니다.</p>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* 기본 정보 섹션 */}
                    <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-5">
                        <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-4 text-slate-800">
                            <User size={20} className="text-blue-600" /> 기본 인적 사항
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">아이디 (수정 불가)</label>
                                <div className="relative">
                                    <input type="text" {...register('userId')} readOnly className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed outline-none font-medium" />
                                    <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">이름</label>
                                <input 
                                    type="text" 
                                    {...register('userName', { required: '이름은 필수 항목입니다.' })}
                                    className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium" 
                                />
                                <ErrorMsg name="userName" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 ml-1">이메일 주소</label>
                            <div className="relative">
                                <input 
                                    type="email" 
                                    {...register('userEmail', { 
                                        required: '이메일을 입력해주세요.',
                                        pattern: { value: /\S+@\S+\.\S+/, message: '유효한 이메일 형식이 아닙니다.' }
                                    })}
                                    className="w-full h-12 px-10 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium" 
                                />
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                            <ErrorMsg name="userEmail" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 ml-1">거주 지역 (전북)</label>
                            <div className="flex gap-2">
                                <div className="flex-[0.5] h-12 flex items-center px-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm font-medium">전북특별자치도</div>
                                <select 
                                    {...register('userResidenceArea', { required: '지역을 선택해주세요.' })}
                                    className="flex-1 h-12 px-4 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                                >
                                    <option value="">시/군 선택</option>
                                    {sggList.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
                                </select>
                            </div>
                            <ErrorMsg name="userResidenceArea" />
                        </div>
                    </section>

                    {/* 권한 및 상태 섹션 */}
                    <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-5">
                        <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-4 text-slate-800">
                            <ShieldCheck size={20} className="text-blue-600" /> 관리 설정
                        </h2>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-500 ml-1">회원 등급</label>
                            <div className="flex gap-3">
                                {['USER', 'ADMIN'].map(role => (
                                    <label key={role} className={`flex-1 h-12 flex items-center justify-center rounded-xl border cursor-pointer transition-all font-bold text-sm ${userGrade === role ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 bg-slate-50'}`}>
                                        <input type="radio" value={role} {...register('userGrade')} className="hidden" />
                                        {role === 'ADMIN' ? '관리자 (ADMIN)' : '일반 사용자 (USER)'}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-between bg-slate-50 p-4 rounded-xl">
                            <div>
                                <span className="block font-bold text-sm text-slate-700">계정 활성화 상태</span>
                                <span className="text-xs text-gray-500">정지 시 해당 회원은 서비스를 이용할 수 없습니다.</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-sm font-bold ${userStatus ? 'text-blue-600' : 'text-red-500'}`}>
                                    {userStatus ? '정상 사용' : '접속 제한'}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setValue('userStatus', !userStatus)}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${userStatus ? 'bg-blue-600' : 'bg-slate-300'}`}
                                >
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${userStatus ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                {/* hook-form에 값을 등록하기 위한 숨김 필드 */}
                                <input type="checkbox" {...register('userStatus')} className="hidden" />
                            </div>
                        </div>
                    </section>

                    {/* 비밀번호 변경 섹션 (선택 사항) */}
                    <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-4 text-slate-800 mb-5">
                            <Lock size={20} className="text-orange-500" /> 비밀번호 강제 변경
                        </h2>
                        <p className="text-[11px] text-slate-400 mb-4">* 회원이 비밀번호를 분실한 경우에만 새 비밀번호를 입력하세요.</p>
                        
                        <div className="space-y-4">
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="새 비밀번호 (8~16자 영문, 숫자, 특수문자 조합)"
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
                    </section>

                    {/* 버튼 영역 */}
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => navigate(-1)} className="flex-1 h-14 bg-white border border-slate-300 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors">취소</button>
                        <button type="submit" className="flex-1 h-14 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all">회원 정보 업데이트</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminMemberEdit;