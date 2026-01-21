import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { facilityService } from '@/services/api'; 

const FacilityUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 시설 ID 추출 (예: /admin/facility/edit/3581)

  // 1. 초기 상태 (백엔드 필드명과 일치)
  const [formData, setFormData] = useState({
    fcltId: '',
    fcltNm: '',
    fcltSeCd: '',
    ctpvNm: '',
    sggNm: '',
    roadNmAddr: '',
    fcltArea: 0,
    rcvCapacity: 0,
    opnYn: 'Y',
    useYn: 'Y'
  });
  const [isLoading, setIsLoading] = useState(true);

  // 2. 기존 데이터 로드 (컴포넌트 마운트 시 실행)
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // 상세 조회 API 호출 (예: GET /api/facility/3581)
        const response = await facilityService.getFacilityDetail(id);
        if (response) {
          setFormData(response); // 서버 데이터로 폼 채우기
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert("정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // 3. 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 4. 업데이트 제출 (백엔드 연동)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 수정 API 호출 (예: PUT /api/facility/update)
      await facilityService.updateFacility(formData);
      alert("수정이 완료되었습니다.");
      navigate(`/admin/facility/list`);
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) return <div className="p-10 text-center">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-10 font-sans text-gray-800">
      <header className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">{formData.fcltNm} 수정</h1>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold mb-8">상세 정보 수정</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            
            {/* 시설명 (수정 불가 처리하고 싶으면 disabled 추가) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">시설명</label>
              <input 
                type="text" name="fcltNm" value={formData.fcltNm} onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-admin-primary transition-all"
              />
            </div>

            {/* 시설유형 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">시설유형</label>
              <div className="relative">
                <select 
                  name="fcltSeCd" value={formData.fcltSeCd} onChange={handleChange}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg outline-none appearance-none bg-white focus:border-admin-primary cursor-pointer"
                >
                  <option value="DSSP-IF-10942">DSSP-IF-10942</option>
                  <option value="DSSP-IF-10943">DSSP-IF-10943</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            {/* 시도 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">시도</label>
              <input 
                type="text" name="ctpvNm" value={formData.ctpvNm} onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-admin-primary"
              />
            </div>

            {/* 시군구 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">시군구</label>
              <input 
                type="text" name="sggNm" value={formData.sggNm} onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-admin-primary"
              />
            </div>

            {/* 도로명 주소 */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-500">도로명 주소</label>
              <input 
                type="text" name="roadNmAddr" value={formData.roadNmAddr} onChange={handleChange}
                className="h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-admin-primary"
              />
            </div>

            {/* 사용 여부 (노출 여부) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">노출여부 (useYn)</label>
              <div className="relative">
                <select 
                  name="useYn" value={formData.useYn} onChange={handleChange}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg outline-none appearance-none bg-white focus:border-admin-primary cursor-pointer"
                >
                  <option value="Y">노출중</option>
                  <option value="N">미노출</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

          </div>

          {/* 하단 버튼 그룹 */}
          <div className="flex justify-end gap-3 pt-10">
            <button 
              type="button" onClick={() => navigate(-1)}
              className="px-10 h-12 border border-gray-400 text-gray-800 rounded-md font-medium hover:bg-gray-50 transition-all"
            >
              취소
            </button>
            <button 
              type="submit"
              className="px-10 h-12 bg-admin-primary text-white rounded-md font-medium hover:bg-opacity-90 transition-all shadow-sm"
            >
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacilityUpdate;




// import React, { useState } from 'react';

// const FacilityForm = ({ initialData, isEdit = false }) => {
//   // 백엔드 필드명과 일치시키면 연동이 매우 쉽습니다.
//   const [formData, setFormData] = useState(initialData || {
//     fcltNm: "",
//     fcltSeCd: "",
//     ctpvNm: "",
//     sggNm: "",
//     roadNmAddr: "",
//     fcltArea: "10",
//     rcptnPsncnt: "10",
//     opnYn: "Y",
//     useYn: "Y"
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = () => {
//     console.log("백엔드로 전송할 데이터:", formData);
//     // axios.post('/api/facility', formData) 등의 로직 수행
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
//       <div className="flex items-center mb-6">
//         <button className="mr-4 text-2xl">←</button>
//         <h1 className="text-2xl font-bold">{formData.fcltNm || "전주 시민공원 대피소"}</h1>
//       </div>

//       <div className="bg-white p-10 rounded-xl border border-gray-200 shadow-sm">
//         <h2 className="text-lg font-bold mb-8">기본정보</h2>
        
//         <div className="grid grid-cols-2 gap-x-6 gap-y-8">
//           <InputItem label="시설명" name="fcltNm" value={formData.fcltNm} onChange={handleChange} placeholder="시설명 입력" />
//           <SelectItem 
//             label="시설유형" 
//             name="fcltSeCd" 
//             value={formData.fcltSeCd} 
//             onChange={handleChange} 
//             options={[{val: "", label: "없음"}, {val: "SHELTER", label: "민방위대피소"}]} 
//           />
//           <InputItem label="시도" name="ctpvNm" value={formData.ctpvNm} onChange={handleChange} placeholder="시도 입력" />
//           <InputItem label="시군구" name="sggNm" value={formData.sggNm} onChange={handleChange} placeholder="시군구 입력" />
          
//           <div className="col-span-1">
//             <InputItem label="도로명 주소" name="roadNmAddr" value={formData.roadNmAddr} onChange={handleChange} placeholder="주소 입력" />
//           </div>

//           <div className="col-start-1 grid grid-cols-2 gap-6">
//              <InputItem label="시설면적(m²)" name="fcltArea" type="number" value={formData.fcltArea} onChange={handleChange} />
//              <InputItem label="예측수용가능 인원" name="rcptnPsncnt" type="number" value={formData.rcptnPsncnt} onChange={handleChange} />
//           </div>

//           <div className="col-start-1 grid grid-cols-2 gap-6">
//             <SelectItem 
//               label="개방여부" 
//               name="opnYn" 
//               value={formData.opnYn} 
//               onChange={handleChange} 
//               options={[{val: "Y", label: "운영중"}, {val: "N", label: "미운영"}]} 
//             />
//             <SelectItem 
//               label="사용여부" 
//               name="useYn" 
//               value={formData.useYn} 
//               onChange={handleChange} 
//               options={[{val: "Y", label: "노출중"}, {val: "N", label: "노출안함"}]} 
//             />
//           </div>
//         </div>
//       </div>

//       {/* 하단 버튼 바 */}
//       <div className="flex justify-center gap-4 mt-10">
//         <button className="px-12 py-3 border border-gray-400 rounded-lg font-medium hover:bg-gray-100 transition">목록으로 이동</button>
//         <button className="px-12 py-3 border border-gray-400 rounded-lg font-medium hover:bg-gray-100 transition">취소</button>
//         <button 
//           onClick={handleSubmit}
//           className="px-12 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
//         >
//           {isEdit ? "수정 완료" : "등록"}
//         </button>
//       </div>
//     </div>
//   );
// };

// // 입력창 컴포넌트
// const InputItem = ({ label, name, value, onChange, placeholder, type = "text" }) => (
//   <div className="flex flex-col">
//     <label className="text-gray-500 text-sm mb-2 ml-1">{label}</label>
//     <input 
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//     />
//   </div>
// );

// // 셀렉트 박스 컴포넌트
// const SelectItem = ({ label, name, value, onChange, options }) => (
//   <div className="flex flex-col">
//     <label className="text-gray-500 text-sm mb-2 ml-1">{label}</label>
//     <select 
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none"
//       style={{backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em'}}
//     >
//       {options.map(opt => (
//         <option key={opt.val} value={opt.val}>{opt.label}</option>
//       ))}
//     </select>
//   </div>
// );

// export default FacilityForm;