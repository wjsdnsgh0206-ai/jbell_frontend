// src/components/shared/PageBreadcrumb.jsx
import { Link } from "react-router-dom"; // Link import 필수
import { ChevronRight } from 'lucide-react';
import { GoHomeFill } from "react-icons/go";

const PageBreadcrumb = ({ items }) => {
  return (
    <nav className="w-full flex py-6 lg:py-10" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center justify-end gap-2 text-graygray-90">
        {items.map((item, index) => {
          // 마지막 항목인지 확인 (마지막 항목은 클릭 안 되게 처리)
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {/* [이동 로직] 
                 1. path가 있고, 마지막 항목이 아니면 -> Link (클릭 가능)
                 2. 그 외(마지막 항목이거나 path가 없으면) -> span (텍스트만)
              */}
              {item.path ? (
                <Link 
                  to={item.path} 
                  className="flex items-center gap-2 hover:text-secondary-50 hover:underline transition-colors"
                >
                  {item.hasIcon && <GoHomeFill className="w-4 h-4 text-graygray-50" />}
                 <span className={`
                    text-detail-m
                    ${isLast ? 'font-bold text-graygray-90' : 'text-graygray-70'} `}>
                    {item.label}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  {item.hasIcon && <GoHomeFill className="w-4 h-4 text-graygray-50" />}
                  <span className={`
                    text-detail-m
                    ${isLast ? 'font-bold text-graygray-90' : 'text-graygray-70'}
                  `}>
                    {item.label}
                  </span>
                </div>
              )}

              {/* 구분자 (>) */}
              {!isLast && (
                <ChevronRight className="w-4 h-4 text-graygray-40" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default PageBreadcrumb;