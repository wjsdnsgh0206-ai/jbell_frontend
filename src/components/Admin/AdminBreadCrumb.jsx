// src/components/admin/AdminBreadcrumb.jsx
import { useLocation, Link } from "react-router-dom";
import { ChevronRight } from 'lucide-react';
import { GoHomeFill } from "react-icons/go";

// 관리자 메뉴 이름 매핑
const adminMap = {
  "system": "시스템 관리",
  "commonCodeList": "공통코드 목록",
  "groupCodeAdd": "그룹코드 등록",
  "subCodeAdd": "상세코드 등록",
  "groupCodeEdit": "공통 코드 관리",
};

const AdminBreadcrumb = () => {
  const { pathname } = useLocation();
  const pathnames = pathname.split("/").filter((x) => x && x !== "admin");

  return (
    <nav className="flex py-2" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {/* 관리자 홈은 항상 고정 */}
        <li className="flex items-center gap-2 text-graygray-50 hover:text-admin-primary">
          <Link to="/admin"><GoHomeFill className="w-4 h-4" /></Link>
          <ChevronRight className="w-3 h-3 text-graygray-30" />
        </li>

        {pathnames.map((name, index) => {
          const isLast = index === pathnames.length - 1;
          const label = adminMap[name] || name; // 매핑된 이름이 없으면 URL 폴더명 그대로 표시

          return (
            <li key={index} className="flex items-center gap-2">
              <span className={`text-detail-m ${isLast ? 'font-bold text-graygray-90' : 'text-graygray-50'}`}>
                {label}
              </span>
              {!isLast && <ChevronRight className="w-3 h-3 text-graygray-30" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default AdminBreadcrumb