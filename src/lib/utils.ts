// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// CSS Classname utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Price formatting (kept in case needed elsewhere)
export function formatPrice(price: number): string {
  if (!price || isNaN(price)) {
    return '₦0'
  }
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Booking reference generation
export function generateBookingRef(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const randomStr = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `PMT-${dateStr}-${randomStr}`
}

// Date calculations
export function calculateDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 1;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Handle invalid dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
  
  const timeDiff = end.getTime() - start.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  return Math.max(1, daysDiff);
}

// Date validation
export function validateDateRange(startDate: string, endDate: string): boolean {
  if (!startDate || !endDate) return true;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Handle invalid dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
  
  return end >= start;
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Format date for display - FIXED VERSION
export function formatDisplayDate(date: string | Date | null): string {
  if (!date) return 'Unknown date';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
}

// Safe string conversion
export function safeString(value: unknown, defaultValue: string = ''): string {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return value.toString();
  return defaultValue;
}

// NEW: Safe number conversion for totalAmount
export function safeNumber(value: unknown, defaultValue: number = 0): number {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}

// NEW: Debug function to check booking data
export function debugBooking(booking: any) {
  console.log('🔍 DEBUG Booking:', {
    ref: booking.refNumber,
    customer: booking.customerName,
    totalAmount: booking.totalAmount,
    totalAmountType: typeof booking.totalAmount,
    createdAt: booking.createdAt,
    createdAtType: typeof booking.createdAt,
    vehicles: booking.vehicles,
    vehiclesType: typeof booking.vehicles
  });
}