// src/layouts/admin/AdminFooter.jsx
import React from 'react';
import { Link } from "react-router-dom"; // Link가 있으니 useNavigate는 굳이 필요 없어
import logo from "@/assets/logo/jeonbuk_safety_nuri_watermark.svg";

const AdminFooter = () => {
  // 에러 원인이었던 이 줄을 삭제했어!
  // const navigate = useNavigate(); 

  const teamMembers = [
    { name: "전은호", email: "wjsdnsgh0206@gmail.com" },
    { name: "김민주", email: "j89465137@gmail.com" },
    { name: "김승하", email: "dubbii720@gmail.com" },
    { name: "김정훈", email: "kwjdgns2198@gmail.com" },
    { name: "최병준", email: "qudwns1216@gmail.com" },
    { name: "최지영", email: "jiyoungwlwl@gmail.com" },
  ];

  return (
    <footer className="mt-auto w-full bg-white border-t border-gray-200 px-8 py-8">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-8">
        
        <div className="flex flex-col xl:flex-row justify-between gap-8">
          {/* 로고 영역 */}
          <div className="shrink-0">
            <Link to="/admin/dashboard">
              <img
                className="w-36 opacity-80 hover:opacity-100 transition-opacity mb-2"
                alt="전북안전누리 관리자 로고"
                src={logo}
              />
            </Link>
            <p className="text-[11px] text-gray-400">전북특별자치도 전주시 덕진구 기린대로 499</p>
          </div>

          {/* 팀원 정보 영역: 3열 그리드로 이메일이 잘리지 않게 배치 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center gap-3 border-l-2 border-slate-50 pl-3">
                <span className="text-[12px] font-bold text-gray-700 min-w-[45px]">
                  {member.name}
                </span>
                <a
                  href={`mailto:${member.email}`}
                  className="text-[11px] text-gray-400 hover:text-blue-500 hover:underline transition-colors"
                  title={member.email}
                >
                  {member.email}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
          <p className="text-[11px] text-gray-300 tracking-wider">
            ADMIN SYSTEM / INTERNAL USE ONLY
          </p>
          <p className="text-[11px] text-gray-400 font-medium">
            © The Government of the Republic of Korea. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;