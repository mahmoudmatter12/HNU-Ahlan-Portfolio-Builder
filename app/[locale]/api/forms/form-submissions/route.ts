import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const formSectionId = searchParams.get('formSectionId')
    const collegeId = searchParams.get('collegeId')
    
    const formSubmissions = await db.formSubmission.findMany({
      where: {
        ...(formSectionId && { formSectionId }),
        ...(collegeId && { collegeId }),
      },
      include: {
        formSection: {
          include: {
            fields: {
              orderBy: { order: 'asc' }
            }
          }
        },
        college: true,
      },
      orderBy: { submittedAt: 'desc' }
    })
    
    return NextResponse.json(formSubmissions)
  } catch (error) {
    console.error('Error fetching form submissions:', error)
    return NextResponse.json({ error: 'Failed to fetch form submissions' }, { status: 500 })
  }
}



// app/api/form-submissions/[id]/route.ts

