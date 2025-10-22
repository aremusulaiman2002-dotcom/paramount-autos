import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Define types for the booking data
interface BookingData {
  id: string
  refNumber: string
  customerName: string
  phone: string
  email?: string
  totalAmount: number
  status: string
  paymentStatus: string
  createdAt: Date
  startDate: Date
  endDate: Date
  pickupLocation: string
  dropoffLocation: string
  vehicles: string
  securityPersonnel: string | null
  notes?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const where = status ? { status } : {}
    
    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        refNumber: true,
        customerName: true,
        phone: true,
        email: true,
        totalAmount: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        startDate: true,
        endDate: true,
        pickupLocation: true,
        dropoffLocation: true,
        vehicles: true,
        securityPersonnel: true,
        notes: true,
      }
    })

    // Parse JSON fields for admin display
    const bookingsWithParsedData = bookings.map((booking: BookingData) => ({
      ...booking,
      vehicles: JSON.parse(booking.vehicles),
      securityPersonnel: booking.securityPersonnel ? JSON.parse(booking.securityPersonnel) : null
    }))

    return NextResponse.json(bookingsWithParsedData)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Generate a unique reference number
    const refNumber = `PMT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    const booking = await prisma.booking.create({
      data: {
        refNumber,
        customerName: body.customerName,
        phone: body.phone,
        email: body.email,
        pickupLocation: body.pickupLocation,
        dropoffLocation: body.dropoffLocation,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        vehicles: JSON.stringify(body.vehicles || []),
        securityPersonnel: body.securityPersonnel ? JSON.stringify(body.securityPersonnel) : null,
        totalAmount: body.totalAmount,
        notes: body.notes,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      }
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}