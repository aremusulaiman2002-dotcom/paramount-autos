import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate unique booking reference
    const refNumber = `PMT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // Calculate totals
    const vehicleSubtotal = body.vehicles.reduce((sum: number, vehicle: any) => {
      return sum + (vehicle.subtotal || 0);
    }, 0);
    
    const securitySubtotal = body.securityPersonnel ? body.securityPersonnel.subtotal : 0;
    const totalAmount = vehicleSubtotal + securitySubtotal;

    // Create booking in database
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
        vehicles: body.vehicles,
        securityPersonnel: body.securityPersonnel,
        totalAmount,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ 
      success: true, 
      booking: {
        id: booking.id,
        refNumber: booking.refNumber,
        totalAmount: booking.totalAmount
      }
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const refNumber = searchParams.get('ref');
  
  if (!refNumber) {
    return NextResponse.json({ error: 'Reference number required' }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { refNumber },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}