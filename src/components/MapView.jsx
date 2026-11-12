import { RESIDENTS, STATUS } from '../data'

const COLORS = {
  idle: '#8a96a3', wait: '#d89a1d', safe: '#1f9d6b', help: '#d6453d', warn: '#8e44ad',
}

export default function MapView({ records, focus, onFocus }) {
  return (
    <div className="map-wrap">
      <svg viewBox="0 0 100 100" className="map" role="img" aria-label="見守り対象者の位置と状態">
        <rect width="100" height="100" fill="var(--map-bg)" />
        <g stroke="var(--map-road)" strokeWidth="3.2" strokeLinecap="round" fill="none">
          <path d="M0 40 H100" /><path d="M0 70 H100" /><path d="M45 0 V100" /><path d="M78 0 V100" />
          <path d="M10 0 L30 40" strokeWidth="2" />
        </g>
        <rect x="52" y="44" width="20" height="22" rx="2" fill="var(--map-park)" />
        <path d="M0 92 Q30 84 60 92 T100 90 V100 H0Z" fill="var(--map-water)" />
        {RESIDENTS.map(r => {
          const tone = STATUS[records[r.id].status].tone
          const pulse = tone === 'wait' || tone === 'help' || tone === 'warn'
          return (
            <g key={r.id} transform={`translate(${r.x} ${r.y})`} onClick={() => onFocus(r.id)} style={{ cursor: 'pointer' }}>
              {pulse && <circle r="5" fill={COLORS[tone]} opacity=".25" className="pulse" />}
              <circle r={focus === r.id ? 3.6 : 2.8} fill={COLORS[tone]} stroke="#fff" strokeWidth="1" />
              <text y="-5" textAnchor="middle" fontSize="3.4" fill="var(--ink)" fontWeight="600">{r.name.split(' ')[0]}</text>
            </g>
          )
        })}
      </svg>
      <ul className="legend">
        {Object.entries(STATUS).map(([k, v]) => (
          <li key={k}><i style={{ background: COLORS[v.tone] }} />{v.label}</li>
        ))}
      </ul>
    </div>
  )
}
