import React, { useState } from 'react';
import { X, AlertTriangle, Info, ShieldCheck, ArrowRight } from 'lucide-react';

const WithdrawalModal = ({ isOpen, onClose }) => {
  const [agreements, setAgreements] = useState({
    terms1: false,
    terms2: false,
  });

  const handleCheck = (e) => {
    const { name, checked } = e.target;
    setAgreements((prev) => ({ ...prev, [name]: checked }));
  };

  // 모든 약관에 동의했는지 확인
  const isAllAgreed = agreements.terms1 && agreements.terms2;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[550px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={22} strokeWidth={2.5} />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">회원 탈퇴 안내</h1>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* 모달 콘텐츠 (스크롤 가능 영역) */}
        <div className="p-7 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          
          {/* 약관 1 */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold">1</span>
              <h2 className="text-base font-bold text-slate-800">데이터 삭제 및 복구 불가 안내</h2>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-3">
              <p className="text-sm leading-relaxed text-slate-600 break-keep">
                회원 탈퇴 시 귀하의 계정에 귀속된 <span className="text-red-600 font-semibold underline">모든 정보 및 이용 기록은 즉시 삭제</span>되며, 삭제된 데이터는 어떠한 경우에도 복구가 불가능합니다. 
                특히 맞춤형 정책 알림 설정 및 북마크 내역이 모두 소멸됩니다.
              </p>
            </div>
            <label className="group flex items-center gap-3 cursor-pointer select-none">
              <input 
                type="checkbox" 
                name="terms1"
                checked={agreements.terms1}
                onChange={handleCheck}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all"
              />
              <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">위 내용을 확인하였으며 동의합니다.</span>
            </label>
          </section>

          {/* 약관 2 */}
          <section className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold">2</span>
              <h2 className="text-base font-bold text-slate-800">법령에 따른 정보 보관 안내</h2>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-3">
              <div className="flex gap-3">
                <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed text-slate-600 break-keep">
                  탈퇴 후에도 관련 법령(전자상거래 등에서의 소비자보호에 관한 법률 등)에 의해 보존할 필요가 있는 개인정보는 법령에서 정한 기간 동안 보관된 후 파기됩니다. 
                  해당 정보는 오직 보관 목적으로만 사용됩니다.
                </p>
              </div>
            </div>
            <label className="group flex items-center gap-3 cursor-pointer select-none">
              <input 
                type="checkbox" 
                name="terms2"
                checked={agreements.terms2}
                onChange={handleCheck}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all"
              />
              <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">위 내용을 확인하였으며 동의합니다.</span>
            </label>
          </section>
        </div>

        {/* 모달 푸터 */}
        <div className="p-6 bg-slate-50 flex flex-col sm:flex-row justify-end gap-3 border-t border-slate-100">
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-[15px] hover:bg-slate-50 transition-colors order-2 sm:order-1"
          >
            취소
          </button>
          <button 
            disabled={!isAllAgreed}
            className={`
              px-8 py-3 rounded-xl font-bold text-[15px] transition-all flex items-center justify-center gap-2 order-1 sm:order-2
              ${isAllAgreed 
                ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-100 active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
            `}
          >
            <ShieldCheck size={18} />
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalModal;