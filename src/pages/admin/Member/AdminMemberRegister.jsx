import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from '@/components/Admin/board/BreadCrumb';


const AdminMemberRegister = () => {
    const navigate = useNavigate();
    const [memberForm, setMemberForm] = useState({
        memberId: '', 
        memberPw: '', 
        memberName: '', 
        memberTelNum: '', 
        memberRegion: '', 
        memberRole: 'USER'
    });


/* <================================ 핸들러 함수들 ================================> */
    const handleCreateUser = async () => {
        try {
            // API 호출 (서버가 있다고 가정)
            // await fetch('/api/admin/users', { ... });
            alert('회원 등록에 성공했습니다!');
            navigate('/admin/adminMemberList'); // 등록 후 다시 목록으로 이동!
        } catch (err) {
            alert('회원 등록에 실패했습니다.');
        }
    };
/* <================================ 핸들러 함수들 ================================> */



    return (
        <div className="p-6 bg-white">
            <BreadCrumb />
            <h1 className="text-2xl font-bold mb-6">신규 회원 등록</h1>

            <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
                
            <div className="form-box">
                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 이름 (필수)</label>
                    <input
                        type="text"
                        placeholder="이름을 입력해주세요."
                        value={memberForm.memberName}
                        onChange={(e) =>
                            setMemberForm({ ...memberForm, memberName: e.target.value })
                        }
                        className="
                            w-full
                            h-[44px]
                            px-4
                            border
                            border-gray-300
                            rounded-md
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            mb-6
                        "
                    />
                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 ID (필수)</label>
                    <input
                        type="text"
                        placeholder="영어와 숫자만을 사용하여, 8~12자리로 입력해주세요."
                        value={memberForm.memberId}
                        onChange={(e) =>
                            setMemberForm({ ...memberForm, memberId: e.target.value })
                        }
                        className="
                            w-full
                            h-[44px]
                            px-4
                            border
                            border-gray-300
                            rounded-md
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            mb-6
                        "
                    />
                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 비밀번호 (필수)</label>
                    <input
                        type="text"
                        placeholder="8~12자리로 입력해주세요."
                        value={memberForm.memberPw}
                        onChange={(e) =>
                            setMemberForm({ ...memberForm, memberPw: e.target.value })
                        }
                        className="
                            w-full
                            h-[44px]
                            px-4
                            border
                            border-gray-300
                            rounded-md
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            mb-6
                        "
                    />
                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 전화번호</label>
                    <input
                        type="text"
                        placeholder="010-xxxx-xxxx"
                        value={memberForm.memberTelNum}
                        onChange={(e) =>
                            setMemberForm({ ...memberForm, memberTelNum: e.target.value })
                        }
                        className="
                            w-full
                            h-[44px]
                            px-4
                            border
                            border-gray-300
                            rounded-md
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            mb-6
                        "
                    />
                    <label className="block font-bold text-[16px] mb-3 text-[#111]">회원 주소지역</label>
                    <select
                        value={memberForm.memberRegion}
                        onChange={(e) =>
                            setMemberForm({ ...memberForm, memberRegion: e.target.value })
                        }
                        className="
                            w-full h-[44px] px-4
                            border border-gray-300 rounded-md
                            bg-white
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            mb-6
                        "
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
                        value={memberForm.memberRole}
                        onChange={(e) =>
                            setMemberForm({ ...memberForm, memberRole: e.target.value })
                        }
                        className="
                            w-full h-[44px] px-4
                            border border-gray-300 rounded-md
                            bg-white
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            mb-6
                        "
                        >
                        <option value="">등급을 선택해주세요.</option>
                        <option value="사용자">사용자</option>
                        <option value="관리자">관리자</option>
                    </select>

                </div>

                <div className="flex-1 text-right mt-8">
                    <button onClick={() => navigate('/admin/adminMemberList')} className="bg-blue-600 mx-3 rounded-md text-white p-2 text-right">뒤로가기</button>
                    <button onClick={handleCreateUser} className="bg-blue-600 rounded-md text-white p-2 text-right">등록하기</button>
                 </div>
            </section>

           
        </div>

    );
};

export default AdminMemberRegister;
