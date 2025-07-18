import { HeroSection } from "./hero-section"
import { AboutSection } from "./about-section"
import { UserProfile } from "../../app/[locale]/(admin)/admin/profile/_components/UserProfile"

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
