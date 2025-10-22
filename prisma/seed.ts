import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  try {
    // Clear existing data
    await prisma.booking.deleteMany()
    await prisma.vehicle.deleteMany()
    await prisma.user.deleteMany()
    console.log('✅ Cleared existing data')
  } catch (error) {
    console.log('ℹ️ No existing data to clear or tables not created yet')
  }

  // Create admin user with hashed password
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  try {
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@paramountautos.com',
        name: 'System Administrator',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
      },
    })
    console.log('✅ Admin user created:', adminUser.email)
  } catch (error) {
    console.log('✅ Admin user already exists')
  }

  // Create sample vehicles
  const vehicles = [
    {
      name: 'Toyota Hilux',
      type: 'SUV',
      pricePerDay: 50000,
      description: 'Reliable and powerful SUV perfect for both city and off-road adventures.',
      features: JSON.stringify(['4WD', '7 Seats', 'AC', 'Bluetooth']),
      image: '/images/hilux.jpg',
    },
    {
      name: 'Toyota Prado',
      type: 'Luxury SUV',
      pricePerDay: 80000,
      description: 'Luxury SUV with premium comfort and advanced safety features.',
      features: JSON.stringify(['Leather Seats', 'Sunroof', 'Premium Sound', 'Navigation']),
      image: '/images/prado.jpg',
    },
    {
      name: '18-Seater Bus',
      type: 'Bus',
      pricePerDay: 120000,
      description: 'Comfortable bus for group travel with ample luggage space.',
      features: JSON.stringify(['AC', 'Comfortable Seats', 'Luggage Space', 'Entertainment']),
      image: '/images/bus.jpg',
    },
    {
      name: 'Ford Ranger',
      type: 'Pickup Truck',
      pricePerDay: 45000,
      description: 'Versatile pickup truck for both work and personal use.',
      features: JSON.stringify(['4WD', 'Double Cabin', 'Towing Capacity', 'AC']),
      image: '/images/ranger.jpg',
    },
    {
      name: 'Mercedes Benz S-Class',
      type: 'Luxury Sedan',
      pricePerDay: 150000,
      description: 'Ultimate luxury sedan with premium features and comfort.',
      features: JSON.stringify(['Leather Seats', 'Massage Function', 'Premium Sound', 'Panoramic Roof']),
      image: '/images/sclass.jpg',
    },
  ]

  // Create vehicles
  for (const vehicle of vehicles) {
    try {
      await prisma.vehicle.create({
        data: vehicle
      })
      console.log(`✅ Created vehicle: ${vehicle.name}`)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.log(`⚠️ Failed to create vehicle ${vehicle.name}:`, errorMessage)
    }
  }

  // Create sample booking
  try {
    const sampleBooking = await prisma.booking.create({
      data: {
        refNumber: 'PMT-20241219-TEST',
        customerName: 'John Doe',
        phone: '+2348012345678',
        email: 'john.doe@example.com',
        pickupLocation: 'Lagos Airport',
        dropoffLocation: 'Victoria Island, Lagos',
        startDate: new Date('2024-12-20'),
        endDate: new Date('2024-12-25'),
        vehicles: JSON.stringify([
          {
            vehicleId: '1',
            name: 'Toyota Hilux',
            quantity: 2,
            days: 5,
            subtotal: 500000
          }
        ]),
        securityPersonnel: JSON.stringify({
          count: 2,
          rate: 15000,
          days: 5,
          subtotal: 150000
        }),
        totalAmount: 650000,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
    })
    console.log('✅ Sample booking created:', sampleBooking.refNumber)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.log('⚠️ Failed to create sample booking:', errorMessage)
  }

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e: unknown) => {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error'
    console.error('❌ Seeding failed:', errorMessage)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })