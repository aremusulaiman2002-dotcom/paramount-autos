// src/app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { generateBookingRef, calculateDays } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📦 Booking POST - Received data:', body);

    const {
      name,
      email,
      phone,
      pickup,
      destination,
      vehicleIds,
      rentalDays,
      securityPersonnel,
      totalPrice,
      startDate,
      endDate,
      notes,
    } = body;

    // Validate required fields
    if (!name || !phone || !pickup || !destination || !vehicleIds || !startDate || !endDate) {
      console.error('❌ Booking POST - Missing required fields:', {
        name: !!name,
        phone: !!phone,
        pickup: !!pickup,
        destination: !!destination,
        vehicleIds: !!vehicleIds,
        startDate: !!startDate,
        endDate: !!endDate
      });
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields',
          missing: {
            name: !name,
            phone: !phone,
            pickup: !pickup,
            destination: !destination,
            vehicleIds: !vehicleIds,
            startDate: !startDate,
            endDate: !endDate
          }
        },
        { status: 400 }
      );
    }

    // Calculate rental days
    const rentalDaysCalc = calculateDays(startDate, endDate);
    console.log('📅 Booking POST - Rental days calculated:', rentalDaysCalc);

    // Prepare vehicles data - ensure it's properly stringified
    const vehiclesData = JSON.stringify({
      vehicleIds: Array.isArray(vehicleIds) ? vehicleIds : [vehicleIds],
      rentalDays: rentalDays || rentalDaysCalc,
    });

    console.log('🚗 Booking POST - Vehicles data:', vehiclesData);

    // Generate unique booking reference
    const refNumber = generateBookingRef();
    console.log('🔖 Booking POST - Generated ref:', refNumber);

    // Create booking
    const [newBooking] = await db.insert(bookings).values({
      refNumber,
      customerName: name,
      email: email || null,
      phone,
      pickupLocation: pickup,
      dropoffLocation: destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      vehicles: vehiclesData,
      securityPersonnel: securityPersonnel ? JSON.stringify(securityPersonnel) : null,
      totalAmount: parseInt(totalPrice) || 0,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      notes: notes || null,
    }).returning();

    if (!newBooking) {
      console.error('❌ Booking POST - Failed to create booking in database');
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to create booking' 
        },
        { status: 500 }
      );
    }

    console.log('✅ Booking POST - Booking created successfully:', newBooking.refNumber);

    return NextResponse.json({
      success: true,
      bookingId: newBooking.refNumber,
      message: 'Booking created successfully',
      booking: newBooking
    });

  } catch (error) {
    console.error('❌ Booking POST - Error creating booking:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// In the GET function of your bookings API route
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');
    const email = searchParams.get('email'); // This is now optional

    console.log('📖 Booking GET - Searching for booking:', { bookingId, email });

    if (!bookingId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Booking ID is required' 
        },
        { status: 400 }
      );
    }

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.refNumber, bookingId))
      .limit(1);

    if (!booking) {
      console.log('❌ Booking GET - Booking not found:', bookingId);
      return NextResponse.json(
        { 
          success: false,
          error: 'Booking not found' 
        },
        { status: 404 }
      );
    }

    // Email verification is now optional
    if (email && booking.email?.toLowerCase() !== email.toLowerCase()) {
      console.log('❌ Booking GET - Email mismatch');
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid credentials' 
        },
        { status: 401 }
      );
    }

    console.log('✅ Booking GET - Booking found:', booking.refNumber);
    return NextResponse.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('❌ Booking GET - Error fetching booking:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch booking' 
      },
      { status: 500 }
    );
  }
}