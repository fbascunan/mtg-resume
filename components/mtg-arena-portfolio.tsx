"use client"

import { useState, useRef, Suspense, useEffect, ReactNode } from "react"
import { GithubIcon, LinkedinIcon, MailIcon, MessageCircleCode } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { Canvas } from "@react-three/fiber"
import Image from "next/image"
import { useTranslations } from "next-intl"
import LocaleSwitcher from '@/components/LocaleSwitcher'
import InteractiveMTGCard from "@/components/ui/InteractiveMTGCard"
import TestComponent from "./ui/TestComponent"


const skills = [
  { name: "VueJS", level: 80, color: "#339933" },
  { name: "React", level: 70, color: "#61DAFB" },
  { name: "Javascript", level: 70, color: "yellow" },
  { name: "TypeScript", level: 60, color: "#3178C6" },
  { name: "Ruby", level: 80, color: "red" },
  { name: "Python", level: 70, color: "#3776AB" },
  { name: ".NET", level: 70, color: "blue" },
  { name: "Azure", level: 60, color: "blue" },
  { name: "SQL", level: 70, color: "lightblue" },
  { name: "Ruby on Rails", level: 75, color: "#E10098" },
  { name: "GIT", level: 80, color: "orange" },
  { name: "Docker", level: 50, color: "blue" },
  { name: "Astro", level: 40, color: "orange" },
]

const projects = [
  { name: "nopBuk", image: "/nopbuk.webp", url: "https://melodic-torrone-6f1779.netlify.app/" },
  { name: "fakeProject", image: "/profile.png", url: "#" },
  { name: "tic-tac-toe", image: "/profile_v2.png", url: "#" }
]

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
  const t = (key: string) => {
    const translator = useTranslations('Index')
    const translation = translator(key)

    if (translation === `Index.${key}`) {
      console.log(key.split('.'), "the last element:", key.split('.').pop())
      return key.split('.').pop()
    }
    return translation
  }

  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white font-fantasy">
      <div className="bg-red-600 text-center p-2">
        {t('onProgress')}
      </div>
      <header className="relative flex items-center justify-center p-6 bg-black bg-opacity-50">
        <h1 className="text-4xl font-bold text-blue-300 glow">
          {t('title')}
        </h1>
        <div className="absolute right-6">
          <LocaleSwitcher />
        </div>
      </header>

      <main className="container mx-auto p-6">
        <FadeInSection>
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <Image className="bg-black bg-opacity-50 p-0  rounded-lg border border-blue-500 glow" src="/profile_v3.png" alt="Profile picture" width={500} height={500} />
            <div className="flex flex-col justify-center md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4 text-orange-400 glow">{t('aboutMe.title')}</h2>
              <div className="flex flex-col bg-black bg-opacity-50 p-6 rounded-lg border border-blue-500 glow h-full">
                <p>{t('aboutMe.description')}</p>
                <a className=" self-baseline mt-auto mb-0  text-blue-400 hover:text-blue-300 transition-colors duration-300" href={t('aboutMe.oneDriveLink')} target="_blank" rel="noopener noreferrer" >{t('aboutMe.cvLink')} →</a>
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-orange-400 glow">{t('skills.title')}</h2>
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
            <h2 className="text-2xl font-semibold mb-4 text-orange-400 glow">{t('interactiveCard.title')}</h2>
            <div className="w-full h-[700px] bg-black bg-opacity-10 rounded-lg border-purple-500">
              <Canvas>
                <Suspense fallback={null}>
                  <InteractiveMTGCard />
                </Suspense>
              </Canvas>
            </div>
          </section>
        </FadeInSection>
        <FadeInSection>
{/* 
          <div className="w-full h-[600px] bg-black bg-opacity-50 rounded-lg border border-purple-500">
            <TestComponent></TestComponent>
          </div> */}

          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-orange-400 glow">{t('projects.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.name} className="flex flex-col w-auto bg-black bg-opacity-50 p-6 rounded-lg border border-purple-500 hover:border-orange-400 transition-colors duration-300 glow">
                    <Image className="self-center mb-4 inline max-h-[350px]" style={{objectFit: "contain"}} src={project.image} alt={project.name} width={500} height={350} />
                    <h3 className=" mt-auto text-xl font-semibold mb-2 text-purple-300">{t(`projects.${project.name}.title`)}</h3>
                    <p className="text-gray-300 mb-4">{t(`projects.${project.name}.description`)}</p>
                    <a className=" self-baseline mt-auto mb-0  text-blue-400 hover:text-blue-300 transition-colors duration-300" href={project.url} target="_blank" rel="noopener noreferrer" >{t('projects.viewSpell')} →</a>
                </div>
              ))}
            </div>
          </section>

        </FadeInSection>
        <FadeInSection>
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-400 glow">{t('contact.title')}</h2>
            <div className="flex justify-center space-x-8">
              <a href="https://github.com/FelipeAndresBascunanMorales" className="text-blue-400 hover:text-blue-300 transition-colors duration-300" target="_blank">
                <GithubIcon size={24} /> <span>GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/fel-and/" className="text-blue-400 hover:text-blue-300 transition-colors duration-300" target="_blank">
                <LinkedinIcon size={24} /> <span>LinkedIn</span>
              </a>
                <a href="mailto:fbascunan03@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors duration-300"  target="_blank">
                <MailIcon size={24} /> <span>Mail</span>
              </a>
              {/* whatsapp */}
              <a href="https://wa.me/56922567802" className="text-blue-400 hover:text-blue-300 transition-colors duration-300" target="_blank">
                <MessageCircleCode width={24} height={24} /> <span>WhatsApp</span>
              </a>
              {/* // link to getonbrd */}
              <a href="https://www.getonbrd.com/p/felipe-bascunan" className="text-blue-400 hover:text-blue-300 transition-colors duration-300"  target="_blank" style={{mixBlendMode: 'screen'}}>
                <Image src="/getonbrd2.png"   alt="GetOnBrd" width={24} height={24} /> <span>GetOnBoard</span>
              </a>
            </div>
          </section>
        </FadeInSection>
      </main>

      <footer className="mt-12 p-6 bg-black bg-opacity-50 text-center">
        <p className="text-gray-400">{t('footer.copyright')}</p>
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