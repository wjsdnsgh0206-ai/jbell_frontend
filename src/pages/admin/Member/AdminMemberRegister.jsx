import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../services/api'; // userService 임포트 추가

const AdminMemberRegister = () => {
    const navigate = useNavigate();
    
    const [memberForm, setMemberForm] = useState({
        memberId: '', 
        memberPw: '', 
        memberName: '', 
        memberTelNum: '', 
        memberRegion: '', 
        memberRole: '사용자'
    });

    const [errors, setErrors] = useState({});
    const [isIdVerified, setIsIdVerified] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'memberTelNum') {
            newValue = value
                .replace(/[^0-9]/g, '')
                .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
        }

        setMemberForm(prev => ({ ...prev, [name]: newValue }));
        
        if (name === 'memberId') {
            setIsIdVerified(false);
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // 아이디 중복 확인 API 연동
    const checkIdDuplication = async () => {
        const idRegex = /^[a-zA-Z0-9]{8,12}$/;
        if (!idRegex.test(memberForm.memberId)) {
            setErrors(prev => ({ ...prev, memberId: "영어와 숫자 조합 8~12자리로 입력해주세요." }));
            return;
        }
        
        try {
            const isAvailable = await userService.checkId(memberForm.memberId);
            if (isAvailable) {
                alert("사용 가능한 아이디입니다.");
                setIsIdVerified(true);
                setErrors(prev => ({ ...prev, memberId: "" }));
            }
        } catch (error) {
            alert(error.response?.data?.message || "이미 사용 중인 아이디입니다.");
            setIsIdVerified(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const idRegex = /^[a-zA-Z0-9]{8,12}$/;
        const telRegex = /^010-\d{4}-\d{4}$/;

        if (!memberForm.memberName.trim()) newErrors.memberName = "이름을 입력해주세요.";
        
        if (!idRegex.test(memberForm.memberId)) {
            newErrors.memberId = "영어와 숫자 조합 8~12자리로 입력해주세요.";
        } else if (!isIdVerified) {
            newErrors.memberId = "아이디 중복 확인이 필요합니다.";
        }
        
        if (memberForm.memberPw.length < 8 || memberForm.memberPw.length > 12) {
            newErrors.memberPw = "비밀번호는 8~12자리여야 합니다.";
        }

        if (memberForm.memberTelNum && !telRegex.test(memberForm.memberTelNum)) {
            newErrors.memberTelNum = "전화번호 형식을 확인해주세요. (010-XXXX-XXXX)";
        }

        if (!memberForm.memberRegion) {
            newErrors.memberRegion = "지역을 선택해주세요.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 회원 등록 API 연동
    const handleCreateUser = async () => {
        if (!validateForm()) return;

        try {
            // userService.signup 호출
            const response = await userService.signup({
                userId: memberForm.memberId,
                userPw: memberForm.memberPw,
                userName: memberForm.memberName,
                userTelNum: memberForm.memberTelNum,
                userRegion: memberForm.memberRegion,
                userRole: memberForm.memberRole
            });

            if (response.status === "SUCCESS" || response) {
                alert('회원 등록에 성공했습니다!');
                navigate('/admin/adminMemberList');
            }
        } catch (error) {
            console.error("Signup Error:", error);
            alert(error.response?.data?.message || '회원 등록 중 서버 오류가 발생했습니다.');
        }
    };

    const ErrorText = ({ msg }) => (
        msg ? <p className="text-red-500 text-xs mt-[-18px] mb-4">{msg}</p> : null
    );

    return (
        <div className="p-6 bg-white">
            <h1 className="text-2xl font-bold mb-6">신규 회원 등록</h1>

            <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
                <div className="form-box">
                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 이름 (필수)</label>
                    <input
                        type="text"
                        name="memberName"
                        placeholder="이름을 입력해주세요."
                        value={memberForm.memberName}
                        onChange={handleChange}
                        className="w-full h-[44px] px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                    />
                    <ErrorText msg={errors.memberName} />

                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 ID (필수)</label>
                    <div className="flex gap-2 mb-6">
                        <input
                            type="text"
                            name="memberId"
                            placeholder="영어와 숫자 조합 8~12자리"
                            value={memberForm.memberId}
                            onChange={handleChange}
                            className="flex-1 h-[44px] px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button 
                            type="button"
                            onClick={checkIdDuplication}
                            className="bg-gray-800 text-white px-4 rounded-md text-sm hover:bg-black transition-colors"
                        >
                            중복확인
                        </button>
                    </div>
                    <ErrorText msg={errors.memberId} />

                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 비밀번호 (필수)</label>
                    <input
                        type="password"
                        name="memberPw"
                        placeholder="8~12자리로 입력해주세요."
                        value={memberForm.memberPw}
                        onChange={handleChange}
                        className="w-full h-[44px] px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                    />
                    <ErrorText msg={errors.memberPw} />

                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 전화번호</label>
                    <input
                        type="text"
                        name="memberTelNum"
                        placeholder="010-xxxx-xxxx"
                        maxLength={13}
                        value={memberForm.memberTelNum}
                        onChange={handleChange}
                        className="w-full h-[44px] px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                    />
                    <ErrorText msg={errors.memberTelNum} />

                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 주소지역</label>
                    <select
                        name="memberRegion"
                        value={memberForm.memberRegion}
                        onChange={handleChange}
                        className="w-full h-[44px] px-4 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                    >
                        <option value="">지역을 선택해주세요</option>
                        <option value="전주시 덕진구">전주시 덕진구</option>
                        <option value="전주시 완산구">전주시 완산구</option>
                        <option value="익산시">익산시</option>
                        <option value="정읍시">정읍시</option>
                        <option value="남원시">남원시</option>
                        <option value="김제시">김제시</option>
                        <option value="완주군">완주군</option>
                        <option value="고창군">고창군</option>
                        <option value="부안군">부안군</option>
                        <option value="순창군">순창군</option>
                        <option value="임실군">임실군</option>
                        <option value="무주군">무주군</option>
                        <option value="진안군">진안군</option>
                        <option value="장수군">장수군</option>
                    </select>
                    <ErrorText msg={errors.memberRegion} />

                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 등급</label>
                    <select
                        name="memberRole"
                        value={memberForm.memberRole}
                        onChange={handleChange}
                        className="w-full h-[44px] px-4 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                    >
                        <option value="사용자">사용자</option>
                        <option value="관리자">관리자</option>
                    </select>
                </div>

                <div className="flex-1 text-right mt-8">
                    <button 
                        type="button"
                        onClick={() => navigate('/admin/member/adminMemberList')} 
                        className="bg-gray-500 mx-3 rounded-md text-white p-2 px-4 text-right hover:bg-gray-600 transition-colors"
                    >
                        뒤로가기
                    </button>
                    <button 
                        type="button"
                        onClick={handleCreateUser} 
                        className="bg-blue-600 rounded-md text-white p-2 px-4 text-right hover:bg-blue-700 transition-colors"
                    >
                        등록하기
                    </button>
                </div>
            </section>
        </div>
    );
};

export default AdminMemberRegister;