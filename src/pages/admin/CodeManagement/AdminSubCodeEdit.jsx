import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { AdminCommonCodeData } from './AdminCommonCodeData';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import { Calendar } from 'lucide-react';

// 아이콘 컴포넌트
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
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(''); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true);
  const [originalName, setOriginalName] = useState('');

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  
  const [currentGroupCode, setCurrentGroupCode] = useState('');

  const [formData, setFormData] = useState({
    parentGroupInfo: '', 
    subCodeId: '',
    subCodeName: '',
    desc: '',
    order: 1,
    regDate: '',
    modDate: ''
  });

  // 1. 데이터 초기 로딩 및 원본 저장
  useEffect(() => {
    const detailData = AdminCommonCodeData.find(item => String(item.id) === String(id));

    if (detailData) {
      setBreadcrumbTitle(detailData.subName); 
      setCurrentGroupCode(detailData.groupCode);

      const parentGroup = AdminCommonCodeData.find(
        item => item.groupCode === detailData.groupCode && item.subCode === '-'
      );

      const initialForm = {
        parentGroupInfo: parentGroup 
          ? `${parentGroup.groupCode} (${parentGroup.groupName})` 
          : `${detailData.groupCode} (${detailData.groupName})`,
        subCodeId: detailData.subCode,
        subCodeName: detailData.subName, 
        desc: detailData.desc || '',
        order: detailData.order || 1,
        regDate: detailData.date,
        modDate: detailData.editDate || detailData.date 
      };

      setFormData(initialForm);
      setOriginalData({ ...initialForm, visible: detailData.visible }); 
      setOriginalName(detailData.subName);
      setIsRegistered(detailData.visible);
    }
  }, [id, setBreadcrumbTitle]);

  // [변경] 변경 사항 감지 로직 (isDirty)
  const isDirty = useMemo(() => {
    if (!originalData) return false;
    return (
      formData.subCodeName !== originalData.subCodeName ||
      formData.desc !== originalData.desc ||
      formData.order !== originalData.order ||
      isRegistered !== originalData.visible
    );
  }, [formData, originalData, isRegistered]);

  // [변경] 뒤로가기 방지 핸들러
  const handlePopState = useCallback(() => {
    if (isDirty) {
      window.history.pushState(null, "", window.location.href);
      setIsCancelModalOpen(true);
    }
  }, [isDirty]);

  // [변경] 브라우저 뒤로가기 버튼 차단 및 해제
  useEffect(() => {
  // 1. 페이지 진입 시 가짜 히스토리 하나 쌓기 (뒤로가기 방어용)
  window.history.pushState(null, "", window.location.href);

  // 2. 뒤로가기 핸들러 등록
  window.addEventListener('popstate', handlePopState);
  
  // 3. 탭 닫기/새로고침 핸들러 등록
  const handleBeforeUnload = (e) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = ''; 
    }
  };
  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    // 페이지 나갈 때 모든 리스너 제거
    window.removeEventListener('popstate', handlePopState);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, [isDirty, handlePopState]); // isDirty가 바뀔 때마다 상태 최신화

  // 2. 취소 버튼 핸들러
const handleCancel = () => {
  if (isDirty) {
    setIsCancelModalOpen(true); 
  } else {
    // 변경 사항이 없으면 굳이 1초 기다릴 필요 없이 바로 상세 페이지로 보냅니다.
    navigate(`/admin/system/subCodeDetail/${id}`, { replace: true });
  }
};

  // 취소 확인 시
  const confirmCancel = () => {
    window.removeEventListener('popstate', handlePopState); // 리스너 제거 필수
    setIsCancelModalOpen(false);
    setToastMessage("수정이 취소되었습니다.");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate(`/admin/system/subCodeDetail/${id}`, { replace: true });
    }, 1000); 
  };

  // 중복 체크 로직
  const checkDuplicateName = useMemo(() => {
    const currentInputName = formData.subCodeName.trim();
    if (!currentInputName || currentInputName === originalName.trim()) return false;

    return AdminCommonCodeData.some(item => 
      item.groupCode === currentGroupCode && 
      item.subCode !== '-' && 
      String(item.id) !== String(id) && 
      item.subName.trim() === currentInputName
    );
  }, [formData.subCodeName, originalName, id, currentGroupCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "order") {
      const val = value.replace(/[^0-9]/g, "");
      let numVal = val === "" ? "" : parseInt(val);
      if (numVal !== "" && numVal < 1) numVal = 1;
      setFormData(prev => ({ ...prev, [name]: numVal }));
    } else if (name === "desc") {
      if (value.length <= 50) setFormData(prev => ({ ...prev, [name]: value }));
    } else if (name === "subCodeName") {
      if (value.length <= 20) setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    if (!formData.subCodeName.trim()) {
      alert("상세 코드명을 입력해주세요.");
      return;
    }
    if (checkDuplicateName) {
      alert("동일한 그룹 내에 이미 존재하는 상세 코드명입니다.");
      return;
    }
    setIsModalOpen(true);
  };

  // [변경] 저장 확인 로직 수정
  const handleConfirmSave = () => {
    setIsModalOpen(false);
    window.removeEventListener('popstate', handlePopState); // 리스너 제거

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const targetIndex = AdminCommonCodeData.findIndex(item => String(item.id) === String(id));
    if (targetIndex !== -1) {
      const finalName = formData.subCodeName.trim();
      AdminCommonCodeData[targetIndex] = {
        ...AdminCommonCodeData[targetIndex],
        subName: finalName,
        desc: formData.desc.trim(),
        order: formData.order,
        visible: isRegistered,
        editDate: formattedDate 
      };
      setBreadcrumbTitle(finalName);
    }

    setToastMessage("상세코드가 성공적으로 수정되었습니다.");
    setShowToast(true);
    
    // replace: true 옵션으로 상세 페이지로 이동
    setTimeout(() => {
      setShowToast(false);
      navigate(`/admin/system/subCodeDetail/${id}`, { replace: true });
    }, 1500);
  };

  if (!formData.subCodeId || !originalData) return null;

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
          <h3 className="text-[24px] font-extrabold mb-14 text-[#111] tracking-tight border-b-2 border-gray-100 pb-3">상세 코드 수정</h3>
          
          <div className="flex flex-col">
            <div className="mb-10 w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">그룹 코드</label>
              <input value={formData.parentGroupInfo} readOnly className="w-full bg-[#F3F4F7] border border-gray-200 rounded-lg px-5 py-4 text-[#666] cursor-not-allowed outline-none font-medium" />
              <p className="text-[13px] text-gray-400 mt-3 font-medium">* 그룹 코드는 수정할 수 없습니다.</p>
            </div>

            <div className="mb-10 w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">상세 코드 ID</label>
              <input value={formData.subCodeId} readOnly className="w-full bg-[#F3F4F7] border border-gray-200 rounded-lg px-5 py-4 text-[#666] cursor-not-allowed outline-none font-medium" />
              <p className="text-[13px] text-gray-400 mt-3 font-medium">* 상세 코드 ID는 수정할 수 없습니다.</p>
            </div>

            <div className="mb-10 w-full max-w-[500px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">상세 코드 명 (필수)</label>
              <input 
                name="subCodeName" 
                value={formData.subCodeName} 
                onChange={handleChange} 
                autoComplete="off"
                className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${checkDuplicateName ? 'border-[#E15141] ring-1 ring-red-50' : 'border-gray-300 focus:border-[#2563EB]'}`} 
              />
              <div className="flex justify-between mt-2">
                {checkDuplicateName ? (
                  <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium">
                    <ErrorIcon /> 이미 존재하는 상세 코드명입니다.
                  </div>
                ) : (
                  <p className="text-[13px] text-gray-400 font-medium">* 최대 20자까지 입력 가능</p>
                )}
                <span className="text-[12px] text-gray-400 font-medium">{formData.subCodeName.length} / 20</span>
              </div>
            </div>

            <div className="mb-10 w-full max-w-[600px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">상세 코드 설명</label>
              <textarea 
                name="desc" 
                value={formData.desc} 
                onChange={handleChange} 
                rows="2" 
                className="w-full bg-white border border-gray-300 rounded-lg px-5 py-4 text-[#111] outline-none focus:border-[#2563EB] resize-none leading-relaxed transition-all font-medium" 
                placeholder="코드 설명을 입력해주세요."
              />
              <div className="flex justify-end mt-2">
                <span className="text-[12px] text-gray-400 font-medium">{formData.desc.length} / 50</span>
              </div>
            </div>

            <div className="mb-10 w-full">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">순서</label>
              <input 
                name="order" 
                type="number" 
                min="1" 
                value={formData.order} 
                onChange={handleChange} 
                className="w-[100px] border border-gray-300 rounded-lg px-4 py-3 text-center outline-none focus:border-[#2563EB] font-medium" 
              />
              <p className="text-[13px] text-gray-400 mt-3 font-medium">* 숫자가 낮을수록 상위에 위치합니다.</p>
            </div>

            <div className="mb-10 flex items-center gap-5 pt-2">
              <label className="font-bold text-[16px] text-[#111]">사용 여부</label>
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsRegistered(!isRegistered)} 
                  className={`w-[54px] h-[28px] flex items-center rounded-full p-1 transition-all ${isRegistered ? 'bg-[#2563EB]' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${isRegistered ? 'translate-x-[26px]' : 'translate-x-0'}`} />
                </button>
                <span className={`text-[14px] font-bold ${isRegistered ? 'text-[#2563EB]' : 'text-gray-400'}`}>{isRegistered ? '사용' : '미사용'}</span>
              </div>
            </div>

            <div className="pt-10 border-t border-gray-100 flex flex-col space-y-8">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-gray-400">등록 일시</label>
                <div className="flex items-center gap-2 text-[#999] font-medium px-1">
                  <Calendar size={16} className="text-gray-300" /> 
                  {formData.regDate}
                </div>
                <p className="text-[12px] text-gray-400 mt-1 font-medium pl-1">* 등록 일시는 수정할 수 없습니다.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-gray-400">수정 일시</label>
                <div className="flex items-center gap-2 text-[#999] font-medium px-1">
                  <Calendar size={16} className="text-gray-300" /> 
                  {formData.modDate}
                </div>
                <p className="text-[12px] text-gray-400 mt-1 font-medium pl-1">* 수정 완료 시 최종 수정 일시가 자동으로 반영됩니다.</p>
              </div>
            </div>          
          </div> 
        </section>

        <div className="flex justify-end gap-2 mt-12 max-w-[1000px]">
          <button 
            type="button" 
            onClick={handleCancel}
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

      <AdminConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmSave} 
        title="상세코드 내용을 수정하시겠습니까?" 
        message="작성하신 내용이 즉시 저장됩니다." 
        type="save" 
      />
      <AdminConfirmModal 
  isOpen={isCancelModalOpen} 
  onClose={() => setIsCancelModalOpen(false)} 
  onConfirm={confirmCancel} 
  title="수정을 취소하시겠습니까?" 
        message="수정 중인 내용은 저장되지 않고 이전 페이지로 돌아갑니다." 
        type="delete" 
      />
    </div>
  );
};

export default AdminSubCodeEdit;