import { useState, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Text, PerspectiveCamera, Texture, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { useTranslations } from "next-intl"
import { url } from "inspector"

const skills = [
 
  { name: "VueJS", level: 80, color: "#339933", art: "/VueJS_concept_in_Magic_the_Gathering_art_style.webp", texture: "/raw_texture.webp" },
  { name: "React", level: 70, color: "#61DAFB", art: "/Magic_the_Gathering_style_card_art_for_React_JS_the_library.webp", texture: "/raw_texture.webp" },
  { name: "Ruby on Rails", level: 75, color: "#E10098", art: "/ruby_on_rails.webp", texture: "/raw_texture.webp" },
  { name: "Ruby", level: 80, color: "red", art: "/Ruby_on_Rails_framework_concept_in_an_MTG_art_style.webp", texture: "/raw_texture.webp" },
  { name: "GIT", level: 80, color: "orange", art: "/github_gitlab.webp", texture: "/raw_texture.webp" },
  { name: "Python", level: 70, color: "#3776AB", art: "/Python3_card_art_for_a_Magic_the_Gathering_like_game_incorporating_the_Python_logo.webp", texture: "/raw_texture.webp" },
  { name: ".NET", level: 70, color: "blue", art: "/backend_concept_in_Magic_the_Gathering_art_style.webp", texture: "/raw_texture.webp" },
  { name: "Azure", level: 60, color: "blue", art: "/Azure_the_cloud_in_Magic_the_Gathering_art_style_with_the_logo.webp", texture: "/raw_texture.webp" },
  
  
  { name: "TypeScript", level: 60, color: "#3178C6", art: "/github_gitlab.webp", texture: "/raw_texture.webp" },
  { name: "Javascript", level: 70, color: "yellow", art: "/github_gitlab.webp", texture: "/raw_texture.webp" },
  { name: "SQL", level: 70, color: "lightblue", art: "/github_gitlab.webp", texture: "/raw_texture.webp" },
  { name: "Docker", level: 50, color: "blue", art: "/github_gitlab.webp", texture: "/raw_texture.webp" },
  { name: "Astro", level: 40, color: "orange", art: "/github_gitlab.webp", texture: "/raw_texture.webp" },
]

export default function InteractiveMTGCard() {
  return (
    <>
      <ambientLight intensity={0.8} />
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
      mesh.current.position.z = 0
    }
  })

  const handlePointerMove = (e: { clientX: number; clientY: number }) => {
    if (hovered) {
      mesh.current.position.z = 2
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
      <mesh position={[0, 0, -0.02]} scale={[1.075, 1.075, 1]}>
        <planeGeometry args={[4, 6]} />
        <meshBasicMaterial map={texture} color={`${skills[activeSkill].color}`} opacity={5} />
      </mesh>

      {/* Main card */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[4, 3, 0.2]} />
        <meshStandardMaterial map={art} color={hovered ? 'white' : '#cccccc'} roughness={1.8}  metalness={3}/>
      </mesh>

      {/* Skill name */}
      <Text
        position={[-2, 2.9, 0.11]}
        fontSize={0.25}
        color="#444444"
        anchorX="left"
        anchorY="middle"
        outlineColor={`{skills[activeSkill].color}aa`}
        outlineWidth={0.01}
      >
        {skills[activeSkill].name}
      </Text>

      {/* Skill level */}
      <Text
        position={[0, -1.2, 0.11]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Mastery: {skills[activeSkill].level}%
      </Text>

      {/* Skill bar */}
      <mesh position={[0, (-0.7 - 1.2), 0.11]}>
        <planeGeometry args={[3, 0.2]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <mesh position={[-1.5 + (skills[activeSkill].level / 100) * 3 / 2, (-0.7 - 1.2), 0.12]}>
        <planeGeometry args={[(skills[activeSkill].level / 100) * 3, 0.2]} />
        <meshBasicMaterial color={skills[activeSkill].color} />
      </mesh>

      {/* Instructions
      <Text
        position={[0, -2.5, 0.11]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {t('instructions')}
      </Text> */}
    </group>
  )
}
