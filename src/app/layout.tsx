import './globals.css'
import { Inter, Poppins } from 'next/font/google'
import SessionProvider from '@/components/providers/SessionProvider'

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'Paramount Autos - Premium Vehicle Rental & Executive Security',
  description: 'Experience unparalleled luxury and security with Paramount Autos. Premium vehicle rentals and professional security services for the discerning client.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-white">
        <SessionProvider>
          {children}
        </SessionProvider>
        
        {/* Developer Credit - Subtle but visible */}
        <div className="fixed bottom-4 right-4 z-50">
          <a 
            href="https://sulaiman-portfolio-sigma.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-gray-800 to-black text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2 border border-gray-600"
          >
            <span>🚀</span>
            <span>Developed by SulaimanDev</span>
          </a>
        </div>
      </body>
    </html>
  )
}