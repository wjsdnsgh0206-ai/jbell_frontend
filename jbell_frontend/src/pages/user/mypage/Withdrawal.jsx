import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 라우터 사용 시
import { AlertTriangle, Info, ShieldCheck, ArrowLeft, Check } from 'lucide-react';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';

const Withdrawal = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const [agreements, setAgreements] = useState({
    terms1: false,
    terms2: false,
  });

  const breadcrumbItems = [
        { label: "홈", path: "/", hasIcon: true },
        { label: "마이페이지", path: "/myProfile", hasIcon: false }, // 리스트로 이동 가능하게 path 추가
        { label: "회원탈퇴", path: "", hasIcon: false },
      ];

  const handleCheck = (e) => {
    const { name, checked } = e.target;
    setAgreements((prev) => ({ ...prev, [name]: checked }));
  };

  const isAllAgreed = agreements.terms1 && agreements.terms2;

  const handleWithdrawal = () => {
    if (isAllAgreed) {
      // 탈퇴 처리 로직 (API 호출 등)
      console.log("탈퇴 처리 시작");
      alert("탈퇴 처리가 완료되었습니다.");
      navigate('/'); // 탈퇴 후 메인으로 이동
    }
  };

  return (
    <>
    <PageBreadcrumb items={breadcrumbItems} />
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-8">
      <div className="bg-white w-full max-w-[600px] rounded-3xl overflow-hidden border border-slate-100">
        
        {/* 상단 헤더 / 뒤로가기 */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">이전으로</span>
          </button>
          <div className="bg-red-50 px-3 py-1 rounded-full">
             <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Account Termination</span>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="p-8 sm:p-10">
          <header className="mb-10">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-5">
              <AlertTriangle size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">정말 탈퇴하시겠어요?</h1>
            <p className="text-slate-500 leading-relaxed">
              탈퇴하시기 전 아래의 안내 사항을 반드시 확인해주세요.<br />
              한 번 삭제된 계정 정보는 다시 되돌릴 수 없습니다.
            </p>
          </header>

          <div className="space-y-8">
            {/* 안내 1 */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-900 text-white text-[12px] font-bold">1</span>
                <h2 className="text-lg font-bold text-slate-800">데이터 삭제 및 복구 불가</h2>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-4">
                <p className="text-[15px] leading-relaxed text-slate-600 break-keep">
                  회원 탈퇴 시 귀하의 계정에 귀속된 <span className="text-red-600 font-semibold underline underline-offset-4">모든 정보 및 이용 기록은 즉시 삭제</span>되며, 삭제된 데이터는 어떠한 경우에도 복구가 불가능합니다. 맞춤 알림 및 북마크 내역이 모두 소멸됩니다.
                </p>
              </div>
             <label className="group flex items-center gap-3 cursor-pointer select-none w-fit">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox"   
                    name="terms1"
                    checked={agreements.terms1}
                    onChange={handleCheck}
                    className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                  />
                  {/* 아이콘: 체크 여부에 따라 색상, 크기, 투명도 애니메이션 적용 */}
                  <Check 
                    size={16} 
                    className={`absolute transition-all pointer-events-none 
                      ${agreements.terms1
                        ? 'text-white scale-110 opacity-100' 
                        : 'text-transparent scale-50 opacity-0'
                      }`} 
                    strokeWidth={4} 
                  />
                </div>
                
                {/* 텍스트: 체크 시 blue-600으로 강조 */}
                <span className={`text-[15px] font-semibold transition-colors 
                  ${agreements.terms1
                    ? 'text-blue-600' 
                    : 'text-slate-700 group-hover:text-red-600'
                  }`}>
                  개인정보 보관 규정을 확인하였으며 동의합니다.
                </span>
              </label>
            </section>

            {/* 안내 2 */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-900 text-white text-[12px] font-bold">2</span>
                <h2 className="text-lg font-bold text-slate-800">법령에 따른 정보 보관</h2>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-4">
                <div className="flex gap-3">
                  <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[15px] leading-relaxed text-slate-600 break-keep">
                    전자상거래 등에서의 소비자보호에 관한 법률 등 관련 법령에 의해 보존할 필요가 있는 개인정보는 일정 기간 보관 후 파기됩니다. 이 정보는 오직 법적 보관 목적으로만 이용됩니다.
                  </p>
                </div>
              </div>
              <label className="group flex items-center gap-3 cursor-pointer select-none w-fit">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    name="terms2"
                    checked={agreements.terms2}
                    onChange={handleCheck}
                    className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                  />
                  {/* 아이콘: 체크 여부에 따라 색상, 크기, 투명도 애니메이션 적용 */}
                  <Check 
                    size={16} 
                    className={`absolute transition-all pointer-events-none 
                      ${agreements.terms2 
                        ? 'text-white scale-110 opacity-100' 
                        : 'text-transparent scale-50 opacity-0'
                      }`} 
                    strokeWidth={4} 
                  />
                </div>
                
                {/* 텍스트: 체크 시 blue-600으로 강조 */}
                <span className={`text-[15px] font-semibold transition-colors 
                  ${agreements.terms2 
                    ? 'text-blue-600' 
                    : 'text-slate-700 group-hover:text-red-600'
                  }`}>
                  개인정보 보관 규정을 확인하였으며 동의합니다.
                </span>
              </label>
            </section>
          </div>

          {/* 하단 버튼 세션 */}
          <div className="mt-12 flex flex-col gap-3">
            <button 
              onClick={handleWithdrawal}
              disabled={!isAllAgreed}
              className={`
                w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2
                ${isAllAgreed 
                  ? 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
              `}
            >
              <ShieldCheck size={20} />
              회원 탈퇴 확정하기
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="w-full py-4 bg-white text-slate-500 font-semibold text-base hover:text-slate-800 transition-colors"
            >
              다음에 할게요 (취소)
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Withdrawal;