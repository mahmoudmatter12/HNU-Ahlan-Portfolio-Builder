import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { sectionOrders } = body

    if (!sectionOrders || !Array.isArray(sectionOrders)) {
      return NextResponse.json({ 
        error: 'sectionOrders array is required' 
      }, { status: 400 })
    }

    // Validate that all sections belong to this college
    const sections = await db.section.findMany({
      where: { 
        collegeId: params.id,
        id: { in: sectionOrders.map(item => item.id) }
      },
      select: { id: true }
    })

    if (sections.length !== sectionOrders.length) {
      return NextResponse.json({ 
        error: 'Some sections do not belong to this college' 
      }, { status: 400 })
    }

    // Update all sections with new order using transaction
    const updatePromises = sectionOrders.map((item, index) => 
      db.section.update({
        where: { id: item.id },
        data: { order: item.order || index }
      })
    )

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedSections = await db.$transaction(updatePromises)

    // Return updated sections in order
    const orderedSections = await db.section.findMany({
      where: { collegeId: params.id },
      orderBy: { order: 'asc' }
    })
    
    return NextResponse.json({
      message: 'Sections reordered successfully',
      sections: orderedSections
    })
  } catch (error) {
    console.error('Error reordering sections:', error)
    return NextResponse.json({ error: 'Failed to reorder sections' }, { status: 500 })
  }
}
