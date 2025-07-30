'use client'
import { CollegeService } from '@/services/collage-service'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import React from 'react'
import { CollageThemeProvider } from '@/context/collage-theme-context'
import HeroSection from '@/app/[locale]/(collages)/_collageUserComponents/hero_section'
import { useUniversity } from '@/context/universityContext'
import AboutSection from '../_collageUserComponents/about_section'
import Departments from '../_collageUserComponents/deps'
import StudentActivites from '../_collageUserComponents/student_activites'
import ColllageGallery from '../_collageUserComponents/colllage_gallery'
import FQA_section from '../_collageUserComponents/FQA_section'
import CustomSection from '../_collageUserComponents/custom_section'
import CollageLeadersSection from '../_collageUserComponents/collage_leaders_section'
import FormIndicatorSection from '../_collageUserComponents/form_indicator_section'

function CollegePage() {
  const { slug } = useParams()
  const { data: college, isLoading } = useQuery({
    queryKey: ['college', slug],
    queryFn: () => CollegeService.getCollegeBySlug(slug as string)
  })
  const { university } = useUniversity()
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (!college) {
    return <div>Not found</div>
  }

  return (
    <CollageThemeProvider college={college}>
      <div>
        <HeroSection collage={college} uni={university || null} />
        <AboutSection collage={college} />
        <Departments college={college} />
        <StudentActivites college={college} />
        <ColllageGallery college={college} />
        <FQA_section collage={college} />
        <CustomSection college={college} />
        <CollageLeadersSection college={college} />
        <FormIndicatorSection college={college} />
      </div>
    </CollageThemeProvider>
  )
}

export default CollegePage