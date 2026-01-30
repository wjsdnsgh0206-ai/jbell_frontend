import React, { useEffect, useState } from 'react';
import BehaviorMethodPageTemplate from '@/components/user/behaviorMethod/BehaviorMethodPageTemplate';
import BehaviorContentRenderer from '@/pages/user/behaviorMethod/BehaviorContentRenderer';
import { behaviorMethodService } from '@/services/api';
import { transformData } from '@/utils/behaviorTransform';

const BaseBehaviorMethodPage = ({ 
  disasterType, 
  pageTitle: propPageTitle, // props로 받은 타이틀 (우선순위 낮음)
  category,
  categoryPath,
}) => {
  const [guideData, setGuideData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // DB에서 가져온 타이틀 상태 (로딩 후 설정됨)
  const [dbPageTitle, setDbPageTitle] = useState("");

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // api.js에서 params(visibleYn='Y', onlyLatest='Y')를 포함하여 호출
        const dbData = await behaviorMethodService.getUserBehaviorList(disasterType);
        
        if (isMounted) {
          if (!dbData || dbData.length === 0) {
             setGuideData(null);
          } else {
             const formattedData = transformData(dbData);
             setGuideData(formattedData);
             // DB 데이터의 첫 번째 항목에서 추출한 메타 타이틀 설정
             if (formattedData.meta.pageTitle) {
                setDbPageTitle(formattedData.meta.pageTitle);
             }
          }
        }
      } catch (err) {
        console.error("데이터 로드 실패", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (disasterType) fetchData();

    return () => { isMounted = false; };
  }, [disasterType]);

  // 최종 타이틀 결정: DB값이 있으면 DB값, 없으면 props값, 없으면 기본값
  const displayTitle = dbPageTitle || propPageTitle || "행동요령";

  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "행동요령", path: null },
    { label: category, path: categoryPath }, 
    { label: displayTitle, path: null } 
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-secondary-50 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !guideData) {
    return (
      <BehaviorMethodPageTemplate
        title={displayTitle}
        breadcrumbItems={breadcrumbItems}
      >
        <div className="py-20 text-center text-graygray-60 min-h-[40vh] flex items-center justify-center">
          {error ? "데이터를 불러오는 중 문제가 발생했습니다." : "등록된 행동요령 정보가 없습니다."}
        </div>
      </BehaviorMethodPageTemplate>
    );
  }

  const { meta, contents } = guideData;

  return (
    <BehaviorMethodPageTemplate
      title={displayTitle}
      lastUpdated={meta.lastUpdated}
      breadcrumbItems={breadcrumbItems}
      tabs={meta.tabs}
    >
      {(activeTab) => (
        // activeTab 인덱스가 contents 길이보다 크면 안전하게 null 처리
        contents[activeTab] ? (
            <BehaviorContentRenderer content={contents[activeTab]} />
        ) : (
            <div className="py-10 text-center">내용이 없습니다.</div>
        )
      )}
    </BehaviorMethodPageTemplate>
  );
};

export default BaseBehaviorMethodPage;