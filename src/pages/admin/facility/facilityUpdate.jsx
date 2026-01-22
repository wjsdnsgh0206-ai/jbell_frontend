import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { facilityService } from '@/services/api'; 

const FacilityUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    fcltId: '',
    fcltNm: '',
    fcltSeCd: '',
    ctpvNm: '',
    sggNm: '',
    roadNmAddr: '',
    lat: 0,
    lot: 0,
    fcltArea: 0,      // 추가
    fcltCapacity: 0,  // 추가
    opnYn: 'Y',
    useYn: 'Y'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const response = await facilityService.getFacilityDetail(id);
        if (response && (response.status === 'SUCCESS' || response.httpCode === 200)) {
          setFormData(response.data);
        } else {
          alert("데이터를 찾을 수 없습니다.");
          navigate(-1);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert("정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 숫자형 필드는 Number로 변환하여 저장
    const numericFields = ['lat', 'lot', 'fcltArea', 'fcltCapacity'];
    const finalValue = numericFields.includes(name) ? Number(value) : value;

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fcltNm) return alert("시설명은 필수입니다.");

    try {
      const response = await facilityService.updateFacility(formData);
      
      if (response.status === 'SUCCESS' || response.httpCode === 200) {
        alert("수정이 완료되었습니다.");
        navigate(`/admin/facility/facilityDetail/${id}`);
      } else {
        alert(`수정 실패: ${response.message}`);
      }
    } catch (error) {
      console.error("수정 실패:", error);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) return <div className="p-20 text-center text-gray-500 font-medium animate-pulse">데이터 로딩 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-10 font-sans text-gray-800">
      <header className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ChevronLeft size={28} />
        </button>
        <div className="flex flex-col">
          <span className="text-sm text-blue-600 font-bold">시설 정보 수정</span>
          <h1 className="text-2xl font-bold tracking-tight">{formData.fcltNm}</h1>
        </div>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold mb-8 border-b pb-4 text-blue-600">상세 정보 수정</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            
            {/* 시설명 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">시설명</label>
              <input 
                type="text" 
                name="fcltNm" 
                value={formData.fcltNm} 
                onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {/* 시설유형 - DB 코드값으로 수정 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">시설유형</label>
              <div className="relative">
                <select 
                  name="fcltSeCd" 
                  value={formData.fcltSeCd} 
                  onChange={handleChange}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg outline-none appearance-none bg-white focus:border-blue-500 cursor-pointer"
                >
                  <option value="DSSP-IF-10945">임시주거시설</option>
                  <option value="DSSP-IF-10943">지진옥외대피소</option>
                  <option value="DSSP-IF-00195">민방위대피소</option>
                  <option value="DSSP-IF-10942">무더위쉼터</option>
                  <option value="DSSP-IF-10804">한파쉼터</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            {/* 주소 정보 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">시도</label>
              <input 
                type="text" 
                name="ctpvNm" 
                value={formData.ctpvNm} 
                onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-gray-50"
                readOnly 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">시군구</label>
              <input 
                type="text" 
                name="sggNm" 
                value={formData.sggNm} 
                onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-500">도로명 주소</label>
              <input 
                type="text" 
                name="roadNmAddr" 
                value={formData.roadNmAddr} 
                onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            {/* 수치 정보 (면적/수용인원) 추가 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">시설 면적 (m²)</label>
              <input 
                type="number" 
                name="fcltArea" 
                value={formData.fcltArea} 
                onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">수용 가능 인원 (명)</label>
              <input 
                type="number" 
                name="fcltCapacity" 
                value={formData.fcltCapacity} 
                onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            {/* 좌표 정보 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">위도 (Latitude)</label>
              <input 
                type="number" 
                step="any"
                name="lat" 
                value={formData.lat} 
                onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">경도 (Longitude)</label>
              <input 
                type="number" 
                step="any"
                name="lot" 
                value={formData.lot} 
                onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            {/* 운영 및 노출 설정 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">운영 상태</label>
              <select 
                name="opnYn" 
                value={formData.opnYn} 
                onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Y">운영중</option>
                <option value="N">미운영</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">목록 노출 여부</label>
              <select 
                name="useYn" 
                value={formData.useYn} 
                onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Y">노출중</option>
                <option value="N">미노출</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-12 border-t mt-12">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="px-10 h-12 border border-gray-400 text-gray-800 rounded-md font-medium hover:bg-gray-50 transition-all"
            >
              취소
            </button>
            <button 
              type="submit"
              className="px-12 h-12 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              수정 사항 저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacilityUpdate;