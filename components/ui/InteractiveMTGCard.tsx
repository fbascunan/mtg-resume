import { useState, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Text, PerspectiveCamera, Texture, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { useTranslations } from "next-intl"
import { url } from "inspector"

const skills = [
  { name: "React", level: 90, color: "#61DAFB", art: "/github_gitlab.webp", texture: "/ruby_on_rails.webp" },
  { name: "TypeScript", level: 85, color: "#3178C6", art: "/github_gitlab.webp", texture: "/ruby_on_rails.webp" }, 
  { name: "Node.js", level: 80, color: "#339933", art: "/github_gitlab.webp", texture: "/ruby_on_rails.webp" },
  { name: "GraphQL", level: 75, color: "#E10098", art: "/github_gitlab.webp", texture: "/ruby_on_rails.webp" },
  { name: "Python", level: 70, color: "#3776AB", art: "/github_gitlab.webp", texture: "/ruby_on_rails.webp" }
]

export default function InteractiveMTGCard() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <InnerInteractiveMTGCard />
    </>
  )
}

function InnerInteractiveMTGCard() {
  const t = useTranslations('InteractiveCard')
  const mesh = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)
  const [activeSkill, setActiveSkill] = useState(0)
  const { size } = useThree()
  const texture = useTexture(skills[activeSkill].texture)
  const art = useTexture(skills[activeSkill].art)

  useFrame((state) => {
    if (!hovered) {
      mesh.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2
      mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1
    }
  })

  const handlePointerMove = (e: { clientX: number; clientY: number }) => {
    if (hovered) {
      const x = (e.clientX / size.width) * 2 - 1
      const y = -(e.clientY / size.height) * 1 + 1
      mesh.current.rotation.y = x * 0.5
      mesh.current.rotation.x = y * 0.5
    }
  }

  return (
    <group
      ref={mesh}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerMove={handlePointerMove}
      onClick={() => setActiveSkill((prevSkill) => (prevSkill + 1) % skills.length)}
    >
      {/* Glow effect */}
      <mesh position={[0, 0, -0.01]} scale={[1.05, 1.05, 1]}>
        <planeGeometry args={[4, 6]} />
        <meshBasicMaterial map={art} color={skills[activeSkill].color} opacity={0.6} transparent />
      </mesh>

      {/* Main card */}
      <mesh>
        <boxGeometry args={[4, 6, 0.2]} />
        <meshStandardMaterial map={texture} color={hovered ? 'white' : '#cccccc'} metalness={0.1} roughness={0.5} />
      </mesh>

      {/* Skill name */}
      <Text
        position={[-1.3, 2.7, 0.11]}
        fontSize={0.3}
        color={skills[activeSkill].color}
        anchorX="center"
        anchorY="middle"
      >
        {skills[activeSkill].name}
      </Text>

      {/* Skill level */}
      <Text
        position={[0, 1.2, 0.11]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Mastery: {skills[activeSkill].level}%
      </Text>

      {/* Skill bar */}
      <mesh position={[0, 0.7, 0.11]}>
        <planeGeometry args={[3, 0.2]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <mesh position={[-1.5 + (skills[activeSkill].level / 100) * 3 / 2, 0.7, 0.12]}>
        <planeGeometry args={[(skills[activeSkill].level / 100) * 3, 0.2]} />
        <meshBasicMaterial color={skills[activeSkill].color} />
      </mesh>

      {/* Instructions */}
      <Text
        position={[0, -2.5, 0.11]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {t('instructions')}
      </Text>
    </group>
  )
}
