import { useEffect, useState } from 'react';
import BehaviorMethodPageTemplate from '@/components/user/behaviorMethod/BehaviorMethodPageTemplate';
import BehaviorContentRenderer from '@/pages/user/behaviorMethod/BehaviorContentRenderer'; // 분리된 렌더러
import { behaviorMethodService } from '@/services/api';
import { transformData } from '@/utils/behaviorTransform';

const BaseBehaviorMethodPage = ({ disasterType, pageTitle, category }) => {
  const [guideData, setGuideData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const dbData = await behaviorMethodService.getBehaviorMethodList(disasterType);
        if (isMounted) {
          const formattedData = transformData(dbData);
          setGuideData(formattedData);
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

  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "행동요령", path: "/behaviorMethod/earthQuake" },
    { label: category, path: null },
    { label: pageTitle, path: null }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        {/* 스피너 컴포넌트가 있다면 교체 권장 */}
        <div className="w-10 h-10 border-4 border-gray-200 border-t-secondary-50 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !guideData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-graygray-50">
        데이터를 불러올 수 없습니다.
      </div>
    );
  }

  const { meta, contents } = guideData;

  return (
    <BehaviorMethodPageTemplate
      title={pageTitle || "행동요령"}
      lastUpdated={meta.lastUpdated}
      breadcrumbItems={breadcrumbItems}
      tabs={meta.tabs}
    >
      {/* 렌더 프로퍼티 패턴: 현재 활성화된 탭 인덱스를 받아 컨텐츠 렌더링 */}
      {(activeTab) => (
        <BehaviorContentRenderer content={contents[activeTab]} />
      )}
    </BehaviorMethodPageTemplate>
  );
};

export default BaseBehaviorMethodPage;