import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BreadCrumb from '@/components/admin/AdminBreadCrumb';
import { AdminCommonCodeData } from './AdminCommonCodeData';
import AdminCodeConfirmModal from './AdminCodeConfirmModal';

const ErrorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="8" fill="#E15141"/>
    <path d="M10 6L6 10M6 6L10 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AdminGroupCodeEdit = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [showToast, setShowToast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true);
  const [originalName, setOriginalName] = useState('');

  const [formData, setFormData] = useState({
    groupCodeId: '',
    groupName: '',
    desc: '',
    order: 1,
    regDate: '',
    modDate: ''
  });

  useEffect(() => {
    const detailData = AdminCommonCodeData.find(item => String(item.id) === String(id));
    if (detailData) {
      setFormData({
        groupCodeId: detailData.groupCode,
        groupName: detailData.groupName,
        desc: detailData.desc || '',
        order: detailData.order || 1,
        regDate: detailData.date,
        modDate: detailData.editDate || detailData.date 
      });
      setOriginalName(detailData.groupName);
      setIsRegistered(detailData.visible);
    }
  }, [id]);

  const checkDuplicateName = useMemo(() => {
    const currentInputName = formData.groupName.trim();
    if (!currentInputName || currentInputName === originalName.trim()) return false;
    return AdminCommonCodeData.some(item => String(item.id) !== String(id) && item.groupName.trim() === currentInputName);
  }, [formData.groupName, originalName, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "groupName") {
      if (value.length <= 20) setFormData(prev => ({ ...prev, [name]: value }));
    } else if (name === "order") {
      const val = value.replace(/[^0-9]/g, "");
      let numVal = val === "" ? "" : parseInt(val);
      if (numVal !== "" && numVal < 1) numVal = 1;
      setFormData(prev => ({ ...prev, [name]: numVal }));
    } else if (name === "desc") {
      if (value.length <= 50) setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    if (!formData.groupName.trim() || checkDuplicateName) {
      alert("그룹 코드 명을 확인해주세요.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmSave = () => {
    setIsModalOpen(false);
    const targetIndex = AdminCommonCodeData.findIndex(item => String(item.id) === String(id));
    if (targetIndex !== -1) {
      AdminCommonCodeData[targetIndex] = {
        ...AdminCommonCodeData[targetIndex],
        groupName: formData.groupName.trim(),
        desc: formData.desc.trim(),
        order: formData.order,
        visible: isRegistered,
        editDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
    }
    setShowToast(true);
    setTimeout(() => navigate('/admin/system/commonCodeList'), 1500);
  };

  return (
    <div className="relative flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      {/* 토스트 메시지 구역 */}
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform translate-y-0">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            <div className="bg-[#4ADE80] w-2 h-2 rounded-full animate-pulse"></div>
            <span className="font-bold text-[16px]">그룹코드가 성공적으로 수정되었습니다.</span>
          </div>
        </div>
      )}

      <main className="p-10 text-left">
        <BreadCrumb />
        <h2 className="text-[32px] font-bold mt-2 mb-10 tracking-tight text-left">공통 코드 관리</h2>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] tracking-tight border-b-2 border-gray-100 pb-3">그룹 코드 수정</h3>
          
          <div className="flex flex-col">
            {/* 1. 그룹 코드 ID (Read Only) */}
            <div className="mb-10 w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 ID</label>
              <input 
                value={formData.groupCodeId} 
                readOnly 
                className="w-full bg-[#F3F4F7] border border-gray-200 rounded-lg px-5 py-4 text-[#666] cursor-not-allowed outline-none font-medium" 
              />
              <p className="text-[13px] text-gray-400 mt-3 font-medium">* 그룹 코드 ID는 수정할 수 없습니다.</p>
            </div>

            {/* 2. 그룹 코드 명 (필수) */}
            <div className="mb-10 w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 명 (필수)</label>
              <input 
                name="groupName" 
                value={formData.groupName} 
                onChange={handleChange} 
                autoComplete="off"
                placeholder="예: 시스템 권한 코드" 
                className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${checkDuplicateName ? 'border-[#E15141] ring-1 ring-red-50' : 'border-gray-300 focus:border-[#2563EB]'}`} 
              />
              <div className="flex justify-between mt-2">
                {checkDuplicateName ? (
                  <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium">
                    <ErrorIcon /> 이미 존재하는 그룹명입니다.
                  </div>
                ) : (
                  <p className="text-[13px] text-gray-400 font-medium">* 최대 20자까지 입력 가능</p>
                )}
                <span className="text-[12px] text-gray-400 font-medium">{formData.groupName.length} / 20</span>
              </div>
            </div>

            {/* 3. 그룹 코드 설명 */}
            <div className="mb-10 w-full max-w-[600px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 설명</label>
              <textarea 
                name="desc" 
                value={formData.desc} 
                onChange={handleChange} 
                rows="2" 
                placeholder="예: 시스템 전반에 사용되는 권한 분류 그룹 코드입니다. (최대 50자)"
                className="w-full bg-white border border-gray-300 rounded-lg px-5 py-4 text-[#111] outline-none focus:border-[#2563EB] resize-none leading-relaxed transition-all font-medium" 
              />
              <div className="flex justify-end mt-2">
                <span className="text-[12px] text-gray-400 font-medium">{formData.desc.length} / 50</span>
              </div>
            </div>

            {/* 4. 순서 */}
            <div className="mb-10 w-full">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">순서</label>
              <input 
                type="number"
                name="order" 
                value={formData.order} 
                onChange={handleChange} 
                min="1"
                className="w-[100px] border border-gray-300 rounded-lg px-4 py-3 text-center outline-none focus:border-[#2563EB] font-medium" 
              />
              <p className="text-[13px] text-gray-400 mt-3 font-medium">* 숫자가 낮을수록 리스트 상단에 노출됩니다.</p>
            </div>

            {/* 5. 등록 여부 */}
            <div className="mb-10 flex items-center gap-5 pt-2">
              <label className="font-bold text-[16px] text-[#111]">노출 여부</label>
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsRegistered(!isRegistered)} 
                  className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-all duration-300 ${isRegistered ? 'bg-[#2563EB]' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${isRegistered ? 'translate-x-[26px]' : 'translate-x-0'}`} />
                </button>
                <span className={`text-[14px] font-bold ${isRegistered ? 'text-[#2563EB]' : 'text-gray-400'}`}>
                  {isRegistered ? '노출' : '미노출'}
                </span>
              </div>
            </div>

            {/* 6. 일시 정보 (구분선 추가) */}
            <div className="pt-10 border-t border-gray-100 flex flex-col">
              <div className="mb-10 w-full max-w-[500px]">
                <label className="block font-bold text-[16px] mb-3 text-[#111]">등록 일시</label>
                <input 
                  value={formData.regDate} 
                  readOnly 
                  className="w-full bg-[#F3F4F7] border border-gray-200 rounded-lg px-5 py-4 text-[#999] cursor-not-allowed font-medium outline-none" 
                />
                <p className="text-[13px] text-gray-400 mt-3 font-medium">* 등록 일시는 수정할 수 없습니다.</p>
              </div>
              
              <div className="w-full max-w-[500px]">
                <label className="block font-bold text-[16px] mb-3 text-[#111]">수정 일시</label>
                <input 
                  value={formData.modDate} 
                  readOnly 
                  className="w-full bg-[#F3F4F7] border border-gray-200 rounded-lg px-5 py-4 text-[#999] cursor-not-allowed font-medium outline-none" 
                />
                <p className="text-[13px] text-gray-400 mt-3 font-medium">* 수정 완료 후 최종 수정 일시가 자동으로 반영됩니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 하단 버튼 구역 */}
        <div className="flex justify-end gap-2 mt-12 max-w-[1000px]">
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="px-8 py-3.5 border border-gray-300 bg-white text-gray-500 rounded-lg font-bold text-[16px] hover:bg-gray-50 transition-colors shadow-sm"
          >
            취소
          </button>
          <button 
            type="button" 
            onClick={handleSave} 
            className="px-8 py-3.5 bg-[#2563EB] text-white rounded-lg font-bold text-[16px] hover:bg-blue-700 shadow-md transition-colors"
          >
            저장
          </button>
        </div>
      </main>

      <AdminCodeConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmSave} 
        title="그룹코드 내용을 수정하시겠습니까?" 
        message="작성하신 내용이 즉시 저장됩니다." 
        type="save" 
      />
    </div>
  );
};

export default AdminGroupCodeEdit;