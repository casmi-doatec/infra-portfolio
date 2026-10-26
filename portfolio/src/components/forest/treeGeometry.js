import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

// Seeded random for reproducible placement
function mulberry32(seed) {
  let s = seed | 0
  return () => {
    s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function createTrunkGeometry(height, radiusBottom, radiusTop, segments) {
  return new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments, 1)
}

export function createCanopyGeometry(radius, detail) {
  const geo = new THREE.IcosahedronGeometry(radius, detail)
  // Vertex noise displacement for organic shape
  const pos = geo.attributes.position
  const rand = mulberry32(Math.round(radius * 1000))
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const noise = (rand() - 0.5) * radius * 0.3
    pos.setX(i, x + noise * (x / radius))
    pos.setY(i, y + noise * 0.5 * (y / radius))
    pos.setZ(i, z + noise * (z / radius))
  }
  geo.computeVertexNormals()
  return geo
}

export function createBranchGeometry(length, radius) {
  const geo = new THREE.CylinderGeometry(radius * 0.3, radius, length, 4, 1)
  return geo
}

// Build a full merged tree geometry pair: { trunk, canopy }
export function buildTreeTemplate(config, seed) {
  const rand = mulberry32(seed)
  const height = 3 + rand() * 4
  const radiusBottom = 0.12 + rand() * 0.1
  const radiusTop = radiusBottom * (0.3 + rand() * 0.3)

  const trunk = createTrunkGeometry(height, radiusBottom, radiusTop, config.trunkSegs)
  trunk.translate(0, height / 2, 0)

  const canopyParts = []
  const canopyY = height * (0.7 + rand() * 0.2)
  for (let i = 0; i < config.canopySpheres; i++) {
    const r = 0.8 + rand() * 1.2
    const sphere = createCanopyGeometry(r, config.canopyDetail)
    const ox = (rand() - 0.5) * r * 0.8
    const oy = canopyY + i * r * 0.4 + rand() * 0.5
    const oz = (rand() - 0.5) * r * 0.5
    sphere.translate(ox, oy, oz)
    canopyParts.push(sphere)
  }

  const branchParts = []
  if (config.branches) {
    const branchCount = 2 + Math.floor(rand() * 3)
    for (let i = 0; i < branchCount; i++) {
      const bLen = 0.8 + rand() * 1.2
      const branch = createBranchGeometry(bLen, radiusBottom * 0.5)
      const by = height * (0.4 + rand() * 0.3)
      const angle = rand() * Math.PI * 2
      const tilt = 0.4 + rand() * 0.6
      branch.rotateZ(tilt * (rand() > 0.5 ? 1 : -1))
      branch.rotateY(angle)
      branch.translate(0, by, 0)
      branchParts.push(branch)
    }
  }

  const trunkGeo = branchParts.length > 0
    ? mergeGeometries([trunk, ...branchParts])
    : trunk

  const canopyGeo = canopyParts.length > 0
    ? mergeGeometries(canopyParts)
    : canopyParts[0] || new THREE.BufferGeometry()

  return { trunk: trunkGeo, canopy: canopyGeo, height }
}

// Create a set of template variants for a given layer config
export function buildLayerTemplates(config, count = 5, baseSeed = 42) {
  const templates = []
  for (let i = 0; i < count; i++) {
    templates.push(buildTreeTemplate(config, baseSeed + i * 137))
  }
  return templates
}
