import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';

const FacilityAdd = () => {
  const navigate = useNavigate();

  // 1. 백엔드 DTO 구조와 일치하는 초기 상태 설정
  const [formData, setFormData] = useState({
    fcltNm: '',        // 시설명
    fcltSeCd: '',      // 시설유형 코드
    ctpvNm: '',        // 시도
    sggNm: '',         // 시군구
    roadNmAddr: '',    // 도로명 주소
    fcltArea: 10,      // 시설면적
    rcvCapacity: 10,   // 예측수용가능 인원
    opnYn: 'Y',        // 개방여부 (운영중: Y, 미개방: N)
    useYn: 'Y'         // 사용여부 (노출중: Y, 미노출: N)
  });

  // 2. 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 3. 등록 버튼 클릭 (백엔드 연동)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("전송될 데이터:", formData);
    // API 연동 예시: await facilityService.addFacility(formData);
    alert("등록되었습니다.");
    navigate('/admin/facility/list');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10 font-sans text-gray-800">
      {/* 상단 헤더 */}
      <header className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">전주 시민공원 대피소</h1>
      </header>

      {/* 메인 폼 카드 */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold mb-8">기본정보</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 그리드 레이아웃 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            
            {/* 시설명 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">시설명</label>
              <input 
                type="text"
                name="fcltNm"
                value={formData.fcltNm}
                onChange={handleChange}
                placeholder="시설명 입력"
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {/* 시설유형 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">시설유형</label>
              <div className="relative">
                <select 
                  name="fcltSeCd"
                  value={formData.fcltSeCd}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg outline-none appearance-none bg-white focus:border-blue-500 cursor-pointer"
                >
                  <option value="">없음</option>
                  <option value="TYPE_01">공공기관</option>
                  <option value="TYPE_02">학교</option>
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
                placeholder="시도 입력"
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
                placeholder="시군구 입력"
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            {/* 도로명 주소 (전체 너비 사용 가능) */}
            <div className="flex flex-col gap-2 md:col-span-1">
              <label className="text-sm font-semibold text-gray-500">도로명 주소</label>
              <input 
                type="text"
                name="roadNmAddr"
                value={formData.roadNmAddr}
                onChange={handleChange}
                placeholder="주소 입력"
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div className="hidden md:block"></div> {/* 레이아웃 맞춤용 빈 칸 */}

            {/* 시설면적 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500 text-nowrap">시설면적(m²)</label>
              <input 
                type="number"
                name="fcltArea"
                value={formData.fcltArea}
                onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            {/* 예측수용가능 인원 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500 text-nowrap">예측수용가능 인원</label>
              <input 
                type="number"
                name="rcvCapacity"
                value={formData.rcvCapacity}
                onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            {/* 개방여부 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">개방여부</label>
              <div className="relative">
                <select 
                  name="opnYn"
                  value={formData.opnYn}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg outline-none appearance-none bg-white focus:border-blue-500 cursor-pointer"
                >
                  <option value="Y">운영중</option>
                  <option value="N">미운영</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            {/* 사용여부 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">사용여부</label>
              <div className="relative">
                <select 
                  name="useYn"
                  value={formData.useYn}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg outline-none appearance-none bg-white focus:border-blue-500 cursor-pointer"
                >
                  <option value="Y">노출중</option>
                  <option value="N">미노출</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

          </div>

          {/* 하단 버튼 그룹 */}
          <div className="flex justify-end gap-3 pt-20">
            <button 
              type="button"
              onClick={() => navigate('/admin/facility/list')}
              className="px-10 h-12 border border-gray-400 text-gray-800 rounded-md font-medium hover:bg-gray-50 transition-all"
            >
              목록으로 이동
            </button>
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="px-10 h-12 border border-gray-400 text-gray-800 rounded-md font-medium hover:bg-gray-50 transition-all"
            >
              취소
            </button>
            <button 
              type="submit"
              className="px-10 h-12 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-all shadow-sm"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacilityAdd;