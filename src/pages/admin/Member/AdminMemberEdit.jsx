import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { userService } from '../../../services/api';



const AdminMemberEdit = () => {
    
    /** <================================================ 상태 관리 ================================================> **/

    const [memberForm, setMemberForm] = useState({
        memberId: '',
        memberPw: '',
        memberName: '',
        memberTelNum: '',
        memberRegion: '',
        memberRole: 'USER', // or ADMIN
    });
    
    const [isIdVerified, setIsIdVerified] = useState(true);
    const { memberId } = useParams();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);  // ← 토글 상태 추가

    /** <================================================ 상태 관리 ================================================> **/
    /** <================================================ useEffect ================================================> **/

    useEffect(() => {
            const fetchMemberDetail = async () => {
            const res = await userService.getMemberDetail(memberId);
            setMemberForm({
                memberId: res.memberId || '',
                memberPw: '', // 비번은 보통 보안상 비워둠
                memberName: res.memberName || '', 
                memberTelNum: res.memberTelNum || '',
                memberRegion: res.memberRegion || '',
                memberRole: res.memberRole || 'USER',
            });
    };
                
        if (memberId) fetchMemberDetail(); // memberId가 있을 때만 실행하도록 방어 코드 추가
    }, [memberId]);

    /** <================================================ useEffect ================================================> **/
    /** <================================================ handle 모음 ================================================> **/

    const handleMemberChange = (e) => {
        const { name, value } = e.target;
        setMemberForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleUpdateMember = async () => {
        await api.put(`/member/${memberId}`, memberForm);
        navigate('/admin/member/adminMemberList');
    };
    const handleToggle = () => {
        setIsOpen(!isOpen);  // true ↔ false 전환
    };

    /** <================================================ handle 모음 ================================================> **/


    const checkIdDuplication = async () => {
    // → "중복확인 버튼 눌렀을 때 실행되는 함수"
    try {
        const response = await userService.checkIdDuplicate(memberForm.memberId);
        if (response.isDuplicate) {
            alert('이미 사용중인 ID입니다.');
            setIsIdVerified(false);
        } else {
            alert('사용 가능한 ID입니다.');
            setIsIdVerified(true);
        }
    } catch (error) {
        alert('중복 확인에 실패했습니다.');
    }
};



     const ErrorText = ({ msg }) => (
        msg ? <p className="text-red-500 text-xs mt-[-18px] mb-4">{msg}</p> : null
    );


    
    return (
        <div className="p-6 bg-white">
            <h1 className="text-2xl font-bold mb-6">회원 수정</h1>

            <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
                <div className="form-box">
                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 이름 (필수)</label>
                    <input
                        type="text"
                        name="memberName"
                        placeholder="이름을 입력해주세요."
                        value={memberForm.memberName}
                        onChange={handleMemberChange}
                        className="w-full h-[44px] px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                    />

                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 ID (필수)</label>
                    <div className="flex gap-2 mb-6">
                        <input
                            type="text"
                            name="memberId"
                            placeholder="영어와 숫자 조합 8~12자리"
                            value={memberForm.memberId}
                            onChange={handleMemberChange}
                            className={`flex-1 h-[44px] px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isIdVerified ? 'border-green-500 bg-green-50' : 'border-gray-300'
                            }`}
                        />
                        <button 
                            type="button"
                            onClick={checkIdDuplication}
                            className={`${
                                isIdVerified ? 'bg-green-600' : 'bg-gray-800'
                            } text-white px-4 rounded-md text-sm hover:opacity-90 transition-colors`}
                        >
                            {isIdVerified ? '확인완료' : '중복확인'}
                        </button>
                    </div>

                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 비밀번호 (필수)</label>
                    <input
                        type="password"
                        name="memberPw"
                        placeholder="8~12자리로 입력해주세요."
                        value={memberForm.memberPw}
                        onChange={handleMemberChange}
                        className="w-full h-[44px] px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                    />

                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 전화번호</label>
                    <input
                        type="text"
                        name="memberTelNum"
                        placeholder="010-xxxx-xxxx"
                        maxLength={13}
                        value={memberForm.memberTelNum}
                        onChange={handleMemberChange}
                        className="w-full h-[44px] px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                    />

                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 주소지역</label>
                    <select
                        name="memberRegion"
                        value={memberForm.memberRegion}
                        onChange={handleMemberChange}
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

                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 등급</label>
                    <select
                        name="memberRole"
                        value={memberForm.memberRole}
                        onChange={handleMemberChange}
                        className="w-full h-[44px] px-4 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                    >
                        <option value="사용자">사용자</option>
                        <option value="관리자">관리자</option>
                    </select>

                    <label className="block font-bold text-[16px] mb-3 text-[#111]">휴면 계정 변환 여부</label>
                        <div className="flex items-center gap-3 mb-6">
                        {/* 토글 배경 */}
                        <button
                            type="button"
                            onClick={() => {
                            // 클릭 시 USER <-> ADMIN 전환
                            const nextRole = memberForm.memberRole === 'USER' ? 'ADMIN' : 'USER';
                            setMemberForm(prev => ({ ...prev, memberRole: nextRole }));
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            memberForm.memberRole === 'ADMIN' ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                        >
                            {/* 토글 동그라미(스위치) */}
                            <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                memberForm.memberRole === 'ADMIN' ? 'translate-x-6' : 'translate-x-1'
                            }`}
                            />
                        </button>
                        
                        {/* 현재 상태 텍스트 표시 */}
                        <span className="text-sm font-medium text-gray-700">
                            {memberForm.memberRole === 'ADMIN' ? '활성화' : '비활성화'}
                        </span>
                        </div>
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
                        onClick={handleUpdateMember} 
                        className="bg-blue-600 rounded-md text-white p-2 px-4 text-right hover:bg-blue-700 transition-colors"
                    >
                        수정하기
                    </button>
                </div>
            </section>
        </div>
    );
};

export default AdminMemberEdit;