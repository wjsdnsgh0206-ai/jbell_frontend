import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { facilityService } from '@/services/api';

const FacilityAdd = () => {
  const navigate = useNavigate();
  // 수정

  // 1. 백엔드 FacilityDTO 필드명과 100% 일치시킴
  const [formData, setFormData] = useState({
    fcltNm: '',
    fcltSeCd: 'DSSP-IF-10945', // DB 외래키 제약조건에 맞는 실제 코드값으로 기본값 설정
    ctpvNm: '전북특별자치도',
    sggNm: '',
    roadNmAddr: '',
    lat: 0, // 기본값 (전북 중심부 등) 또는 0
    lot: 0,
    fcltArea: 0,
    fcltCapacity: 0, // rcvCapacity에서 fcltCapacity로 수정
    opnYn: 'Y',
    useYn: 'Y'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // 숫자 필드 처리
    const finalValue = (name === 'fcltArea' || name === 'fcltCapacity') 
      ? Number(value) 
      : value;

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fcltNm || !formData.roadNmAddr) {
      alert("시설명과 도로명 주소는 필수 입력 항목입니다.");
      return;
    }

    try {
      // API 호출
      const response = await facilityService.addFacility(formData);
      
      // 백엔드 ApiResponse 구조(status: "SUCCESS")에 맞춤
      if (response && (response.status === 'SUCCESS' || response.httpCode === 200)) {
        alert("시설이 성공적으로 등록되었습니다.");
        navigate('/admin/facility/facilityList');
      } else {
        alert(`등록 실패: ${response.message || "오류가 발생했습니다."}`);
      }
    } catch (error) {
      console.error("등록 중 에러 발생:", error);
      alert("서버 통신 중 오류가 발생했습니다. (콘솔 로그를 확인하세요)");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10 font-sans text-gray-800">
      <header className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">신규 시설 등록</h1>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold mb-8 border-b pb-4 text-blue-600">시설 기본정보</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            
            {/* 시설명 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">시설명 <span className="text-red-500">*</span></label>
              <input 
                type="text"
                name="fcltNm"
                value={formData.fcltNm}
                onChange={handleChange}
                placeholder="예: 전주 시민공원 대피소"
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* 시설유형 - DB 코드값(DSSP-IF-...)으로 수정 */}
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

            {/* 시도 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">시도</label>
              <input 
                type="text"
                name="ctpvNm"
                value={formData.ctpvNm}
                onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            {/* 시군구 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">시군구</label>
              <input 
                type="text"
                name="sggNm"
                value={formData.sggNm}
                onChange={handleChange}
                placeholder="예: 전주시 완산구"
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            {/* 도로명 주소 */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-500">도로명 주소 <span className="text-red-500">*</span></label>
              <input 
                type="text"
                name="roadNmAddr"
                value={formData.roadNmAddr}
                onChange={handleChange}
                placeholder="전북특별자치도 전주시..."
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* 시설면적 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">시설면적 (m²)</label>
              <input 
                type="number"
                name="fcltArea"
                value={formData.fcltArea}
                onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            {/* 수용 인원 - fcltCapacity로 필드명 변경 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">예측 수용 인원 (명)</label>
              <input 
                type="number"
                name="fcltCapacity" 
                value={formData.fcltCapacity}
                onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            {/* 개방여부 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">운영 여부</label>
              <select 
                name="opnYn"
                value={formData.opnYn}
                onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Y">운영중(개방)</option>
                <option value="N">미운영(미개방)</option>
              </select>
            </div>

            {/* 사용여부 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">사용자 노출 여부</label>
              <select 
                name="useYn"
                value={formData.useYn}
                onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Y">노출함</option>
                <option value="N">노출 안 함</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-12 border-t mt-12">
            <button 
              type="button"
              onClick={() => navigate('/admin/facility/facilityList')}
              className="px-8 h-12 border border-gray-400 text-gray-800 rounded-md font-medium hover:bg-gray-50 transition-all"
            >
              목록으로
            </button>
            <button 
              type="submit"
              className="px-12 h-12 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              시설 등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacilityAdd;