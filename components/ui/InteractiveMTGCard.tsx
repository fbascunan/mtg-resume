import { useState, useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Text, PerspectiveCamera, useTexture } from "@react-three/drei"
import * as THREE from "three"

const skills = [
 
  { name: "VueJS", level: 80, color: "#339933", art: "/VueJS_concept_in_Magic_the_Gathering_art_style.webp", texture: "/card_template_blue.png" },
  { name: "React", level: 70, color: "#61DAFB", art: "/Javascript_concept_in_an_MTG_art_style.webp", texture: "/card_template_blue.png" },
  { name: "Ruby on Rails", level: 75, color: "#E10098", art: "/Ruby_on_Rails_framework_concept_in_an_MTG_art_style.webp", texture: "/card_template_red.webp" },
  { name: "Ruby", level: 80, color: "red", art: "/ruby_on_rails.webp", texture: "/card_template_red.webp" },
  { name: "GIT, Gitlab & Github", level: 80, color: "orange", art: "/github_gitlab.webp", texture: "/card_template_white.png" },
  { name: "Python", level: 70, color: "#3776AB", art: "/Python3_card_art_for_a_Magic_the_Gathering_like_game_incorporating_the_Python_logo2.webp", texture: "/card_template_yellow.webp" },
  { name: ".NET", level: 70, color: "blue", art: "/backend_concept_in_Magic_the_Gathering_art_style.webp", texture: "/card_template_blue.png" },
  { name: "Azure", level: 60, color: "blue", art: "/Azure_the_cloud_in_Magic_the_Gathering_art_style_with_the_logo.webp", texture: "/card_template_blue.png" },
  
  
  { name: "Docker", level: 50, color: "blue", art: "/Docker_concept_in_an_MTG_art_style_(1).webp", texture: "/card_template_blue.png" },
  { name: "SQL", level: 70, color: "lightblue", art: "/SQL_concept_in_an_MTG_art_style.webp", texture: "/card_template_yellow.webp" },
  { name: "Astro", level: 40, color: "orange", art: "/AstroJS_concept_in_an_MTG_art_style.webp", texture: "/card_template_yellow.webp" },
  { name: "TypeScript", level: 60, color: "#3178C6", art: "/Javascript_concept_in_an_MTG_art_style_(1).webp", texture: "/card_template_white.png" },
  { name: "Javascript", level: 70, color: "yellow", art: "/js_card.webp", texture: "/card_template_yellow.webp" },
  { name: "Next.js", level: 60, color: "gray", art: "/nextjs.jpg", texture: "/card_template_white.png" },
]

// Precompute colors
const precomputedColors = skills.map(skill => {
  const originalColor = new THREE.Color(skill.color);
  return originalColor.lerp(new THREE.Color(0xffffff), 0.4);
});

export default function InteractiveMTGCard() {
  // Memoize the light setup
  const lights = useMemo(() => (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} />
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
    </>
  ), []);

  return (
    <>
      {lights}
      <InnerInteractiveMTGCard />
    </>
  )
}

function InnerInteractiveMTGCard() {
  const mesh = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)
  const [activeSkill, setActiveSkill] = useState(0)
  const { size } = useThree()

  // Preload all textures
  const textures = useTexture(
    skills.map(skill => skill.texture)
  );
  const artTextures = useTexture(
    skills.map(skill => skill.art)
  );

  // Memoize current textures
  const currentTextures = useMemo(() => ({
    texture: textures[activeSkill],
    art: artTextures[activeSkill]
  }), [activeSkill, textures, artTextures]);

  // Memoize geometries
  const geometries = useMemo(() => ({
    plane: new THREE.PlaneGeometry(4, 6),
    box: new THREE.BoxGeometry(4, 3.8, 0),
    skillBar: new THREE.PlaneGeometry(3, 0.2)
  }), []);

  // Optimize frame updates
  useFrame((state) => {
    if (!hovered && mesh.current) {
      const time = state.clock.getElapsedTime();
      mesh.current.rotation.y = Math.sin(time * 0.5) * 0.2;
      mesh.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      mesh.current.position.z = 0;
    }
  });

  // Memoize event handlers
  const handlePointerMove = useMemo(() => 
    (e: { clientX: number; clientY: number }) => {
      if (hovered && mesh.current) {
        mesh.current.position.z = 2;
        const x = (e.clientX / size.width) * 2 - 1;
        const y = -(e.clientY / size.height) * 1 + 1;
        mesh.current.rotation.y = x * 0.5;
        mesh.current.rotation.x = y * 0.5;
      }
    }, 
    [hovered, size]
  );

  const handleClick = () => {
    setActiveSkill((prevSkill) => (prevSkill + 1) % skills.length);
  };

  // Memoize materials
  const materials = useMemo(() => ({
    glow: new THREE.MeshBasicMaterial({
      map: currentTextures.texture,
      color: precomputedColors[activeSkill],
      transparent: true,
      opacity: 1
    }),
    art: new THREE.MeshStandardMaterial({
      map: currentTextures.art,
      color: hovered ? '#dfdfdf' : '#cfcfcf',
      roughness: 1.8,
      metalness: 2.8
    }),
    skillBar: new THREE.MeshBasicMaterial({ color: "white" }),
    progress: new THREE.MeshBasicMaterial({ color: skills[activeSkill].color })
  }), [activeSkill, hovered, currentTextures]);

  return (
    <group
      ref={mesh}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    >
      {/* Glow effect */}
      <mesh position={[0, 0, 0]} scale={[1.075, 1.075, 1]} geometry={geometries.plane} material={materials.glow} />

      {/* Main art */}
      <mesh position={[0, 0.8, hovered ? -0.35 : -0.01]} geometry={geometries.box} material={materials.art} />

      {/* Skill name */}
      <Text
        position={[-1.7, 2.7, 0.03]}
        fontSize={0.24}
        color="#111111"
        anchorX="left"
        anchorY="middle"
        outlineWidth={0.01}
      >
        {skills[activeSkill].name}
      </Text>

      {/* Skill level */}
      <Text
        position={[0, -1.35, 0.11]}
        fontSize={0.24}
        color="#111111"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
      >
        Mastery: {skills[activeSkill].level}%
      </Text>

      {/* Skill bar background */}
      <mesh position={[0, -1.9, 0.11]} geometry={geometries.skillBar} material={materials.skillBar} />
      
      {/* Skill bar progress */}
      <mesh 
        position={[-1.5 + (skills[activeSkill].level / 100) * 3 / 2, -1.9, 0.12]}
        geometry={new THREE.PlaneGeometry((skills[activeSkill].level / 100) * 3, 0.2)}
        material={materials.progress}
      />
    </group>
  )
}