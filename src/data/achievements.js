export const achievementTiers = {
  BRONZE: { name: '銅牌', order: 1, color: '#8C7853' },
  SILVER: { name: '銀牌', order: 2, color: '#A9ACB6' },
  GOLD: { name: '金牌', order: 3, color: '#FFD017' },
  PLATINUM: { name: '白金', order: 4, color: '#02DF82' },
  DIAMOND: { name: '鑽石', order: 5, color: '#00BFFF' }, // 高亮水藍色
  MASTER: { name: '大師', order: 6, color: '#AE00AE' }, // 原鑽石色
};

export const achievementsList = [
  // --- 登入類成就 ---
  {
    id: 'firstLogin',
    name: '首次登入',
    description: '第一次來到這裡，歡迎！',
    tier: 'BRONZE',
    hidden: false,
  },
  {
    id: 'threeDayLogin',
    name: '來三天囉',
    description: '連續登入 3 天，你很關心阿彬喔！',
    tier: 'SILVER',
    hidden: false,
  },
  {
    id: 'sevenDayLogin',
    name: '阿彬鐵粉',
    description: '連續登入 7 天，你一定是鐵粉！',
    tier: 'GOLD',
    hidden: false,
  },
  {
    id: 'thirtyDayLogin',
    name: '女王的忠實護衛',
    description: '連續登入 30 天，女王感謝你的守護！',
    tier: 'PLATINUM',
    hidden: false,
  },
  {
    id: 'earlySupporter',
    name: '首批阿彬粉',
    description: '能找到阿彬粉絲頁的你不簡單，感謝你對阿彬的愛！',
    tier: 'DIAMOND',
    hidden: false, 
  },
  // --- 答題表現類成就 ---
  {
    id: 'firstPerfectScore',
    name: '首次全對',
    description: '全部答對，太厲害了！',
    tier: 'PLATINUM',
    hidden: false,
  },
  {
    id: 'firstAllWrong',
    name: '沒關係',
    description: '第一次全部答錯，別灰心！',
    tier: 'BRONZE',
    hidden: false,
  },
  // --- 答錯累積類成就 ---
  {
    id: 'tenIncorrectAnswers',
    name: '再接再厲',
    description: '累積答錯 10 題，錯誤是成功之母！',
    tier: 'BRONZE',
    hidden: false,
    progressField: 'totalIncorrectAnswers',
    targetValue: 10,
  },
  {
    id: 'fiftyIncorrectAnswers',
    name: '不怕失敗',
    description: '累積答錯 50 題，你的勇氣值得讚賞！',
    tier: 'SILVER',
    hidden: false,
    progressField: 'totalIncorrectAnswers',
    targetValue: 50,
  },
  {
    id: 'hundredIncorrectAnswers',
    name: '越挫越勇',
    description: '累積答錯 100 題，堅持下去就是勝利！',
    tier: 'GOLD',
    hidden: false,
    progressField: 'totalIncorrectAnswers',
    targetValue: 100,
  },
  // --- 答對累積類成就 ---
  {
    id: 'tenCorrectAnswers',
    name: '小有成就',
    description: '累積答對 10 題，不錯喔！',
    tier: 'BRONZE',
    hidden: false,
    progressField: 'totalCorrectAnswers',
    targetValue: 10,
  },
  {
    id: 'fiftyCorrectAnswers',
    name: '鋼鐵粉絲',
    description: '累積答對 50 題，你對阿彬瞭若指掌！',
    tier: 'SILVER',
    hidden: false,
    progressField: 'totalCorrectAnswers',
    targetValue: 50,
  },
  {
    id: 'hundredCorrectAnswers',
    name: '阿彬知識王',
    description: '累積答對 100 題，你就是傳說中的知識王！',
    tier: 'GOLD',
    hidden: false,
    progressField: 'totalCorrectAnswers',
    targetValue: 100,
  },
  // --- 總答題數類成就 ---
  {
    id: 'hundredQuizzes',
    name: '刷題高手',
    description: '累積完成 100 次測驗，你很有毅力！',
    tier: 'SILVER',
    hidden: false,
    progressField: 'totalQuizzesAnswered',
    targetValue: 100,
  },
  {
    id: 'fiveHundredQuizzes',
    name: '刷題達人',
    description: '累積完成 500 次測驗，太驚人了！',
    tier: 'GOLD',
    hidden: false,
    progressField: 'totalQuizzesAnswered',
    targetValue: 500,
  },
  {
    id: 'thousandQuizzes',
    name: '阿彬代言人',
    description: '累積完成 1000 次測驗，你就是阿彬的官方代言人！',
    tier: 'PLATINUM',
    hidden: true, // 預設隱藏，達成後才顯示
    progressField: 'totalQuizzesAnswered',
    targetValue: 1000,
  },
];
