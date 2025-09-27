import { MapPin, Phone, Mail, Facebook, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-primary-600 text-white rounded-lg p-2 mr-3">
                <span className="text-xl font-bold">NT</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">PT NOVITA TRAVEL</h3>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Penyedia layanan transportasi dan logistik terpercaya di Kalimantan Timur sejak 2010.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/layanan" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Layanan
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Layanan Kami</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Travel Antar Kota</li>
              <li className="text-gray-300">Antar Barang</li>
              <li className="text-gray-300">Logistik Express</li>
              <li className="text-gray-300">Charter Bus</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hubungi Kami</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mt-1 mr-3 text-primary-400" />
                <p className="text-gray-300 text-sm">
                  Jl. Mugirejo, Mugirejo, Kec. Sungai Pinang, Kota Samarinda, Kalimantan Timur 75119
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-primary-400" />
                <span className="text-gray-300">+62 123 456 789</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-primary-400" />
                <span className="text-gray-300">info@novitatravel.com</span>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 mt-1 mr-3 text-primary-400" />
                <div className="text-gray-300 text-sm">
                  <p>Senin - Sabtu: 06:00 - 22:00</p>
                  <p>Minggu: 07:00 - 20:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 PT NOVITA TRAVEL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}