import React, { useState, useEffect } from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';
import PageTabs from '@/components/shared/PageTabs'; 
import PageBreadcrumb from '@/components/shared/PageBreadcrumb'; // [추가] 브레드크럼 컴포넌트
import { safetyPolicyService } from '@/services/api'; 

const SafetyPolicyList = () => {
  const [policies, setPolicies] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // [추가] 브레드크럼 아이템 정의
  const breadcrumbItems = [
    { label: '홈', path: '/', hasIcon: true },
    { label: '안전 가이드', path: null }, // 상위 카테고리 (클릭 안됨)
    { label: '주요 안전정책', path: null } // 현재 페이지
  ];

  useEffect(() => {
    fetchPolicies();
  }, [page]);

  const fetchPolicies = async () => {
    try {
      const params = {
        page: page,
        size: 10,
        visibleYn: 'Y'
      };
      
      const res = await safetyPolicyService.getSafetyPolicyList(params);
      
      if (res && res.data) {
        setPolicies(res.data.list);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error("정책 목록 조회 실패:", error);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* [추가] 공통 브레드크럼 적용 */}
      <PageBreadcrumb items={breadcrumbItems} />

      <PageTabs 
        tabs={[
          { id: 'policy', label: '주요 안전정책', active: true, path: '/safety/policy' },
          { id: 'manual', label: '재난 행동요령', active: false, path: '/safety/manual' }
        ]}
      />

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-graygray-90 mb-6">전라북도 주요 안전정책</h3>
        
        <div className="border-t border-graygray-90">
          {policies.length > 0 ? (
            policies.map((item) => (
              <div key={item.contentId} className="border-b border-graygray-20 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-graygray-5 transition-colors px-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="bg-secondary-5 text-secondary-50 text-xs px-2 py-0.5 rounded font-medium">
                       {item.source || 'JBELL'}
                     </span>
                     <span className="text-graygray-50 text-sm">{item.createdAt ? item.createdAt.substring(0, 10) : ''}</span>
                  </div>
                  <h4 className="text-lg font-bold text-graygray-90 mb-1">{item.title}</h4>
                  <p className="text-graygray-70 text-sm line-clamp-1">{item.body || '내용 없음'}</p>
                </div>
                
                {item.contentLink && (
                  <a 
                    href={item.contentLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-medium text-graygray-70 hover:text-secondary-50 border border-graygray-20 px-4 py-2 rounded bg-white hover:border-secondary-50 transition-all shrink-0"
                  >
                    원문 보기 <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-graygray-50">
              등록된 안전정책이 없습니다.
            </div>
          )}
        </div>
        
        {/* 더보기 버튼 */}
        {policies.length < total && (
           <div className="mt-8 text-center">
             <button 
               onClick={() => setPage(prev => prev + 1)}
               className="px-6 py-3 bg-white border border-graygray-20 rounded text-graygray-70 hover:bg-graygray-5"
             >
               더 보기 +
             </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default SafetyPolicyList;