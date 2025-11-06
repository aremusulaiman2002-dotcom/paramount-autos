// lib/emailjs.ts
import emailjs from '@emailjs/browser'

// Initialize EmailJS with your public key
export const initEmailJS = () => {
  if (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY)
  }
}

export interface BookingEmailData {
  ref_number: string
  customer_name: string
  phone: string
  email: string
  pickup_location: string
  dropoff_location: string
  start_date: string
  end_date: string
  vehicles: string
  total_amount: string
}

export const sendBookingNotification = async (bookingData: BookingEmailData) => {
  try {
    const templateParams = {
      ...bookingData,
      to_email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'paramountautomobiles001@gmail.com',
    }

    console.log('Sending email with data:', templateParams)

    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      templateParams
    )

    console.log('✅ Email sent successfully:', response)
    return { success: true, message: 'Booking notification sent successfully' }
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    return { 
      success: false, 
      message: 'Failed to send notification email',
      error: error 
    }
  }
}