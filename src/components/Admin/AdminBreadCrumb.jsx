// src/components/admin/AdminBreadcrumb.jsx
import { useLocation } from "react-router-dom";
import { ChevronRight } from 'lucide-react';
import { GoHomeFill } from "react-icons/go";

// 고정 메뉴 매핑 (ID를 제외한 정적 경로들)
const adminMap = {
  "realtime": "실시간 정보 관리",
  "accidentNews": "사고속보 관리",
  "disaster": "재난 관리",
  "contents": "콘텐츠 관리",
  "behavioralGuide": "행동요령 관리",
  "behavioralGuideList": "행동요령 목록",
  "system": "시스템 관리",
  "commonCodeList": "공통코드 목록",
  "groupCodeAdd": "그룹코드 등록",
  "subCodeAdd": "상세코드 등록",
  "groupCodeDetail": "공통 코드 상세",
  "groupCodeEdit": "공통 코드 수정",
  "subCodeDetail": "상세 코드 상세",
  "subCodeEdit": "상세 코드 수정",
  "behavioralGuideDetail": "행동요령 상세",
  "citySafetyMasterPlan": "도시안전기본계획 관리",
  "disasterSafetyPolicy": "재난별 안전정책 관리",
  "citizenSafetyInsurance": "시민 안전보험 관리",
  "stormAndFloodInsurance": "풍수해 안전보험 관리",
  "pressRelList": "보도자료 목록",
  "pressRelAdd": "보도자료 등록",
  "pressRelDetail": "보도자료 상세",
  "pressRelEdit": "보도자료 수정",
  "safetyEduList": "시민안전교육 목록",
  "safetyEduEdit": "시민안전교육 수정",

};

/**
 * @param {string} customTitle - 상세 페이지 등에서 ID 대신 보여줄 커스텀 텍스트
 */
const AdminBreadcrumb = ({ customTitle }) => {
  const { pathname } = useLocation();
  const pathnames = pathname.split("/").filter((x) => x && x !== "admin");

  return (
    <nav className="flex py-2" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {/* 홈 아이콘 */}
        <li className="flex items-center gap-2 text-graygray-50">
          <GoHomeFill className="w-4 h-4" />
          {pathnames.length > 0 && <ChevronRight className="w-3 h-3 text-graygray-30" />}
        </li>

        {pathnames.map((name, index) => {
          const isLast = index === pathnames.length - 1;
          
          /**
           * [유동적 타이틀 로직]
           * 1. 마지막 항목(상세페이지 ID 등)이면서 부모(Layout)로부터 전달받은 customTitle이 있으면 사용
           * 2. 그 외에는 adminMap 설정값 사용
           */
          const label = (isLast && customTitle) ? customTitle : (adminMap[name] || name);

          return (
            <li key={index} className="flex items-center gap-2 text-graygray-50">
              <div
                className={`text-detail-m ${
                  isLast ? 'font-bold text-graygray-90' : 'text-graygray-50'
                }`}
              >
                {label}
              </div>
              {/* 마지막 항목이 아니면 화살표 표시 */}
              {!isLast && <ChevronRight className="w-3 h-3 text-graygray-50" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default AdminBreadcrumb;