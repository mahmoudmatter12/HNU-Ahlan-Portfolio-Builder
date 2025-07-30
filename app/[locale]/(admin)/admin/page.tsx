import BackgroundDecorations from '@/components/BackgroundDecorations'
import React from 'react'

function page() {
  return (
    <>
      <BackgroundDecorations showDecorations={false}>
        <div className='text-white text-2xl font-bold'>
          Welcome to the admin dashboard
        </div>
        <div className='text-sm text-gray-400'>
          Manage your college&apos;s data and settings
        </div>
      </BackgroundDecorations>
    </>
  )
}

export default page