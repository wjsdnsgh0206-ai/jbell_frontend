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

  // [추가] 중복 상태 및 원본 명칭 관리
  const [isNameDuplicate, setIsNameDuplicate] = useState(false);
  const [originalName, setOriginalName] = useState('');

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
        const data = await codeService.getCodeItem(groupId, itemId);
        
        if (data) {
          const initialForm = {
            groupCode: data.groupCode,
            groupName: data.groupName,
            subCodeId: data.subCode,
            subCodeName: data.subName,
            desc: data.desc,
            order: data.order,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          };
          setFormData(initialForm);
          setOriginalData({ ...initialForm, visible: data.visible });
          setOriginalName(data.subName); // 원본 명칭 저장
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

  // [추가] 상세 코드 명 중복 체크 useEffect
  useEffect(() => {
    const checkSubName = async () => {
      const name = formData.subCodeName.trim();
      
      // 입력값이 없거나 기존 이름과 같다면 체크 안함
      if (!name || name === originalName.trim()) {
        setIsNameDuplicate(false);
        return;
      }

      try {
        // 서버의 checkSubDup API 호출 (groupCode, subCode, subName 전달)
        const res = await codeService.checkSubDup({ 
          groupCode: groupId,
          subCode: itemId,
          subName: name 
        });
        const data = res.data || res;
        setIsNameDuplicate(!!data.isNameDup);
      } catch (e) {
        console.error("상세코드 중복 체크 실패", e);
      }
    };

    const timer = setTimeout(checkSubName, 400);
    return () => clearTimeout(timer);
  }, [formData.subCodeName, originalName, groupId, itemId]);

  // [추가] 중복 UI 판정 변수
  const isNameInvalid = useMemo(() => {
    const currentName = formData.subCodeName.trim();
    if (!currentName || currentName === originalName.trim()) return false;
    return isNameDuplicate;
  }, [formData.subCodeName, originalName, isNameDuplicate]);

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

    // 순서(order)는 현재 백엔드 미구현으로 수정을 막아두었으므로 로직에서 제외하거나 
    // 나중에 구현 시 아래 주석을 해제하여 사용하세요.
    /*
    if (name === "order") {
      const val = value.replace(/[^0-9]/g, "");
      let numVal = val === "" ? "" : parseInt(val);
      if (numVal !== "" && numVal < 1) numVal = 1;
      setFormData(prev => ({ ...prev, [name]: numVal }));
    } 
    */

    const { name, value } = e.target;
    
    if (name === "subCodeName") {
      // 상세 코드 명: 100자 제한
      if (value.length <= 100) setFormData(prev => ({ ...prev, [name]: value }));
    } else if (name === "desc") {
      // 상세 코드 설명: 200자 제한
      if (value.length <= 200) setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // 취소 버튼 클릭 핸들러 추가
const handleCancelClick = () => {
  if (isDirty) {
    // 수정된 내용이 있으면 확인 모달 오픈
    setIsCancelModalOpen(true);
  } else {
    // 수정된 내용이 없으면 즉시 이전 페이지(상세)로 이동
    navigate(`/admin/system/subCodeDetail/${groupId}/${itemId}`, { replace: true });
  }
};

  const handleSave = () => {
    setIsSubmitted(true);
    if (!formData.subCodeName.trim() || isNameDuplicate) {
      return; 
    }
    setIsModalOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsModalOpen(false);
    try {
      // 등록(AddItem) API와 필드명을 동일하게 맞추는 것이 핵심입니다.
      const payload = {
        groupCode: groupId,      // URL 파라미터에서 온 값
        subCode: itemId,        // URL 파라미터에서 온 값
        subName: formData.subCodeName.trim(),
        desc: formData.desc.trim(),
        order: Number(formData.order) || 1,
        visible: isRegistered   // Add 페이지처럼 boolean 값으로 전송
      };

      // API 호출
      await codeService.updateItem(groupId, itemId, payload);

      setToastMessage("상세코드가 성공적으로 수정되었습니다.");
      setShowToast(true);
      
      // 이동하기 전 팝스테이트 이벤트 리스너 제거 (이탈 방지 방해 금지)
      window.removeEventListener('popstate', handlePopState);

      setTimeout(() => {
        // 상세 페이지로 이동 (replace: true로 뒤로가기 시 수정페이지 진입 방지)
        navigate(`/admin/system/subCodeDetail/${groupId}/${itemId}`, { replace: true });
      }, 1500);
    } catch (error) {
      console.error("수정 실패:", error);
      const serverMsg = error.response?.data?.message || "저장 중 오류가 발생했습니다.";
      setToastMessage(`오류: ${serverMsg}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

 // [추가] 토스트 트리거 함수 (코드의 일관성을 위해 추가)
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const confirmCancel = () => {
    // 1. 모달 닫기
    setIsCancelModalOpen(false);
    
    // 2. 취소 토스트 메시지 설정 및 표시
    setToastMessage("수정이 취소되었습니다.");
    setShowToast(true);
    
    // 3. 이탈 방지 리스너 즉시 제거
    window.removeEventListener('popstate', handlePopState);
    
    // 4. 토스트를 보여줄 시간을 준 뒤 상세 페이지로 이동
    setTimeout(() => {
      navigate(`/admin/system/subCodeDetail/${groupId}/${itemId}`, { replace: true });
    }, 800); // 0.8초 정도 토스트 노출 후 이동
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
            {/* 메시지에 '취소'가 포함되지 않았을 때만 체크 아이콘 표시 (그룹수정 페이지와 동일 로직) */}
            {!toastMessage.includes("취소") && <SuccessIcon fill="#4ADE80" />}
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
        name="subCodeName" 
        value={formData.subCodeName} 
        onChange={handleChange} 
        autoComplete="off"
        placeholder="상세 코드 명을 입력하세요"
        className={`w-full border rounded-lg px-5 py-4 outline-none transition-all font-medium ${
          (isSubmitted && !formData.subCodeName.trim()) || isNameInvalid
            ? 'border-[#E15141] ring-1 ring-red-50' 
            : 'border-gray-300 focus:border-[#2563EB]'
        }`} 
      />
      <div className="flex justify-between items-start mt-2">
        <div className="flex-1 min-h-[20px]">
          {isNameInvalid ? (
            <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium">
              <ErrorIcon /> 이미 존재하는 상세 코드명입니다.
            </div>
          ) : (isSubmitted && !formData.subCodeName.trim()) ? (
            <div className="text-[#E15141] text-sm flex items-center gap-2 font-medium">
              <ErrorIcon /> 상세 코드명을 입력해주세요.
            </div>
          ) : (formData.subCodeName.trim() !== "" && formData.subCodeName.trim() !== originalName.trim()) ? (
            <div className="text-[#2563EB] text-sm flex items-center gap-2 font-medium">
              <SuccessIcon /> 사용 가능한 상세 코드명입니다.
            </div>
          ) : (
            <p className="text-[13px] text-gray-400 font-medium">* 최대 100자까지 입력 가능</p>
          )}
        </div>
        <span className="text-[12px] text-gray-400 font-medium ml-4 shrink-0">
          {formData.subCodeName?.length || 0} / 100
        </span>
      </div>
    </div>

            <div className="w-full max-w-[600px]">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">상세 코드 설명</label>
              <textarea name="desc" value={formData.desc} onChange={handleChange} rows="2" className="w-full bg-white border border-gray-300 rounded-lg px-5 py-4 text-[#111] outline-none focus:border-[#2563EB] resize-none leading-relaxed transition-all font-medium" placeholder="코드 설명을 입력해주세요." />
              <div className="flex justify-end mt-2"><span className="text-[12px] text-gray-400 font-medium">{formData.desc?.length || 0} / 200</span></div>
            </div>
            {/*  상세 코드 순서 영역 아직 구현 X  @@*/}
            <div className="w-full">
              <label className="block font-bold text-[16px] mb-3 text-[#111]">순서</label>
              <input 
                name="order" 
                type="number" 
                value={formData.order} 
                readOnly // 읽기 전용 추가
                className="w-[100px] bg-[#F3F4F7] border border-gray-300 rounded-lg px-4 py-3 text-center text-[#666] cursor-not-allowed outline-none font-medium" 
                title="순서는 등록 시 자동으로 할당되며, 수정 페이지에서는 변경할 수 없습니다."
              />
              <p className="text-[12px] text-gray-400 mt-2 font-medium">* 순서는 등록 시 자동으로 할당되며, 수정 페이지에서는 변경할 수 없습니다.</p>
              <p className="text-[13px] text-gray-400 font-medium">* 숫자가 낮을수록 리스트 상단에 노출됩니다.</p>
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

        {/* 하단 버튼 구역 수정 */}
        <div className="flex justify-end gap-2 mt-12 max-w-[1000px]">
          <button 
            type="button" 
            onClick={handleCancelClick}
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

      <AdminConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmSave} title="상세코드 내용을 수정하시겠습니까?" message="작성하신 내용이 즉시 저장됩니다." type="save" />
      <AdminConfirmModal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} onConfirm={confirmCancel} title="수정을 취소하시겠습니까?" message="수정 중인 내용은 저장되지 않고 이전 페이지로 돌아갑니다." type="delete" />
    </div>
  );
};

export default AdminSubCodeEdit;