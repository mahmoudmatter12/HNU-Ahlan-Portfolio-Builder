import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { label, type, isRequired, options, order } = body
    
    const formField = await db.formField.update({
      where: { id: params.id },
      data: {
        label,
        type,
        isRequired,
        options,
        order,
      },
      include: {
        formSection: true,
      }
    })
    
    return NextResponse.json(formField)
  } catch (error) {
    console.error('Error updating form field:', error)
    if (typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: 'Form field not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update form field' }, { status: 500 })
  }
}
