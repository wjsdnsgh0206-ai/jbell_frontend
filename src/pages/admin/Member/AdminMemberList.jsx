import React, { useState } from 'react';
import BreadCrumb from '@/components/Admin/board/BreadCrumb';
import { useNavigate } from 'react-router-dom';

const AdminMemberList = () => {
    
    const navigate = useNavigate();
    
    const memberData = Array(10).fill({
            memberId: 'kimgoogle12345',
            memberName: '김국을',
            memberTelNum: '010-xxxx-xxxx',
            memberRegion: '전주시 완산구',
            display: true
        });


        const [memberForm, setMemberForm] = useState({
            memberId: '',
            memberPW: '',
            memberName: '',
            memberTelNum: '',
            memberRegion: '',
            memberRole: 'USER', // or ADMIN
            });



            const handleCreateUser = async () => {
                try {
                    await fetch('/api/admin/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(form),
                    });

                    alert('회원 등록 완료');
                } catch (err) {
                    alert('등록 실패');
                }
             };



    
    return (
         <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
            <div className="p-6 bg-gray-50 min-h-screen">
            <BreadCrumb />
            {/* 페이지 제목 */}
            <h1 className="text-2xl font-bold mb-6">회원 조회</h1>

            {/* 검색 바 영역 */}
            <div className="grid grid-cols-5 gap-4 bg-white p-4 border rounded-md mb-6 shadow-sm">
            <div>
                <label className="block text-sm mb-1">로그인 ID</label>
                <input type="text" placeholder="ID를 입력해주세요." className="w-full border p-2 rounded text-sm" />
            </div>
            <div>
                <label className="block text-sm mb-1">이름</label>
                <input type="text" placeholder="이름을 입력해주세요." className="w-full border p-2 rounded text-sm" />
            </div>
            <div>
                <label className="block text-sm mb-1">전화번호</label>
                <input type="text" placeholder="010-xxxx-xxxx" className="w-full border p-2 rounded text-sm" />
            </div>
            <div>
                <label className="block text-sm mb-1">주소</label>
                <select className="w-full border p-2 rounded text-sm">
                <option>전주시 덕진구</option>
                <option>전주시 완산구</option>
                <option>군산시</option>
                <option>익산시</option>
                <option>정읍시</option>
                <option>남원시</option>
                <option>김제시</option>
                <option>완주군</option>
                <option>고창군</option>
                <option>부안군</option>
                <option>순창군</option>
                <option>임실군</option>
                <option>무주군</option>
                <option>진안군</option>
                <option>장수군</option>
                </select>
            </div>
            <div className="flex items-end gap-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded text-sm">검색</button>
                <button className="px-4 py-2 border rounded text-sm">초기화</button>
            </div>
            </div>

            {/* 테이블 상단 툴바 */}
            <div className="flex justify-between items-center mb-4 text-sm">
            <div className="flex gap-4">
                <label><input type="checkbox" className="mr-1" /> 7개 선택됨</label>
                <button className="text-blue-600">일괄 노출</button>
            </div>
            </div>

            {/* 테이블 영역 */}
            <div className="bg-white border rounded-md overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 border-b">
                <tr>
                    <th className="p-3 text-center"><input type="checkbox" /></th>
                    <th className="p-3">ID</th>
                    <th className="p-3">이름</th>
                    <th className="p-3">전화번호</th>
                    <th className="p-3">주소검색</th>
                    <th className="p-3">노출</th>
                    <th className="p-3">상세</th>
                </tr>
                </thead>
                <tbody>
                {memberData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-center"><input type="checkbox" defaultChecked /></td>
                    <td className="p-3 text-blue-600">{item.memberId}</td>
                    <td className="p-3">{item.memberName}</td>
                    <td className="p-3 truncate max-w-xs">{item.memberTelNum}</td>
                    <td className="p-3">{item.memberRegion}</td>
                    <td className="p-3">
                        <div className="w-10 h-5 bg-blue-500 rounded-full relative">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                        </div>
                    </td>
                    <td className="p-3">
                        <button className="border px-2 py-1 rounded text-xs">보기</button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>

            {/* 페이지네이션 및 등록 버튼 컨테이너 */}
            <div className="flex items-center mt-10 w-full relative">
            
            {/* 1. 왼쪽 빈 공간: 오른쪽 버튼과 대칭을 맞춰서 페이지네이션을 정중앙에 배치 */}
            <div className="flex-1"></div>

            {/* 2. 중앙 페이지네이션 영역 */}
            <div className="flex justify-center items-center gap-1 text-sm">
                <button className="p-2 text-gray-400">이전</button>
                <button className="w-8 h-8 flex items-center justify-center bg-blue-900 text-white rounded font-medium shadow-sm">1</button>
                {[2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button key={num} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded transition">{num}</button>
                ))}
                <button className="p-2 text-gray-600">다음</button>
            </div>

                {/* 3. 오른쪽 버튼 영역: flex-1과 text-right로 부모 div 안쪽 우측 끝에 고정 */}
                <div className="flex-1 text-right">
                    <button 
                    onClick={() => navigate('/admin/adminMemberRegister')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow-sm transition-colors"
                    >
                    신규 회원 등록
                    </button>
                </div>
            </div>
        </div>

            </div>
    )
};

export default AdminMemberList;