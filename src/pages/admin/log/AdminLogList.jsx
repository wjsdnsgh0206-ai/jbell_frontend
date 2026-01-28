import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

// import BreadCrumb from '@/components/Admin/board/BreadCrumb';
import AdminSearchBox from '@/components/admin/AdminSearchBox'; // ★ 공용 컴포넌트 임포트
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import AdminBreadcrumb from '@/components/admin/AdminBreadCrumb';

const AdminLogList = () => {
    
    const [selectedIds, setSelectedIds] = useState([]); // AdminDataTable
    const [currentPage, setCurrentPage] = useState(1);  // AdminPaigination
    const itemsPerPage = 10;

    const { setBreadcrumbTitle } = useOutletContext();  // Breadcrumb...

    useEffect(() => {
    setBreadcrumbTitle('');
    }, [setBreadcrumbTitle]);

    /*
    useEffect(() => {
        axios.get('/api/logs/login')
        .then(res => {
            console.log(res.data.data);
        });
    }, []);
    */


    
    /* <================ 데이터 및 상태 관리 ================> */
    const logData = Array(10).fill(null).map((_, i) => ({
        logId: `kimgoogleuser${i + 1}`,
        logIp: '192.168.0.1',
        loggedDate: '2026-01-14', // 날짜 필터링 비교를 위해 포맷을 YYYY-MM-DD로 가정 (화면엔 변환해서 보여줌)
        logSOF: i % 2 === 0 ? '실패' : '성공',
        logReason: i % 2 === 0 ? '자격 증명 오류(ID, PW 불일치)' : '로그인 성공',
        display: true
    }));

    // 1. 상태 통합 (AdminSearchBox 규격에 맞춤)
    const [searchParams, setSearchParams] = useState({
        logIp: '',
        logDate: '',
        logSOF: '전체',
        logReason: '전체',
        keyword: '', // ★ keyword는 '로그인 ID' 검색으로 사용
    });
    
    // 필터링된 리스트 상태
    const [filteredLogList, setFilteredLogList] = useState(logData);

    const columns = [
        {
            key: 'no',
            header: '번호',
            className: 'text-center',
            render: (_, __, index) =>
            (currentPage - 1) * itemsPerPage + index + 1
        },
        {
            key: 'logId',
            header: '로그인 ID',
            className: 'text-center',
            render: (value) => (
            <span className="text-blue-600 font-medium">{value}</span>
            )
        },
        {
            key: 'logIp',
            header: '로그인 IP',
            className: 'text-center'
        },
        {
            key: 'loggedDate',
            header: '발생일자',
            className: 'text-center'
        },
        {
            key: 'logSOF',
            header: '성공/실패',
            className: 'text-center',
            render: (value) => (
            <span
                className={`px-2 py-1 rounded text-xs inline-block ${
                value === '성공'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
            >
                {value}
            </span>
            )
        },
        {
            key: 'logReason',
            header: '실패 이유',
            className: 'text-left'
        }
    ];



    const startIndex = (currentPage - 1) * itemsPerPage;
    const pagedData = filteredLogList.slice(
    startIndex,
    startIndex + itemsPerPage
    );

   


    /* <================ 핸들러 ================> */
    
    // 2. 커스텀 입력값 변경 핸들러 (children 내부 input용)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    // 3. 검색 버튼 클릭 시 실행
    const handleLogSearch = () => {
        const result = logData.filter(item => {
            // keyword -> 로그인 ID 검색
            if (searchParams.keyword && !item.logId.includes(searchParams.keyword)) return false;
            
            // 나머지 조건 검색
            if (searchParams.logIp && !item.logIp.includes(searchParams.logIp)) return false;
            
            // 날짜 검색 (문자열 단순 포함 여부 혹은 일치 여부)
            if (searchParams.logDate && !item.loggedDate.includes(searchParams.logDate)) return false;
            
            if (searchParams.logSOF !== '전체' && item.logSOF !== searchParams.logSOF) return false;
            
            if (searchParams.logReason !== '전체' && !item.logReason.includes(searchParams.logReason)) return false;
            
            return true;
        });
        setFilteredLogList(result);
    };

    // 4. 초기화 버튼 클릭 시 실행
    const handleReset = () => {
        setSearchParams({
            logIp: '',
            logDate: '',
            logSOF: '전체',
            logReason: '전체',
            keyword: ''
        });
        setFilteredLogList(logData);
    };

    // 공통 Input 스타일 (AdminSearchBox와 높이/스타일 통일)
    const inputStyle = "h-14 px-3 text-body-m border border-admin-border rounded-md bg-white focus:border-admin-primary outline-none transition-all";

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
            <div className="p-6 bg-gray-50 min-h-screen">
                
                <h1 className="text-2xl font-bold mb-6">로그 관리</h1>

            {/* 검색 바 영역: AdminSearchBox 적용 */}
            <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8 mb-8">
                <div className="flex flex-wrap gap-4 items-start">
                    <AdminSearchBox
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        onSearch={handleLogSearch}
                        onReset={handleReset}
                    >

                        {/* <=== 여기서부터 children (커스텀 필터들) ===> */}

                        {/* 1. 로그인 IP */}
                        <input 
                            type="text" 
                            name="logIp"
                            value={searchParams.logIp}
                            onChange={handleInputChange}
                            placeholder="IP 주소 (xxx.xxx...)" 
                            className={`${inputStyle} w-[160px]`} 
                        />

                        {/* 2. 발생일자 */}
                        <input 
                            type="date" 
                            name="logDate"
                            value={searchParams.logDate}
                            onChange={handleInputChange}
                            className={`${inputStyle} w-[160px] cursor-pointer`} 
                        />

                        {/* 3. 성공/실패 여부 */}
                        <select 
                            name="logSOF"
                            value={searchParams.logSOF}
                            onChange={handleInputChange}
                            className={`${inputStyle} min-w-[100px] cursor-pointer`}
                        >
                            <option value="전체">성공/실패(전체)</option>
                            <option value="성공">성공</option>
                            <option value="실패">실패</option>
                        </select>

                        {/* 4. 성공/실패 이유 */}
                        <select 
                            name="logReason"
                            value={searchParams.logReason}
                            onChange={handleInputChange}
                            className={`${inputStyle} w-[200px] cursor-pointer`}
                        >
                            <option value="전체">이유(전체)</option>
                            <option value="자격 증명 오류">자격 증명 오류</option>
                            <option value="계정 상태 문제">계정 상태 문제</option>
                            <option value="계정 만료">계정 만료</option>
                            <option value="계정 비활성화">계정 비활성화</option>
                            <option value="인증 부족">인증 부족</option>
                            <option value="시스템 오류">시스템 오류</option>
                            <option value="기타 접근 제한">기타 접근 제한</option>
                            <option value="세션">세션 관련</option>
                        </select>
                        
                        {/* 5. 로그인 ID는 AdminSearchBox의 기본 keyword 입력창을 사용 */}
                        
                        {/* <=== 여기까지 children ===> */}

                    </AdminSearchBox>
                </div>
                </section>

                {/* 테이블 영역 */}
                <div className="bg-white border rounded-md overflow-hidden shadow-sm">
                    <AdminDataTable
                        columns={columns}
                        data={pagedData}
                        selectedIds={selectedIds}
                        onSelectionChange={setSelectedIds}
                        rowKey="logId"
                    />
                </div>

                {/* 페이지네이션 */}
                <div className="flex justify-center mt-6 gap-2 text-sm">
                    <AdminPagination
                    totalItems={filteredLogList.length}
                    itemCountPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminLogList;