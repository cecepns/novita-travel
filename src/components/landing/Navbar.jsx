import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import Logo from '../../assets/logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Layanan', href: '/layanan' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-800 text-white py-2 px-4">
        <div className="container mx-auto flex flex-wrap items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              <span>+62 123 456 789</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="hidden md:block">Jl. Mugirejo, Samarinda, Kalimantan Timur</span>
            </div>
          </div>
          <div className="text-sm">
            FB: Novita Transpot Samarinda
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="rounded-lg p-2 mr-3">
                <img src={Logo} alt="Logo" className="w-20 h-auto" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">PT NOVITA TRAVEL</h1>
                <p className="text-sm text-gray-600">Travel & Logistik Terpercaya</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/reservasi"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
              >
                Reservasi Sekarang
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 px-4 font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/reservasi"
                onClick={() => setIsOpen(false)}
                className="block mx-4 mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium text-center"
              >
                Reservasi Sekarang
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}