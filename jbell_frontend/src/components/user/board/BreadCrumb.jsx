import { GoHomeFill } from "react-icons/go";

// ----- 게시판 종류 페이지에 들어가는 브레드 크럼 ----- //
const BreadCrumb = ({ firstPath, secondPath, thirdPath }) => {
  // 구분선 컴포넌트 (반복되니까 따로 뺌)
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
        {/* 홈 아이콘 */}
        <li className="inline-flex items-center">
          <div className="p-1 rounded inline-flex items-center">
            <GoHomeFill size={18} className="text-graygray-90" />
          </div>
        </li>

        {/* 첫 번째 경로 */}
        {firstPath && (
          <li className="inline-flex items-center">
            {/* <Divider /> */}
            <span className="font-normal text-graygray-90 text-xs sm:text-sm lg:text-[15px] whitespace-nowrap px-0.5">
              {firstPath}
            </span>
          </li>
        )}

        {/* 두 번째 경로 */}
        {secondPath && (
          <li className="inline-flex items-center">
            <Divider />
            <span className={`text-xs sm:text-sm lg:text-[15px] whitespace-nowrap px-0.5 ${!thirdPath ? 'text-graygray-90 underline underline-offset-4 decoration-1' : 'font-normal text-graygray-90'}`}>
              {secondPath}
            </span>
          </li>
        )}

        {/* 세 번째 경로 (있을 경우에만 마지막 강조) */}
        {thirdPath && (
          <li className="inline-flex items-center">
            <Divider />
            <span className="text-graygray-90 text-xs sm:text-sm lg:text-[15px] underline underline-offset-4 decoration-1 whitespace-nowrap px-0.5">
              {thirdPath}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default BreadCrumb;