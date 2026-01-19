import React from 'react'; // React 추가
import { useLocation, useParams, useNavigate } from 'react-router-dom'; // useNavigate 추가하면 좋아요

const AdminMemberDetail = () => {
    const { memberId } = useParams(); 
    const location = useLocation();
    const navigate = useNavigate();

    // 목록에서 넘겨준 user 데이터가 없을 때를 대비한 방어 코드
    const item = location.state?.item;

    // 데이터가 없으면 에러를 뱉는 대신 "데이터가 없다"고 알려주거나 목록으로 튕겨내기
    if (!item) {
        return (
            <div className="p-10 text-center">
                <p>회원 정보를 불러올 수 없습니다.</p>
                <button onClick={() => navigate(-1)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">돌아가기</button>
            </div>
        );
    }

    
    // 수정 버튼 클릭 핸들러 (만들어야 함!)
        const handleEditClick = () => {
            navigate('/admin/member/adminMemberEdit/' + item.memberId); // 실제 수정 페이지 경로
        };

    // 삭제 버튼 클릭 핸들러
        const handleDeleteClick = () => {
            if (window.confirm(`'${item.memberId}' 회원을 정말 삭제하시겠습니까?`)) {
            alert('삭제 처리 완료! (실제 DB 삭제 로직 필요)');
            navigate('/admin/member/adminMemberList'); // 삭제 후 목록으로 돌아가기
            }
        };
    
    
    return (
        <div className="p-6 bg-white">
            <h1 className="text-2xl font-bold mb-6">회원 정보 조회</h1>

            <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
               <div className="p-10">
                    <h2 className="text-2xl mb-5">{item.memberName} 님의 상세 정보</h2>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <p value="memberId">아이디: {item.memberId}</p>
                        <p value="memberName">이름: {item.memberName}</p>
                        <p value="memberTelNum">전화번호: {item.memberTelNum}</p>
                        <p value="memberRegion">주소지역: {item.memberRegion}</p>
                        <p value="memberRole">등급: {item.memberRole}</p>
                    </div>
                </div>
                 <div className="mt-8 flex justify-between">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                        목록으로
                    </button>
                    <div>
                        <button 
                            onClick={handleEditClick} 
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-3"
                        >
                            수정
                        </button>
                        <button 
                            onClick={handleDeleteClick} 
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            삭제
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminMemberDetail;