import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { codeService } from '@/services/api'; 
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import { Calendar } from 'lucide-react';

const SuccessIcon = ({ fill = "#2563EB" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="8" fill={fill}/>
    <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ErrorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="8" fill="#E15141"/>
    <path d="M10 6L6 10M6 6L10 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AdminSubCodeEdit = () => {
  const { groupId, itemId } = useParams(); 
  const navigate = useNavigate();
  // context가 undefined일 경우를 대비한 안전한 접근
  const context = useOutletContext() || {}; 
  const setBreadcrumbTitle = context.setBreadcrumbTitle || (() => {});
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(''); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    groupCode: '',
    groupName: '', // 그룹명 추가
    subCodeId: '', 
    subCodeName: '', 
    desc: '', 
    order: 1, 
    createdAt: '', 
    updatedAt: ''
  });

  const [isRegistered, setIsRegistered] = useState(true);
  const [originalData, setOriginalData] = useState(null);

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '-';
    return dateTimeStr.replace('T', ' ').split('.')[0];
  };

  // 데이터 로드 및 필드 매핑
useEffect(() => {
  const fetchDetail = async () => {
    if (!groupId || !itemId) return;
    try {
      setIsLoading(true);
      // 백엔드 수정 후: 이제 이 호출 한 번으로 groupName까지 다 옵니다.
      const data = await codeService.getCodeItem(groupId, itemId);
      
      if (data) {
        const initialForm = {
          groupCode: data.groupCode,
          groupName: data.groupName, // ★ 서버에서 가져온 그룹명 사용
          subCodeId: data.subCode,
          subCodeName: data.subName,
          desc: data.desc,
          order: data.order,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        };
        setFormData(initialForm);
        setOriginalData({ ...initialForm, visible: data.visible });
        setIsRegistered(data.visible);
        setBreadcrumbTitle(data.subName);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };
  fetchDetail();
}, [groupId, itemId]);

  // 수정 여부 감지 (Dirty Check)
  const isDirty = useMemo(() => {
    if (!originalData) return false;
    return (
      formData.subCodeName !== originalData.subCodeName ||
      formData.desc !== originalData.desc ||
      formData.order !== originalData.order ||
      isRegistered !== originalData.visible
    );
  }, [formData, originalData, isRegistered]);

  const handlePopState = useCallback(() => {
    if (isDirty) {
      window.history.pushState(null, "", window.location.href);
      setIsCancelModalOpen(true);
    }
  }, [isDirty]);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handlePopState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "order") {
      const val = value.replace(/[^0-9]/g, "");
      setFormData(prev => ({ ...prev, [name]: val === "" ? "" : parseInt(val) }));
    } else if (name === "desc") {
      if (value.length <= 50) setFormData(prev => ({ ...prev, [name]: value }));
    } else if (name === "subCodeName") {
      if (value.length <= 20) setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    setIsSubmitted(true);
    if (!formData.subCodeName.trim()) return;
    setIsModalOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsModalOpen(false);
    try {
      const payload = {
        codeGroupId: groupId,
        codeItemId: itemId,
        codeItemName: formData.subCodeName.trim(),
        description: formData.desc.trim(),
        sortOrder: formData.order,
        visibleYn: isRegistered ? 'Y' : 'N'
      };

      await codeService.updateItem(groupId, itemId, payload);

      setToastMessage("상세코드가 성공적으로 수정되었습니다.");
      setShowToast(true);
      setTimeout(() => {
        navigate(`/admin/system/subCodeDetail/${groupId}/${itemId}`, { replace: true });
      }, 1500);
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const confirmCancel = () => {
    setIsCancelModalOpen(false);
    navigate(-1);
  };

  // 1. 로딩 중일 때 메시지 표시
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F8F9FB] min-h-screen">
        <p className="text-gray-500 font-bold">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 2. 데이터 로드가 끝났는데 formData가 비어있는 경우 (API 오류 등)
  if (!formData.groupCode) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F8F9FB] min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 font-bold mb-4">데이터를 찾을 수 없습니다.</p>
          <button onClick={() => navigate(-1)} className="text-blue-500 underline">뒤로 가기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            <SuccessIcon fill="#4ADE80" />
            <span className="font-bold text-[16px]">{toastMessage}</span>
          </div>
        </div>
      )}

      <main className="p-10 text-left">
        <h2 className="text-[32px] font-bold mt-2 mb-10 tracking-tight">공통 코드 관리</h2>
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] tracking-tight border-b-2 border-gray-100 pb-3">상세 코드 수정</h3>
          
          <div className="flex flex-col space-y-10">
            {/* 그룹 정보 영역 (상세페이지와 동일한 형식) */}
            <div className="w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드</label>
              <input 
                value={`${formData.groupCode} (${formData.groupName})`} 
                readOnly 
                className="w-full bg-[#F3F4F7] border border-gray-300 rounded-lg px-5 py-4 text-[#666] cursor-not-allowed outline-none font-medium" 
              />
            </div>

            {/* 상세 코드 ID 영역 */}
            <div className="w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">상세 코드 ID</label>
              <input 
                value={formData.subCodeId} 
                readOnly 
                className="w-full bg-[#F3F4F7] border border-gray-300 rounded-lg px-5 py-4 text-[#666] cursor-not-allowed outline-none font-medium" 
              />
            </div>

            {/* 수정 가능한 필드들... */}
            <div className="w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">상세 코드 명 (필수)</label>
              <input 
                name="subCodeName" value={formData.subCodeName} onChange={handleChange} autoComplete="off"
                placeholder="상세 코드 명을 입력하세요"
                className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${isSubmitted && !formData.subCodeName.trim() ? 'border-[#E15141] ring-1 ring-red-50' : 'border-gray-300 focus:border-[#2563EB]'}`} 
              />
              <div className="flex justify-between items-start mt-2">
                <div className="flex-1">
                  {isSubmitted && !formData.subCodeName.trim() ? (
                    <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium"><ErrorIcon /> 상세 코드명을 입력해주세요.</div>
                  ) : (
                    <p className="text-[13px] text-gray-400 font-medium">* 최대 20자까지 입력 가능</p>
                  )}
                </div>
                <span className="text-[12px] text-gray-400 font-medium ml-4 shrink-0">{formData.subCodeName?.length || 0} / 20</span>
              </div>
            </div>

            <div className="w-full max-w-[600px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">상세 코드 설명</label>
              <textarea name="desc" value={formData.desc} onChange={handleChange} rows="2" className="w-full bg-white border border-gray-300 rounded-lg px-5 py-4 text-[#111] outline-none focus:border-[#2563EB] resize-none leading-relaxed transition-all font-medium" placeholder="코드 설명을 입력해주세요." />
              <div className="flex justify-end mt-2"><span className="text-[12px] text-gray-400 font-medium">{formData.desc?.length || 0} / 50</span></div>
            </div>

            <div className="w-full">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">순서</label>
              <input name="order" type="number" min="1" value={formData.order} onChange={handleChange} className="w-[100px] border border-gray-300 rounded-lg px-4 py-3 text-center outline-none focus:border-[#2563EB] font-medium" />
            </div>

            <div className="flex items-center gap-5 pt-2">
              <label className="font-bold text-[16px] text-[#111]">사용 여부</label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setIsRegistered(!isRegistered)} className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-all ${isRegistered ? 'bg-[#2563EB]' : 'bg-gray-300'}`}>
                  <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${isRegistered ? 'translate-x-[26px]' : 'translate-x-0'}`} />
                </button>
                <span className={`text-[14px] font-bold ${isRegistered ? 'text-[#2563EB]' : 'text-gray-400'}`}>{isRegistered ? '사용' : '미사용'}</span>
              </div>
            </div>

            {/* 날짜 정보 영역 */}
            <div className="pt-10 border-t border-gray-100 flex flex-col space-y-8">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-gray-400">등록 일시</label>
                <div className="flex items-center gap-2 text-[#999] font-medium px-1"><Calendar size={16} className="text-gray-300" /> {formatDateTime(formData.createdAt)}</div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-gray-400">수정 일시</label>
                <div className="flex items-center gap-2 text-[#999] font-medium px-1"><Calendar size={16} className="text-gray-300" /> {formatDateTime(formData.updatedAt || formData.createdAt)}</div>
              </div>
            </div>          
          </div> 
        </section>

        <div className="flex justify-end gap-2 mt-12 max-w-[1000px]">
          <button type="button" onClick={() => navigate(-1)} className="px-8 py-3.5 border border-gray-300 bg-white text-gray-500 rounded-lg font-bold text-[16px] hover:bg-gray-50 transition-colors shadow-sm">취소</button>
          <button type="button" onClick={handleSave} className="px-8 py-3.5 bg-[#2563EB] text-white rounded-lg font-bold text-[16px] hover:bg-blue-700 shadow-md transition-colors">저장</button>
        </div>
      </main>

      <AdminConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmSave} title="상세코드 내용을 수정하시겠습니까?" message="작성하신 내용이 즉시 저장됩니다." type="save" />
      <AdminConfirmModal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} onConfirm={confirmCancel} title="수정을 취소하시겠습니까?" message="수정 중인 내용은 저장되지 않고 이전 페이지로 돌아갑니다." type="delete" />
    </div>
  );
};

export default AdminSubCodeEdit;