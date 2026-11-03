/**
 * NetworkScene — "Infrastructure is the Foundation"
 *
 * Visual metaphor: a modern wireframe skyscraper surrounded by
 * cloud service nodes. The building represents the system; infra
 * engineers are the ones who hold it up.
 */

import { useRef, useMemo, Fragment } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Text, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Building geometry ─────────────────────────────────────── */

// 12 floors, stepped pyramid (wide at base, narrow at top)
const FLOORS = Array.from({ length: 12 }, (_, i) => {
  const t = i / 11           // 0 = ground, 1 = roof
  const y = i * 0.40 - 1.80 // –1.80 (ground) → 2.60 (roof)
  const w = 2.00 - t * 1.10 // 2.00 → 0.90
  const d = 1.20 - t * 0.60 // 1.20 → 0.60
  return { y, w, d, t }
})

/* ─── Infra nodes — alternating left/right at building heights ─ */

const NODES = [
  // right side, high
  { id: 'dns',   label: 'Route 53',   pos: [ 3.2,  2.4,  0.2], color: '#e63946', side:  1, floorY: 2.40 },
  // left side, high
  { id: 'cdn',   label: 'CloudFront', pos: [-3.2,  1.8,  0  ], color: '#4cc9f0', side: -1, floorY: 1.80 },
  // right
  { id: 'alb',   label: 'ALB',        pos: [ 3.2,  1.0,  0  ], color: '#90e0ef', side:  1, floorY: 1.00 },
  // left
  { id: 'ec2a',  label: 'EC2-A',      pos: [-3.2,  0.4,  0.3], color: '#ffffff', side: -1, floorY: 0.40 },
  // right
  { id: 'ec2b',  label: 'EC2-B',      pos: [ 3.2, -0.2,  0.3], color: '#ffffff', side:  1, floorY: -0.20 },
  // left
  { id: 'eks',   label: 'EKS',        pos: [-3.2, -0.8, -0.2], color: '#c8a96e', side: -1, floorY: -0.80 },
  // right
  { id: 'rds',   label: 'RDS',        pos: [ 3.2, -1.4,  0  ], color: '#c8a96e', side:  1, floorY: -1.40 },
  // left
  { id: 'cache', label: 'Cache',      pos: [-3.2, -1.6,  0  ], color: '#4cc9f0', side: -1, floorY: -1.60 },
]

// Precompute packet speeds once
const PACKET_SPEEDS = NODES.map(() => 0.10 + Math.random() * 0.18)

/* ─── Sub-components ────────────────────────────────────────── */

function BuildingFloor({ y, w, d, t }) {
  const lineRef = useRef()

  const edgesGeo = useMemo(() => {
    const box   = new THREE.BoxGeometry(w, 0.26, d)
    const edges = new THREE.EdgesGeometry(box)
    box.dispose()
    return edges
  }, [w, d])

  // Lerp color from deep navy-blue (base) to bright cyan (top)
  const color = useMemo(
    () => new THREE.Color().lerpColors(
      new THREE.Color('#1e3a5f'),
      new THREE.Color('#4cc9f0'),
      t
    ),
    [t]
  )

  useFrame(({ clock }) => {
    if (lineRef.current) {
      lineRef.current.material.opacity =
        0.22 + Math.sin(clock.elapsedTime * 0.7 + t * 6) * 0.06
    }
  })

  return (
    <lineSegments ref={lineRef} geometry={edgesGeo} position={[0, y, 0]}>
      <lineBasicMaterial color={color} transparent opacity={0.28} />
    </lineSegments>
  )
}

// Vertical columns on building corners
function BuildingColumns() {
  const cols = [
    [-0.95, 0.95], [-0.95, -0.95], [0.95, 0.95], [0.95, -0.95],
  ]
  const height = 4.5
  const ref = useRef()

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.children.forEach((c, i) => {
        c.material.opacity =
          0.20 + Math.sin(clock.elapsedTime * 0.5 + i * 1.2) * 0.07
      })
    }
  })

  return (
    <group ref={ref}>
      {cols.map(([x, z], i) => (
        <mesh key={i} position={[x, -1.8 + height / 2, z]}>
          <cylinderGeometry args={[0.018, 0.018, height, 6]} />
          <meshBasicMaterial color="#4cc9f0" transparent opacity={0.22} />
        </mesh>
      ))}
    </group>
  )
}

// Foundation slab at the bottom
function Foundation() {
  const edgesGeo = useMemo(() => {
    const geo   = new THREE.BoxGeometry(2.6, 0.12, 1.8)
    const edges = new THREE.EdgesGeometry(geo)
    geo.dispose()
    return edges
  }, [])

  return (
    <group>
      <lineSegments geometry={edgesGeo} position={[0, -1.92, 0]}>
        <lineBasicMaterial color="#e63946" transparent opacity={0.55} />
      </lineSegments>
      {/* Ground grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.98, 0]}>
        <planeGeometry args={[7, 5, 10, 7]} />
        <meshBasicMaterial color="#1e3a5f" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  )
}

function InfraNode({ label, pos, color }) {
  const meshRef = useRef()

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const s = 1 + Math.sin(clock.elapsedTime * 1.2 + pos[0]) * 0.07
      meshRef.current.scale.setScalar(s)
    }
  })

  return (
    <group position={pos}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.15, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.7}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>
      {/* Halo ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22, 0.30, 36]} />
        <meshBasicMaterial color={color} transparent opacity={0.10} side={THREE.DoubleSide} />
      </mesh>
      <Text
        position={[0, 0.32, 0]}
        fontSize={0.11}
        color="#ffffff"
        anchorX="center"
        anchorY="bottom"
        fillOpacity={0.65}
      >
        {label}
      </Text>
    </group>
  )
}

function DataPacket({ from, to, color, speed }) {
  const meshRef = useRef()
  const progress = useRef(Math.random())
  const fromV = useMemo(() => new THREE.Vector3(...from), [from])
  const toV   = useMemo(() => new THREE.Vector3(...to),   [to])
  const tmp   = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, delta) => {
    progress.current = (progress.current + delta * speed) % 1
    tmp.lerpVectors(fromV, toV, progress.current)
    if (meshRef.current) meshRef.current.position.copy(tmp)
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.04, 6, 6]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

function ParticleField() {
  const ref = useRef()
  const count = 240

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 30
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.008
      ref.current.rotation.x = clock.elapsedTime * 0.004
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#2a3f55" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

/* ─── Main exported scene ───────────────────────────────────── */

export default function NetworkScene() {
  const groupRef = useRef()

  // Gentle pendulum sway — feels like a living structure, not a spinning globe
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.14) * 0.55
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.20) * 0.04
    }
  })

  return (
    <>
      <ambientLight intensity={0.30} />
      <pointLight position={[ 6,  5,  4]} intensity={1.8} color="#ffffff" />
      <pointLight position={[-5, -3, -5]} intensity={0.8} color="#4cc9f0" />
      <pointLight position={[ 0,  0,  0]} intensity={0.5} color="#e63946" distance={5} />

      <ParticleField />

      <group ref={groupRef}>

        {/* Building */}
        {FLOORS.map((floor, i) => (
          <BuildingFloor key={i} {...floor} />
        ))}
        <BuildingColumns />
        <Foundation />

        {/* Infra nodes + connections */}
        {NODES.map((node, i) => {
          // Connection goes from the building edge at the node's floor height
          const buildingEdgeX = node.side * (1.0 - Math.abs(node.floorY) * 0.08)
          const from = [buildingEdgeX, node.floorY, 0]
          const to   = node.pos

          return (
            <Fragment key={node.id}>
              <InfraNode {...node} />
              <Line
                points={[from, to]}
                color="#4cc9f0"
                lineWidth={0.6}
                transparent
                opacity={0.20}
              />
              <DataPacket
                from={from}
                to={to}
                color={node.color}
                speed={PACKET_SPEEDS[i]}
              />
            </Fragment>
          )
        })}
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.35}
      />
    </>
  )
}
