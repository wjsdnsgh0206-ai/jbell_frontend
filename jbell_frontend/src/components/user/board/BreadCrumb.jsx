import { ChevronDown, Search, House, ChevronRight } from 'lucide-react';
import { GoHomeFill } from "react-icons/go";

// ----- 게시판 종류 페이지에 들어가는 브레드 크럼 ----- //
const BreadCrumb = ({firstPath, secondPath, thirdPath}) => {

    return (
        <>
            <div className="flex items-center gap-1">
                <GoHomeFill size={18} className="text-graygray-90 fill-graygray-90" />
                <span className="text-[15px] font-pretendard-medium text-graygray-90 ml-1">{firstPath}</span>
            </div>
            <ChevronRight size={16} className="text-graygray-40" />
            <span className="text-[15px] font-pretendard-bold text-graygray-90 underline underline-offset-4 decoration-1">
                {secondPath}
            </span>
            
            <span className="text-[15px] font-pretendard-bold text-graygray-90 underline underline-offset-4 decoration-1">
                {thirdPath}
            </span>
        </>
    )
}

export default BreadCrumb;