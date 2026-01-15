import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminMemberRegister = () => {
    const navigate = useNavigate();
    
    // 초기 상태 설정
    const [memberForm, setMemberForm] = useState({
        memberId: '', 
        memberPw: '', 
        memberName: '', 
        memberTelNum: '', 
        memberRegion: '', 
        memberRole: '사용자' // 기본값 설정
    });

    // 에러 메시지 상태 관리
    const [errors, setErrors] = useState({});

    // 입력 핸들러 (통합 관리)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMemberForm(prev => ({ ...prev, [name]: value }));
        
        // 입력 시 해당 필드의 에러 메시지 초기화
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // 유효성 검사 로직
    const validateForm = () => {
        const newErrors = {};
        const idRegex = /^[a-zA-Z0-9]{8,12}$/;
        const telRegex = /^010-\d{4}-\d{4}$/;

        if (!memberForm.memberName.trim()) newErrors.memberName = "이름을 입력해주세요.";
        
        if (!idRegex.test(memberForm.memberId)) {
            newErrors.memberId = "영어와 숫자 조합 8~12자리로 입력해주세요.";
        }
        
        if (memberForm.memberPw.length < 8 || memberForm.memberPw.length > 12) {
            newErrors.memberPw = "비밀번호는 8~12자리여야 합니다.";
        }

        if (memberForm.memberTelNum && !telRegex.test(memberForm.memberTelNum)) {
            newErrors.memberTelNum = "010-XXXX-XXXX 형식으로 입력해주세요.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* <================================ 핸들러 함수들 ================================> */
    const handleCreateUser = async () => {
        if (!validateForm()) return;

        try {
            // API 호출 시뮬레이션
            console.log("등록 데이터:", memberForm);
            alert('회원 등록에 성공했습니다!');
            navigate('/admin/adminMemberList');
        } catch (err) {
            alert('회원 등록에 실패했습니다.');
        }
    };
    /* <================================ 핸들러 함수들 ================================> */

    // 에러 메시지 컴포넌트
    const ErrorText = ({ msg }) => (
        msg ? <p className="text-red-500 text-xs mt-[-18px] mb-4">{msg}</p> : null
    );

    return (
        <div className="p-6 bg-white">
            <h1 className="text-2xl font-bold mb-6">신규 회원 등록</h1>

            <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
                <div className="form-box">
                    {/* 회원 이름 */}
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

                    {/* 회원 ID */}
                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 ID (필수)</label>
                    <input
                        type="text"
                        name="memberId"
                        placeholder="영어와 숫자만을 사용하여, 8~12자리로 입력해주세요."
                        value={memberForm.memberId}
                        onChange={handleChange}
                        className="w-full h-[44px] px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                    />
                    <ErrorText msg={errors.memberId} />

                    {/* 회원 비밀번호 */}
                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 비밀번호 (필수)</label>
                    <input
                        type="password" // 보안을 위해 password 타입으로 변경
                        name="memberPw"
                        placeholder="8~12자리로 입력해주세요."
                        value={memberForm.memberPw}
                        onChange={handleChange}
                        className="w-full h-[44px] px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                    />
                    <ErrorText msg={errors.memberPw} />

                    {/* 회원 전화번호 */}
                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 전화번호</label>
                    <input
                        type="text"
                        name="memberTelNum"
                        placeholder="010-xxxx-xxxx"
                        value={memberForm.memberTelNum}
                        onChange={handleChange}
                        className="w-full h-[44px] px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                    />
                    <ErrorText msg={errors.memberTelNum} />

                    {/* 회원 주소지역 */}
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

                    {/* 회원 등급 */}
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