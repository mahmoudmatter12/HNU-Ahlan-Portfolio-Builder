import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest
  ,
  { params }: { params: { id: string } }
) {
  try {
    const formSubmission = await db.formSubmission.findUnique({
      where: { id: params.id },
      include: {
        formSection: {
          include: {
            fields: {
              orderBy: { order: 'asc' }
            }
          }
        },
        college: true,
      }
    })
    
    if (!formSubmission) {
      return NextResponse.json({ error: 'Form submission not found' }, { status: 404 })
    }
    
    return NextResponse.json(formSubmission)
  } catch (error) {
    console.error('Error fetching form submission:', error)
    return NextResponse.json({ error: 'Failed to fetch form submission' }, { status: 500 })
  }
}

