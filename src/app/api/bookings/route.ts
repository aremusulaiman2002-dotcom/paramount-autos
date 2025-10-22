import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateBookingRef } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.customerName || !body.phone || !body.pickupLocation || !body.dropoffLocation) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create booking with JSON strings
    const booking = await prisma.booking.create({
      data: {
        refNumber: generateBookingRef(),
        customerName: body.customerName,
        phone: body.phone,
        email: body.email,
        pickupLocation: body.pickupLocation,
        dropoffLocation: body.dropoffLocation,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        vehicles: JSON.stringify(body.vehicles), // Convert to JSON string
        securityPersonnel: body.securityPersonnel ? JSON.stringify(body.securityPersonnel) : null,
        totalAmount: body.vehicles.reduce((sum: number, vehicle: any) => sum + vehicle.subtotal, 0) + 
                    (body.securityPersonnel?.subtotal || 0),
        status: 'PENDING',
        paymentStatus: 'PENDING',
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: booking.id,
        refNumber: booking.refNumber,
        totalAmount: booking.totalAmount,
        status: booking.status
      }
    })
  } catch (error) {
    console.error('Failed to create booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const refNumber = searchParams.get('ref')

  if (!refNumber) {
    return NextResponse.json(
      { success: false, error: 'Booking reference is required' },
      { status: 400 }
    )
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { refNumber }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Parse JSON strings back to objects
    const bookingWithParsedData = {
      ...booking,
      vehicles: JSON.parse(booking.vehicles),
      securityPersonnel: booking.securityPersonnel ? JSON.parse(booking.securityPersonnel) : null
    }

    return NextResponse.json({
      success: true,
      data: bookingWithParsedData
    })
  } catch (error) {
    console.error('Failed to fetch booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}