// src/pages/admin/contents/behavioralGuide/BehavioralGuideData.js

/**
 * [관리자] 행동요령 관리 더미 데이터
 * * [데이터 구조 규칙]
 * 1. id: 고유 식별자 (API 기반)
 * 2. category: 재난 대분류 (natural: 자연재난, social: 사회재난, life: 생활안전)
 * 3. categoryName: 화면 표시용 대분류 명칭 (safety_cate_nm1)
 * 4. type: 재난 소분류 코드 (safety_cate2)
 * 5. typeName: 화면 표시용 소분류 명칭 (safety_cate_nm2 - 태풍, 해양오염 등)
 * 6. title: 행동요령 상세 제목 (safety_cate_nm3 - 태풍 특보 중 행동요령 등)
 * 7. actRmks: 실제 상세 행동요령 내용 (API의 actRmks 필드)
 * 8. visible: 노출 여부 (관리자 설정값)
 * 9. date: 등록일시
 */

export const AccidentNewsData = [
  // --- 자연재난 (natural) : 태풍 (10건) ---
  {
    "id": 1,
    "category": "natural",
    "categoryName": "자연재난",
    "type": "01001",
    "typeName": "태풍",
    "title": "태풍 특보 중 행동요령",
    "actRmks": "- TV, 라디오 등을 통해 기상정보를 청취하여 내가 있는 지역의 상황을 지속적으로 파악하고, 주변에 있는 사람들에게 알려 줍니다",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 2,
    "category": "natural",
    "categoryName": "자연재난",
    "type": "01001",
    "typeName": "태풍",
    "title": "태풍 예보시 행동요령",
    "actRmks": "- TV, 라디오, 인터넷, 스마트폰 등으로 기상상황을 미리 파악하여 어떻게 할지를 준비합니다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 3,
    "category": "natural",
    "categoryName": "자연재난",
    "type": "01001",
    "typeName": "태풍",
    "title": "태풍 특보 중 행동요령",
    "actRmks": "- 가스 누출로 2차 피해가 발생할 수 있으므로 미리 차단하고, 감전 위험이 있는 집 안팎의 전기시설은 만지지 않도록 합니다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 4,
    "category": "natural",
    "categoryName": "자연재난",
    "type": "01001",
    "typeName": "태풍",
    "title": "태풍 특보 중 행동요령",
    "actRmks": "- 가족, 지인, 이웃과 연락하여 안전을 확인하고 위험정보 등을 공유합니다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 5,
    "category": "natural",
    "categoryName": "자연재난",
    "type": "01001",
    "typeName": "태풍",
    "title": "태풍 이후 행동요령",
    "actRmks": "- 가족과 지인에게 연락하여 안전 여부를 확인하고, 연락이 되지 않고 실종이 의심될 경우에는 가까운 경찰서에 신고합니다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 6,
    "category": "natural",
    "categoryName": "자연재난",
    "type": "01001",
    "typeName": "태풍",
    "title": "태풍 예보시 행동요령",
    "actRmks": "- 가족과 함께 가정의 하수구나 집 주변의 배수구를 미리 점검하고 막힌 곳은 뚫습니다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 7,
    "category": "natural",
    "categoryName": "자연재난",
    "type": "01001",
    "typeName": "태풍",
    "title": "태풍 특보 중 행동요령",
    "actRmks": "- 강풍으로 인해 피해를 입지 않도록 가급적 욕실과 같이 창문이 없는 방이나 집안의 제일 안쪽으로 이동합니다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 8,
    "category": "natural",
    "categoryName": "자연재난",
    "type": "01001",
    "typeName": "태풍",
    "title": "태풍 특보 중 행동요령",
    "actRmks": "- 건물의 출입문, 창문은 닫아서 파손되지 않도록 하고, 창문이나 유리문에서 되도록 떨어져 있도록 합니다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 9,
    "category": "natural",
    "categoryName": "자연재난",
    "type": "01001",
    "typeName": "태풍",
    "title": "태풍 이후 행동요령",
    "actRmks": "- 고립된 지역에서는 무리하게 물을 건너지 말고, 119에 신고하거나 주변에 도움을 요청합니다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 10,
    "category": "natural",
    "categoryName": "자연재난",
    "type": "01001",
    "typeName": "태풍",
    "title": "태풍 특보 중 행동요령",
    "actRmks": "- 공사장, 전신주, 지하 공간 등 위험지역에는 접근하지 않도록 합니다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },

  // --- 사회재난 (social) : 해양오염사고 (10건) ---
  {
    "id": 11,
    "category": "social",
    "categoryName": "사회재난",
    "type": "02001",
    "typeName": "해양오염사고",
    "title": "조치 완료 후에는",
    "actRmks": "Q : 해양오염사고 발생시 어떻게 하면 인적피해를 최소화 할 수 있습니까? A : 위험지대 거주하는 경우 신속히 대피하며, 대피시에는 가능한 방독면, 물수건, 마스크 등으로 호흡기를 보호하고 우의나 비닐로 유류에 노출되지 않도록 합니다. 어린이와 노약자를 우선으로 대피시켜 오염원으로 인한 피해를 최소화 합니다.    오염된 지역 내에서는 식수나 음식물을 먹지 말고, 오염물에 접촉된 경우 비누로 깨끗이 씻읍시다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 12,
    "category": "social",
    "categoryName": "사회재난",
    "type": "02001",
    "typeName": "해양오염사고",
    "title": "발생시에는",
    "actRmks": "관계기관이 도착하면 주민들은 관계기관의 현장 안전관리 계획 등의 지시에 따라 행동 합니다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 13,
    "category": "social",
    "categoryName": "사회재난",
    "type": "02001",
    "typeName": "해양오염사고",
    "title": "발생시에는",
    "actRmks": "대책본부 설치 및 재정, 물품, 인원 등 사고수습을 지원합니다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 14,
    "category": "social",
    "categoryName": "사회재난",
    "type": "02001",
    "typeName": "해양오염사고",
    "title": "발생시에는",
    "actRmks": "방제물품 등을 배부 받고 해양오염사고에 대응하는 교육을 숙지합니다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 15,
    "category": "social",
    "categoryName": "사회재난",
    "type": "02001",
    "typeName": "해양오염사고",
    "title": "발생시에는",
    "actRmks": "방제작업 동원 시 마스크와 안전복 등을 착용하고 충분한 휴식을 취하며 안전사고에 주의합니다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 16,
    "category": "social",
    "categoryName": "사회재난",
    "type": "02001",
    "typeName": "해양오염사고",
    "title": "조치 완료 후에는",
    "actRmks": "사고로 인한 피해의 경제적 손실 여부를 점검하고 보상을 청구합니다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 17,
    "category": "social",
    "categoryName": "사회재난",
    "type": "02001",
    "typeName": "해양오염사고",
    "title": "발생하기 전에는",
    "actRmks": "사고에 대비하여 응급약품, 비상식량 등의 생필품은 미리 준비합니다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 18,
    "category": "social",
    "categoryName": "사회재난",
    "type": "02001",
    "typeName": "해양오염사고",
    "title": "발생시에는",
    "actRmks": "사전 교육을 받은 자원봉사자는 지시에 따라 사고수습을 지원합니다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 19,
    "category": "social",
    "categoryName": "사회재난",
    "type": "02001",
    "typeName": "해양오염사고",
    "title": "발생시에는",
    "actRmks": "오염된 지역 내에서는 식수나 음식물은 먹지 말고 오염물에 접촉된 경우, 비누로 깨끗이 씻읍시다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 20,
    "category": "social",
    "categoryName": "사회재난",
    "type": "02001",
    "typeName": "해양오염사고",
    "title": "발생시에는",
    "actRmks": "오염사고 목격시 국민안전처(혹은 해양환경관리공단) 및 지자체에 신속히 신고합니다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },

  // --- 생활안전 (life) : 응급처치 (10건) ---
  {
    "id": 21,
    "category": "life",
    "categoryName": "생활안전",
    "type": "03002",
    "typeName": "응급처치",
    "title": "뱀에 물렸을 경우",
    "actRmks": "119 또는 1339의 도움을 청한다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 22,
    "category": "life",
    "categoryName": "생활안전",
    "type": "03002",
    "typeName": "응급처치",
    "title": "과호흡증후군 응급처치",
    "actRmks": "‘과호흡증후군’은 이유도 없이 답답하게 느껴지고, 그 답답함에서 벗어나려고 열심히 호흡을 하는 동안에 더욱더 답답해져서 흥분상태에 빠지고, 때로는 실신하게 되는 수가 있다. 지나친 호흡운동에 따라서, 몸 안의 이산화탄소가 너무 밖으로 나와서 일어나는 경우다. 불안감 스트레스 등이 주원인인데, 특히 신경이 예민한 젊은 여성에게 주로 발생을 한다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 23,
    "category": "life",
    "categoryName": "생활안전",
    "type": "03002",
    "typeName": "응급처치",
    "title": "열로 인한 질환 예방",
    "actRmks": "가능한 시원한 시간대에 일을 합시다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 24,
    "category": "life",
    "categoryName": "생활안전",
    "type": "03002",
    "typeName": "응급처치",
    "title": "과호흡증후군 응급처치",
    "actRmks": "가슴에 통증이 생기거나 팔다리가 꼬이는 느낌이 들며 숨이 매우 가파지는 증상을 나타낸다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 25,
    "category": "life",
    "categoryName": "생활안전",
    "type": "03002",
    "typeName": "응급처치",
    "title": "응급처치 국민행동요령",
    "actRmks": "다친 사람이나 급성질환자에게 사고 현장에서 즉시 조치를 취하는 것을 말한다. 이는 보다 나은 병원 치료를 받을 때까지 일시적으로 도와주는 것일 뿐 아니라, 적절한 조치로 회복상태에 이르도록 하는 것을 포함한다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 26,
    "category": "life",
    "categoryName": "생활안전",
    "type": "03002",
    "typeName": "응급처치",
    "title": "응급처치",
    "actRmks": "대설-동상",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 27,
    "category": "life",
    "categoryName": "생활안전",
    "type": "03002",
    "typeName": "응급처치",
    "title": "응급처치 국민행동요령",
    "actRmks": "동의  - 응급처치를 하기 전 처치자는 반드시 부상자로부터 사전 동의를 얻도록 한다. 허락이나 동의없이 신체를 접촉하는 행위는 위법이며, 어떤 면에서는 폭행으로 간주되어 법적 소송에 휘말릴 수 있다. 따라서 부상자의 사전 동의 없는 응급처치 행위는 위법이 될 수 있다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 28,
    "category": "life",
    "categoryName": "생활안전",
    "type": "03002",
    "typeName": "응급처치",
    "title": "응급처치 국민행동요령",
    "actRmks": "또한 의학적 치료 여부에 따라 장애가 일시적이거나, 영구적일 수도 있다. 응급처치는 일반적으로 타인에게 실시하는 것이지만 상대가 본인이나 가족인 경우는 곧 자신을 위한 일이 된다. 이처럼 응급상황을 인지하고 처치할 줄 안다면 삶의 질을 향상시킬 수 있다. 문제는 응급상황을 인지하지 못하여 기본증상조차 파악하지 못하는 경우가 생각보다 많다는 것이다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 29,
    "category": "life",
    "categoryName": "생활안전",
    "type": "03002",
    "typeName": "응급처치",
    "title": "화상",
    "actRmks": "로션을 바르거나 연고, 기름 같은 것도 바르지 맙시다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  },
  {
    "id": 30,
    "category": "life",
    "categoryName": "생활안전",
    "type": "03002",
    "typeName": "응급처치",
    "title": "응급처치 국민행동요령",
    "actRmks": "명시적 동의  - 의식이 있는 경우 즉, 이성적인 결정을 내릴 수 있는 법적인 성인에게는 사전 동의를 얻어야 한다. 처치자는 자신의 이름을 대고 응급처치 교육을 받았음을 밝혀야 한다. 그리고 앞으로 실시할 응급처치에 대해 설명을 해야 한다. 부상자는 상태에 따라 직접 말을 하거나 고개를 끄덕이는 방법으로 의사표현을 할 것이다.",
    "visible": true,
    "date": "2025-05-20 06:00"
  }
];