// scripts/clear-data.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearData() {
  console.log('Starting database cleanup...')
  
  try {
    // Delete in correct order to respect foreign key constraints
    await prisma.verificationToken.deleteMany()
    console.log('✓ Cleared verification tokens')
    
    await prisma.session.deleteMany()
    console.log('✓ Cleared sessions')
    
    await prisma.account.deleteMany()
    console.log('✓ Cleared accounts')
    
    await prisma.user.deleteMany()
    console.log('✓ Cleared users')
    
    await prisma.booking.deleteMany()
    console.log('✓ Cleared bookings')
    
    await prisma.vehicle.deleteMany()
    console.log('✓ Cleared vehicles')
    
    console.log('🎉 Database cleared successfully! All tables are empty but structure remains intact.')
    
  } catch (error) {
    console.error('Error clearing database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

clearData()