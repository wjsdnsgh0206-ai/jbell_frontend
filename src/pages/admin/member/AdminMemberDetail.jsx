import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { userService, commonService } from '@/services/api'; // API 서비스 추가

const AdminMemberDetail = () => {
    const { memberId } = useParams();
    const navigate = useNavigate();
    const { setBreadcrumbTitle } = useOutletContext();

    // 상태 관리
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState(null);
    const [sggList, setSggList] = useState([]); // 지역 코드 목록
    const [isLoading, setIsLoading] = useState(true);

    /** <================ 데이터 로드 (서버 통신) ================> **/
    useEffect(() => {
    const fetchData = async () => {
        try {
            // 1. 지역 코드 로드
            const regionRes = await commonService.getCodeList('AREA_JB');
            setSggList(regionRes.data || []);

            // 2. 회원 상세 정보 로드
            const res = await userService.getMemberDetail(memberId);
            
            // [중요] 백엔드 응답이 ApiResponse 형태일 경우 res.data를 사용하고, 
            // 아닐 경우 res를 바로 사용합니다. 
            // 또한 status가 1/0(숫자)으로 올 경우를 대비해 처리합니다.
            const userData = res.data || res; 
            
            setFormData({
                ...userData,
                // 백엔드 로그에 user_status AS status로 찍히므로 필드명 통일
                status: userData.status !== undefined ? userData.status : (userData.userStatus ? 1 : 0)
            });
            
            setBreadcrumbTitle(userData.userName ? `${userData.userName} 회원 상세` : "회원 상세 조회");
        } catch (error) {
            console.error("데이터 로드 실패:", error);
            alert("정보를 불러오는데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
    return () => setBreadcrumbTitle("");
}, [memberId, setBreadcrumbTitle]);

    if (isLoading) return <div className="p-10 text-center text-gray-500">데이터를 불러오는 중입니다...</div>;
    if (!formData) return <div className="p-10 text-center">회원 정보를 찾을 수 없습니다.</div>;

    /** <================ 핸들러 모음 ================> **/
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            if (window.confirm('변경사항을 저장하시겠습니까?')) {
                await userService.updateMember(memberId, formData);
                alert('저장되었습니다.');
                setIsEdit(false);
            }
        } catch (error) {
            alert('저장에 실패했습니다.');
        }
    };

    const handleDeleteClick = async () => {
        if (window.confirm(`'${formData.userId}' 회원을 정말 삭제하시겠습니까?`)) {
            try {
                await userService.deleteMember(memberId);
                alert('삭제 완료');
                navigate('/admin/member/adminMemberList');
            } catch (error) {
                alert('삭제 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">회원 상세 조회</h1>
                    <button 
                        onClick={() => setIsEdit(!isEdit)}
                        className={`px-5 py-2 rounded-lg font-medium transition ${
                            isEdit ? 'bg-gray-500 text-white' : 'bg-indigo-600 text-white'
                        }`}
                    >
                        {isEdit ? '수정 취소' : '수정하기'}
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8">
                        <div className="grid grid-cols-1 gap-y-6">
                            {/* 아이디 (읽기 전용) */}
                            <DetailField label="아이디" name="userId" value={formData.userId} readOnly />

                            {/* 이름 */}
                            <DetailField label="이름" name="userName" value={formData.userName} isEdit={isEdit} onChange={handleInputChange} />

                            {/* 이메일 */}
                            <DetailField label="이메일" name="userEmail" value={formData.userEmail} isEdit={isEdit} onChange={handleInputChange} />

                            {/* 지역 (SelectBox 처리) */}
                            <div className="flex flex-col md:flex-row md:items-center border-b border-gray-100 pb-4">
                                <label className="md:w-1/4 text-sm font-semibold text-gray-500">거주 지역</label>
                                <div className="md:w-3/4 mt-1 md:mt-0">
                                    {isEdit ? (
                                        <select
                                            name="userResidenceArea"
                                            value={formData.userResidenceArea}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-blue-300 rounded-md outline-none"
                                        >
                                            <option value="">지역 선택</option>
                                            {sggList.map(sgg => (
                                                <option key={sgg.code} value={sgg.code}>{sgg.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        // 코드를 이름으로 변환하여 표시
                                        <span className="text-gray-900 font-medium">
                                            {sggList.find(s => s.code === formData.userResidenceArea)?.name || formData.userResidenceArea}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* 등급 (SelectBox 처리) */}
                            <div className="flex flex-col md:flex-row md:items-center border-b border-gray-100 pb-4">
                                <label className="md:w-1/4 text-sm font-semibold text-gray-500">회원 등급</label>
                                <div className="md:w-3/4 mt-1 md:mt-0">
                                    {isEdit ? (
                                        <select
                                            name="userGrade"
                                            value={formData.userGrade}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-blue-300 rounded-md"
                                        >
                                            <option value="USER">사용자</option>
                                            <option value="ADMIN">관리자</option>
                                        </select>
                                    ) : (
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${formData.userGrade === 'ADMIN' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {formData.userGrade === 'ADMIN' ? '관리자' : '일반 사용자'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* 상태값 (토글 스위치) */}
                            <div className="flex flex-col md:flex-row md:items-center pb-4">
                                <label className="md:w-1/4 text-sm font-semibold text-gray-500">계정 상태</label>
                                <div className="md:w-3/4 flex items-center">
                                    <button
                                        type="button"
                                        disabled={!isEdit}
                                        // status 필드 (1: 활성, 0: 정지) 연동
                                        onClick={() => setFormData(prev => ({ ...prev, status: prev.status === 1 ? 0 : 1 }))}
                                        className={`relative inline-flex h-7 w-14 rounded-full transition ${
                                            formData.status === 1 ? 'bg-green-500' : 'bg-gray-300'
                                        } ${!isEdit && 'opacity-50 cursor-not-allowed'}`}
                                    >
                                        <span className={`inline-block w-6 h-6 bg-white rounded-full transform transition mt-0.5 ${formData.status === 1 ? 'translate-x-7' : 'translate-x-1'}`} />
                                    </button>
                                    <span className="ml-3 text-sm font-medium">{formData.status === 1 ? '활성' : '정지(휴면)'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
      
                    {/* 하단 버튼 바 */}
                    <div className="bg-gray-50 px-8 py-4 flex justify-between items-center">
                        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800 font-medium">
                            ← 목록으로 돌아가기
                        </button>
                        
                        <div className="flex gap-3">
                            {isEdit && (
                                <>
                                    <button onClick={handleSave} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                        변경사항 저장
                                    </button>
                                    <button onClick={handleDeleteClick} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                                        회원 삭제
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 재사용을 위한 필드 컴포넌트
const DetailField = ({ label, name, value, isEdit, readOnly, onChange }) => (
    <div className="flex flex-col md:flex-row md:items-center border-b border-gray-100 pb-4">
        <label className="md:w-1/4 text-sm font-semibold text-gray-500">{label}</label>
        <div className="md:w-3/4 mt-1 md:mt-0">
            {isEdit && !readOnly ? (
                <input
                    type="text"
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
            ) : (
                <span className={`text-gray-900 font-medium ${readOnly && 'text-gray-400'}`}>{value}</span>
            )}
        </div>
    </div>
);

export default AdminMemberDetail;