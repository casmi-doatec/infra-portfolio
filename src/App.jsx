import { useReducer, useRef, useState, useEffect } from 'react'
import { RESIDENTS, ENDPOINTS, STATUS, SOURCE_LABEL, SCRIPT } from './data'
import { reducer, initialState, clock } from './reducer'
import MapView from './components/MapView'
import Workflow from './components/Workflow'

function Pill({ status }) {
  const s = STATUS[status]
  return <span className={`pill pill-${s.tone}`}>{s.label}</span>
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [tab, setTab] = useState('demo')
  const [answers, setAnswers] = useState({})
  const [picked, setPicked] = useState(() => new Set(RESIDENTS.map(r => r.id)))
  const [focus, setFocus] = useState(null)
  const [playing, setPlaying] = useState(false)
  const timers = useRef([])

  const emergency = state.mode === 'emergency'
  const ep = ENDPOINTS[state.env]
  const send = a => dispatch({ ...a, at: clock() })

  const stopTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  useEffect(() => stopTimers, [])

  const reset = () => { stopTimers(); setPlaying(false); setPicked(new Set(RESIDENTS.map(r => r.id))); dispatch({ type: 'RESET' }) }

  const play = () => {
    reset()
    setPlaying(true)
    SCRIPT.forEach(([delay, a]) => {
      timers.current.push(setTimeout(() => {
        dispatch({ ...a, at: clock(), ...(a.type === 'SEND_EMERGENCY' && { ids: RESIDENTS.map(r => r.id) }) })
        if (delay === SCRIPT.at(-1)[0]) setPlaying(false)
      }, delay + 100))
    })
  }

  const toggle = id => setPicked(p => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const counts = Object.values(state.records).reduce((m, r) => ({ ...m, [r.status]: (m[r.status] || 0) + 1 }), {})

  return (
    <>
      <header className="top">
        <div className="top-inner">
          <div>
            <h1>見守り・安否確認 連携デモ</h1>
            <p>外部見守り端末 ⇄ GAS（受け口）⇄ LINE ／ スプレッドシート ⇄ 連携先</p>
          </div>
          <div className="env" role="group" aria-label="接続先">
            {Object.entries(ENDPOINTS).map(([k, v]) => (
              <button key={k} className={state.env === k ? `on env-${k}` : ''} onClick={() => send({ type: 'SET_ENV', env: k })}>{v.label}</button>
            ))}
          </div>
        </div>
        <nav className="tabs">
          <button className={tab === 'demo' ? 'on' : ''} onClick={() => setTab('demo')}>動作デモ</button>
          <button className={tab === 'flow' ? 'on' : ''} onClick={() => setTab('flow')}>ワークフロー・API</button>
        </nav>
      </header>

      <main className="wrap">
        {tab === 'flow' ? <Workflow /> : (
          <>
            <section className="card controls">
              <div className="mode">
                <span className={`mode-dot ${emergency ? 'on' : ''}`} />
                <div>
                  <b>{emergency ? '緊急モード中' : '平常モード'}</b>
                  <small>{ep.label}環境に接続中</small>
                </div>
              </div>
              <div className="btns">
                <button className="btn danger" disabled={emergency || !picked.size} onClick={() => send({ type: 'SEND_EMERGENCY', ids: [...picked] })}>
                  緊急モードを発動（{picked.size}名）
                </button>
                <button className="btn" disabled={!emergency} onClick={() => send({ type: 'TIMEOUT' })}>時間経過 → 未回答を判定</button>
                <button className="btn" disabled={!emergency} onClick={() => send({ type: 'SYNC' })}>連携先へ送信</button>
                <button className="btn primary" disabled={playing} onClick={play}>自動再生</button>
                <button className="btn ghost" onClick={reset}>リセット</button>
              </div>
              <div className="counts">
                {Object.entries(STATUS).map(([k, v]) => (
                  <span key={k} className={`count pill-${v.tone}`}><b>{counts[k] || 0}</b>{v.label}</span>
                ))}
              </div>
            </section>

            <div className="grid">
              <section className="card">
                <h2>対象者一覧</h2>
                <p className="muted">緊急モード中に「LINE」「端末」ボタンで、各経路からの回答を疑似的に送れます。</p>
                <ul className="people">
                  {RESIDENTS.map(r => {
                    const rec = state.records[r.id]
                    return (
                      <li key={r.id} className={focus === r.id ? 'focus' : ''} onClick={() => setFocus(r.id)}>
                        <label className="check" onClick={e => e.stopPropagation()}>
                          <input type="checkbox" checked={picked.has(r.id)} disabled={emergency} onChange={() => toggle(r.id)} />
                        </label>
                        <img className="avatar" src={r.photo} alt="" />
                        <div className="who">
                          <b>{r.name}</b><small>{r.area}</small>
                          <div className="tags">
                            <span className={`tag ${r.line ? '' : 'off'}`}>LINE</span>
                            <span className="tag">端末 {r.device}</span>
                            {rec.delivery === 'failed' && <span className="tag bad">送信失敗</span>}
                          </div>
                          {rec.adopted && (
                            <div className="adopted">
                              採用: {SOURCE_LABEL[rec.adopted.source]} {rec.adopted.at}
                              {rec.appended.map((a, i) => (
                                <span key={i} className="dup"> ／ 追記: {SOURCE_LABEL[a.source]} {a.at}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="side" onClick={e => e.stopPropagation()}>
                          <Pill status={rec.status} />
                          <div className="reply">
                            <select value={answers[r.id] || 'safe'} onChange={e => setAnswers(a => ({ ...a, [r.id]: e.target.value }))} disabled={!emergency} aria-label="回答内容">
                              <option value="safe">無事</option>
                              <option value="help">要支援</option>
                            </select>
                            <button disabled={!emergency || !r.line} onClick={() => send({ type: 'RESPOND', id: r.id, source: 'LINE', answer: answers[r.id] || 'safe' })}>LINE</button>
                            <button disabled={!emergency} onClick={() => send({ type: 'RESPOND', id: r.id, source: 'DEVICE', answer: answers[r.id] || 'safe' })}>端末</button>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>

              <div className="col">
                <section className="card">
                  <h2>地図</h2>
                  <MapView records={state.records} focus={focus} onFocus={setFocus} />
                </section>

                <section className="card">
                  <h2>通知 <span className="badge">{state.alerts.length}</span></h2>
                  {state.alerts.length === 0 ? <p className="muted">未回答・送信失敗の通知はありません。</p> : (
                    <ul className="alerts">
                      {state.alerts.map(a => (
                        <li key={a.id} className={a.type}>
                          <b>{a.type === 'failed' ? '送信失敗' : '未回答'}</b>
                          <span>{a.text}</span>
                          <time>{a.at}</time>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </div>

            <div className="grid">
              <section className="card">
                <h2>API 通信ログ</h2>
                <p className="muted">GAS が送受信する内容（HTTPS ・ JSON ・ APIキー認証）。</p>
                <ul className="log">
                  {state.logs.length === 0 && <li className="muted">操作するとここに通信が表示されます。</li>}
                  {state.logs.map(l => (
                    <li key={l.n} className={l.tone || ''}>
                      <div className="log-head">
                        <span className={`dir dir-${l.dir}`}>{l.dir === 'out' ? '送信 →' : l.dir === 'in' ? '← 受信' : '設定'}</span>
                        <code>{l.method} {l.url}</code>
                        {l.status && <span className="http">{l.status}</span>}
                        <time>{l.at}</time>
                      </div>
                      {l.body && <pre>{JSON.stringify(l.body)}</pre>}
                      {l.note && <p>{l.note}</p>}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="card">
                <h2>連携先へ送るデータ</h2>
                <p className="muted">Authorization: Bearer <code>{ep.key}</code></p>
                {state.lastSync
                  ? <pre className="payload">{JSON.stringify(state.lastSync.payload, null, 2)}</pre>
                  : <p className="muted">「連携先へ送信」を押すと、送信内容がここに表示されます。</p>}
              </section>
            </div>
          </>
        )}
      </main>
      <footer className="foot">これは提案用のデモです。画面は説明用の疑似表示で、実際の開発範囲は「受け口（API）」です。登場する名前・端末IDはすべて架空です。</footer>
    </>
  )
}
