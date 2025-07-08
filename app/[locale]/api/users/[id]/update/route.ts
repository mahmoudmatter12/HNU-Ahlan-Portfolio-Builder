import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'


export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { email, name, userType, collegeId } = body
    
    const user = await db.user.update({
      where: { id: params.id },
      data: {
        email,
        name,
        userType,
        collegeId,
      },
      include: {
        college: true,
      }
    })
    
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    if (typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

