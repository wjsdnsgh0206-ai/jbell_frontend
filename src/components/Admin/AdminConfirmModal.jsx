import React from 'react';

const AdminConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'save' // 'save' 또는 'delete'
}) => {
  if (!isOpen) return null;

  // 타입에 따른 스타일 설정
  const isDelete = type === 'delete';
  const accentColor = isDelete ? 'bg-[#FF003E] hover:bg-[#D90035]' : 'bg-[#2563EB] hover:bg-[#1D4ED8]';
  const iconBg = isDelete ? 'bg-red-50' : 'bg-blue-50';
  const iconStroke = isDelete ? '#FF003E' : '#2563EB';

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* 배경 오버레이 (클릭 시 닫힘) */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* 모달 콘텐츠 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="p-8 text-center">
          {/* 아이콘 영역 */}
          <div className={`mx-auto w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mb-6`}>
            {isDelete ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconStroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconStroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            )}
          </div>

          <h3 className="text-[22px] font-bold text-[#111] mb-3 tracking-tight">
            {title}
          </h3>
          <div className="text-[#666] text-[15px] leading-relaxed mb-8 whitespace-pre-wrap">
            {message}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold text-[16px] transition-colors"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-4 ${accentColor} text-white rounded-xl font-bold text-[16px] shadow-lg shadow-opacity-20 transition-all active:scale-[0.98]`}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConfirmModal;