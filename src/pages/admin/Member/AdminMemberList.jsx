import React, { useState, useEffect } from 'react';
import BreadCrumb from '@/components/Admin/board/BreadCrumb';
import { useNavigate } from 'react-router-dom';



// AdminMemberList
const AdminMemberList = () => {
    
    const navigate = useNavigate();

    /** <=================================================== 상태 모음 ===================================================> **/
        const [memberList, setMemberList] = useState([]);      // 화면에 보여줄 데이터
        const [query, setQuery] = useState({});   // 검색/필터 조건

        const [memberForm, setMemberForm] = useState({
            memberId: '',
            memberPW: '',
            memberName: '',
            memberTelNum: '',
            memberRegion: '',
            memberRole: 'USER', // or ADMIN
        });

        // const [keyword, setKeyword] = useState('');
        // const [memberRegion, setMemberRegion] = useState('');

       


        // 1. 상태 관리
        const [originalMemberList, setOriginalMemberList] = useState([]); // 필터링 전 전체 데이터 보관용
        const [searchMemberID, setSearchMemberID] = useState(''); // 아이디 검색어
        const [searchMemberName, setSearchMemberName] = useState(''); // 이름 검색어
        const [searchMemberTelNum, setSearchMemberTelNum] = useState(''); // 전화번호 검색어
        const [selectedMemberRegion, setSelectedMemberRegion] = useState(''); // 선택된 지역
        const [sortOrder, setSortOrder] = useState('latest'); // 정렬 상태 (최신순/오래된순)

    /** <=================================================== 상태 모음 ===================================================> **/
    /** <=================================================== handler 모음 ===================================================> **/
        
        /**  
        const handleMemberSelect = () => {
                setQuery({
                    memberRegion
                });
            };
        **/
    
    
    
        // 1) 삭제 기능: id를 비교하여 제외한 나머지만 상태에 반영 
            const handleMemberDelete = (id) => {
                if (!window.confirm('삭제하시겠습니까?')) return;
                
                const updatedMemberList = memberList.filter(item => item.id !== id);
                setMemberList(updatedMemberList);
                setOriginalMemberList(originalMemberList.filter(item => item.id !== id));
                alert('삭제되었습니다.');
            };

            // 2) 필터링 및 검색 기능
            const handleMemberSearch = () => {
                let filtered = [...originalMemberList];

                // 지역 필터링
                if (selectedMemberRegion) {
                    filtered = filtered.filter(item => item.memberRegion === selectedMemberRegion);
                }

                // 키워드(아이디) 검색
                if (searchMemberID) {
                    filtered = filtered.filter(item => item.memberId.includes(searchMemberID));
                }

                // 키워드(이름) 검색
                if (searchMemberName) {
                    filtered = filtered.filter(item => item.memberName.includes(searchMemberName));
                }

                // 키워드(전화번호) 검색
                if (searchMemberTelNum) {
                    filtered = filtered.filter(item => item.memberTelNum.includes(searchMemberTelNum));
                }

                setMemberList(filtered);
            };

            // 2) 정렬 기능
            const handleSort = (order) => {
                setSortOrder(order);
                const sorted = [...memberList].sort((a, b) => {
                    return order === 'latest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt;
                });
                setMemberList(sorted);
            };

            // 초기화 기능
            const handleReset = () => {
                setSearchMemberName('');
                setSelectedMemberRegion('');
                setMemberList(originalMemberList);
            };
       
    /** <=================================================== handler 모음 ===================================================> **/
    /** <=================================================== useEffect 모음 ===================================================> **/

         const memberData = Array.from({ length: 10 }, (_, i) => ({
                id: i + 1,
                memberId: `kimgoogleuser${i + 1}`,
                memberName: `김국을${i + 1}`,
                memberTelNum: `010-0000-000${i}`,
                memberRegion: i % 2 === 0 ? '전주시 완산구' : '전주시 덕진구',
                memberRole: 'USER', // or ADMIN
                createdAt: new Date(2026, 0, i + 1).getTime() // 정렬 확인용 날짜 데이터
            }));

    
        // 초기 데이터 로드 (더미 데이터 셋팅)
        useEffect(() => {
          
            setMemberList(memberData);
            setOriginalMemberList(memberData);
            setSelectedMemberRegion('');
        }, []);
        
    /** <=================================================== useEffect 모음 ===================================================> **/


    
  


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
                  <input
                    type="text"
                    value={searchMemberID}
                    onChange={(e) => setSearchMemberID(e.target.value)}
                    placeholder="ID를 입력해주세요."
                    className="w-full border p-2 rounded text-sm"
                />
            </div>
            <div>
                <label className="block text-sm mb-1">이름</label>
                <input
                    type="text"
                    value={searchMemberName}
                    onChange={(e) => setSearchMemberName(e.target.value)}
                    placeholder="이름을 입력해주세요."
                    className="w-full border p-2 rounded text-sm"
                />
            </div>
            <div>
                <label className="block text-sm mb-1">전화번호</label>
                  <input
                    type="text"
                    value={searchMemberTelNum}
                    onChange={(e) => setSearchMemberTelNum(e.target.value)}
                    placeholder="이름을 입력해주세요."
                    className="w-full border p-2 rounded text-sm"
                />
            </div>
            <div>
                <label className="block text-sm mb-1">주소</label>
                <select
                    value={selectedMemberRegion}
                    onChange={(e) => setSelectedMemberRegion(e.target.value)}
                    className="w-full border p-2 rounded text-sm"
                >
                    <option value="">전체</option>
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
            </div>
            <div className="flex items-end gap-2">
                <button onClick={handleMemberSearch} className="px-4 py-2 bg-blue-500 text-white rounded text-sm">검색</button>
                <button onClick={handleReset} className="px-4 py-2 border rounded text-sm">초기화</button>
            </div>
            </div>

            {/* 테이블 상단 툴바 */}
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

            {/* 테이블 영역 */}
            <div className="bg-white border rounded-md overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 border-b">
                <tr>
                    <th className="p-3">번호</th>
                    <th className="p-3">ID</th>
                    <th className="p-3">이름</th>
                    <th className="p-3">전화번호</th>
                    <th className="p-3">주소검색</th>
                    <th className="p-3">수정/삭제</th>
                </tr>
                </thead>
                <tbody>
                {memberList.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-center"><input type="checkbox" defaultChecked /></td>
                        <td className="p-3 text-blue-600">{item.memberId}</td>
                        <td className="p-3">{item.memberName}</td>
                        <td className="p-3 truncate max-w-xs">{item.memberTelNum}</td>
                        <td className="p-3">{item.memberRegion}</td>
                        <td className="p-3">
                            <button 
                            onClick={() => navigate('/admin/adminMemberEdit', { state: item })}
                            className="border px-2 py-1 rounded text-xs"
                            >수정
                            </button>
                            <button 
                            onClick={() => handleMemberDelete(item.memberId)}
                            className="border px-2 py-1 rounded text-xs text-red-600 hover:bg-red-50"
                            >삭제
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>

            {/* 페이지네이션 및 등록 버튼 컨테이너 */}
            <div className="relative">
                {/* 1. 왼쪽 빈 공간: 오른쪽 버튼과 대칭을 맞춰서 페이지네이션을 정중앙에 배치 */}
                <div className="absolute left-1/2 -translate-x-1/2">
                      {/* 2. 중앙 페이지네이션 영역 */}
                        <div className="flex justify-center items-center gap-1 text-sm">
                            <button className="p-2 text-gray-400">이전</button>
                            <button className="w-8 h-8 flex items-center justify-center bg-blue-900 text-white rounded font-medium shadow-sm">1</button>
                            {[2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <button key={num} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded transition">{num}</button>
                            ))}
                            <button className="p-2 text-gray-600">다음</button>
                        </div>
                </div>

              

            </div>
        </div>

            </div>
    )
};

export default AdminMemberList;