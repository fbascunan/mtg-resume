"use client"

import { useState, useRef, Suspense, useEffect, ReactNode } from "react"
import { GithubIcon, LinkedinIcon, MailIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Text, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"
import Image from "next/image"

const skills = [
  { name: "React", level: 90, color: "#61DAFB" },
  { name: "TypeScript", level: 85, color: "#3178C6" },
  { name: "Node.js", level: 80, color: "#339933" },
  { name: "GraphQL", level: 75, color: "#E10098" },
  { name: "Python", level: 70, color: "#3776AB" },
]

function InteractiveMTGCard() {
  const mesh = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)
  const [activeSkill, setActiveSkill] = useState(0)
  const { size } = useThree()
  // const { size, viewport } = useThree()
  // const aspect = size.width / viewport.width

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
        <meshBasicMaterial color={skills[activeSkill].color} opacity={0.6} transparent />
      </mesh>

      {/* Main card */}
      <mesh>
        <boxGeometry args={[4, 6, 0.2]} />
        <meshStandardMaterial color={hovered ? 'white' : '#cccccc'} metalness={0.5} roughness={0.5} />
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
        Click to change skill • Hover to rotate
      </Text>
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <InteractiveMTGCard />
    </>
  )
}

function FadeInSection({ children }: { children: ReactNode }) {
  const [isVisible, setVisible] = useState(false)
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setVisible(entry.isIntersecting))
    })
    if (domRef.current) {
      observer.observe(domRef.current)
    }
    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current)
      }
    }
  }, [])

  return (
    <div
      className={`transition-opacity duration-1500 ${isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      ref={domRef}
    >
      {children}
    </div>
  )
}

export function MtgArenaPortfolio() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white font-fantasy">
      <div className="bg-red-600 text-center p-2">
        This portfolio is a work in progress
      </div>
      <header className="p-6 bg-black bg-opacity-50">
        <h1 className="text-4xl font-bold text-center text-blue-300 glow">Planeswalker&apos;s Portfolio</h1>
      </header>

      <main className="container mx-auto p-6">
        <FadeInSection>
          <section className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <Image className="bg-black bg-opacity-50 p-6 rounded-lg border border-blue-500 glow" src="/profile_v3.png" alt="Profile picture" width={500} height={500} />
            <div className="flex flex-col justify-center col-span-2">
              <h2 className="text-2xl font-semibold mb-4 text-orange-400 glow">About Me</h2>
              <div className="bg-black bg-opacity-50 p-6 rounded-lg border border-blue-500 glow" style={{ height: "100%" }}>
                <p>Greetings, fellow Planeswalker! I&apos;m a seasoned developer with a passion for crafting magical digital experiences. My skills span across multiple planes of web development, from frontend sorcery to backend wizardry.</p>
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-orange-400 glow">Mana Pool (Skills)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill) => (
                <Card
                  key={skill.name}
                  className={`bg-black bg-opacity-50 border-2 transition-all duration-300 ease-in-out transform hover:scale-105 ${hoveredSkill === skill.name ? `border-[${skill.color}] shadow-lg shadow-[${skill.color}]/50` : 'border-gray-700'
                    }`}
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2" style={{ color: skill.color }}>{skill.name}</h3>
                    <Progress
                      value={skill.level}
                      className="h-2 mb-2"
                      color={skill.color}
                    />
                    <p className="text-sm text-gray-400">{skill.level}% Mastery</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </FadeInSection>
        <FadeInSection>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-orange-400 glow">Arcane Artifact (Interactive Skill Card)</h2>
            <div className="w-full h-[600px] bg-black bg-opacity-50 rounded-lg border border-purple-500">
              <Canvas>
                <Suspense fallback={null}>
                  <Scene />
                </Suspense>
              </Canvas>
            </div>
          </section>
        </FadeInSection>
        <FadeInSection>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-orange-400 glow">My Spellbook (Projects)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((project) => (
                <div key={project} className="bg-black bg-opacity-50 p-6 rounded-lg border border-purple-500 hover:border-orange-400 transition-colors duration-300 glow">
                  <h3 className="text-xl font-semibold mb-2 text-purple-300">Project {project}</h3>
                  <p className="text-gray-300 mb-4">A powerful spell that transforms user interactions into seamless experiences.</p>
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">View Spell →</a>
                </div>
              ))}
            </div>
          </section>

        </FadeInSection>
        <FadeInSection>
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400 glow">Contact the Planeswalker</h2>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                <GithubIcon size={24} />
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                <LinkedinIcon size={24} />
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                <MailIcon size={24} />
              </a>
            </div>
          </section>
        </FadeInSection>
      </main>

      <footer className="mt-12 p-6 bg-black bg-opacity-50 text-center">
        <p className="text-gray-400">© 2023 Planeswalker&apos;s Portfolio. All rights reserved across the multiverse.</p>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
        
        .font-fantasy {
          font-family: 'Cinzel', serif;
        }
        
        .glow {
          text-shadow: 0 0 10px currentColor;
        }
        
        .glow:hover {
          text-shadow: 0 0 20px currentColor;
          transition: text-shadow 0.3s ease-in-out, color 0.3s ease-in-out;
          color: #ffcc00;
        }
      `}</style>
    </div>
  )
}