import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
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

const AdminGroupCodeEdit = () => {
  const { id } = useParams(); 
  const { setBreadcrumbTitle } = useOutletContext();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({ groupName: false });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(''); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true);
  const [originalName, setOriginalName] = useState('');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); 
  const [originalData, setOriginalData] = useState(null); 
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    groupCode: '',
    groupName: '',
    desc: '',
    order: 1,
    createdAt: '',
    updatedAt: ''
  });

  // [추가] 날짜 포맷 함수
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '-';
    return dateTimeStr.replace('T', ' ');
  };

// 데이터 로드 (DB 연동)
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`/api/common/code/groups/${id}`);
        const data = response.data;
        const initialForm = {
          groupCode: data.groupCode,
          groupName: data.groupName,
          desc: data.desc || '',
          order: data.order || 1,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        };
        setFormData(initialForm);
        setOriginalData({ ...initialForm, visible: data.visible });
        setOriginalName(data.groupName);
        setIsRegistered(data.visible);
        setBreadcrumbTitle(data.groupName);
      } catch (error) {
        console.error("로드 실패:", error);
      }
    };
    fetchDetail();
  }, [id, setBreadcrumbTitle]);

  // 변경 사항 체크 (더티 체크)
  const isDirty = useMemo(() => {
    if (!originalData) return false;
    return (
      formData.groupName !== originalData.groupName ||
      formData.desc !== originalData.desc ||
      formData.order !== originalData.order ||
      isRegistered !== originalData.visible
    );
  }, [formData, originalData, isRegistered]);

  // 중복 체크 로직 개선
  // [수정] 기존 로직을 아래로 교체
const checkDuplicateName = useMemo(() => {
  const currentInputName = formData.groupName.trim();
  
  // 입력값이 없거나 기존 이름과 똑같으면 중복 아님
  if (!currentInputName || currentInputName === originalName.trim()) return false;

  // 실 서버 연동 시에는 서버 저장 시 에러 처리를 하거나 중복체크 API를 사용합니다.
  // 에러 방지를 위해 일단 false를 반환하게 둡니다.
  return false; 
}, [formData.groupName, originalName]);

  // 브라우저 뒤로가기 방지
  const handlePopState = useCallback(() => {
    if (isDirty) {
      window.history.pushState(null, "", window.location.href);
      setIsCancelModalOpen(true);
    }
  }, [isDirty]);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.addEventListener('popstate', handlePopState);
    const handleBeforeUnload = (e) => {
      if (isDirty) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, handlePopState]);

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
    setIsSubmitted(true);
    const isGroupNameEmpty = !formData.groupName.trim();
    
    setErrors({ groupName: isGroupNameEmpty });

    // 1. 필수값 체크 (Alert 노출)
    if (isGroupNameEmpty) {
      alert("필수 입력 사항을 모두 작성해주세요.");
      return;
    }

    // 2. 중복 체크 (Alert 없이 중단 -> UI 하단에 메시지 노출)
    if (checkDuplicateName) {
      return;
    }
    
    setIsModalOpen(true);
  };

  const handleConfirmSave = async () => {
  setIsModalOpen(false);
  try {
    await axios.put(`/api/common/code/groups/${id}`, {
      groupCode: formData.groupCode,
      groupName: formData.groupName.trim(),
      desc: formData.desc.trim(),
      order: formData.order,
      visible: isRegistered
    });

    window.removeEventListener('popstate', handlePopState);
    setToastMessage("그룹코드가 성공적으로 수정되었습니다.");
    setShowToast(true);
    setTimeout(() => {
      navigate(`/admin/system/groupCodeDetail/${id}`, { replace: true });
    }, 1500);
  } catch (error) {
    console.error("저장 실패:", error);
    alert("저장 중 오류가 발생했습니다.");
  }
};

  const handleCancel = () => {
    if (isDirty) setIsCancelModalOpen(true);
    else confirmCancel();
  };

  const confirmCancel = () => {
    setIsCancelModalOpen(false);
    setToastMessage("수정이 취소되었습니다.");
    setShowToast(true);
    window.removeEventListener('popstate', handlePopState);
    setTimeout(() => {
      navigate(`/admin/system/groupCodeDetail/${id}`, { replace: true });
    }, 500);
  };

  if (!originalData) return null;

  return (
    <div className="relative flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            {!toastMessage.includes("취소") && <SuccessIcon fill="#4ADE80" />}
            <span className="font-bold text-[16px]">{toastMessage}</span>
          </div>
        </div>
      )}

      <main className="p-10 text-left">
        <h2 className="text-[32px] font-bold mt-2 mb-10 tracking-tight text-left">공통 코드 관리</h2>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-14 w-full max-w-[1000px]">
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] tracking-tight border-b-2 border-gray-100 pb-3">그룹 코드 수정</h3>
          
          <div className="flex flex-col space-y-10">
            {/* 그룹 코드 ID (Read Only) */}
            <div className="w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 ID</label>
              <input value={formData.groupCode} readOnly className="w-full bg-[#F3F4F7] border border-gray-200 rounded-lg px-5 py-4 text-[#666] cursor-not-allowed outline-none font-medium" />
              <p className="text-[13px] text-gray-400 mt-3 font-medium">* 그룹 코드 ID는 수정할 수 없습니다.</p>
            </div>

            {/* 그룹 코드 명 (필수) */}
            <div className="w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 명 (필수)</label>
              <input 
                name="groupName" 
                value={formData.groupName} 
                onChange={handleChange} 
                autoComplete="off"
                placeholder="그룹 코드 명을 입력하세요"
                className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${
                  errors.groupName || checkDuplicateName 
                    ? 'border-[#E15141] ring-1 ring-red-50' 
                    : 'border-gray-300 focus:border-[#2563EB]'
                }`} 
              />
              <div className="flex justify-between items-start mt-2">
                <div className="flex-1 min-h-[20px]">
                  {checkDuplicateName ? (
                    <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium">
                      <ErrorIcon /> 이미 존재하는 그룹명입니다.
                    </div>
                  ) : errors.groupName ? (
                    <div className="flex items-center gap-2 text-[#E15141] text-[13px] font-medium">
                      <ErrorIcon /> <span>그룹 코드 명을 입력해주세요.</span>
                    </div>
                  ) : (
                    <p className="text-[13px] text-gray-400 font-medium">* 최대 20자까지 입력 가능</p>
                  )}
                </div>
                <span className="text-[12px] text-gray-400 font-medium ml-4 shrink-0">
                  {formData.groupName.length} / 20
                </span>
              </div>
            </div>

            {/* 나머지 입력 필드들 */}
            <div className="w-full max-w-[600px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드 설명</label>
              <textarea name="desc" value={formData.desc} onChange={handleChange} rows="2" className="w-full bg-white border border-gray-300 rounded-lg px-5 py-4 text-[#111] outline-none focus:border-[#2563EB] resize-none leading-relaxed transition-all font-medium" />
              <div className="flex justify-end mt-2"><span className="text-[12px] text-gray-400 font-medium">{formData.desc.length} / 50</span></div>
            </div>

            <div className="w-full">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">순서</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange} min="1" className="w-[100px] border border-gray-300 rounded-lg px-4 py-3 text-center outline-none focus:border-[#2563EB] font-medium" />
            </div>

            <div className="flex items-center gap-5 pt-2">
              <label className="font-bold text-[16px] text-[#111]">사용 여부</label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setIsRegistered(!isRegistered)} className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-all duration-300 ${isRegistered ? 'bg-[#2563EB]' : 'bg-gray-300'}`}>
                  <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${isRegistered ? 'translate-x-[26px]' : 'translate-x-0'}`} />
                </button>
                <span className={`text-[14px] font-bold ${isRegistered ? 'text-[#2563EB]' : 'text-gray-400'}`}>{isRegistered ? '사용' : '미사용'}</span>
              </div>
            </div>

            {/* 등록/수정 정보 */}
            <div className="pt-10 border-t border-gray-100 flex flex-col space-y-8">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-gray-400">등록 일시</label>
                <div className="flex items-center gap-2 text-[#999] font-medium px-1">
                  <Calendar size={16} className="text-gray-300" /> 
                  {/* regDate 대신 formatDateTime(formData.createdAt) 사용 */}
                  {formatDateTime(formData.createdAt)}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-gray-400">수정 일시</label>
                <div className="flex items-center gap-2 text-[#999] font-medium px-1">
                  <Calendar size={16} className="text-gray-300" /> 
                  {/* modDate 대신 formatDateTime(formData.updatedAt || formData.createdAt) 사용 */}
                  {formatDateTime(formData.updatedAt || formData.createdAt)}
                </div>
              </div>
            </div>
          </div>  
        </section>

        <div className="flex justify-end gap-2 mt-12 max-w-[1000px]">
          <button type="button" onClick={handleCancel} className="px-8 py-3.5 border border-gray-300 bg-white text-gray-500 rounded-lg font-bold text-[16px] hover:bg-gray-50 transition-colors shadow-sm">취소</button>
          <button type="button" onClick={handleSave} className="px-8 py-3.5 bg-[#2563EB] text-white rounded-lg font-bold text-[16px] hover:bg-blue-700 shadow-md transition-colors">저장</button>
        </div>
      </main>

      <AdminConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmSave} title="그룹코드 내용을 수정하시겠습니까?" message="작성하신 내용이 즉시 저장됩니다." type="save" />
      <AdminConfirmModal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} onConfirm={confirmCancel} title="수정을 취소하시겠습니까?" message="수정 중인 내용은 저장되지 않고 이전 페이지로 돌아갑니다." type="delete" />
    </div>
  );
};

export default AdminGroupCodeEdit;