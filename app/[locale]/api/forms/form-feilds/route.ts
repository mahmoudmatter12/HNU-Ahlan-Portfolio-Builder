import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const formSectionId = searchParams.get('formSectionId')
    
    const formFields = await db.formField.findMany({
      where: formSectionId ? { formSectionId } : undefined,
      include: {
        formSection: {
          include: {
            college: true
          }
        }
      },
      orderBy: { order: 'asc' }
    })
    
    return NextResponse.json(formFields)
  } catch (error) {
    console.error('Error fetching form fields:', error)
    return NextResponse.json({ error: 'Failed to fetch form fields' }, { status: 500 })
  }
}

