import { RESIDENTS, ENDPOINTS } from './data'

const byId = Object.fromEntries(RESIDENTS.map(r => [r.id, r]))

export const clock = (d = new Date()) =>
  d.toLocaleTimeString('ja-JP', { hour12: false })

export const initialState = {
  env: 'test',
  mode: 'normal',
  records: Object.fromEntries(
    RESIDENTS.map(r => [r.id, { status: 'normal', delivery: 'idle', adopted: null, appended: [] }]),
  ),
  alerts: [],
  logs: [],
  lastSync: null,
  stage: 0,
}

let seq = 0
const ANSWER = { safe: '無事', help: '要支援' }
const SRC = { LINE: 'LINE', DEVICE: '見守り端末' }

const log = (state, entry) => ({
  ...state,
  logs: [{ n: ++seq, ...entry }, ...state.logs].slice(0, 60),
})

export function buildPayload(state, at) {
  const recs = Object.entries(state.records)
  const count = s => recs.filter(([, r]) => r.status === s).length
  return {
    event: 'safety_status',
    environment: state.env,
    sent_at: at,
    summary: {
      total: recs.length,
      safe: count('safe'),
      help: count('help'),
      waiting: count('waiting'),
      unanswered: count('unanswered'),
    },
    residents: recs.map(([id, r]) => ({
      id,
      status: r.status,
      source: r.adopted?.source ?? null,
      answered_at: r.adopted?.at ?? null,
      duplicates: r.appended.length,
    })),
  }
}

export function reducer(state, a) {
  const ep = ENDPOINTS[state.env]
  const at = a.at ?? clock()

  switch (a.type) {
    case 'RESET':
      seq = 0
      return { ...initialState, env: state.env }

    case 'SET_ENV': {
      const next = { ...state, env: a.env }
      return log(next, {
        at, dir: 'sys', method: 'CONFIG', url: '接続先を切り替え',
        note: `${ENDPOINTS[a.env].label}環境 → ${ENDPOINTS[a.env].device}`,
        headline: `接続先を${ENDPOINTS[a.env].label}環境に切り替えました`,
      })
    }

    case 'SEND_EMERGENCY': {
      const targets = a.ids.map(id => byId[id])
      let s = { ...state, mode: 'emergency', stage: 1, records: { ...state.records }, alerts: [...state.alerts] }
      const failed = []
      targets.forEach(r => {
        if (r.flaky) {
          failed.push(r.device)
          s.records[r.id] = { ...s.records[r.id], status: 'waiting', delivery: 'failed' }
          s.alerts.unshift({ id: `${r.id}-f`, type: 'failed', rid: r.id, at, text: `${r.name}さんの端末へ緊急合図が届きませんでした（${r.device}）` })
        } else {
          s.records[r.id] = { ...s.records[r.id], status: 'waiting', delivery: 'ok' }
        }
      })
      s = log(s, {
        at, dir: 'out', method: 'POST', url: `${ep.device}/v1/emergency`,
        body: { mode: 'emergency', request_id: `req-${Date.now().toString(36)}`, targets: targets.map(r => r.device) },
        status: 200, note: `${targets.length - failed.length}件受付 / ${failed.length}件失敗`,
        headline: `${targets.length}名の見守り端末へ緊急モードの合図を送りました` +
          (failed.length ? `（${targets.filter(r => r.flaky).map(r => r.name).join('、')}さんの端末には届きませんでした）` : ''),
      })
      if (failed.length) {
        s = log(s, {
          at, dir: 'in', method: 'POST', url: '/webhook/device-status', tone: 'help',
          body: { event: 'delivery_failed', devices: failed }, status: 200,
          note: '送信失敗の通知を受信 → 一覧に反映',
          headline: `${targets.filter(r => r.flaky).map(r => r.name).join('、')}さんの端末へ届かなかったため、送信失敗として通知を受け取りました`,
        })
      }
      return s
    }

    case 'RESPOND': {
      const rec = state.records[a.id]
      if (!rec || state.mode !== 'emergency') return state
      const r = byId[a.id]
      const resp = { source: a.source, answer: a.answer, at }
      const url = a.source === 'DEVICE' ? '/webhook/device-response' : '/webhook/line'
      const body = a.source === 'DEVICE'
        ? { device_id: r.device, answer: a.answer, answered_at: at }
        : { type: 'message', userId: `U••••${r.id.slice(-3)}`, text: a.answer === 'safe' ? '無事です' : '助けて' }

      if (rec.adopted) {
        const s = { ...state, stage: Math.max(state.stage, 2), records: { ...state.records, [a.id]: { ...rec, appended: [...rec.appended, resp] } } }
        return log(s, {
          at, dir: 'in', method: 'POST', url, body, status: 200, tone: 'dup',
          note: `重複: 先着（${rec.adopted.source === 'LINE' ? 'LINE' : '端末'} ${rec.adopted.at}）を採用済み → 後着を追記`,
          headline: `${r.name}さんから${SRC[a.source]}でも回答が届きました。先に${SRC[rec.adopted.source]}で回答済みのため、上書きせず追記しました`,
        })
      }
      const status = a.answer === 'safe' ? 'safe' : 'help'
      let s = {
        ...state,
        stage: Math.max(state.stage, 2),
        records: { ...state.records, [a.id]: { ...rec, status, adopted: resp } },
        alerts: state.alerts.filter(x => !(x.rid === a.id && x.type === 'unanswered')),
      }
      return log(s, {
        at, dir: 'in', method: 'POST', url, body, status: 200, tone: status === 'safe' ? 'ok' : 'help',
        note: `先着として採用 → ${status === 'safe' ? '無事' : '要支援'}`,
        headline: `${r.name}さんから${SRC[a.source]}で「${ANSWER[a.answer]}」と回答がありました`,
      })
    }

    case 'TIMEOUT': {
      if (state.mode !== 'emergency') return state
      const ids = Object.keys(state.records).filter(id => state.records[id].status === 'waiting')
      if (!ids.length) return { ...state, stage: Math.max(state.stage, 3) }
      const records = { ...state.records }
      const alerts = [...state.alerts]
      ids.forEach(id => {
        records[id] = { ...records[id], status: 'unanswered' }
        alerts.unshift({ id: `${id}-u`, type: 'unanswered', rid: id, at, text: `${byId[id].name}さんから一定時間内に回答がありません` })
      })
      return log({ ...state, records, alerts, stage: Math.max(state.stage, 3) }, {
        at, dir: 'in', method: 'POST', url: '/webhook/device-status', tone: 'warn',
        body: { event: 'no_response', devices: ids.map(id => byId[id].device) }, status: 200,
        note: `${ids.length}件を未回答として通知 → 一覧・地図に反映`,
        headline: `${ids.map(id => byId[id].name).join('、')}さんから回答がないため「未回答」にしました`,
      })
    }

    case 'SYNC': {
      const payload = buildPayload(state, at)
      const { safe, help, unanswered } = payload.summary
      return log({ ...state, lastSync: { at, payload }, stage: 4 }, {
        at, dir: 'out', method: 'POST', url: `${ep.platform}/v1/situations`,
        body: payload.summary, status: 202, note: '集約した状況を連携先へ送信（氏名は含めず ID のみ）',
        headline: `集計結果（無事 ${safe}名・要支援 ${help}名・未回答 ${unanswered}名）を連携先へ送りました`,
      })
    }

    default:
      return state
  }
}
