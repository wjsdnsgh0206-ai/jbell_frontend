import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// 공용 컴포넌트
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

const AdminMemberList = () => {
    const navigate = useNavigate();

    /** <================ 상태 관리 ================> **/
    const [originalMemberList, setOriginalMemberList] = useState([]); // 전체 데이터 (필터링 전)
    const [filteredMemberList, setFilteredMemberList] = useState([]); // 검색 필터링된 데이터
    
    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 테이블 선택 상태
    const [selectedIds, setSelectedIds] = useState([]);

    // 모달 상태
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // 검색 조건 상태
    const [searchParams, setSearchParams] = useState({
        memberRegion: '',
        memberId: '',
        memberTelNum: '',
        keyword: '', // 이름 검색용
    });

    const [sortOrder, setSortOrder] = useState('latest'); // 정렬 상태

    /** <================ 테이블 컬럼 정의 ================> **/
    const columns = useMemo(() => [
        { 
            key: 'memberId', 
            header: 'ID', 
            width: '15%',
            className: 'text-blue-600 font-bold hover:underline cursor-pointer text-center whitespace-nowrap',
            // 클릭 이벤트는 onRowClick에서 처리되지만, 시각적 스타일을 위해 클래스 추가
        },
        { key: 'memberName', header: '이름', width: '15%', className: 'text-center whitespace-nowrap' },
        { key: 'memberTelNum', header: '전화번호', width: '20%', className: 'text-center whitespace-nowrap' },
        { key: 'memberRegion', header: '주소', width: '20%', className: 'text-center whitespace-nowrap' },
        { 
            key: 'isDormant', 
            header: '상태', 
            width: '10%',
            className: 'text-center whitespace-nowrap',
            render: (value) => value ? (
                <span className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700">휴면</span>
            ) : (
                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">활성</span>
            )
        },
        {
            key: 'createdAt',
            header: '가입일',
            width: '15%',
            className: 'text-center whitespace-nowrap',
            render: (value) => new Date(value).toLocaleDateString()
        }
    ], []);

    /** <================ 핸들러 ================> **/

    // 1) 입력값 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({ ...prev, [name]: value }));
    };

    // 2) 검색 실행 핸들러
    const handleMemberSearch = () => {
        let filtered = [...originalMemberList];

        if (searchParams.memberRegion) {
            filtered = filtered.filter((item) => item.memberRegion === searchParams.memberRegion);
        }
        if (searchParams.memberId) {
            filtered = filtered.filter((item) => item.memberId.includes(searchParams.memberId));
        }
        if (searchParams.memberTelNum) {
            filtered = filtered.filter((item) => item.memberTelNum.includes(searchParams.memberTelNum));
        }
        if (searchParams.keyword) {
            filtered = filtered.filter((item) => item.memberName.includes(searchParams.keyword));
        }

        setFilteredMemberList(filtered);
        setCurrentPage(1); // 검색 시 1페이지로 초기화
        setSelectedIds([]); // 선택 초기화
    };

    // 3) 초기화 핸들러
    const handleReset = () => {
        setSearchParams({
            memberRegion: '',
            memberId: '',
            memberTelNum: '',
            keyword: '',
        });
        setFilteredMemberList(originalMemberList);
        setCurrentPage(1);
        setSelectedIds([]);
    };

    // 4) 삭제 모달 열기
    const openDeleteModal = () => {
        if (selectedIds.length === 0) {
            alert('삭제할 회원을 선택해주세요.');
            return;
        }
        setIsDeleteModalOpen(true);
    };

    // 5) 실제 삭제 처리 (AdminConfirmModal 확인 시)
    const handleConfirmDelete = () => {
        const updatedOriginal = originalMemberList.filter(item => !selectedIds.includes(item.id));
        const updatedFiltered = filteredMemberList.filter(item => !selectedIds.includes(item.id));
        
        setOriginalMemberList(updatedOriginal);
        setFilteredMemberList(updatedFiltered);
        
        setSelectedIds([]);
        setIsDeleteModalOpen(false);
    };

    // 6) 정렬 핸들러
    const handleSort = (order) => {
        setSortOrder(order);
        const sorted = [...filteredMemberList].sort((a, b) => {
            return order === 'latest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt;
        });
        setFilteredMemberList(sorted);
    };

    // 7) 상세 페이지 이동 (행 클릭 시)
    const handleRowClick = (item) => {
        navigate(`/admin/member/adminMemberDetail/${item.memberId}`, { state: { item } });
    };

    /** <================ Effects & Data ================> **/
    useEffect(() => {
        // 더미 데이터 생성 (데이터 양을 늘려 페이지네이션 테스트 용이하게 변경)
        const memberData = Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            memberId: `kimgoogleuser${i + 1}`,
            memberName: `김국을${i + 1}`,
            memberTelNum: `010-0000-${String(i).padStart(4, '0')}`,
            memberRegion: i % 2 === 0 ? '전주시 완산구' : '전주시 덕진구',
            memberRole: 'USER',
            isDormant: i % 3 === 0,
            createdAt: new Date(2026, 0, i + 1).getTime(),
        })).sort((a, b) => b.createdAt - a.createdAt); // 기본 최신순

        setOriginalMemberList(memberData);
        setFilteredMemberList(memberData);
    }, []);

    // 현재 페이지에 보여줄 데이터 계산 (Client-side Pagination)
    const currentData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredMemberList.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredMemberList, currentPage]);

    // AdminSearchBox 내부 커스텀 Input 스타일
    const customInputStyle = "h-14 px-3 text-body-m border border-admin-border rounded-md bg-white focus:border-admin-primary outline-none transition-all";

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
            <div className="p-6 bg-gray-50 min-h-screen">
                
                {/* 1. 페이지 제목 */}
                <h1 className="text-2xl font-bold mb-6">회원 조회</h1>
                

                {/* 2. 검색 박스 */}
                <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8 mb-8">
                <div className="flex flex-wrap gap-4 items-start">
                    <AdminSearchBox
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        onSearch={handleMemberSearch}
                        onReset={handleReset}
                    >
                        {/* 지역 선택 */}
                        <select
                            name="memberRegion"
                            value={searchParams.memberRegion}
                            onChange={handleInputChange}
                            className={`${customInputStyle} min-w-[160px] cursor-pointer`}
                        >
                            <option value="">지역(전체)</option>
                            <option value="전주시 덕진구">전주시 덕진구</option>
                            <option value="전주시 완산구">전주시 완산구</option>
                            <option value="군산시">군산시</option>
                            <option value="익산시">익산시</option>
                            {/* 필요한 지역 추가 */}
                        </select>

                        {/* 아이디 입력 */}
                        <input
                            type="text"
                            name="memberId"
                            value={searchParams.memberId}
                            onChange={handleInputChange}
                            placeholder="ID 입력"
                            className={`${customInputStyle} w-[180px]`}
                        />

                        {/* 전화번호 입력 */}
                        <input
                            type="text"
                            name="memberTelNum"
                            value={searchParams.memberTelNum}
                            onChange={handleInputChange}
                            placeholder="전화번호 입력"
                            className={`${customInputStyle} w-[180px]`}
                        />
                    </AdminSearchBox>
                </div>
                </section>

                {/* 3. 테이블 툴바 (정렬 + 액션 버튼) */}
                <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
                <div className="flex justify-between items-center mb-4 text-sm">
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleSort('latest')}
                            className={`px-3 py-1 rounded transition-colors ${sortOrder === 'latest' ? 'bg-gray-800 text-white' : 'bg-white border hover:bg-gray-50'}`}
                        >
                            최신순
                        </button>
                        <button
                            onClick={() => handleSort('oldest')}
                            className={`px-3 py-1 rounded transition-colors ${sortOrder === 'oldest' ? 'bg-gray-800 text-white' : 'bg-white border hover:bg-gray-50'}`}
                        >
                            오래된순
                        </button>
                    </div>
                    
                    <div className="flex gap-2">
                         {/* 선택 삭제 버튼 추가 (AdminDataTable의 체크박스 활용) */}
                         <button
                            onClick={openDeleteModal}
                            disabled={selectedIds.length === 0}
                            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded-md shadow-sm transition-colors"
                        >
                            선택 삭제
                        </button>

                        <button
                            onClick={() => navigate('/admin/member/adminMemberRegister')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow-sm transition-colors"
                        >
                            신규 회원 등록
                        </button>
                    </div>
                </div>

                {/* 4. 데이터 테이블 */}
                <AdminDataTable
                    columns={columns}
                    data={currentData}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    onRowClick={handleRowClick}
                    rowKey="id" // 고유 식별자 키
                />

                {/* 5. 페이지네이션 */}
                <div className="mt-4">
                    <AdminPagination
                        totalItems={filteredMemberList.length}
                        itemCountPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
                </section>
            </div>
            

            {/* 6. 삭제 확인 모달 */}
            <AdminConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="회원 삭제"
                message={`선택한 ${selectedIds.length}명의 회원을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`}
                type="delete"
            />
        </div>
    );
};

export default AdminMemberList;