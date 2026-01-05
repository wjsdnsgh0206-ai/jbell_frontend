import { Link } from "react-router-dom"; // Link 추가
import { GoHomeFill } from "react-icons/go";

// ----- 게시판 종류 페이지에 들어가는 브레드 크럼 ----- //
const BreadCrumb = ({ firstPath, secondPath, thirdPath }) => {
  // 구분선 컴포넌트
  const Divider = () => (
    <img
      className="relative w-4 h-4 mx-1"
      alt="다음"
      src="https://c.animaapp.com/PZUA6SpP/img/icon16-1.svg"
    />
  );

  return (
    <nav className="inline-flex items-center gap-1 rounded-md overflow-x-auto" aria-label="브레드크럼">
      <ol className="inline-flex items-center">
        {/* 홈 아이콘 - 누르면 홈으로 */}
        <li className="inline-flex items-center">
          <Link to="/" className="p-1 rounded inline-flex items-center hover:bg-gray-50">
            <GoHomeFill size={18} className="text-graygray-90" />
          </Link>
        </li>

        {/* 첫 번째 경로 (예: 홈 텍스트) */}
        {firstPath && (
          <li className="inline-flex items-center">
            <span className="font-normal text-graygray-90 text-xs sm:text-sm lg:text-[15px] whitespace-nowrap px-0.5">
              {firstPath}
            </span>
          </li>
        )}

        {/* 두 번째 경로 (대피소 소개) */}
        {secondPath && (
          <li className="inline-flex items-center">
            <Divider />
            {/* thirdPath가 있다면 리스트로 가는 링크를 걸고, 없으면 현재 페이지이므로 링크 없이 강조만 함 */}
            {thirdPath ? (
              <Link 
                to="/facilityList" 
                className="text-xs sm:text-sm lg:text-[15px] text-graygray-90 hover:underline px-0.5 whitespace-nowrap"
              >
                {secondPath}
              </Link>
            ) : (
              <span className="text-xs sm:text-sm lg:text-[15px] text-graygray-90 underline underline-offset-4 decoration-1 font-bold px-0.5 whitespace-nowrap">
                {secondPath}
              </span>
            )}
          </li>
        )}

        {/* 세 번째 경로 (시설 상세명) */}
        {thirdPath && (
          <li className="inline-flex items-center">
            <Divider />
            <span className="text-graygray-90 text-xs sm:text-sm lg:text-[15px] underline underline-offset-4 decoration-1 font-bold whitespace-nowrap px-0.5">
              {thirdPath}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default BreadCrumb;