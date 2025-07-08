import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, slug, type, theme, galleryImages, projects } = body
    
    const college = await db.college.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        type,
        theme,
        galleryImages,
        projects,
      },
      include: {
        createdBy: true,
      }
    })
    
    return NextResponse.json(college)
  } catch (error) {
    console.error('Error updating college:', error)
    if (typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: 'College not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update college' }, { status: 500 })
  }
}

