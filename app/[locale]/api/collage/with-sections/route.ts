import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const college = await db.college.findUnique({
      where: { id: params.id },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    })
    
    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 })
    }
    
    return NextResponse.json(college)
  } catch (error) {
    console.error('Error fetching college with sections:', error)
    return NextResponse.json({ error: 'Failed to fetch college with sections' }, { status: 500 })
  }
}
