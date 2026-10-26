import * as THREE from 'three'

// Desaturated blue-gray palette matching --bg: #eef3f8
export const COLORS = {
  sky: {
    top:    new THREE.Color(0.780, 0.840, 0.910),
    mid:    new THREE.Color(0.880, 0.920, 0.960),
    low:    new THREE.Color(0.840, 0.890, 0.940),
    bottom: new THREE.Color(0.760, 0.820, 0.890),
  },
  fog: new THREE.Color('#d8e2ee'),
  trunk: {
    far:  new THREE.Color(0.58, 0.64, 0.74),
    mid:  new THREE.Color(0.42, 0.48, 0.58),
    near: new THREE.Color(0.30, 0.36, 0.46),
    fg:   new THREE.Color(0.22, 0.28, 0.38),
  },
  canopy: {
    far:  new THREE.Color(0.55, 0.62, 0.72),
    mid:  new THREE.Color(0.46, 0.54, 0.60),
    near: new THREE.Color(0.40, 0.50, 0.48),
    fg:   new THREE.Color(0.34, 0.44, 0.40),
  },
  ground: new THREE.Color(0.52, 0.56, 0.54),
  dust: new THREE.Color('#fff8e8'),
  lightShaft: new THREE.Color(1.0, 0.98, 0.94),
}

export const LAYERS = {
  far:  { zMin: -30, zMax: -18, count: 50, xSpread: 40, trunkSegs: 6,  canopyDetail: 0, canopySpheres: 1, branches: false },
  mid:  { zMin: -18, zMax: -8,  count: 30, xSpread: 30, trunkSegs: 8,  canopyDetail: 0, canopySpheres: 2, branches: false },
  near: { zMin: -8,  zMax: -2,  count: 10, xSpread: 20, trunkSegs: 10, canopyDetail: 1, canopySpheres: 3, branches: true },
  fg:   { zMin: -1,  zMax: 1,   count: 4,  xSpread: 14, trunkSegs: 12, canopyDetail: 1, canopySpheres: 3, branches: true },
}

export const QUALITY = {
  high: {
    fogDensity: 0.045,
    particleCount: 120,
    lightShaftCount: 6,
    dpr: [1, 1.5],
    layerScale: 1,
  },
  low: {
    fogDensity: 0.050,
    particleCount: 50,
    lightShaftCount: 0,
    dpr: [0.75, 1],
    layerScale: 0.5,
  },
}

export function detectQuality() {
  if (typeof window === 'undefined') return 'high'
  const w = window.innerWidth
  const mobile = w < 768
  const lowPower = navigator.hardwareConcurrency != null && navigator.hardwareConcurrency <= 4
  return (mobile || lowPower) ? 'low' : 'high'
}
