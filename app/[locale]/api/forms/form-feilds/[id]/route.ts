import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formField = await db.formField.findUnique({
      where: { id: params.id },
      include: {
        formSection: {
          include: {
            college: true
          }
        }
      }
    })
    
    if (!formField) {
      return NextResponse.json({ error: 'Form field not found' }, { status: 404 })
    }
    
    return NextResponse.json(formField)
  } catch (error) {
    console.error('Error fetching form field:', error)
    return NextResponse.json({ error: 'Failed to fetch form field' }, { status: 500 })
  }
}


