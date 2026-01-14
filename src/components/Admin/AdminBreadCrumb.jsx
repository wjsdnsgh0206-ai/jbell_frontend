// src/components/admin/AdminBreadcrumb.jsx
import { useLocation, Link } from "react-router-dom";
import { ChevronRight } from 'lucide-react';
import { GoHomeFill } from "react-icons/go";

// 고정 메뉴 매핑 (ID를 제외한 정적 경로들)
const adminMap = {
  "system": "시스템 관리",
  "commonCodeList": "공통코드 목록",
  "groupCodeAdd": "그룹코드 등록",
  "subCodeAdd": "상세코드 등록",
  "groupCodeDetail": "공통 코드 상세",
  "groupCodeEdit": "공통 코드 수정",
  "subCodeDetail": "상세 코드 상세",
  "subCodeEdit": "상세 코드 수정",
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
        <li className="flex items-center gap-2 text-graygray-50 hover:text-admin-primary">
          <Link to="/admin"><GoHomeFill className="w-4 h-4" /></Link>
          {pathnames.length > 0 && <ChevronRight className="w-3 h-3 text-graygray-30" />}
        </li>

        {pathnames.map((name, index) => {
          const routeTo = `/admin/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          
          /**
           * [유동적 타이틀 로직]
           * 1. 마지막 항목(상세페이지 ID 등)이면서 부모(Layout)로부터 전달받은 customTitle이 있으면 사용
           * 2. 그 외에는 adminMap 설정값 사용
           */
          const label = (isLast && customTitle) ? customTitle : (adminMap[name] || name);

          return (
            <li key={index} className="flex items-center gap-2 text-graygray-50 hover:text-admin-primary">
              <Link 
                to={routeTo}
                className={`text-detail-m ${isLast ? 'font-bold text-graygray-90 pointer-events-none' : 'hover:underline'}`}
              >
                {label}
              </Link>
              {!isLast && <ChevronRight className="w-3 h-3 text-graygray-50" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default AdminBreadcrumb;