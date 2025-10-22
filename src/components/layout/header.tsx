'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, Phone } from 'lucide-react'

export function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-gray-900 leading-tight">PARAMOUNT AUTOS</div>
              <div className="text-xs text-gray-500 leading-tight">Premium Vehicle Rental</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`font-medium transition-colors ${
                pathname === '/' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/vehicles" 
              className={`font-medium transition-colors ${
                pathname === '/vehicles' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Our Fleet
            </Link>
            <Link 
              href="/services" 
              className={`font-medium transition-colors ${
                pathname === '/services' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Services
            </Link>
            <Link 
              href="/about" 
              className={`font-medium transition-colors ${
                pathname === '/about' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`font-medium transition-colors ${
                pathname === '/contact' ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Contact Info */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              <Phone className="w-4 h-4" />
              <span className="font-medium text-sm">+234 800 000 0000</span>
            </div>
            <Link 
              href="/booking" 
              className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors font-medium text-sm"
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 mt-4 pt-4">
          <nav className="flex items-center justify-between">
            <Link 
              href="/vehicles" 
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium text-sm"
            >
              Fleet
            </Link>
            <Link 
              href="/services" 
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium text-sm"
            >
              Services
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium text-sm"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium text-sm"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}