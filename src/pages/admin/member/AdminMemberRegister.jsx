import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, commonService } from '@/services/api'; 

const AdminMemberRegister = () => {
    const navigate = useNavigate();
    
    // 상태 관리: 백엔드 DTO와 최대한 이름을 맞추는 것이 혼선을 줄입니다.
    const [memberForm, setMemberForm] = useState({
        userId: '', 
        userPw: '', 
        userName: '', 
        userEmail: '',
        userBirthDate: '',
        userGender: 'M', // 기본값 남성
        userResidenceArea: '', 
        userGrade: 'USER' // 기본값 USER
    });

    const [sggList, setSggList] = useState([]); // 지역 목록 상태
    const [errors, setErrors] = useState({});
    const [isIdVerified, setIsIdVerified] = useState(false);

    // 지역 코드 로드 (SignupForm 로직 이식)
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await commonService.getCodeList('AREA_JB');
                if (response && response.data) setSggList(response.data);
            } catch (error) {
                console.error("지역 코드 로드 실패:", error);
            }
        };
        fetchRegions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMemberForm(prev => ({ ...prev, [name]: value }));
        
        if (name === 'userId') setIsIdVerified(false);
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const checkIdDuplication = async () => {
        const idRegex = /^[a-zA-Z0-9]{5,12}$/; // 일반 회원가입(5자)과 통일
        if (!memberForm.userId) return alert("아이디를 입력해주세요.");
        if (!idRegex.test(memberForm.userId)) {
            setErrors(prev => ({ ...prev, userId: "5~12자 영문, 숫자 조합으로 입력해주세요." }));
            return;
        }
        
        try {
            const isDuplicated = await userService.checkId(memberForm.userId);
            if (isDuplicated === false) {
                alert("사용 가능한 아이디입니다.");
                setIsIdVerified(true);
            } else {
                alert("이미 사용 중인 아이디입니다.");
                setIsIdVerified(false);
            }
        } catch (error) {
            alert(error.response?.status === 409 ? "이미 사용 중인 아이디입니다." : "오류가 발생했습니다.");
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!memberForm.userName.trim()) newErrors.userName = "이름을 입력해주세요.";
        if (!isIdVerified) newErrors.userId = "아이디 중복 확인이 필요합니다.";
        if (memberForm.userPw.length < 8) newErrors.userPw = "비밀번호는 8자 이상이어야 합니다.";
        if (!memberForm.userEmail.includes('@')) newErrors.userEmail = "유효한 이메일을 입력해주세요.";
        if (!memberForm.userBirthDate) newErrors.userBirthDate = "생년월일을 선택해주세요.";
        if (!memberForm.userResidenceArea) newErrors.userResidenceArea = "지역을 선택해주세요.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateUser = async () => {
        if (!validateForm()) return;

        try {
            // 백엔드 SignupRequest DTO 구조와 1:1 매칭
            const response = await userService.signup(memberForm);

            if (response.status === "SUCCESS") {
                alert('회원 등록이 완료되었습니다.');
                navigate('/admin/member/adminMemberList');
            } else {
                alert(response.message || "등록 실패");
            }
        } catch (error) {
            alert(error.response?.data?.message || "서버 오류가 발생했습니다.");
        }
    };

    return (
        <div className="p-6 bg-white max-w-[800px] mx-auto">
            <h1 className="text-2xl font-bold mb-6">신규 회원 등록 (관리자용)</h1>

            <section className="border border-gray-200 rounded-xl p-10 shadow-sm space-y-6">
                {/* 이름 & 아이디 */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-bold mb-2">이름</label>
                        <input type="text" name="userName" value={memberForm.userName} onChange={handleChange} className="w-full border p-2 rounded" />
                        {errors.userName && <p className="text-red-500 text-xs">{errors.userName}</p>}
                    </div>
                    <div>
                        <label className="block font-bold mb-2">아이디</label>
                        <div className="flex gap-2">
                            <input type="text" name="userId" value={memberForm.userId} onChange={handleChange} className="flex-1 border p-2 rounded" />
                            <button onClick={checkIdDuplication} className="bg-gray-800 text-white px-3 rounded text-sm">확인</button>
                        </div>
                        {errors.userId && <p className="text-red-500 text-xs">{errors.userId}</p>}
                    </div>
                </div>

                {/* 비밀번호 & 이메일 */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-bold mb-2">비밀번호</label>
                        <input type="password" name="userPw" value={memberForm.userPw} onChange={handleChange} className="w-full border p-2 rounded" />
                        {errors.userPw && <p className="text-red-500 text-xs">{errors.userPw}</p>}
                    </div>
                    <div>
                        <label className="block font-bold mb-2">이메일</label>
                        <input type="email" name="userEmail" value={memberForm.userEmail} onChange={handleChange} className="w-full border p-2 rounded" placeholder="example@mail.com" />
                        {errors.userEmail && <p className="text-red-500 text-xs">{errors.userEmail}</p>}
                    </div>
                </div>

                {/* 생년월일 & 성별 */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-bold mb-2">생년월일</label>
                        <input type="date" name="userBirthDate" value={memberForm.userBirthDate} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block font-bold mb-2">성별</label>
                        <select name="userGender" value={memberForm.userGender} onChange={handleChange} className="w-full border p-2 rounded">
                            <option value="M">남성</option>
                            <option value="F">여성</option>
                        </select>
                    </div>
                </div>

                {/* 지역 & 등급 */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-bold mb-2">거주 지역</label>
                        <select name="userResidenceArea" value={memberForm.userResidenceArea} onChange={handleChange} className="w-full border p-2 rounded">
                            <option value="">지역 선택</option>
                            {sggList.map(item => <option key={item.code} value={item.name}>{item.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block font-bold mb-2">권한 등급</label>
                        <select name="userGrade" value={memberForm.userGrade} onChange={handleChange} className="w-full border p-2 rounded">
                            <option value="USER">일반 사용자</option>
                            <option value="ADMIN">관리자</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                    <button onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-100 rounded-lg">취소</button>
                    <button onClick={handleCreateUser} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">등록하기</button>
                </div>
            </section>
        </div>
    );
};

export default AdminMemberRegister;