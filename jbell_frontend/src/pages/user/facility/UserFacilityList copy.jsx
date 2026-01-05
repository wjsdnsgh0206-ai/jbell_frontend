import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. useNavigate 추가
import { ChevronDown, Search, House, ChevronRight } from 'lucide-react';
import BreadCrumb from '@/components/user/board/BreadCrumb';
import Pagenation from "@/components/user/board/Pagination";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

const UserFacilityList = ({ path }) => {
    const navigate = useNavigate(); // 2. navigate 함수 생성
    
    const [facilityType, setFacilityType] = useState("전체");
    const [district, setDistrict] = useState("전체");
    const [searchQuery, setSearchQuery] = useState("");

    const facilityData = [
        { id: 1, type: "민방위대피시설", name: "전주 시민공원 대피소", address: "전주시 완산구 효자로 444" },
        { id: 2, type: "민방위대피시설", name: "전주 시민공원 대피소", address: "전주시 완산구 효자로 444" },
        { id: 3, type: "한파쉼터", name: "전주 시민공원 대피소", address: "전주시 완산구 효자로 444" },
        { id: 4, type: "한파쉼터", name: "전주 시민공원 대피소", address: "전주시 완산구 효자로 444" },
        { id: 5, type: "무더위쉼터", name: "전주 시민공원 대피소", address: "전주시 완산구 효자로 444" },
    ];

    const handleReset = () => {
        setFacilityType("전체");
        setDistrict("전체");
        setSearchQuery("");
        // setCurrentPage(1); // 필요시 주석 해제
    };

    // 3. 상세 페이지 이동 핸들러
    const handleDetail = (id) => {
        navigate(`/facility/detail/${id}`); // 경로 설정 (본인 프로젝트의 App.js 경로와 맞춰줘)
    };

    return (
        <div className="flex w-full min-h-screen">
            <div className="flex-1 flex flex-col items-center gap-12 pt-10 pb-20 px-0 relative">

                <div className="w-full max-w-[1000px] flex flex-col gap-10">

                    <nav aria-label="Breadcrumb" className="flex items-center gap-2">
                        <BreadCrumb 
                            firstPath="홈" 
                            secondPath="대피소 소개"
                        />
                    </nav>

                    <header className="flex flex-col items-start gap-4 w-full">
                        <h1 className="font-heading-heading-m-700 font-[number:var(--heading-heading-m-700-font-weight)] text-graygray-90 text-[length:var(--heading-heading-m-700-font-size)] tracking-[var(--heading-heading-m-700-letter-spacing)] leading-[var(--heading-heading-m-700-line-height)] whitespace-nowrap">
                            대피소 소개
                        </h1>
                        <p className="font-detail-detail-m-400 font-[number:var(--detail-detail-m-400-font-weight)] text-[#555555] text-[length:var(--detail-detail-m-400-font-size)]">
                            최종 정보 수정일: 2025년 12월 16일
                        </p>
                    </header>

                    <section className="flex flex-col items-center gap-10 p-[30px] bg-white rounded-xl border border-solid border-graygray-10 shadow-sm">
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
                                <div className="flex h-12 items-center gap-2 px-4 bg-white rounded-lg border border-solid border-[#717171]">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="시설명 검색"
                                        className="flex-1 text-[16px] bg-transparent border-none outline-none placeholder:text-graygray-50"
                                    />
                                    <span><Search className="w-[20px] h-[20px]" /></span>
                                </div>
                            </div>

                            <button
                                onClick={handleReset}
                                className="h-12 px-5 bg-graygray-0 rounded-lg border border-solid border-[#717171] cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-secondarysecondary-90 text-[16px] font-medium">초기화</span>
                            </button>
                        </div>

                        <div className="w-full border-t border-graygray-30">
                            <div className="flex bg-secondarysecondary-5 border-b border-secondarysecondary-30 font-bold text-[14px]">
                                <div className="w-[120px] px-4 py-3">유형</div>
                                <div className="w-[200px] px-4 py-3 flex justify-between items-center gap-1">
                                    <span>시설명</span>
                                    <span className="flex flex-col leading-none">
                                        <FaCaretUp className="text-[12px]" />
                                        <FaCaretDown className="text-[12px] -mt-1" />
                                    </span>
                                </div>
                                <div className="flex-1 px-4 py-3">주소</div>
                                <div className="w-[80px] px-4 py-3 text-center">상세</div>
                            </div>

                            {facilityData.map((facility) => (
                                <div key={facility.id} className="flex border-b border-graygray-30 items-center text-[15px] text-graygray-90 hover:bg-gray-50">
                                    <div className="w-[120px] px-4 py-4">{facility.type}</div>
                                    <div className="w-[200px] px-4 py-4">{facility.name}</div>
                                    <div className="flex-1 px-4 py-4">{facility.address}</div>
                                    <div className="w-[80px] px-4 py-4 text-center">
                                        {/* 4. '보기' 버튼 클릭 이벤트 추가 */}
                                        <button 
                                            onClick={() => handleDetail(facility.id)}
                                            className="px-2 py-1 text-[13px] border border-[#e6e8ea] rounded bg-white cursor-pointer hover:bg-gray-100"
                                        >
                                            보기
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <nav className="flex items-center gap-2">
                            <Pagenation />
                        </nav>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default UserFacilityList;