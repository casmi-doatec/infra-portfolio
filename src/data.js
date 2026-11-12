export const RESIDENTS = [
  { id: 'R001', photo: '/people/R001.svg', name: '山田 ハル',   area: '高砂2丁目',   line: true,  device: 'DV-1001', lat: 35.8592, lng: 139.6538 },
  { id: 'R002', photo: '/people/R002.svg', name: '佐藤 トシオ', area: '常盤4丁目',   line: false, device: 'DV-1002', lat: 35.8622, lng: 139.6516 },
  { id: 'R003', photo: '/people/R003.svg', name: '鈴木 ミチ',   area: '岸町3丁目',     line: true,  device: 'DV-1003', lat: 35.8576, lng: 139.6524, flaky: true },
  { id: 'R004', photo: '/people/R004.svg', name: '高橋 ケンジ', area: '東高砂町',     line: true,  device: 'DV-1004', lat: 35.8597, lng: 139.6586 },
  { id: 'R005', photo: '/people/R005.svg', name: '田中 フミ',   area: '仲町1丁目',       line: false, device: 'DV-1005', lat: 35.8603, lng: 139.6566 },
  { id: 'R006', photo: '/people/R006.svg', name: '伊藤 マサ',   area: '岸町4丁目',       line: true,  device: 'DV-1006', lat: 35.858, lng: 139.6562 },
  { id: 'R007', photo: '/people/R007.svg', name: '渡辺 キヨ',   area: '東仲町',   line: true,  device: 'DV-1007', lat: 35.862, lng: 139.6588 },
  { id: 'R008', photo: '/people/R008.svg', name: '中村 ヨシ',   area: '常盤1丁目',   line: true,  device: 'DV-1008', lat: 35.8632, lng: 139.6548 },
]

export const ENDPOINTS = {
  test: {
    label: 'テスト',
    device: 'https://sandbox.device-vendor.example/api',
    platform: 'https://sandbox.platform.example/api',
    key: 'sk_test_••••••••3f9a',
  },
  prod: {
    label: '本番',
    device: 'https://api.device-vendor.example/api',
    platform: 'https://api.platform.example/api',
    key: 'sk_live_••••••••b71c',
  },
}

export const STATUS = {
  normal:     { label: '平常',       tone: 'idle' },
  waiting:    { label: '回答待ち',   tone: 'wait' },
  safe:       { label: '無事',       tone: 'safe' },
  help:       { label: '要支援',     tone: 'help' },
  unanswered: { label: '未回答',     tone: 'warn' },
}

export const SOURCE_LABEL = { LINE: 'LINE', DEVICE: '見守り端末' }

export const STAGES = [
  { title: '平常',           sub: '見守り中' },
  { title: '緊急合図を送信', sub: 'GAS → 見守り端末' },
  { title: '回答を受付',     sub: 'LINE・端末から' },
  { title: '未回答を判定',   sub: '通知を受けて反映' },
  { title: '連携先へ送信',   sub: '集計結果を共有' },
]

// Scripted run for the auto-play button: [delay ms, action]
export const SCRIPT = [
  [0,     { type: 'SEND_EMERGENCY' }],
  [2600,  { type: 'RESPOND', id: 'R001', source: 'LINE',   answer: 'safe' }],
  [4600,  { type: 'RESPOND', id: 'R002', source: 'DEVICE', answer: 'safe' }],
  [6600,  { type: 'RESPOND', id: 'R001', source: 'DEVICE', answer: 'safe' }],
  [8600,  { type: 'RESPOND', id: 'R004', source: 'DEVICE', answer: 'help' }],
  [10600, { type: 'RESPOND', id: 'R005', source: 'DEVICE', answer: 'safe' }],
  [12400, { type: 'RESPOND', id: 'R006', source: 'LINE',   answer: 'safe' }],
  [14200, { type: 'RESPOND', id: 'R008', source: 'LINE',   answer: 'safe' }],
  [16000, { type: 'RESPOND', id: 'R008', source: 'DEVICE', answer: 'safe' }],
  [18400, { type: 'TIMEOUT' }],
  [21000, { type: 'SYNC' }],
]
