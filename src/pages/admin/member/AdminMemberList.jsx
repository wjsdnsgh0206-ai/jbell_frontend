import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// commonService 추가 임포트
import { userService, commonService } from '@/services/api'; 

import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

const AdminMemberList = () => {
    const navigate = useNavigate();

    /** <================ 상태 관리 ================> **/
    const [memberList, setMemberList] = useState([]); 
    const [totalItems, setTotalItems] = useState(0);    
    const [sggList, setSggList] = useState([]); // 지역 코드 리스트 상태 추가
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [selectedIds, setSelectedIds] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [searchParams, setSearchParams] = useState({
        memberRegion: '',
        memberId: '',
        memberTelNum: '',
        keyword: '', 
    });

    const [sortOrder, setSortOrder] = useState('latest');

    /** <================ 지역 코드 로드 ================> **/
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                // 회원가입과 동일하게 'AREA_JB' 그룹 코드를 불러옵니다.
                const response = await commonService.getCodeList('AREA_JB');
                if (response && response.data) {
                    setSggList(response.data);
                }
            } catch (error) {
                console.error("지역 코드 로드 실패:", error);
            }
        };
        fetchRegions();
    }, []);

    /** <================ 코드 -> 이름 변환 함수 ================> **/
    const getRegionName = useCallback((code) => {
        if (!code) return '-';
        const region = sggList.find(item => String(item.code) === String(code));
        return region ? region.name : code; // 매칭되는 이름이 없으면 코드 그대로 표시
    }, [sggList]);

    /** <================ API 호출 함수 ================> **/
    const fetchMembers = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                page: currentPage,
                size: itemsPerPage,
                sortOrder,
                ...searchParams
            };
            const response = await userService.getMemberList(params);
            setMemberList(response.data.list);
            setTotalItems(response.data.total);
        } catch (error) {
            console.error("로딩 실패", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, sortOrder, searchParams]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    /** <================ 테이블 컬럼 정의 ================> **/
    const columns = useMemo(() => [
        { 
            key: 'userId', 
            header: 'ID', 
            width: '15%',
            className: 'text-blue-600 font-bold hover:underline cursor-pointer text-center whitespace-nowrap',
        },
        { key: 'userName', header: '이름', width: '15%', className: 'text-center whitespace-nowrap' },
        { key: 'userEmail', header: '이메일', width: '20%', className: 'text-center whitespace-nowrap' },
        { 
            key: 'userResidenceArea', 
            header: '지역', // '주소'에서 '지역'으로 변경
            width: '20%', 
            className: 'text-center whitespace-nowrap',
            // render 함수를 사용하여 코드값을 이름으로 변환
            render: (value) => getRegionName(value)
        },
        { 
            key: 'status', 
            header: '상태', 
            width: '10%',
            className: 'text-center whitespace-nowrap',
            render: (value) => value ? (
                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">활성</span>
            ) : (
                <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">정지</span>
            )
        },
        {
            key: 'userCreatedAt',
            header: '가입일',
            width: '15%',
            className: 'text-center whitespace-nowrap',
            render: (value) => value ? new Date(value).toLocaleDateString() : '-'
        }
    ], [getRegionName]); // getRegionName이 바뀔 때 컬럼 정의도 업데이트

    /** <================ 핸들러 ================> **/
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({ ...prev, [name]: value }));
    };

    const handleMemberSearch = () => {
        setCurrentPage(1);
        fetchMembers();
    };

    const handleReset = () => {
        setSearchParams({
            memberRegion: '',
            memberId: '',
            memberTelNum: '',
            keyword: '',
        });
        setCurrentPage(1);
        setSortOrder('latest');
    };

    const handleConfirmDelete = async () => {
        try {
            await userService.deleteMembers(selectedIds);
            alert('삭제(비활성화) 처리가 완료되었습니다.');
            setSelectedIds([]); // 선택 해제
            fetchMembers();
        } catch (error) {
            alert('삭제 실패');
        }
    };

    const handleRowClick = (item) => {
        navigate(`/admin/member/adminMemberDetail/${item.userId}`, { state: { item } });
    };

    const customInputStyle = "h-14 px-3 text-body-m border border-admin-border rounded-md bg-white focus:border-admin-primary outline-none transition-all";

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
            <div className="p-6 bg-gray-50 min-h-screen">
                <h1 className="text-2xl font-bold mb-6">회원 조회</h1>
                
                <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8 mb-8">
                    <AdminSearchBox
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        onSearch={handleMemberSearch}
                        onReset={handleReset}
                    >
                        {/* 검색창 Select Box 동적 렌더링 */}
                        <select
                            name="memberRegion"
                            value={searchParams.memberRegion}
                            onChange={handleInputChange}
                            className={`${customInputStyle} min-w-[160px] cursor-pointer`}
                        >
                            <option value="">지역(전체)</option>
                            {sggList.map((item) => (
                                <option key={item.code} value={item.code}>
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            name="memberId"
                            value={searchParams.memberId}
                            onChange={handleInputChange}
                            placeholder="ID 입력"
                            className={`${customInputStyle} w-[180px]`}
                        />

                        <input
                            type="text"
                            name="keyword"
                            value={searchParams.keyword}
                            onChange={handleInputChange}
                            placeholder="이름 입력"
                            className={`${customInputStyle} w-[180px]`}
                        />
                    </AdminSearchBox>
                </section>

                <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
                    <div className="flex justify-between items-center mb-4 text-sm">
                        <div className="flex gap-2">
                            {['latest', 'oldest'].map((order) => (
                                <button
                                    key={order}
                                    onClick={() => setSortOrder(order)}
                                    className={`px-3 py-1 rounded transition-colors ${sortOrder === order ? 'bg-gray-800 text-white' : 'bg-white border hover:bg-gray-50'}`}
                                >
                                    {order === 'latest' ? '최신순' : '오래된순'}
                                </button>
                            ))}
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                disabled={selectedIds.length === 0}
                                className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded-md transition-colors"
                            >
                                선택 정지
                            </button>
                            <button
                                onClick={() => navigate('/admin/member/adminMemberRegister')}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
                            >
                                신규 회원 등록
                            </button>
                        </div>
                    </div>

                    <AdminDataTable
                        columns={columns}
                        data={memberList}
                        selectedIds={selectedIds}
                        onSelectionChange={setSelectedIds}
                        onRowClick={handleRowClick}
                        rowKey="userId"
                    />

                    <div className="mt-4">
                        <AdminPagination
                            totalItems={totalItems}
                            itemCountPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </section>
            </div>

            <AdminConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="회원 상태 변경"
                message={`선택한 ${selectedIds.length}명의 회원을 비활성화(정지) 하시겠습니까?`}
                type="delete"
            />
        </div>
    );
};

export default AdminMemberList;