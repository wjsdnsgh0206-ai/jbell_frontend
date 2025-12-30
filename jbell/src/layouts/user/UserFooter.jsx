import React from 'react';

const UserFooter = () => {
  const footerLinks = ["소속기관(지정 및 위원회)", "업무별 누리집", "산하기관 및 관련단체", "정부기관"];

  return (
    <footer className="w-full bg-[#f9fafb] mt-20 border-t border-gray-200">
      {/* 상단 링크 버튼 섹션 */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl grid grid-cols-4">
          {footerLinks.map((link, idx) => (
            <button key={idx} className="flex items-center justify-between px-6 py-4 text-sm font-medium border-r border-gray-200 last:border-r-0 hover:bg-gray-50">
              {link} <span className="text-gray-400 text-lg">+</span>
            </button>
          ))}
        </div>
      </div>

      {/* 하단 상세 정보 */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex justify-between items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-2 opacity-70 grayscale">
              <div className="w-6 h-6 rounded-full bg-blue-600" />
              <span className="text-lg font-bold">대한민국정부</span>
            </div>
            <div className="text-sm text-gray-500 space-y-1">
              <p>(04383) 서울특별시 용산구 이태원로 22</p>
              <p><strong>대표전화</strong> 1234-5678 | (유료, 평일 09시~18시)</p>
              <p><strong>해외이용</strong> +82-1234-5678 | (유료, 평일 09시~18시)</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-6">
            <div className="flex gap-4 text-sm font-medium text-gray-600">
              <button>이용안내 〉</button>
              <button>찾아오시는 길 〉</button>
            </div>
            <div className="flex gap-3">
              {/* 소셜 아이콘 더미 */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">SNS</div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-10 flex justify-between items-center text-xs text-gray-400">
          <div className="flex gap-4">
            <button className="text-blue-600 font-bold">개인정보처리방침</button>
            <button>저작권정책</button>
            <button>웹 접근성 품질인증 마크 획득</button>
          </div>
          <p>© The Government of the Republic of Korea. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;