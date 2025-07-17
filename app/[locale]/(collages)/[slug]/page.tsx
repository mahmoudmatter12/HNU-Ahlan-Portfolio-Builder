'use client'
import { CollegeService } from '@/services/collage-service'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import React from 'react'

function CollegePage() {
  const { slug } = useParams()
  const { data: college } = useQuery({
    queryKey: ['college', slug],
    queryFn: () => CollegeService.getCollegeBySlug(slug as string)
  })
  return (
    <div>
      {college?.name} -- {college?.createdBy?.name}
    </div>
  )
}

export default CollegePage