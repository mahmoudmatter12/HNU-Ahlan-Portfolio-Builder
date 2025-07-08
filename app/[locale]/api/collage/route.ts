import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const createdById = searchParams.get('createdById')
    
    const colleges = await db.college.findMany({
      where: {
        ...(type && { type: type as any }),
        ...(createdById && { createdById }),
      },
      include: {
        User: true,
        sections: {
          orderBy: { order: 'asc' }
        },
        forms: true,
        createdBy: true,
        _count: {
          select: {
            User: true,
            sections: true,
            forms: true,
            FormSubmission: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(colleges)
  } catch (error) {
    console.error('Error fetching colleges:', error)
    return NextResponse.json({ error: 'Failed to fetch colleges' }, { status: 500 })
  }
}
