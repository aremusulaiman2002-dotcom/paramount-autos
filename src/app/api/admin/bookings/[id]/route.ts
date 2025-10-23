// src/app/api/admin/bookings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { bookings } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    console.log('📖 Admin Booking GET - Fetching booking:', id)

    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id))
      .limit(1)

    if (booking.length === 0 || !booking[0]) {
      console.log('❌ Admin Booking GET - Booking not found:', id)
      return NextResponse.json(
        { 
          success: false,
          error: 'Booking not found' 
        }, 
        { status: 404 }
      )
    }

    console.log('✅ Admin Booking GET - Booking found:', booking[0].refNumber)
    
    return NextResponse.json({
      success: true,
      data: booking[0]
    })
  } catch (error) {
    console.error('❌ Admin Booking GET - Error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch booking'
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    console.log('✏️ Admin Booking PUT - Updating booking:', id, 'with data:', body)

    const existingBooking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id))
      .limit(1)

    if (existingBooking.length === 0 || !existingBooking[0]) {
      console.log('❌ Admin Booking PUT - Booking not found:', id)
      return NextResponse.json(
        { 
          success: false,
          error: 'Booking not found' 
        }, 
        { status: 404 }
      )
    }

    // Validate required fields for update
    const allowedFields = [
      'status', 
      'paymentStatus', 
      'totalAmount', 
      'notes', 
      'pickupLocation', 
      'dropoffLocation',
      'startDate',
      'endDate'
    ]
    
    const updateData: any = {}
    
    // Only allow specific fields to be updated
    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = body[key]
      }
    })

    // Add updatedAt timestamp
    updateData.updatedAt = new Date()

    console.log('✏️ Admin Booking PUT - Update data:', updateData)

    // Update booking
    const [updatedBooking] = await db
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, id))
      .returning()

    if (!updatedBooking) {
      console.error('❌ Admin Booking PUT - Failed to update booking')
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to update booking' 
        },
        { status: 500 }
      )
    }

    console.log('✅ Admin Booking PUT - Booking updated successfully:', updatedBooking.refNumber)
    
    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: 'Booking updated successfully'
    })
  } catch (error) {
    console.error('❌ Admin Booking PUT - Error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'Failed to update booking'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    console.log('🗑️ Admin Booking DELETE - Deleting booking:', id)

    const existingBooking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id))
      .limit(1)

    if (existingBooking.length === 0 || !existingBooking[0]) {
      console.log('❌ Admin Booking DELETE - Booking not found:', id)
      return NextResponse.json(
        { 
          success: false,
          error: 'Booking not found' 
        }, 
        { status: 404 }
      )
    }

    const bookingRef = existingBooking[0].refNumber

    await db
      .delete(bookings)
      .where(eq(bookings.id, id))

    console.log('✅ Admin Booking DELETE - Booking deleted successfully:', bookingRef)
    
    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully',
      deletedBooking: bookingRef
    })
  } catch (error) {
    console.error('❌ Admin Booking DELETE - Error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'Failed to delete booking'
      },
      { status: 500 }
    )
  }
}