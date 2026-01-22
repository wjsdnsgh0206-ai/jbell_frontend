import React from 'react';
import { Maximize2, Minimize2, Map as MapIcon } from 'lucide-react';

const DisasterSummarySection = () => {
  const mapMarkers = [
    { id: 1, top: "128px", left: "152px", color: "#de3412", label: "주의" },
    { id: 2, top: "315px", left: "464px", color: "#de3412", label: "주의" },
    { id: 3, top: "110px", left: "454px", color: "#0b78cb", label: "위급" },
  ];

  return (
    <section className="flex-1 h-[416px] relative rounded-xl border border-solid border-gray-200 bg-slate-50 flex flex-col items-center justify-center shadow-sm">
      <MapIcon size={180} className="text-slate-200" />
      {mapMarkers.map((marker) => (
        <div key={marker.id} className="absolute flex flex-col items-center" style={{ top: marker.top, left: marker.left }}>
          <div className="w-4 h-4 rounded-full shadow-lg animate-pulse" style={{ backgroundColor: marker.color }} />
        </div>
      ))}
      <div className="absolute top-4 right-4 flex gap-2">
        <button className="p-1.5 bg-white border rounded shadow-sm hover:bg-gray-50"><Maximize2 size={16}/></button>
        <button className="p-1.5 bg-white border rounded shadow-sm hover:bg-gray-50"><Minimize2 size={16}/></button>
      </div>
      <div className="text-center z-10 mt-4">
        <h2 className="font-bold text-[#1d1d1d] text-[17px]">지도 영역</h2>
        <p className="text-gray-400 text-sm">(카카오 API 연동 예정)</p>
      </div>
      <div className="absolute bottom-6 right-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-medium"><div className="w-3 h-3 rounded-full bg-[#0B78CB]" /> 위급(재난)</div>
        <div className="flex items-center gap-2 text-xs font-medium"><div className="w-3 h-3 rounded-full bg-[#DE3412]" /> 주의(특보)</div>
      </div>
    </section>
  );
};

export default DisasterSummarySection;