"use client"

import { useState } from "react"
import HomeSharedSection from "@/components/_homeComponents/HomeSharedSection"
import SplashScreen from "@/components/SplashScreen"

function Home() {
  const [showSplash, setShowSplash] = useState(true)

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  const handleSplashSkip = () => {
    setShowSplash(false)
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} onSkip={handleSplashSkip} />
  }

  return <HomeSharedSection />
}

export default Home
