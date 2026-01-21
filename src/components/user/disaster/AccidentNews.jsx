import React, { useState } from 'react';
import { useAccidentNews } from '@/hooks/user/useAccidentNews';
import { RefreshCw, ChevronDown, AlertCircle, MapPin, Clock } from 'lucide-react';
import CommonMap from "@/components/user/modal/CommonMap"; 

const AccidentNews = () => {
  const { accidents, isLoading, refetch } = useAccidentNews();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({ label: '전체 보기', value: '전체' });
  
  const [activeMarker, setActiveMarker] = useState(null);
  const [mapConfig, setMapConfig] = useState({
    center: { lat: 35.8242, lng: 127.1480 },
    level: 8
  });

  const categories = [
    { label: '전체 보기', value: '전체' },
    { label: '재난 / 사고', value: '재난' },
    { label: '도로 공사', value: '공사' },
    { label: '기타 돌발', value: '기타돌발' }
  ];

  const filteredData = accidents.filter(item => 
    selectedOption.value === '전체' ? true : item.category === selectedOption.value
  );

  const mapMarkers = filteredData.map(item => ({
    lat: item.lat,
    lng: item.lng,
    id: item.id,
    content: `
      <div style="padding: 10px; min-width: 200px;">
        <div style="color: #ef4444; font-weight: bold; margin-bottom: 5px;">[${item.type}] ${item.detailType}</div>
        <div style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">${item.content}</div>
        <div style="font-size: 12px; color: #64748b;">
          📍 ${item.roadName} (${item.direction})<br/>
          🚧 ${item.blockedLanes} ${item.blockType}<br/>
          ⏰ ${item.displayDate} 시작
        </div>
      </div>
    `
  }));

  const handleItemClick = (item) => {
    const newCenter = { lat: item.lat, lng: item.lng };
    setActiveMarker({ id: item.id, lat: item.lat, lng: item.lng });
    setMapConfig({ center: newCenter, level: 5 });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6 w-full p-0 bg-[#f8f9fb] lg:h-full min-h-0">
      <section className="w-full lg:w-[320px] flex flex-col bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden text-black lg:h-full min-h-[560px]">
        <header className="p-5 border-b border-gray-100 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="text-orange-500">⚠️</span> 최근 사고 속보
            </h3>
            <button onClick={refetch} className="p-2 hover:bg-gray-100 rounded-full">
              <RefreshCw size={20} className={`${isLoading ? 'animate-spin' : ''} text-gray-400`} />
            </button>
          </div>

          <div className="relative z-50">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex justify-between items-center p-3 border border-blue-400 rounded-lg text-sm font-bold shadow-sm"
            >
              {selectedOption.label}
              <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[60]">
                {categories.map((cat) => (
                  <li 
                    key={cat.value}
                    onClick={() => { setSelectedOption(cat); setIsOpen(false); }}
                    className={`px-4 py-3 text-sm font-bold cursor-pointer ${selectedOption.value === cat.value ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                  >
                    {cat.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>

        <div className="flex-1 bg-[#f1f3f7] p-3 space-y-3 lg:overflow-y-auto">
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
                className={`bg-white rounded-lg border-2 transition-all ${activeMarker?.id === item.id ? 'border-blue-500 shadow-md scale-[1.01]' : 'border-transparent'}`}
              >
                <div className="flex justify-between items-center px-4 py-2 bg-[#edf0f5]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-white font-bold border border-gray-200">
                      {item.roadType}
                    </span>
                    <span className={`font-bold text-sm ${item.category === '재난' ? 'text-[#e53935]' : 'text-blue-600'}`}>
                      {item.type}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500">{item.displayDate}</span>
                </div>

                <div className="p-4">
                  <p className="text-[15px] font-bold text-[#333] mb-2 leading-tight">
                    {item.content}
                  </p>
                  
                  <div className="space-y-1 mt-3 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1.5 text-[12px] text-gray-600">
                      <MapPin size={13} className="text-gray-400" />
                      <span className="font-semibold">{item.roadName}</span>
                      <span className="text-gray-400">|</span>
                      <span>{item.direction}</span>
                    </div>
                    
                    {(item.blockedLanes || item.blockType) && (
                      <div className="flex items-center gap-1.5 text-[12px] text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        <span className="font-bold">통제:</span>
                        <span>{item.blockedLanes} ({item.blockType})</span>
                      </div>
                    )}

                    {item.endDate && (
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Clock size={12} />
                        <span>종료 예정: {item.endDate}</span>
                      </div>
                    )}
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