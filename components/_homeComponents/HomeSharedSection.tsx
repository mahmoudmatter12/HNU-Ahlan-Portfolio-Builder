import { HeroSection } from "./hero-section"
import { AboutSection } from "./about-section"
import { UserProfile } from "../UserProfile"

function HomeSharedSection() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <UserProfile />
    </>
  )
}

export default HomeSharedSection
