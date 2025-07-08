import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const collegeId = searchParams.get('collegeId')
    
    const formSections = await db.formSection.findMany({
      where: collegeId ? { collegeId } : undefined,
      include: {
        college: true,
        fields: {
          orderBy: { order: 'asc' }
        },
        submissions: true,
        _count: {
          select: {
            fields: true,
            submissions: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(formSections)
  } catch (error) {
    console.error('Error fetching form sections:', error)
    return NextResponse.json({ error: 'Failed to fetch form sections' }, { status: 500 })
  }
}

