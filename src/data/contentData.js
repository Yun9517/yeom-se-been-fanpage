export const videosData = [
  { id: 'gMb8xHtg-VA', title: '固定影片 1' },
  { id: '0ViTu7kRdlM', title: '固定影片 2' },
  { id: 'uzDZwqO4lI8', title: '最新影片' },
  { id: '7xrOohoT6jg', title: '最熱門影片' },
];

export const masterQuestions = [
  {
    question: '廉世彬是哪一年出道的？',
    options: ['2020', '2021', '2022', '2023'],
    answer: '2022',
  },
  {
    question: '廉世彬的MBTI是?',
    options: ['INFJ', 'ENFJ', 'ENTP', 'ISTP'],
    answer: 'ISTP',
  },
  {
    question: '有歌手夢的廉世彬，當歌手的藝名是甚麼?',
    options: ['Snoopy', 'Snooze', '女王阿彬', 'LISA'],
    answer: 'Snooze',
  },
  {
    question: '廉世彬第一支加入的"棒球"啦啦隊是哪一支球隊?',
    options: ['樂天巨人', 'NC恐龍', '起亞虎', '韓華鷹'],
    answer: '起亞虎',
  },
  {
    question: '廉世彬個人單曲Cherry Blooming，是在哪一天發布的?',
    options: ['2025年6月16日(GMT+8)', '2025年6月18日(GMT+8)', '2025年5月16日(GMT+8)', '2025年5月18日(GMT+8)'],
    answer: '2025年6月16日(GMT+8)',
  },
  {
    question: '廉世彬就讀白石藝術大學時，主修甚麼科系呢?',
    options: ['實用舞蹈系', '實用表演系', '實用音樂系', '實用話劇系'],
    answer: '實用音樂系',
  },
  {
    question: '廉世彬與河智媛、禹洙漢在台灣職棒明星賽期間，開的快閃店餐廳，店名是甚麼?',
    options: ['好厝邊〝Hasubeen〞', '夢想食堂', '樂天三本柱美食餐廳', 'A Joy 響'],
    answer: '好厝邊〝Hasubeen〞',
  },
  {
    question: '廉世彬自出道以來受到眾多粉絲喜歡，有許多外號，以下哪個不是?',
    options: ['啦啦隊女王', '拯救世界的廉世彬', '怪物新人', '阿彬'],
    answer: '怪物新人',
  },
  {
    question: '廉世彬首張單曲새벽감성，是在哪一年發布的?',
    options: ['2021', '2022', '2023', '2024'],
    answer: '2024',
  },
  {
    question: '廉世彬的生日是哪一天',
    options: ['2月9日', '4月23日', '4月25日', '9月8日'],
    answer: '4月23日',
  },
];

export const getRandomQuestions = (allQuestions, num = 5) => {
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};
