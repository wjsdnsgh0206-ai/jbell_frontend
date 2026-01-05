 // 팀원 공유용: 홍수 행동요령 데이터 파일
export const forestFireData = {
  // 1. 페이지 메타 정보
  meta: {
    title: "재난 타이틀",
    lastUpdated: "2025년 12월 16일",
    breadcrumbs: [
      { label: "홈", hasIcon: true },
      { label: "행동요령", hasIcon: false },
      { label: "자연재난행동요령", hasIcon: false },
      { label: "재난 타이틀", hasIcon: false },
    ],
    tabs: [
      { label: "발생 전 대비요령" },
      { label: "특보 중 행동요령" },
      { label: "이후 행동요령" },
    ]
  },

  // 2. 탭별 상세 컨텐츠
  contents: [
    // [Tab 0] 발생 전 대비요령
    {
      subTitle: "발생 전 대비요령",
      guidelines: [
        "설명 1",
        "설명 2",
        "설명 3",
        "설명 4",
        "설명 5",
      ],
      videos: [
        {
          title: "영상 제목",
          description: "영상 설명",
          image: "https://c.animaapp.com/VB47VnAn/img/image-1@2x.png",
        }
      ]
    },

    // [Tab 1] 특보 중
    {
      subTitle: "특보 중 행동요령",
      guidelines: [
        "설명 1",
        "설명 2",
        "설명 3",
        "설명 4",
        "설명 5",
      ],
      videos: [
        {
          title: "영상 제목1",
          description: "영상 설명",
          image: "https://c.animaapp.com/VB47VnAn/img/image-1@2x.png",
        },
        {
          title: "영상 제목2",
          description: "영상 설명",
          image: "https://c.animaapp.com/VB47VnAn/img/image-1@2x.png",
        }
      ]
    },

    // [Tab 2] 이후
    {
      subTitle: "이후 행동요령",
      guidelines: [
        "설명 1",
        "설명 2",
        "설명 3",
        "설명 4",
        "설명 5",
      ],
      videos: []
    }
  ]
};