export const RESIDENTS = [
  { id: 'R001', name: '山田 ハル',   age: 82, area: '港町1丁目',   line: true,  device: 'DV-1001', x: 18, y: 30 },
  { id: 'R002', name: '佐藤 トシオ', age: 78, area: '港町2丁目',   line: false, device: 'DV-1002', x: 36, y: 62 },
  { id: 'R003', name: '鈴木 ミチ',   age: 85, area: '桜ヶ丘',     line: true,  device: 'DV-1003', x: 55, y: 22, flaky: true },
  { id: 'R004', name: '高橋 ケンジ', age: 74, area: '桜ヶ丘',     line: true,  device: 'DV-1004', x: 70, y: 48 },
  { id: 'R005', name: '田中 フミ',   age: 88, area: '緑町',       line: false, device: 'DV-1005', x: 82, y: 76 },
  { id: 'R006', name: '伊藤 マサ',   age: 80, area: '緑町',       line: true,  device: 'DV-1006', x: 28, y: 82 },
  { id: 'R007', name: '渡辺 キヨ',   age: 79, area: '駅前通り',   line: true,  device: 'DV-1007', x: 62, y: 80 },
  { id: 'R008', name: '中村 ヨシ',   age: 83, area: '駅前通り',   line: true,  device: 'DV-1008', x: 88, y: 28 },
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

// Scripted run for the auto-play button: [delay ms, action]
export const SCRIPT = [
  [0,    { type: 'SEND_EMERGENCY' }],
  [1800, { type: 'RESPOND', id: 'R001', source: 'LINE',   answer: 'safe' }],
  [2800, { type: 'RESPOND', id: 'R002', source: 'DEVICE', answer: 'safe' }],
  [3800, { type: 'RESPOND', id: 'R001', source: 'DEVICE', answer: 'safe' }],
  [4800, { type: 'RESPOND', id: 'R004', source: 'DEVICE', answer: 'help' }],
  [5800, { type: 'RESPOND', id: 'R005', source: 'DEVICE', answer: 'safe' }],
  [6800, { type: 'RESPOND', id: 'R006', source: 'LINE',   answer: 'safe' }],
  [7800, { type: 'RESPOND', id: 'R008', source: 'LINE',   answer: 'safe' }],
  [8400, { type: 'RESPOND', id: 'R008', source: 'DEVICE', answer: 'safe' }],
  [9600, { type: 'TIMEOUT' }],
  [10800,{ type: 'SYNC' }],
]
