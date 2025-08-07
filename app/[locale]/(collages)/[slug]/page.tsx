'use client'
import { CollegeService } from '@/services/collage.service'
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
import { Loader2 } from 'lucide-react'
import NotFound from '@/app/not-found'

function CollegePage() {
  const { slug } = useParams()
  const { data: college, isLoading } = useQuery({
    queryKey: ['college', slug],
    queryFn: () => CollegeService.getCollegeBySlug(slug as string)
  })
  const { university } = useUniversity()
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
    </div>
  }
  if (!college) {
    return <NotFound />
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