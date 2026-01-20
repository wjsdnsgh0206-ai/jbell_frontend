import React, { useState } from 'react';

const JeonbukMap = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('완주군');
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  const districts = [
    { id: 1, name: '전주시', coords: '177,105,173,120,183,127,181,136,184,142,184,148,181,156,188,162,203,155,209,147,217,150,232,134,225,128,221,119,215,118,204,104' },
    { id: 2, name: '군산시', coords: '127,47,98,56,95,69,43,77,59,89,61,107,76,112,80,120,127,96,138,65' },
    { id: 3, name: '익산시', coords: '177,104,161,106,152,99,129,99,141,65,127,45,130,16,149,5,175,9,180,32,198,43,199,61,185,92,175,94' },
    { id: 4, name: '정읍시', coords: '131,267,105,260,100,225,87,222,98,188,118,182,119,172,132,160,158,171,169,183,181,185,188,205,194,208,186,221,197,245,159,233' },
    { id: 5, name: '남원시', coords: '330,232,324,258,307,259,306,248,283,235,274,235,268,230,261,230,264,246,253,260,219,309,223,318,232,314,280,325,295,302,324,322,340,307,354,268' },
    { id: 6, name: '김제시', coords: '81,122,126,100,149,102,159,107,174,105,172,115,163,132,180,150,185,166,179,183,168,181,161,169,130,156,126,165,114,171,85,134' },
    { id: 7, name: '완주군', coords: '178,103,176,94,187,94,201,62,201,40,215,27,239,21,246,14,259,22,267,57,262,96,245,140,240,153,235,159,235,176,213,164,200,180,202,189,196,206,188,204,182,183,184,176,188,167,182,149,163,134,174,116,181,130,183,146,183,157,189,163,205,155,210,148,216,152,235,134,225,126,223,118,217,117,204,103' },
    { id: 8, name: '진안군', coords: '268,59,264,75,262,100,242,151,248,182,258,189,281,198,286,206,293,205,294,178,313,139,326,139,335,116,325,110,310,70,292,71,281,55' },
    { id: 9, name: '무주군', coords: '360,142,334,125,337,117,327,109,312,69,311,54,355,41,401,49,414,85,398,112,384,122,368,122' },
    { id: 10, name: '장수군', coords: '359,145,334,126,328,140,314,142,296,179,294,204,274,210,269,228,274,233,284,232,308,245,308,257,323,257,327,231' },
    { id: 11, name: '임실군', coords: '242,154,238,160,237,179,214,167,202,181,203,189,195,210,188,221,210,266,222,255,251,259,262,247,257,228,267,228,273,208,282,205,278,199,249,185' },
    { id: 12, name: '순창군', coords: '217,314,249,263,223,257,210,268,198,248,160,235,133,264,150,292,172,266,180,284,180,319,202,326' },
    { id: 13, name: '고창군', coords: '74,224,97,227,104,263,86,306,59,321,37,320,8,274,21,242' },
    { id: 14, name: '부안군', coords: '118,172,116,181,97,188,86,222,78,223,68,216,28,221,13,203,60,162,55,155,63,140,76,144,84,137' }
  ];

  const districtLabels = [
    { name: '전주시', x: 203, y: 140 },
    { name: '군산시', x: 100, y: 90 },
    { name: '익산시', x: 165, y: 60 },
    { name: '정읍시', x: 145, y: 215 },
    { name: '남원시', x: 290, y: 285 },
    { name: '김제시', x: 135, y: 140 },
    { name: '완주군', x: 230, y: 80 },
    { name: '진안군', x: 290, y: 130 },
    { name: '무주군', x: 365, y: 90 },
    { name: '장수군', x: 319, y: 195 },
    { name: '임실군', x: 230, y: 220 },
    { name: '순창군', x: 205, y: 290 },
    { name: '고창군', x: 60, y: 275 },
    { name: '부안군', x: 75, y: 185 }
  ];

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      padding: '120px 0', // 상하 여백을 줘서 공간 확보
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '600px', 
        position: 'relative' // 자식 요소 기준점
      }}>
        <svg 
          viewBox="0 0 420 340" 
          preserveAspectRatio="xMidYMid meet" // SVG 자체를 중앙에 고정
          style={{ width: '100%', height: 'auto' }}
        >
          {districts.map((district) => (
            <polygon
              key={district.id}
              points={district.coords}
              fill={selectedDistrict === district.name ? '#1e5a9e' : (hoveredDistrict === district.name ? '#3b7ec4' : '#d4e4f7')}
              stroke="#ffffff"
              strokeWidth="2"
              style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
              onMouseEnter={() => setHoveredDistrict(district.name)}
              onMouseLeave={() => setHoveredDistrict(null)}
              onClick={() => setSelectedDistrict(district.name)}
            />
          ))}
          
          {districtLabels.map((label, index) => (
            <text
              key={index}
              x={label.x}
              y={label.y}
              textAnchor="middle"
              fill={selectedDistrict === label.name ? '#ffffff' : '#2c3e50'}
              fontSize="12.5"
              fontWeight="600"
              pointerEvents="none"
              style={{ userSelect: 'none' }}
            >
              {label.name}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default JeonbukMap;