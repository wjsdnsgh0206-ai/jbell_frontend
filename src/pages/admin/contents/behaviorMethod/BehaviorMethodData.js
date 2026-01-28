// src/pages/admin/contents/behaviorMethod/BehaviorMethodData.js

/**
 * [관리자] 행동요령 관리 더미 데이터 (리팩토링 완료)
 * * [데이터 구조 규칙 - CamelCase 적용]
 * 1. contentId: 고유 식별자 (DB: content_id)
 * 2. contentType: 재난 유형 코드 통합 (DB: content_type) -> 예: TYPHOON, MARINE_POLLUTION, FIRST_AID
 * 3. title: 행동요령 상세 제목 (DB: title)
 * 4. body: 실제 상세 행동요령 내용 HTML/Text (DB: body)
 * 5. visibleYn: 노출 여부 'Y'/'N' (DB: visible_yn)
 * 6. contentLink: 출처 또는 관련 링크 (DB: content_link)
 * 7. createdAt: 등록일시 (DB: created_at)
 * 8. ordering: 정렬 순서 (DB: ordering)
 */

export const BehaviorMethodData = [
  // --- 자연재난 (natural) : 태풍 (TYPHOON) ---
  {
    contentId: 1,
    contentType: "TYPHOON",
    title: "태풍 특보 중 행동요령",
    body: "- TV, 라디오 등을 통해 기상정보를 \n 청취하여 내가 있는 지역의 상황을 지속적으로 파악하고, 주변에 있는 사람들에게 알려 줍니다",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 1
  },
  {
    contentId: 2,
    contentType: "TYPHOON",
    title: "태풍 예보시 행동요령",
    body: "- TV, 라디오, 인터넷, 스마트폰 등으로 기상상황을 미리 파악하여 어떻게 할지를 준비합니다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 2
  },
  {
    contentId: 3,
    contentType: "TYPHOON",
    title: "태풍 특보 중 행동요령",
    body: "- 가스 누출로 2차 피해가 발생할 수 있으므로 미리 차단하고, 감전 위험이 있는 집 안팎의 전기시설은 만지지 않도록 합니다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 3
  },
  {
    contentId: 4,
    contentType: "TYPHOON",
    title: "태풍 특보 중 행동요령",
    body: "- 가족, 지인, 이웃과 연락하여 안전을 확인하고 위험정보 등을 공유합니다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 4
  },
  {
    contentId: 5,
    contentType: "TYPHOON",
    title: "태풍 이후 행동요령",
    body: "- 가족과 지인에게 연락하여 안전 여부를 확인하고, 연락이 되지 않고 실종이 의심될 경우에는 가까운 경찰서에 신고합니다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 5
  },
  {
    contentId: 6,
    contentType: "TYPHOON",
    title: "태풍 예보시 행동요령",
    body: "- 가족과 함께 가정의 하수구나 집 주변의 배수구를 미리 점검하고 막힌 곳은 뚫습니다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 6
  },
  {
    contentId: 7,
    contentType: "TYPHOON",
    title: "태풍 특보 중 행동요령",
    body: "- 강풍으로 인해 피해를 입지 않도록 가급적 욕실과 같이 창문이 없는 방이나 집안의 제일 안쪽으로 이동합니다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 7
  },
  {
    contentId: 8,
    contentType: "TYPHOON",
    title: "태풍 특보 중 행동요령",
    body: "- 건물의 출입문, 창문은 닫아서 파손되지 않도록 하고, 창문이나 유리문에서 되도록 떨어져 있도록 합니다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 8
  },
  {
    contentId: 9,
    contentType: "TYPHOON",
    title: "태풍 이후 행동요령",
    body: "- 고립된 지역에서는 무리하게 물을 건너지 말고, 119에 신고하거나 주변에 도움을 요청합니다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 9
  },
  {
    contentId: 10,
    contentType: "TYPHOON",
    title: "태풍 특보 중 행동요령",
    body: "- 공사장, 전신주, 지하 공간 등 위험지역에는 접근하지 않도록 합니다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 10
  },

  // --- 사회재난 (social) : 해양오염사고 (MARINE_POLLUTION) ---
  {
    contentId: 11,
    contentType: "MARINE_POLLUTION",
    title: "조치 완료 후에는",
    body: "Q : 해양오염사고 발생시 어떻게 하면 인적피해를 최소화 할 수 있습니까? A : 위험지대 거주하는 경우 신속히 대피하며, 대피시에는 가능한 방독면, 물수건, 마스크 등으로 호흡기를 보호하고 우의나 비닐로 유류에 노출되지 않도록 합니다. 어린이와 노약자를 우선으로 대피시켜 오염원으로 인한 피해를 최소화 합니다. 오염된 지역 내에서는 식수나 음식물을 먹지 말고, 오염물에 접촉된 경우 비누로 깨끗이 씻읍시다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 11
  },
  {
    contentId: 12,
    contentType: "MARINE_POLLUTION",
    title: "발생시에는",
    body: "관계기관이 도착하면 주민들은 관계기관의 현장 안전관리 계획 등의 지시에 따라 행동 합니다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 12
  },
  {
    contentId: 13,
    contentType: "MARINE_POLLUTION",
    title: "발생시에는",
    body: "대책본부 설치 및 재정, 물품, 인원 등 사고수습을 지원합니다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 13
  },
  {
    contentId: 14,
    contentType: "MARINE_POLLUTION",
    title: "발생시에는",
    body: "방제물품 등을 배부 받고 해양오염사고에 대응하는 교육을 숙지합니다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 14
  },
  {
    contentId: 15,
    contentType: "MARINE_POLLUTION",
    title: "발생시에는",
    body: "방제작업 동원 시 마스크와 안전복 등을 착용하고 충분한 휴식을 취하며 안전사고에 주의합니다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 15
  },
  {
    contentId: 16,
    contentType: "MARINE_POLLUTION",
    title: "조치 완료 후에는",
    body: "사고로 인한 피해의 경제적 손실 여부를 점검하고 보상을 청구합니다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 16
  },
  {
    contentId: 17,
    contentType: "MARINE_POLLUTION",
    title: "발생하기 전에는",
    body: "사고에 대비하여 응급약품, 비상식량 등의 생필품은 미리 준비합니다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 17
  },
  {
    contentId: 18,
    contentType: "MARINE_POLLUTION",
    title: "발생시에는",
    body: "사전 교육을 받은 자원봉사자는 지시에 따라 사고수습을 지원합니다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 18
  },
  {
    contentId: 19,
    contentType: "MARINE_POLLUTION",
    title: "발생시에는",
    body: "오염된 지역 내에서는 식수나 음식물은 먹지 말고 오염물에 접촉된 경우, 비누로 깨끗이 씻읍시다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 19
  },
  {
    contentId: 20,
    contentType: "MARINE_POLLUTION",
    title: "발생시에는",
    body: "오염사고 목격시 국민안전처(혹은 해양환경관리공단) 및 지자체에 신속히 신고합니다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 20
  },

  // --- 생활안전 (life) : 응급처치 (FIRST_AID) ---
  {
    contentId: 21,
    contentType: "FIRST_AID",
    title: "뱀에 물렸을 경우",
    body: "119 또는 1339의 도움을 청한다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 21
  },
  {
    contentId: 22,
    contentType: "FIRST_AID",
    title: "과호흡증후군 응급처치",
    body: "‘과호흡증후군’은 이유도 없이 답답하게 느껴지고, 그 답답함에서 벗어나려고 열심히 호흡을 하는 동안에 더욱더 답답해져서 흥분상태에 빠지고, 때로는 실신하게 되는 수가 있다. 지나친 호흡운동에 따라서, 몸 안의 이산화탄소가 너무 밖으로 나와서 일어나는 경우다. 불안감 스트레스 등이 주원인인데, 특히 신경이 예민한 젊은 여성에게 주로 발생을 한다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 22
  },
  {
    contentId: 23,
    contentType: "FIRST_AID",
    title: "열로 인한 질환 예방",
    body: "가능한 시원한 시간대에 일을 합시다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 23
  },
  {
    contentId: 24,
    contentType: "FIRST_AID",
    title: "과호흡증후군 응급처치",
    body: "가슴에 통증이 생기거나 팔다리가 꼬이는 느낌이 들며 숨이 매우 가파지는 증상을 나타낸다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 24
  },
  {
    contentId: 25,
    contentType: "FIRST_AID",
    title: "응급처치 국민행동요령",
    body: "다친 사람이나 급성질환자에게 사고 현장에서 즉시 조치를 취하는 것을 말한다. 이는 보다 나은 병원 치료를 받을 때까지 일시적으로 도와주는 것일 뿐 아니라, 적절한 조치로 회복상태에 이르도록 하는 것을 포함한다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 25
  },
  {
    contentId: 26,
    contentType: "FIRST_AID",
    title: "응급처치",
    body: "대설-동상",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 26
  },
  {
    contentId: 27,
    contentType: "FIRST_AID",
    title: "응급처치 국민행동요령",
    body: "동의  - 응급처치를 하기 전 처치자는 반드시 부상자로부터 사전 동의를 얻도록 한다. 허락이나 동의없이 신체를 접촉하는 행위는 위법이며, 어떤 면에서는 폭행으로 간주되어 법적 소송에 휘말릴 수 있다. 따라서 부상자의 사전 동의 없는 응급처치 행위는 위법이 될 수 있다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 27
  },
  {
    contentId: 28,
    contentType: "FIRST_AID",
    title: "응급처치 국민행동요령",
    body: "또한 의학적 치료 여부에 따라 장애가 일시적이거나, 영구적일 수도 있다. 응급처치는 일반적으로 타인에게 실시하는 것이지만 상대가 본인이나 가족인 경우는 곧 자신을 위한 일이 된다. 이처럼 응급상황을 인지하고 처치할 줄 안다면 삶의 질을 향상시킬 수 있다. 문제는 응급상황을 인지하지 못하여 기본증상조차 파악하지 못하는 경우가 생각보다 많다는 것이다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 28
  },
  {
    contentId: 29,
    contentType: "FIRST_AID",
    title: "화상",
    body: "로션을 바르거나 연고, 기름 같은 것도 바르지 맙시다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 29
  },
  {
    contentId: 30,
    contentType: "FIRST_AID",
    title: "응급처치 국민행동요령",
    body: "명시적 동의  - 의식이 있는 경우 즉, 이성적인 결정을 내릴 수 있는 법적인 성인에게는 사전 동의를 얻어야 한다. 처치자는 자신의 이름을 대고 응급처치 교육을 받았음을 밝혀야 한다. 그리고 앞으로 실시할 응급처치에 대해 설명을 해야 한다. 부상자는 상태에 따라 직접 말을 하거나 고개를 끄덕이는 방법으로 의사표현을 할 것이다.",
    visibleYn: "Y",
    contentLink: "",
    createdAt: "2025-05-20 06:00",
    ordering: 30
  }
];