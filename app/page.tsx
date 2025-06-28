"use client"
import { SortableList } from '@/components/SortableList'
import { useTheme } from 'next-themes'
import React from 'react'

function Home() {
  const { setTheme } = useTheme()
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
    </>
  )
}

export default Home