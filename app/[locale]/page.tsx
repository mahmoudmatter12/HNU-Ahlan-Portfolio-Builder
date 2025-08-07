"use client"

import { useState } from "react"
import SplashScreen from "@/components/SplashScreen"
import { HeroSection } from "@/components/_homeComponents/hero-section"
import HomeCollageSectionIndecator from "@/components/_homeComponents/home_collage_section_indecator"
import { useUniversity } from "@/context/universityContext"

function Home() {
  const [showSplash, setShowSplash] = useState(true)
  const { university } = useUniversity()


  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  const handleSplashSkip = () => {
    setShowSplash(false)
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} onSkip={handleSplashSkip} />
  }

  return <>
    <HeroSection university={university || null} />
    <HomeCollageSectionIndecator university={university} />
    {/* <div className="w-screen h-screen flex justify-center items-center">
      <iframe src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FHNU.Helwan%2Fvideos%2F2201219793710396%2F&show_text=false&width=560&t=0" width="100%" height="100%" style={{ border: "none", overflow: "hidden" }} scrolling="no" frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
    </div> */}
  </>
}

export default Home
