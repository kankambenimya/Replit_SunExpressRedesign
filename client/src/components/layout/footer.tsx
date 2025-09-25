import { Link } from "wouter";
import { Sun, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-sunblue rounded-full flex items-center justify-center mr-2">
                <Sun className="text-sunorange h-4 w-4" />
              </div>
              <span className="text-white font-bold text-xl">SunExpress</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your sun specialist connecting Europe and Turkey with exceptional service and great value.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="social-facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="social-twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="social-instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="social-linkedin">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-flights">
                  Flights
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-destinations">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-offers">
                  Special Offers
                </Link>
              </li>
              <li>
                <Link href="/checkin" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-checkin">
                  Check-in
                </Link>
              </li>
              <li>
                <Link href="/my-booking" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-booking">
                  My Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-baggage">
                  Baggage
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-seats">
                  Seat Selection
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-meals">
                  Meals
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-lounge">
                  Lounge Access
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-insurance">
                  Travel Insurance
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-contact">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-faq">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-terms">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-privacy">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-about">
                  About Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 SunExpress. All rights reserved. | Flight booking made simple.</p>
        </div>
      </div>
    </footer>
  );
}
