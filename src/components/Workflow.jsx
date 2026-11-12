const STEPS = [
  { n: 1, who: '運用担当', title: '緊急モード発動', body: '管理画面（既存）から対象者を指定して発動。' },
  { n: 2, who: 'GAS', title: '合図を送信', body: '対象の端末IDを指定して連携先APIへ POST。LINEへの通知は既存処理のまま。' },
  { n: 3, who: '見守り端末', title: '端末が緊急モードに', body: '対象者の端末が反応し、安否を尋ねる。' },
  { n: 4, who: '高齢者', title: '端末またはLINEで回答', body: '「無事」「助けて」を、使いやすい方で返す。' },
  { n: 5, who: 'GAS', title: '回答を受信・取り込み', body: 'doPost で受け、APIキーと形式を検証して安否データへ保存。' },
  { n: 6, who: 'GAS', title: '重複をまとめる', body: 'LINEと端末の両方が来たら、先着を採用し後着は追記。' },
  { n: 7, who: '連携先 → GAS', title: '未回答・失敗を通知', body: '届かない・答えがない場合も通知を受けて「未回答」「送信失敗」に。' },
  { n: 8, who: 'スプレッドシート', title: '地図・一覧に反映', body: '既存の地図と一覧に、最小限の変更で状態を表示。' },
  { n: 9, who: 'GAS', title: '連携先へデータ送信', body: '集約した状況（個人名は含めない）を連携先プラットフォームへ。' },
]

const API = [
  ['POST', '/v1/emergency', 'GAS → 端末側', '緊急モードの合図（対象の端末ID指定）'],
  ['POST', '/webhook/device-response', '端末側 → GAS', '安否の応答（無事／要支援）'],
  ['POST', '/webhook/device-status', '端末側 → GAS', '送信失敗・未回答の通知'],
  ['POST', '/webhook/line', 'LINE → GAS', '既存のLINE回答（重複判定に合流）'],
  ['POST', '/v1/situations', 'GAS → 連携先', '集約した安否状況の連携'],
]

export default function Workflow() {
  return (
    <div className="workflow">
      <section className="card">
        <h2>全体の流れ</h2>
        <p className="muted">フロントは作らず、既存のGAS＋スプレッドシート＋LINEに「受け口」を足します。</p>
        <ol className="steps">
          {STEPS.map(s => (
            <li key={s.n}>
              <span className="step-n">{s.n}</span>
              <div>
                <span className="step-who">{s.who}</span>
                <strong>{s.title}</strong>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="card">
        <h2>構成</h2>
        <div className="arch">
          <div className="node">LINE</div>
          <div className="arrow">⇄</div>
          <div className="node core">
            <b>Google Apps Script</b>
            <small>Web API 受け口 ／ 重複判定 ／ 環境切替</small>
          </div>
          <div className="arrow">⇄</div>
          <div className="node">見守り端末<small>（連携先経由）</small></div>
          <div className="arrow down">↕</div>
          <div className="node sheet">スプレッドシート<small>安否データ・地図・一覧</small></div>
          <div className="arrow down">→</div>
          <div className="node">連携先プラットフォーム</div>
        </div>
      </section>

      <section className="card">
        <h2>API 一覧（案）</h2>
        <p className="muted">HTTPS ・ JSON ・ APIキー認証。項目の詳細は着手後に連携先と確定します。</p>
        <div className="table-scroll">
          <table>
            <thead><tr><th>メソッド</th><th>パス</th><th>方向</th><th>用途</th></tr></thead>
            <tbody>
              {API.map(([m, p, d, u]) => (
                <tr key={p}><td><code>{m}</code></td><td><code>{p}</code></td><td>{d}</td><td>{u}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2>重複まとめのルール</h2>
        <ul className="rules">
          <li><b>先に届いた回答を採用</b>し、安否ステータスを確定。</li>
          <li><b>後から届いた回答は追記</b>（上書きしない）。内容が食い違う場合は一覧で分かるようにする。</li>
          <li>未回答の通知後に回答が届いたら、<b>未回答を解除</b>して回答を採用。</li>
          <li>同一回答の再送（リトライ）は、端末ID＋回答時刻で判別して二重登録を防ぐ。</li>
        </ul>
      </section>
    </div>
  )
}
