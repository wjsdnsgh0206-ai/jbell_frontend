import { useState } from "react";
import { ChevronDown, Search, House, ChevronRight  } from 'lucide-react';
// import { MdHomeFilled } from "react-icons/md";


const UserFacilityList = () => {
    const [facilityType, setFacilityType] = useState("전체");
    const [district, setDistrict] = useState("전체");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const facilityData = [
        { id: 1, type: "민방위대피시설", name: "전주 시민공원 대피소", address: "전주시 완산구 효자로 444" },
        { id: 2, type: "민방위대피시설", name: "전주 시민공원 대피소", address: "전주시 완산구 효자로 444" },
        { id: 3, type: "한파쉼터", name: "전주 시민공원 대피소", address: "전주시 완산구 효자로 444" },
        { id: 4, type: "한파쉼터", name: "전주 시민공원 대피소", address: "전주시 완산구 효자로 444" },
        { id: 5, type: "무더위쉼터", name: "전주 시민공원 대피소", address: "전주시 완산구 효자로 444" },
    ];

    const paginationNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const handleReset = () => {
        setFacilityType("전체");
        setDistrict("전체");
        setSearchQuery("");
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex w-full min-h-screen">

            {/* 메인 콘텐츠 영역: max-width를 설정해서 너무 커지지 않게 조절 */}
            <div className="flex-1 flex flex-col items-center gap-12 pt-10 pb-20 px-10 relative">

                <div className="w-full max-w-[1000px] flex flex-col gap-10">

                    {/* Breadcrumb */}
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-gray-600">
                        <div className="flex items-center gap-1">
                            <House size={18} className="text-black fill-black" />
                            <span className="text-[15px] font-medium text-black ml-1">홈</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                        <span className="text-[15px] font-semibold text-black underline underline-offset-4 decoration-1">
                            대피소 소개
                        </span>
                    </nav>
                    {/* 헤더 섹션 */}
                    <header className="flex flex-col items-start gap-4 w-full">
                        <h1 className="font-heading-heading-m-700 font-[number:var(--heading-heading-m-700-font-weight)] text-graygray-90 text-[length:var(--heading-heading-m-700-font-size)] tracking-[var(--heading-heading-m-700-letter-spacing)] leading-[var(--heading-heading-m-700-line-height)] whitespace-nowrap">
                            대피소 소개
                        </h1>
                        <p className="font-detail-detail-m-400 font-[number:var(--detail-detail-m-400-font-weight)] text-[#555555] text-[length:var(--detail-detail-m-400-font-size)]">
                            최종 정보 수정일: 2025년 12월 16일
                        </p>
                    </header>

                    {/* 필터 및 테이블 섹션: p-[30px] 유지하되 너비 최적화 */}
                    <section className="flex flex-col items-center gap-10 p-[30px] bg-white rounded-xl border border-solid border-graygray-40 shadow-sm">

                        {/* 필터 바: 각 박스 크기를 이미지 비율에 맞춰 적절히 축소 */}
                        <div className="flex items-end justify-start gap-3 w-full">
                            <div className="flex flex-col gap-2 w-[140px]">
                                <label className="text-[14px] text-graygray-90 font-medium">시설 유형</label>
                                <div className="flex h-12 px-3 bg-graygray-0 rounded-lg border border-solid border-[#717171] items-center">

                                    <select
                                        value={facilityType}
                                        onChange={(e) => setFacilityType(e.target.value)}
                                        className="w-full text-[16px] bg-transparent border-none outline-none"
                                    >
                                        <option value="전체">전체</option>
                                        <option value="민방위대피시설">민방위대피시설</option>
                                        <option value="한파쉼터">한파쉼터</option>
                                        <option value="무더위쉼터">무더위쉼터</option>
                                    </select>
                                    <ChevronDown />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 w-[140px]">
                                <label className="text-[14px] text-graygray-90 font-medium">시군구</label>
                                <div className="flex h-12 px-3 bg-graygray-0 rounded-lg border border-solid border-[#717171] items-center">
                                    <select
                                        value={district}
                                        onChange={(e) => setDistrict(e.target.value)}
                                        className="w-full text-[16px] bg-transparent border-none outline-none"
                                    >
                                        <option value="전체">전체</option>
                                        <option value="완산구">완산구</option>
                                        <option value="덕진구">덕진구</option>
                                    </select>
                                    <ChevronDown />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 flex-1 max-w-[400px]">
                                <label className="text-[14px] text-graygray-90 font-medium">시설명</label>
                                <div className="flex h-12 items-center gap-2 px-4 bg-white rounded-lg border border-solid border-graygray-60">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="시설명 검색"
                                        className="flex-1 text-[16px] bg-transparent border-none outline-none placeholder:text-graygray-50"
                                    />
                                    {/* 돋보기 아이콘 자리에 텍스트나 간단한 SVG 추가 가능 */}
                                    <span className="text-gray-700"><Search /></span>
                                </div>
                            </div>

                            <button
                                onClick={handleReset}
                                className="h-12 px-5 bg-graygray-0 rounded-lg border border-solid border-graygray-90 cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-secondarysecondary-90 text-[16px] font-medium">초기화</span>
                            </button>
                        </div>

                        {/* 테이블 영역 */}
                        <div className="w-full border-t border-graygray-30">
                            {/* 헤더 */}
                            <div className="flex bg-secondarysecondary-5 border-b border-secondarysecondary-30 font-bold text-[14px]">
                                <div className="w-[120px] px-4 py-3">유형</div>
                                <div className="w-[200px] px-4 py-3">시설명</div>
                                <div className="flex-1 px-4 py-3">주소</div>
                                <div className="w-[80px] px-4 py-3 text-center">상세</div>
                            </div>

                            {/* 바디 */}
                            {facilityData.map((facility) => (
                                <div key={facility.id} className="flex border-b border-graygray-30 items-center text-[15px] text-graygray-90 hover:bg-gray-50">
                                    <div className="w-[120px] px-4 py-4">{facility.type}</div>
                                    <div className="w-[200px] px-4 py-4">{facility.name}</div>
                                    <div className="flex-1 px-4 py-4">{facility.address}</div>
                                    <div className="w-[80px] px-4 py-4 text-center">
                                        <button className="px-2 py-1 text-[13px] border border-[#e6e8ea] rounded bg-white">보기</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 페이지네이션 */}
                        <nav className="flex items-center gap-2">
                            <button className="text-gray-400 text-[14px] px-2">{"<"} 이전</button>
                            {paginationNumbers.map((num) => (
                                <button
                                    key={num}
                                    className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === num ? "bg-[#003366] text-white" : "text-gray-600"}`}
                                    onClick={() => setCurrentPage(num)}
                                >
                                    {num}
                                </button>
                            ))}
                            <button className="text-gray-600 text-[14px] px-2">다음 {">"}</button>
                        </nav>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default UserFacilityList;