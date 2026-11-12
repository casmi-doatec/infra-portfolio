import { RESIDENTS, STATUS } from '../data'

const COLORS = {
  idle: '#7c8794', wait: '#f5a524', safe: '#22c55e', help: '#ef4444', warn: '#a78bfa',
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
        <defs>
          {RESIDENTS.map(r => <clipPath key={r.id} id={`clip-${r.id}`}><circle r="3.4" /></clipPath>)}
        </defs>
        {RESIDENTS.map(r => {
          const tone = STATUS[records[r.id].status].tone
          const pulse = tone === 'wait' || tone === 'help' || tone === 'warn'
          return (
            <g key={r.id} transform={`translate(${r.x} ${r.y})`} onClick={() => onFocus(r.id)} style={{ cursor: 'pointer' }}>
              {pulse && <circle r="5" fill={COLORS[tone]} opacity=".35" className="pulse" />}
              <circle r={focus === r.id ? 4.8 : 4.2} fill={COLORS[tone]} />
              <image href={r.photo} x="-3.4" y="-3.4" width="6.8" height="6.8" clipPath={`url(#clip-${r.id})`} preserveAspectRatio="xMidYMid slice" />
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
