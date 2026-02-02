import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Calendar, Building2 } from 'lucide-react';
import PageTabs from '@/components/shared/PageTabs'; 
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import { safetyPolicyService } from '@/services/api'; 

const SafetyPolicyList = () => {
  const [policies, setPolicies] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // 아코디언 상태 관리 (클릭한 항목의 ID 저장)
  const [expandedId, setExpandedId] = useState(null);

  // 1. 브레드크럼 정의
  const breadcrumbItems = [
    { label: '홈', path: '/', hasIcon: true },
    { label: '안전 가이드', path: null }, 
    { label: '주요 안전정책', path: null } 
  ];

  // 2. 탭 메뉴 정의 (확장성을 위해 구성)
  const tabs = [
    { label: '주요 안전정책', active: true, onClick: () => {} }, // 현재 페이지
    // { label: '재난 행동요령', active: false, onClick: () => navigate('/safety/behavior') } // 예시
  ];

  useEffect(() => {
    fetchPolicies();
  }, [page]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const params = { page: page, size: 10, visibleYn: 'Y' };
      const res = await safetyPolicyService.getSafetyPolicyList(params);
      
      if (res && res.data) {
        // 더보기 방식일 경우 기존 데이터에 누적
        if (page === 1) {
            setPolicies(res.data.list);
        } else {
            setPolicies(prev => [...prev, ...res.data.list]);
        }
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error("정책 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // HTML 태그 제거 헬퍼 (요약본 표시용)
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // 토글 핸들러
  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col items-center w-full pb-20 px-4 lg:px-0 max-w-screen-xl mx-auto">
      
      {/* 1. 상단 브레드크럼 */}
      <PageBreadcrumb items={breadcrumbItems} />

      <header className="flex flex-col w-full gap-8 lg:gap-10 mb-10">
        {/* 타이틀 영역 */}
        <div className="flex flex-col gap-4 border-b border-graygray-20 pb-6">
          <h1 className="text-heading-xl text-graygray-90">주요 안전정책</h1>
          <p className="text-body-m text-graygray-60">
            전북특별자치도의 주요 재난 안전 정책과 제도 정보를 안내해 드립니다.
          </p>
        </div>

        {/* 2. 탭 네비게이션 */}
        <PageTabs 
            tabs={tabs} 
            activeTab={0} 
            onTabChange={() => {}} 
        />

        {/* 3. 안내 박스 */}
        <aside className="w-full p-6 bg-secondary-5 rounded-lg border border-secondary-10 flex items-start gap-3">
           <span className="text-secondary-50 font-bold text-lg">💡</span>
           <div className="flex flex-col gap-1">
             <p className="text-body-m-bold text-graygray-90">정책 상세 확인 방법</p>
             <p className="text-body-s text-graygray-70 leading-relaxed">
               아래 목록에서 정책 제목을 클릭하시면 상세 내용을 확인하실 수 있습니다.<br/>
               원문 링크가 있는 경우 해당 기관 페이지로 이동하여 더 자세한 정보를 볼 수 있습니다.
             </p>
           </div>
        </aside>
      </header>

      {/* 4. 컨텐츠 영역 (리스트) */}
      <section className="w-full flex flex-col gap-4 min-h-[400px]">
        {policies.length > 0 ? (
          policies.map((item) => {
            const isExpanded = expandedId === item.contentId;
            
            return (
              <article 
                key={item.contentId} 
                className={`flex flex-col w-full bg-white border rounded-xl overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'border-secondary-50 shadow-md ring-1 ring-secondary-10' : 'border-graygray-20 hover:border-graygray-40'
                }`}
              >
                {/* 헤더 (클릭 시 토글) */}
                <div 
                    onClick={() => toggleExpand(item.contentId)}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 cursor-pointer gap-4 bg-white"
                >
                  <div className="flex-1 space-y-3">
                    {/* 메타 정보 */}
                    <div className="flex items-center gap-3 text-xs md:text-sm font-medium">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-graygray-5 text-graygray-70 border border-graygray-10">
                            <Building2 size={14} />
                            {item.source || '전북특별자치도'}
                        </span>
                        <span className="flex items-center gap-1.5 text-graygray-50">
                            <Calendar size={14} />
                            {item.createdAt ? item.createdAt.substring(0, 10) : ''}
                        </span>
                    </div>
                    
                    {/* 제목 */}
                    <h3 className={`text-title-l font-bold transition-colors ${
                        isExpanded ? 'text-secondary-50' : 'text-graygray-90'
                    }`}>
                        {item.title}
                    </h3>
                  </div>

                  {/* 화살표 아이콘 */}
                  <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-secondary-5 text-secondary-50' : 'text-graygray-40'}`}>
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </div>

                {/* 본문 (확장 시 노출) */}
                {isExpanded && (
                    <div className="px-6 pb-8 pt-2 border-t border-dashed border-graygray-20 animate-fade-in">
                        {/* 원문 링크 버튼 */}
                        {item.contentLink && (
                            <div className="flex justify-end mb-6">
                                <a 
                                    href={item.contentLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-detail-m font-bold text-secondary-50 hover:text-secondary-60 hover:underline"
                                >
                                    원문 보러가기 <ExternalLink size={16} />
                                </a>
                            </div>
                        )}

                        {/* Quill 에디터 내용 렌더링 (HTML) */}
                        <div 
                            className="ql-editor prose prose-sm md:prose-base max-w-none text-graygray-80 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: item.body }}
                        />
                    </div>
                )}
                
                {/* 닫힌 상태일 때 요약 텍스트 (옵션) */}
                {!isExpanded && (
                    <div className="px-6 pb-6 text-body-m text-graygray-60 line-clamp-1 cursor-pointer" onClick={() => toggleExpand(item.contentId)}>
                        {stripHtml(item.body)}
                    </div>
                )}
              </article>
            );
          })
        ) : (
          !loading && (
            <div className="py-20 text-center text-graygray-50 bg-graygray-5 rounded-lg border border-dashed border-graygray-20">
              등록된 안전정책이 없습니다.
            </div>
          )
        )}

        {/* 로딩 스피너 */}
        {loading && (
            <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-secondary-50 rounded-full animate-spin" />
            </div>
        )}

        {/* 더보기 버튼 */}
        {policies.length < total && !loading && (
           <div className="mt-8 text-center">
             <button 
               onClick={() => setPage(prev => prev + 1)}
               className="px-10 py-4 bg-white border border-graygray-20 rounded-lg text-body-m-bold text-graygray-70 hover:bg-graygray-5 hover:border-graygray-30 transition-all shadow-sm"
             >
               더 보기 +
             </button>
           </div>
        )}
      </section>
    </div>
  );
};

export default SafetyPolicyList;