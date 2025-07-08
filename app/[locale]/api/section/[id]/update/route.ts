import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, order, content } = body
    
    const section = await db.section.update({
      where: { id: params.id },
      data: {
        title,
        order,
        content,
      },
      include: {
        college: true,
      }
    })
    
    return NextResponse.json(section)
  } catch (error) {
    console.error('Error updating section:', error)
    if (typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 })
  }
}

