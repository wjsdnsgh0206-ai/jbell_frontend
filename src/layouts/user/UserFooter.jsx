const UserFooter = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-[#f9f9f9]">
      {/* 푸터 상단 링크 (1200px 그리드) */}
      <div className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-4">
          {["소속기관", "업무별 누리집", "산하기관", "정부기관"].map((item, idx) => (
            <button key={idx} className="py-4 border-r border-gray-200 last:border-r-0 text-[14px] font-bold text-[#444] flex justify-between px-6 items-center hover:bg-gray-50">
              {item} <span className="text-gray-400">+</span>
            </button>
          ))}
        </div>
      </div>

      {/* 푸터 정보 영역 */}
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-2 grayscale opacity-80">
              <div className="w-6 h-6 bg-gray-600 rounded-full" />
              <span className="text-lg font-bold text-gray-700">JBELL</span>
            </div>
            <div className="text-[14px] text-[#666] leading-relaxed">
              <p>(01234) 전라북도 전주시 완산구</p>
              <p>대표전화 <strong>1588-1234</strong> (유료, 평일 09시~18시)</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-6">
            <div className="flex gap-4 text-[13px] font-bold text-[#444]">
              <button className="text-blue-600">개인정보처리방침</button>
              <button>이용안내</button>
              <button>찾아오시는 길</button>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-gray-200" />)}
            </div>
          </div>
        </div>
        <p className="mt-8 text-[12px] text-gray-400">© The Government of the Republic of Korea. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default UserFooter;