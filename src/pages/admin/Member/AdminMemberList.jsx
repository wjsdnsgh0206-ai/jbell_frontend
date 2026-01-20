import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// 공용 컴포넌트
import AdminSearchBox from '@/components/admin/AdminSearchBox';

const AdminMemberList = () => {
    const navigate = useNavigate();

    /** <================ 상태 관리 ================> **/
    const [memberList, setMemberList] = useState([]);      // 화면에 보여줄 데이터
    const [originalMemberList, setOriginalMemberList] = useState([]); // 필터링 전 전체 데이터

    // 검색 조건 상태 (AdminSearchBox 규격에 맞춤)
    // keyword는 AdminSearchBox의 기본 input과 연결되므로 '이름' 검색으로 활용합니다.
    const [searchParams, setSearchParams] = useState({
        memberRegion: '',
        memberId: '',
        memberTelNum: '',
        keyword: '', // 이름 검색용
    });

    const [sortOrder, setSortOrder] = useState('latest'); // 정렬 상태

    /** <================ 핸들러 ================> **/

    // 1) 입력값 변경 핸들러 (children으로 주입된 커스텀 input용)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({ ...prev, [name]: value }));
    };

    // 2) 검색 실행 핸들러
    const handleMemberSearch = () => {
        let filtered = [...originalMemberList];

        // 지역 필터링
        if (searchParams.memberRegion) {
            filtered = filtered.filter((item) => item.memberRegion === searchParams.memberRegion);
        }

        // 아이디 검색
        if (searchParams.memberId) {
            filtered = filtered.filter((item) => item.memberId.includes(searchParams.memberId));
        }

        // 전화번호 검색
        if (searchParams.memberTelNum) {
            filtered = filtered.filter((item) => item.memberTelNum.includes(searchParams.memberTelNum));
        }

        // 이름 검색 (keyword 필드 사용)
        if (searchParams.keyword) {
            filtered = filtered.filter((item) => item.memberName.includes(searchParams.keyword));
        }

        setMemberList(filtered);
    };

    // 3) 초기화 핸들러
    const handleReset = () => {
        setSearchParams({
            memberRegion: '',
            memberId: '',
            memberTelNum: '',
            keyword: '',
        });
        setMemberList(originalMemberList);
    };

    // 4) 삭제 핸들러
    const handleMemberDelete = (id) => {
        if (!window.confirm('삭제하시겠습니까?')) return;
        const updatedList = memberList.filter((item) => item.id !== id);
        setMemberList(updatedList);
        setOriginalMemberList(originalMemberList.filter((item) => item.id !== id));
        alert('삭제되었습니다.');
    };

    // 5) 정렬 핸들러
    const handleSort = (order) => {
        setSortOrder(order);
        const sorted = [...memberList].sort((a, b) => {
            return order === 'latest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt;
        });
        setMemberList(sorted);
    };

    // 6) 상세 페이지 이동
    const handleDetailClick = (item) => {
        navigate(`/admin/member/adminMemberDetail/${item.memberId}`, { state: { item } });
    };

    /** <================ Effects & Data ================> **/
    useEffect(() => {
        // 더미 데이터 생성
        const memberData = Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            memberId: `kimgoogleuser${i + 1}`,
            memberName: `김국을${i + 1}`,
            memberTelNum: `010-0000-000${i}`,
            memberRegion: i % 2 === 0 ? '전주시 완산구' : '전주시 덕진구',
            memberRole: 'USER',
            isDormant: i % 3 === 0, // 휴면 여부 예시
            createdAt: new Date(2026, 0, i + 1).getTime(),
        }));

        setMemberList(memberData);
        setOriginalMemberList(memberData);
    }, []);

    // 공통 Input 스타일 (AdminSearchBox와 높이/스타일 맞춤)
    const inputStyle = "h-14 px-3 text-body-m border border-admin-border rounded-md bg-white focus:border-admin-primary outline-none transition-all";

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
            <div className="p-6 bg-gray-50 min-h-screen">
                {/* 페이지 제목 */}
                <h1 className="text-2xl font-bold mb-6">회원 조회</h1>

                {/* 검색 박스 영역 */}
                <div className="mb-6">
                    <AdminSearchBox
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        onSearch={handleMemberSearch}
                        onReset={handleReset}
                    >
                        {/* [Children Slot] 커스텀 필터들 */}
                        
                        {/* 1. 지역 선택 */}
                        <select
                            name="memberRegion"
                            value={searchParams.memberRegion}
                            onChange={handleInputChange}
                            className={`${inputStyle} min-w-[140px] cursor-pointer`}
                        >
                            <option value="">지역(전체)</option>
                            <option value="전주시 덕진구">전주시 덕진구</option>
                            <option value="전주시 완산구">전주시 완산구</option>
                            <option value="군산시">군산시</option>
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

                        {/* 2. 아이디 입력 */}
                        <input
                            type="text"
                            name="memberId"
                            value={searchParams.memberId}
                            onChange={handleInputChange}
                            placeholder="ID 입력"
                            className={`${inputStyle} w-[150px]`}
                        />

                        {/* 3. 전화번호 입력 */}
                        <input
                            type="text"
                            name="memberTelNum"
                            value={searchParams.memberTelNum}
                            onChange={handleInputChange}
                            placeholder="전화번호 입력"
                            className={`${inputStyle} w-[150px]`}
                        />
                        
                        {/* 4. 이름 입력은 AdminSearchBox의 기본 'keyword' input을 사용합니다 (placeholder만 변경 불가하므로 사용자가 인지하도록 둠) */}
                    </AdminSearchBox>
                </div>

                {/* 테이블 툴바 */}
                <div className="flex justify-between items-center mb-4 text-sm">
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleSort('latest')}
                            className={`px-3 py-1 rounded ${sortOrder === 'latest' ? 'bg-gray-800 text-white' : 'bg-white border'}`}
                        >
                            최신순
                        </button>
                        <button
                            onClick={() => handleSort('oldest')}
                            className={`px-3 py-1 rounded ${sortOrder === 'oldest' ? 'bg-gray-800 text-white' : 'bg-white border'}`}
                        >
                            오래된순
                        </button>
                    </div>
                    <div className="flex-1 text-right">
                        <button
                            onClick={() => navigate('/admin/member/adminMemberRegister')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow-sm transition-colors"
                        >
                            신규 회원 등록
                        </button>
                    </div>
                </div>

                {/* 테이블 영역 */}
                <div className="bg-white border rounded-md overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-3 text-center w-12"><input type="checkbox" /></th>
                                <th className="p-3">ID</th>
                                <th className="p-3">이름</th>
                                <th className="p-3">전화번호</th>
                                <th className="p-3">주소</th>
                                <th className="p-3">상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {memberList.length > 0 ? (
                                memberList.map((item, index) => (
                                    <tr key={item.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 text-center"><input type="checkbox" /></td>
                                        <td
                                            onClick={() => handleDetailClick(item)}
                                            className="p-3 cursor-pointer text-blue-600 hover:underline font-medium"
                                        >
                                            {item.memberId}
                                        </td>
                                        <td className="p-3">{item.memberName}</td>
                                        <td className="p-3">{item.memberTelNum}</td>
                                        <td className="p-3">{item.memberRegion}</td>
                                        <td className="p-3">
                                            {item.isDormant ? (
                                                <span className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700">휴면</span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">활성</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-10 text-center text-gray-500">
                                        검색 결과가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 (디자인 유지) */}
                <div className="relative mt-4">
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <div className="flex justify-center items-center gap-1 text-sm">
                            <button className="p-2 text-gray-400">이전</button>
                            <button className="w-8 h-8 flex items-center justify-center bg-blue-900 text-white rounded font-medium shadow-sm">1</button>
                            {[2, 3, 4, 5].map(num => (
                                <button key={num} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded transition">{num}</button>
                            ))}
                            <button className="p-2 text-gray-600">다음</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMemberList;