import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const form = await db.formSection.findUnique({
      where: { id: id },
      include: {
        fields: {
          orderBy: { order: 'asc' }
        },
        college: true
      }
    })
    
    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }
    
    return NextResponse.json(form)
  } catch (error) {
    console.error('Error fetching form with fields:', error)
    return NextResponse.json({ error: 'Failed to fetch form with fields' }, { status: 500 })
  }
}
