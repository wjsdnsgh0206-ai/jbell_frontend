import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import { facilityService } from '@/services/api'; 
import { ChevronLeft } from 'lucide-react';

// 시설 유형 코드 변환 헬퍼 (백엔드 ApiType 매핑)
const getSeCdName = (code) => {
  const mapping = {
    'DSSP-IF-10945': '임시주거시설',
    'DSSP-IF-10942': '무더위쉼터',
    'DSSP-IF-10804': '한파쉼터',
    'DSSP-IF-10943': '지진옥외대피소',
    'DSSP-IF-10417': '원자력사고 대피소',
    'DSSP-IF-00195': '민방위 대피소',
  };
  return mapping[code] || code;
};

const FacilityDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ 
    title: '', 
    message: '', 
    type: 'delete', 
    onConfirm: () => {} 
  });

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const response = await facilityService.getFacilityDetail(id);
        // 백엔드 ApiResponse 객체 구조에 맞춰 SUCCESS 체크
        if (response && (response.status === 'SUCCESS' || response.httpCode === 200)) {
          setData(response.data);
        } else {
          alert(response.message || "데이터를 찾을 수 없습니다.");
          navigate('/admin/facility/facilityList');
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id, navigate]);

  const handleDeleteClick = () => {
    setModalConfig({
      title: '시설 삭제',
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-red-600 font-bold">[{data?.fcltNm}]</span> 항목을 정말 삭제하시겠습니까?</p>
          <p className="text-sm text-gray-500">* 삭제된 데이터는 복구할 수 없습니다.</p>
        </div>
      ),
      type: 'delete',
      onConfirm: async () => {
        try {
          // 백엔드는 List<Long> 형식을 받으므로 배열로 전달
          const response = await facilityService.deleteFacilities([Number(id)]); 
          
          if (response.status === 'SUCCESS' || response.httpCode === 200) {
            setIsModalOpen(false);
            alert("성공적으로 삭제되었습니다.");
            navigate('/admin/facility/facilityList');
          } else {
            alert(response.message || "삭제에 실패했습니다.");
          }
        } catch (error) {
          console.error("삭제 실패:", error);
          alert("서버 통신 오류로 삭제하지 못했습니다.");
        }
      }
    });
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="p-20 text-center text-gray-500 font-medium animate-pulse">데이터 로딩 중...</div>;
  if (!data) return <div className="p-20 text-center text-gray-500 font-medium">존재하지 않는 시설입니다.</div>;

  return (
    <div className="max-w-6xl mx-auto p-10 font-sans text-gray-800">
      <header className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">시설 상세 정보</h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 왼쪽: 시설 상세 정보 카드 */}
        <div className="flex-[2] bg-white p-10 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h2 className="text-xl font-bold text-blue-600">기본 및 상세 정보</h2>
            <span className="text-sm text-gray-400 font-mono">ID: {data.fcltId}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8">
            <InfoItem label="시설명" value={data.fcltNm} />
            <InfoItem label="시설유형" value={getSeCdName(data.fcltSeCd)} />
            <InfoItem label="지역명" value={`${data.ctpvNm} ${data.sggNm}`} />
            <InfoItem label="도로명 주소" value={data.roadNmAddr} />
            
            {/* 추가된 필드: 면적 및 수용인원 */}
            <InfoItem label="시설 면적" value={data.fcltArea ? `${data.fcltArea.toLocaleString()} m²` : "0 m²"} />
            <InfoItem label="예측 수용 인원" value={data.fcltCapacity ? `${data.fcltCapacity.toLocaleString()} 명` : "0 명"} />
            
            <InfoItem label="위도(Lat)" value={data.lat} />
            <InfoItem label="경도(Lot)" value={data.lot} />
            <InfoItem label="최종 업데이트" value={data.regDt ? data.regDt.replace('T', ' ').substring(0, 16) : "-"} />
          </div>
        </div>

        {/* 오른쪽: 상태 정보 카드 */}
        <div className="flex-1 bg-white p-10 rounded-2xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-8 border-b pb-4 text-gray-700">관리 상태</h2>
          <div className="space-y-10">
            <div>
              <p className="text-gray-400 text-sm mb-3 font-medium">실시간 운영 여부</p>
              <span className={`px-4 py-2 rounded-lg text-sm font-bold ${data.opnYn === 'Y' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {data.opnYn === 'Y' ? "● 운영 중" : "○ 미운영"}
              </span>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-3 font-medium">사용자 페이지 노출</p>
              <span className={`px-4 py-2 rounded-lg text-sm font-bold ${data.useYn === 'Y' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                {data.useYn === 'Y' ? "V 노출 중" : "X 비노출"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-12 pt-8 border-t">
        <button 
          onClick={() => navigate('/admin/facility/facilityList')} 
          className="px-8 py-3 border border-gray-400 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition"
        >
          목록으로
        </button>
        <button 
          onClick={handleDeleteClick} 
          className="px-8 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-all active:scale-95"
        >
          시설 삭제
        </button>
        <button 
          onClick={() => navigate(`/admin/facility/facilityUpdate/${id}`)} 
          className="px-10 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md transition active:scale-95"
        >
          정보 수정하기
        </button>
      </div>

      <AdminConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        {...modalConfig} 
      />
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <p className="text-gray-400 text-sm font-medium">{label}</p>
    <p className="text-gray-900 font-bold text-lg break-all">{value || "-"}</p>
  </div>
);

export default FacilityDetail;