import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { bookings } from '@/lib/schema'
import { eq } from 'drizzle-orm'

interface Context {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id))
      .limit(1)

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
    const { id } = await context.params
    const body = await request.json()
    
    const [existingBooking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id))
      .limit(1)

    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    const [updatedBooking] = await db
      .update(bookings)
      .set({
        status: body.status,
        paymentStatus: body.paymentStatus,
        notes: body.notes
      })
      .where(eq(bookings.id, id))
      .returning()

    if (!updatedBooking) {
      return NextResponse.json(
        { success: false, error: 'Failed to update booking' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedBooking
    })
  } catch (error) {
    console.error('Failed to update booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}