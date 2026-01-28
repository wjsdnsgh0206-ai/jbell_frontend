// src\components\shared\PageBreadcrumb.jsx
import { Link } from "react-router-dom";
import { ChevronRight } from 'lucide-react';
import { GoHomeFill } from "react-icons/go";

/**
 * PageBreadcrumb
 * @param {Array} items - [{ label: string, path?: string, hasIcon?: boolean }]
 */
const PageBreadcrumb = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className="w-full flex py-6 lg:py-10" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center justify-end gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isHome = item.hasIcon; // 홈 아이콘 여부

          // 공통 스타일: 마지막 항목은 진하게, 나머지는 연하게
          const textClass = `text-detail-m transition-colors ${
            isLast 
              ? 'font-bold text-graygray-90 cursor-default' 
              : 'text-graygray-70 hover:text-secondary-50 hover:underline'
          }`;

          return (
            <li key={index} className="flex items-center gap-2">
              {/* 1. 링크가 있고 마지막이 아닌 경우 -> Link 컴포넌트 */}
              {!isLast && item.path ? (
                <Link to={item.path} className={`flex items-center gap-1 ${textClass}`}>
                  {isHome && <GoHomeFill className="w-4 h-4 mb-0.5" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                /* 2. 링크가 없거나 마지막인 경우 -> span (텍스트만 표시) */
                <div className={`flex items-center gap-1 ${textClass}`}>
                  {isHome && <GoHomeFill className="w-4 h-4 mb-0.5" />}
                  <span>{item.label}</span>
                </div>
              )}

              {/* 구분자 (>) : 마지막 항목이 아닐 때만 표시 */}
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