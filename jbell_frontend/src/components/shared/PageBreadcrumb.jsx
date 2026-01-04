import { ChevronRight } from 'lucide-react';
import { GoHomeFill } from "react-icons/go";

const PageBreadcrumb = ({ items }) => {
  return (
    <nav className="w-full flex py-6 lg:py-10" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center justify-end gap-2 text-graygray-90">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.hasIcon && <GoHomeFill className="w-4 h-4 text-graygray-50" />}
            <span className={`text-detail-m ${index === items.length - 1 ? 'font-bold text-graygray-90' : 'text-graygray-70'}`}>
              {item.label}
            </span>
            {index < items.length - 1 && <ChevronRight className="w-4 h-4 text-graygray-40" />}
          </li>
        ))}
      </ol>
    </nav>
  );
};
export default PageBreadcrumb;