import { Car, Phone, Mail, MapPin, Shield, Clock } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold">PARAMOUNT AUTOS</div>
                <div className="text-xs text-gray-400">Premium Vehicle Rental</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience luxury and security with our premium fleet of vehicles and professional 
              security personnel. Your safety and comfort are our top priorities.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Our Services</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Car className="w-4 h-4" />
                <span className="text-sm">Luxury Vehicle Rental</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Executive Security</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Nationwide Coverage</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <div className="space-y-3">
              <Link href="/vehicles" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Our Fleet
              </Link>
              <Link href="/services" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Our Services
              </Link>
              <Link href="/about" className="block text-gray-400 hover:text-white transition-colors text-sm">
                About Us
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="text-white text-sm font-medium">+234 800 000 0000</div>
                  <div className="text-gray-400 text-xs">Customer Service</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="text-white text-sm font-medium">info@paramountautos.com</div>
                  <div className="text-gray-400 text-xs">Email Us</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="text-white text-sm font-medium">24/7</div>
                  <div className="text-gray-400 text-xs">Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm text-center md:text-left mb-4 md:mb-0">
              <p>&copy; 2025 Paramount Autos. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-6">
              <p className="text-gray-400 text-sm">Drive Safe. Book Smart. Travel Confidently.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}