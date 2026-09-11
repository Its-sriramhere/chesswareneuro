import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, RoundedBox, Text, Sparkles } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import * as THREE from 'three'
import ScrollReveal from '../react-bits/ScrollReveal'

type PieceType = 'king' | 'queen' | 'bishop' | 'knight' | 'rook' | 'pawn'
type PieceColor = 'white' | 'black'

interface Piece {
  id: string
  type: PieceType
  color: PieceColor
  position: [number, number]
}

const initialPieces: Piece[] = [
  { id: 'wr1', type: 'rook', color: 'white', position: [0, 0] },
  { id: 'wk', type: 'knight', color: 'white', position: [1, 0] },
  { id: 'wb', type: 'bishop', color: 'white', position: [2, 0] },
  { id: 'wq', type: 'queen', color: 'white', position: [3, 0] },
  { id: 'wki', type: 'king', color: 'white', position: [4, 0] },
  { id: 'wb2', type: 'bishop', color: 'white', position: [5, 0] },
  { id: 'wk2', type: 'knight', color: 'white', position: [6, 0] },
  { id: 'wr2', type: 'rook', color: 'white', position: [7, 0] },
  ...Array.from({ length: 8 }, (_, i) => ({ id: `wp${i}`, type: 'pawn' as PieceType, color: 'white' as PieceColor, position: [i, 1] as [number, number] })),
  { id: 'br1', type: 'rook', color: 'black', position: [0, 7] },
  { id: 'bk', type: 'knight', color: 'black', position: [1, 7] },
  { id: 'bb', type: 'bishop', color: 'black', position: [2, 7] },
  { id: 'bq', type: 'queen', color: 'black', position: [3, 7] },
  { id: 'bki', type: 'king', color: 'black', position: [4, 7] },
  { id: 'bb2', type: 'bishop', color: 'black', position: [5, 7] },
  { id: 'bk2', type: 'knight', color: 'black', position: [6, 7] },
  { id: 'br2', type: 'rook', color: 'black', position: [7, 7] },
  ...Array.from({ length: 8 }, (_, i) => ({ id: `bp${i}`, type: 'pawn' as PieceType, color: 'black' as PieceColor, position: [i, 6] as [number, number] })),
]

// Lathe profiles — [radius, height] silhouettes (revolved around Y)
const PROFILES: Record<string, [number, number][]> = {
  pawn: [
    [0.02, 0], [0.22, 0], [0.2, 0.04], [0.17, 0.16], [0.24, 0.3], [0.15, 0.4],
    [0.1, 0.44], [0.13, 0.48], [0.11, 0.53], [0.06, 0.55],
  ],
  rook: [
    [0.02, 0], [0.22, 0], [0.22, 0.11], [0.16, 0.13], [0.18, 0.42],
    [0.2, 0.48], [0.13, 0.52], [0.13, 0.58], [0.09, 0.6], [0.09, 0.64],
    [0.2, 0.64], [0.2, 0.6], [0.24, 0.6], [0.24, 0.56], [0.17, 0.56],
    [0.17, 0.52], [0.24, 0.52], [0.24, 0.64],
  ],
  bishop: [
    [0.02, 0], [0.22, 0], [0.2, 0.05], [0.16, 0.24], [0.23, 0.34],
    [0.13, 0.42], [0.1, 0.46], [0.13, 0.5], [0.09, 0.54], [0.14, 0.62], [0, 0.66],
  ],
  queen: [
    [0.02, 0], [0.24, 0], [0.22, 0.05], [0.18, 0.2], [0.26, 0.32],
    [0.13, 0.44], [0.1, 0.48], [0.14, 0.54], [0.12, 0.6], [0.07, 0.64], [0, 0.64],
  ],
  king: [
    [0.02, 0], [0.24, 0], [0.22, 0.05], [0.18, 0.2], [0.16, 0.3],
    [0.24, 0.4], [0.14, 0.46], [0.1, 0.5], [0.12, 0.56], [0.08, 0.6], [0, 0.6],
  ],
}

function LathePiece({ type, color }: { type: PieceType; color: PieceColor }) {
  const points = useMemo(
    () => PROFILES[type].map(([x, y]) => new THREE.Vector2(x, y)),
    [type]
  )
  const white = color === 'white'
  const bodyColor = white ? '#F4F4F6' : '#2A3441'

  return (
    <mesh castShadow receiveShadow>
      <latheGeometry args={[points, 48]} />
      <meshPhysicalMaterial
        color={bodyColor}
        metalness={white ? 0.15 : 0.7}
        roughness={0.2}
        clearcoat={0.6}
        clearcoatRoughness={0.3}
        envMapIntensity={0.6}
      />
    </mesh>
  )
}

function Knight({ color }: { color: PieceColor }) {
  const white = color === 'white'
  const bodyColor = white ? '#F4F4F6' : '#2A3441'

  return (
    <group castShadow>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.25, 0.1, 32]} />
        <meshPhysicalMaterial color={bodyColor} metalness={white ? 0.15 : 0.7} roughness={0.2} clearcoat={0.6} clearcoatRoughness={0.3} />
      </mesh>
      <mesh position={[0.04, 0.26, 0]} rotation={[0.55, 0, 0.1]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 0.32, 24]} />
        <meshPhysicalMaterial color={bodyColor} metalness={white ? 0.15 : 0.7} roughness={0.2} clearcoat={0.6} clearcoatRoughness={0.3} />
      </mesh>
      <mesh position={[0.1, 0.45, 0]} rotation={[0, 0, -0.25]} castShadow>
        <boxGeometry args={[0.22, 0.14, 0.2]} />
        <meshPhysicalMaterial color={bodyColor} metalness={white ? 0.15 : 0.7} roughness={0.2} clearcoat={0.6} clearcoatRoughness={0.3} />
      </mesh>
      <mesh position={[0.22, 0.46, 0]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 0.12, 0.18]} />
        <meshPhysicalMaterial color={bodyColor} metalness={white ? 0.15 : 0.7} roughness={0.2} clearcoat={0.6} clearcoatRoughness={0.3} />
      </mesh>
      <mesh position={[0.02, 0.5, 0.08]} rotation={[0, 0, -0.1]} castShadow>
        <coneGeometry args={[0.04, 0.12, 12]} />
        <meshPhysicalMaterial color={bodyColor} metalness={white ? 0.15 : 0.7} roughness={0.2} clearcoat={0.6} clearcoatRoughness={0.3} />
      </mesh>
      <mesh position={[0.02, 0.46, -0.06]} castShadow>
        <coneGeometry args={[0.035, 0.11, 12]} />
        <meshPhysicalMaterial color={bodyColor} metalness={white ? 0.15 : 0.7} roughness={0.2} clearcoat={0.6} clearcoatRoughness={0.3} />
      </mesh>
    </group>
  )
}

function PieceCross({ type }: { type: PieceType }) {
  if (type !== 'king') return null
  return (
    <mesh position={[0, 0.68, 0]} castShadow>
      <boxGeometry args={[0.07, 0.38, 0.07]} />
      <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.25} />
    </mesh>
  )
}

function PieceGoldBand({ type }: { type: PieceType }) {
  if (type !== 'queen' && type !== 'rook' && type !== 'bishop') return null
  return (
    <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <torusGeometry args={[type === 'rook' ? 0.165 : 0.125, 0.015, 12, 32]} />
      <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.25} />
    </mesh>
  )
}

function PieceShape({ type, color }: { type: PieceType; color: PieceColor }) {
  return (
    <group>
      {type === 'knight' ? (
        <Knight color={color} />
      ) : (
        <LathePiece type={type} color={color} />
      )}
      <PieceGoldBand type={type} />
      <PieceCross type={type} />
    </group>
  )
}

function Tile({ x, y }: { x: number; y: number }) {
  const dark = (x + y) % 2 === 0
  return (
    <RoundedBox
      args={[0.92, 0.16, 0.92]}
      radius={0.02}
      smoothness={4}
      position={[x - 3.5, -0.08, y - 3.5]}
      receiveShadow
    >
      <meshPhysicalMaterial
        color={dark ? '#232B37' : '#E4E4E8'}
        roughness={0.15}
        metalness={0.45}
        clearcoat={0.4}
        clearcoatRoughness={0.35}
      />
    </RoundedBox>
  )
}

function PieceMesh({ type, color, onClick }: { type: PieceType; color: PieceColor; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <group
      position={[0, 0, hovered ? 0.12 : 0]}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
        setHovered(true)
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
        setHovered(false)
      }}
      scale={hovered ? 1.06 : 1}
    >
      <PieceShape type={type} color={color} />
      {hovered && (
        <mesh position={[0, -0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.4, 32]} />
          <meshBasicMaterial color="#D4AF37" transparent opacity={0.45} />
        </mesh>
      )}
    </group>
  )
}

function Chessboard() {
  const [message, setMessage] = useState<string | null>(null)

  const handlePieceClick = (piece: Piece) => {
    setMessage(`${piece.color === 'white' ? 'White' : 'Black'} ${piece.type} selected (${String.fromCharCode(97 + piece.position[0])}${8 - piece.position[1]})`)
    setTimeout(() => setMessage(null), 2000)
  }

  return (
    <group>
      {Array.from({ length: 64 }, (_, i) => {
        const x = i % 8
        const y = Math.floor(i / 8)
        return <Tile key={i} x={x} y={y} />
      })}

      {initialPieces.map((piece) => (
        <group key={piece.id} position={[piece.position[0] - 3.5, 0, piece.position[1] - 3.5]}>
          <PieceMesh
            type={piece.type}
            color={piece.color}
            onClick={() => handlePieceClick(piece)}
          />
        </group>
      ))}

      {message && (
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.16}
          color="#D4AF37"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#0B0C10"
        >
          {message}
        </Text>
      )}
    </group>
  )
}

function StageRings() {
  const ring1 = useRef<THREE.Mesh>(null)
  const ring2 = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ring1.current) {
      ring1.current.rotation.z = t * 0.2
      const mat = ring1.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.3 + Math.sin(t * 1.2) * 0.12
    }
    if (ring2.current) {
      ring2.current.rotation.z = -t * 0.16
      const mat = ring2.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.14 + Math.sin(t * 0.9 + 1) * 0.06
    }
  })

  return (
    <group>
      <mesh ref={ring1} position={[0, -0.235, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.85, 8.18, 64]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2} position={[0, -0.23, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.6, 8.72, 64]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.14} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function OrbitRing() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.3
  })

  return (
    <group position={[0, 1.7, 0]}>
      <mesh ref={ref} rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[5.2, 5.32, 96]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.16} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[4.35, 4.38, 96]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function BreathingLights() {
  const gold = useRef<THREE.PointLight>(null)
  const spot = useRef<THREE.SpotLight>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (gold.current) gold.current.intensity = 0.7 + Math.sin(t * 1.5) * 0.25
    if (spot.current) spot.current.intensity = 0.9 + Math.sin(t * 1.8 + 2) * 0.3
  })

  return (
    <>
      <pointLight ref={gold} position={[-5, 4, -4]} intensity={0.7} color="#D4AF37" />
      <spotLight ref={spot} position={[0, 12, 2]} angle={0.5} intensity={0.9} color="#D4AF37" />
    </>
  )
}

export default function ChessboardHero() {
  const mountRef = useRef<HTMLElement | null>(null)
  const inView = useInView(mountRef, { once: true, amount: 0.15 })

  return (
    <section ref={mountRef} id="interactive-board" className="relative py-24 bg-obsidian/60 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/50 via-obsidian/30 to-obsidian/50" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-px h-4 bg-gold" />
            <span className="text-xs tracking-[0.3em] text-gold font-mono uppercase">
              CHESSWARE NEURO INTERACTIVE MATRIX v2.4
            </span>
            <span className="w-px h-4 bg-gold" />
          </div>
          <p className="text-sm text-ivory-dim">
            Hover over the board to reveal pieces. Click pieces to inspect coordinates.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="relative">
          <div className="relative rounded-2xl border border-slate-light bg-obsidian-light/50 backdrop-blur-sm p-6 md:p-10 shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <div
              className="h-[300px] sm:h-[420px] md:h-[520px] w-full rounded-xl overflow-hidden"
              style={{
                touchAction: 'pan-y',
                background:
                  'radial-gradient(ellipse 90% 85% at 50% 42%, #1C212D 0%, #151923 48%, #0B0C10 100%)',
                boxShadow: 'inset 0 0 120px rgba(212, 175, 55, 0.06), 0 0 80px rgba(212, 175, 55, 0.04)',
              }}
            >
              {inView && (
                <Canvas
                  camera={{ position: [0, 7, 9], fov: 40 }}
                  shadows
                  dpr={[1, 1.5]}
                  gl={{ antialias: true }}
                >
                <hemisphereLight intensity={0.5} color="#E8E4D8" groundColor="#0B0C10" />
                <directionalLight position={[6, 9, 5]} intensity={1.4} color="#fff" castShadow shadow-mapSize={[1024, 1024]} />
                <BreathingLights />
                <mesh position={[0, -0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[8.4, 64]} />
                  <meshPhysicalMaterial color="#0F1219" roughness={0.12} metalness={0.55} clearcoat={0.5} clearcoatRoughness={0.3} />
                </mesh>
                <StageRings />
                <OrbitRing />
                <Sparkles count={80} scale={[12, 3, 12]} position={[0, 0.8, 0]} size={2.6} speed={0.5} opacity={0.7} color="#D4AF37" />
                <Chessboard />
                <ContactShadows position={[0, -0.16, 0]} opacity={0.55} scale={11} blur={2.6} far={2.5} resolution={512} color="#000000" />
              </Canvas>
            )}
            </div>
            <div className="flex items-center justify-between mt-4 text-xs font-mono text-ivory-dim">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                REALISTIC 3D MATRIX
              </span>
              <span>Hover to highlight • Click pieces to select</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}