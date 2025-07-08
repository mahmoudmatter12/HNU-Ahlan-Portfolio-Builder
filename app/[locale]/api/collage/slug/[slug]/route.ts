import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const college = await db.college.findUnique({
      where: { slug: params.slug },
      include: {
        User: true,
        sections: {
          orderBy: { order: 'asc' }
        },
        forms: {
          include: {
            fields: {
              orderBy: { order: 'asc' }
            }
          }
        },
        createdBy: true,
      }
    })
    
    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 })
    }
    
    return NextResponse.json(college)
  } catch (error) {
    console.error('Error fetching college by slug:', error)
    return NextResponse.json({ error: 'Failed to fetch college' }, { status: 500 })
  }
}
