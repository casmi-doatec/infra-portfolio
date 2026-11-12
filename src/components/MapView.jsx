import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import { RESIDENTS, STATUS } from '../data'

maplibregl.setWorkerUrl(workerUrl)

const COLORS = {
  idle: '#7c8794', wait: '#f5a524', safe: '#22c55e', help: '#ef4444', warn: '#a78bfa',
}

const STYLE = 'https://tiles.openfreemap.org/styles/liberty'
const VIEW = { pitch: 58, bearing: -24 }
const BOUNDS = RESIDENTS.reduce(
  (b, r) => b.extend([r.lng, r.lat]),
  new maplibregl.LngLatBounds([RESIDENTS[0].lng, RESIDENTS[0].lat], [RESIDENTS[0].lng, RESIDENTS[0].lat]),
)

export default function MapView({ records, focus, onFocus }) {
  const box = useRef(null)
  const map = useRef(null)
  const pins = useRef({})
  const onFocusRef = useRef(onFocus)
  useEffect(() => { onFocusRef.current = onFocus })

  useEffect(() => {
    const m = new maplibregl.Map({
      container: box.current,
      style: STYLE,
      bounds: BOUNDS,
      fitBoundsOptions: { padding: 50, ...VIEW },
      maxPitch: 75,
      attributionControl: { compact: true },
    })
    m.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-left')
    m.scrollZoom.disable()

    m.on('load', () => {
      // Japanese place and shop names
      m.getStyle().layers.forEach(l => {
        if (l.type === 'symbol' && m.getLayoutProperty(l.id, 'text-field')) {
          m.setLayoutProperty(l.id, 'text-field', ['coalesce', ['get', 'name:ja'], ['get', 'name']])
        }
      })
      // Make buildings read clearly in 3D
      if (m.getLayer('building-3d')) {
        m.setPaintProperty('building-3d', 'fill-extrusion-color', [
          'interpolate', ['linear'], ['coalesce', ['get', 'render_height'], 0],
          0, '#e9e6df', 15, '#d9d4ca', 40, '#c3bcae',
        ])
        m.setPaintProperty('building-3d', 'fill-extrusion-opacity', 0.92)
      }
    })

    RESIDENTS.forEach(r => {
      const el = document.createElement('button')
      el.type = 'button'
      el.className = 'pin'
      el.innerHTML = `<span class="pin-face"><img src="${r.photo}" alt="" /></span><span class="pin-label">${r.name.split(' ')[0]}</span>`
      el.addEventListener('click', e => { e.stopPropagation(); onFocusRef.current(r.id) })
      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat([r.lng, r.lat]).addTo(m)
      pins.current[r.id] = { el, marker }
    })

    map.current = m
    return () => { m.remove(); map.current = null; pins.current = {} }
  }, [])

  useEffect(() => {
    RESIDENTS.forEach(r => {
      const pin = pins.current[r.id]
      if (!pin) return
      const st = STATUS[records[r.id].status]
      pin.el.style.setProperty('--c', COLORS[st.tone])
      pin.el.classList.toggle('pin-pulse', ['wait', 'help', 'warn'].includes(st.tone))
      pin.el.classList.toggle('pin-focus', focus === r.id)
      pin.el.title = `${r.name}　${st.label}`
      pin.el.style.zIndex = focus === r.id ? 10 : ''
    })
  }, [records, focus])

  useEffect(() => {
    const m = map.current
    if (!m) return
    const r = RESIDENTS.find(x => x.id === focus)
    if (r) m.flyTo({ center: [r.lng, r.lat], zoom: 16.6, pitch: 55, duration: 1200 })
    else m.fitBounds(BOUNDS, { padding: 50, ...VIEW, duration: 1000 })
  }, [focus])

  return (
    <div className="map-wrap">
      <div ref={box} className="map" />
      <ul className="legend">
        {Object.entries(STATUS).map(([k, v]) => (
          <li key={k}><i style={{ background: COLORS[v.tone] }} />{v.label}</li>
        ))}
      </ul>
    </div>
  )
}
