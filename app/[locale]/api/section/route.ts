import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const collegeId = searchParams.get('collegeId')
    
    const sections = await db.section.findMany({
      where: collegeId ? { collegeId } : undefined,
      include: {
        college: true,
      },
      orderBy: { order: 'asc' }
    })
    
    return NextResponse.json(sections)
  } catch (error) {
    console.error('Error fetching sections:', error)
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 })
  }
}

