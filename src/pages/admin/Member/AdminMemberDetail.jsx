import React, { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

const AdminMemberDetail = () => {
    const { memberId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // 수정 모드 상태 관리
    const [isEdit, setIsEdit] = useState(false);
    const item = location.state?.item;

    // 수정 입력값 상태 관리
    const [formData, setFormData] = useState({ ...item });

    if (!item) {
        return (
            <div className="p-10 text-center">
                <p>회원 정보를 불러올 수 없습니다.</p>
                <button onClick={() => navigate(-1)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">돌아가기</button>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        alert('저장 처리 완료 (DB 연동 필요)');
        setIsEdit(false);
    };

    const handleDeleteClick = () => {
        if (window.confirm(`'${item.memberId}' 회원을 정말 삭제하시겠습니까?`)) {
            alert('삭제 완료');
            navigate('/admin/member/adminMemberList');
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">회원 상세 관리</h1>
                    
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8">
                        <div className="grid grid-cols-1 gap-y-6">
                            {/* 데이터 필드 반복 */}
                            {[
                                { label: '아이디', name: 'memberId', value: formData.memberId, readOnly: true },
                                { label: '이름', name: 'memberName', value: formData.memberName },
                                { label: '전화번호', name: 'memberTelNum', value: formData.memberTelNum },
                                { label: '주소지역', name: 'memberRegion', value: formData.memberRegion },
                                { label: '등급', name: 'memberRole', value: formData.memberRole },
                            ].map((field) => (
                                <div key={field.name} className="flex flex-col md:flex-row md:items-center border-b border-gray-100 pb-4 last:border-0">
                                    <label className="md:w-1/4 text-sm font-semibold text-gray-500">{field.label}</label>
                                    <div className="md:w-3/4 mt-1 md:mt-0">
                                        {isEdit && !field.readOnly ? 
                                            field.name === 'memberRole' ? (
                                            <select
                                            name={field.name}
                                            value={field.value}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-md"
                                            >
                                            <option value="USER">사용자</option>
                                            <option value="ADMIN">관리자</option>
                                            </select>
                                        ) :(
                                            <input
                                                type="text"
                                                name={field.name}
                                                value={field.value}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            />
                                        ) : (
                                            <span className="text-gray-900 font-medium">{field.value}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div class="flex justify-center">
                            <button 
                                onClick={() => setIsEdit(!isEdit)}
                                className={`px-5 py-2 rounded-lg font-medium transition ${
                                isEdit ? 'bg-gray-500 text-white' : 'bg-indigo-600 text-white'
                                }`}
                            >
                                {isEdit ? '수정 취소' : '수정 모드'}
                            </button>
                        </div>
                    </div>
      
                    <div className="bg-gray-50 px-8 py-4 flex justify-between items-center">
                        <button 
                            onClick={() => navigate(-1)}
                            className="text-gray-600 hover:text-gray-800 font-medium"
                        >
                            ← 목록으로 돌아가기
                        </button>
                        
                        <div className="flex gap-3">
                                {isEdit && (
                                    <>
                                    <button
                                        onClick={handleSave}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg"
                                    >
                                        변경사항 저장
                                    </button>
                                    <button
                                        onClick={handleDeleteClick}
                                        className="px-6 py-2 bg-red-600 text-white rounded-lg"
                                    >
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

export default AdminMemberDetail;