export const DISASTER_OPTIONS = {
  // 재난 단계/카테고리
  CATEGORIES: [
    { value: '안전안내', label: '안전안내' },
    { value: '긴급재난', label: '긴급재난' },
    { value: '위급재난', label: '위급재난' },
  ],

  // 재난 유형 (중요도 및 발생 빈도순 상위 배치)
  TYPES: [
    // 1순위: 기상/자연재해 (빈번함)
    { value: '호우', label: '호우' },
    { value: '태풍', label: '태풍' },
    { value: '대설', label: '대설' },
    { value: '화재', label: '화재' },
    { value: '지진', label: '지진' },
    { value: '폭염', label: '폭염' },
    { value: '한파', label: '한파' },
    
    // 2순위: 주의/경보 (사회적 영향)
    { value: '미세먼지', label: '미세먼지' },
    { value: '황사', label: '황사' },
    { value: '산불', label: '산불' },
    { value: '강풍', label: '강풍' },
    { value: '건조', label: '건조' },
    { value: '산사태', label: '산사태' },
    { value: '풍랑', label: '풍랑' },
    { value: '안개', label: '안개' },
    
    // 3순위: 사고/안전 (교통 및 시설)
    { value: '교통', label: '교통' },
    { value: '교통통제', label: '교통통제' },
    { value: '교통사고', label: '교통사고' },
    { value: '붕괴', label: '붕괴' },
    { value: '폭발', label: '폭발' },
    { value: '수도', label: '수도' },
    { value: '정전', label: '정전' },
    { value: '에너지', label: '에너지' },
    
    // 4순위: 질병/환경/안보
    { value: '전염병', label: '전염병' },
    { value: '가축질병', label: '가축질병' },
    { value: 'AI', label: 'AI' },
    { value: '환경오염사고', label: '환경오염사고' },
    { value: '지진해일', label: '지진해일' },
    { value: '민방공', label: '민방공' },
    { value: '테러', label: '테러' },
    
    // 5순위: 기타 및 특수 재난
    { value: '가뭄', label: '가뭄' },
    { value: '금융', label: '금융' },
    { value: '통신', label: '통신' },
    { value: '홍수', label: '홍수' },
    { value: '기타', label: '기타' },
  ]
};