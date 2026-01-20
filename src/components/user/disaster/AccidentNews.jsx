import React, { useState } from 'react';
import { useAccidentNews } from '@/hooks/user/useAccidentNews';
import { RefreshCw, ChevronDown, AlertCircle } from 'lucide-react';
import CommonMap from "@/components/user/modal/CommonMap"; 

const AccidentNews = () => {
  const { accidents, isLoading, refetch } = useAccidentNews();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({ label: '전체 보기', value: '전체' });
  
  // 1. 클릭된 마커의 고유 ID와 지도의 중심/레벨 상태 관리
  const [activeMarker, setActiveMarker] = useState(null);
  const [mapConfig, setMapConfig] = useState({
    center: { lat: 35.8242, lng: 127.1480 }, // 전북 중심 초기값
    level: 8
  });

  const categories = [
    { label: '전체 보기', value: '전체' },
    { label: '🚨 재난 / 사고', value: '재난' },
    { label: '🚧 도로 공사', value: '공사' },
    { label: 'ℹ️ 기타 돌발', value: '기타돌발' }
  ];

  const filteredData = accidents.filter(item => 
    selectedOption.value === '전체' ? true : item.category === selectedOption.value
  );

  // 2. CommonMap에 전달할 마커 데이터 가공 (빨간 점 + 정보창 HTML)
  const mapMarkers = filteredData.map(item => ({
    lat: item.lat || 35.8242,
    lng: item.lng || 127.1480,
    time: item.displayDate,
    id: item.id, // ID 전달
    content: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="
          width: 14px; height: 14px; 
          background-color: #ef4444; 
          border: 2px solid white; 
          border-radius: 50%; 
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
          margin-bottom: 8px;
        "></div>
        
          <div style="color: #ef4444; font-size: 13px; margin-bottom: 4px;">
            ${item.type}
          </div>
          <div style="font-size: 16px; font-weight: 700; color: #1e293b; line-height: 1.4;">
            ${item.content}
          </div>
          <div style="font-size: 13px; color: #64748b; margin-top: 6px; padding-top: 6px;">
            ${item.displayDate}
          </div>
      </div>
    `
  }));

  // 3. 사고 리스트 클릭 핸들러 (ID 기반으로 변경)
  const handleItemClick = (item) => {
    const newCenter = { lat: item.lat || 35.8242, lng: item.lng || 127.1480 };
    
    // 고유 ID를 저장하여 중복 클릭 방지
    setActiveMarker({
      id: item.id,
      lat: newCenter.lat,
      lng: newCenter.lng
    });
    
    setMapConfig({
      center: newCenter,
      level: 5 // 클릭 시 상세하게 확대
    });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6 w-full p-0 bg-[#f8f9fb] lg:h-full min-h-0">
      {/* 리스트 섹션 */}
      <section className="w-full lg:w-[320px] flex flex-col bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden text-black lg:h-full min-h-[560px] md:min-h-[626px]">
        <header className="p-5 border-b border-gray-100 relative bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="text-orange-500 font-bold">⚠️</span> 최근 사고 속보
            </h3>
            <button onClick={refetch} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <RefreshCw size={20} className={`${isLoading ? 'animate-spin' : ''} text-gray-400`} />
            </button>
          </div>

          <div className="relative z-50">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex justify-between items-center p-3 bg-white border border-blue-400 rounded-lg text-left text-sm font-bold text-gray-700 shadow-sm"
            >
              {selectedOption.label}
              <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden border-t-0 z-[60]">
                {categories.map((cat) => (
                  <li 
                    key={cat.value}
                    onClick={() => { setSelectedOption(cat); setIsOpen(false); }}
                    className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors ${
                      selectedOption.value === cat.value ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cat.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>

        {/* 사고 리스트 바디 */}
        <div className="flex-1 bg-[#f1f3f7] p-3 space-y-3 custom-scrollbar lg:overflow-y-auto">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <RefreshCw className="animate-spin mb-2" />
              <p>데이터 로드 중...</p>
            </div>
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleItemClick(item)}
                className={`bg-white rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                  activeMarker?.id === item.id ? 'border-blue-500 shadow-md scale-[1.01]' : 'border-transparent'
                }`}
              >
                <div className="flex justify-between items-center px-4 py-2.5 bg-[#edf0f5]">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      item.category === '재난' ? 'bg-[#e53935]' : 'bg-[#fbc02d]'
                    }`}>
                      <span className="text-white text-xs">{item.category === '재난' ? '🚗' : '🚧'}</span>
                    </div>
                    <span className={`font-bold text-sm ${item.category === '재난' ? 'text-[#e53935]' : 'text-gray-700'}`}>
                      {item.type}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500 font-semibold">{item.displayDate}</span>
                </div>

                <div className="p-5 bg-white">
                  <p className="text-[15px] font-bold text-[#333] leading-snug mb-3">
                    {item.content}
                  </p>
                  <div className="pt-3 border-t border-dashed border-gray-100">
                    <p className="text-[12px] text-gray-400 flex items-center gap-1">
                      <span className="text-blue-400 font-bold">★</span> 발생 일시 : {item.detailDate}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <AlertCircle size={40} className="mb-2 opacity-20" />
              <p>해당 카테고리에 데이터가 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* 지도 섹션 */}
      <section className="flex-1 bg-white rounded-xl shadow-md border border-gray-200 relative overflow-hidden lg:h-full min-h-[400px]">
        <CommonMap 
          markers={mapMarkers} 
          selectedMarker={activeMarker}
          center={mapConfig.center}
          level={mapConfig.level}
        />
      </section>
    </div>
  );
};

export default AccidentNews;