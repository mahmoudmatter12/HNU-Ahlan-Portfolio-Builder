"use client"
import { SortableList } from '@/components/SortableList'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import React from 'react'

function Home() {
  const { setTheme } = useTheme()
  const t = useTranslations('home')
  return (
    <>
      <div>
        <button className='bg-gray-200 dark:bg-red-600' onClick={() => setTheme("light")}>Light</button>
        <button className='bg-gray-800 text-white' onClick={() => setTheme("dark")}>Dark</button>
      </div>
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
        <h1>Sortable List with @dnd-kit</h1>
        <SortableList />
      </div>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>{t('title')}</h1>
        <p className='text-gray-600'>{t('description')}</p>
      </div>
    </>
  )
}

export default Home