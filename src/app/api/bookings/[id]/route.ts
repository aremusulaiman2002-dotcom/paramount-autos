import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface Context {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, context: Context) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: context.params.id }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: booking
    })
  } catch (error) {
    console.error('Failed to fetch booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    const body = await request.json()
    
    const booking = await prisma.booking.update({
      where: { id: context.params.id },
      data: {
        status: body.status,
        paymentStatus: body.paymentStatus,
        notes: body.notes
      }
    })

    return NextResponse.json({
      success: true,
      data: booking
    })
  } catch (error) {
    console.error('Failed to update booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}