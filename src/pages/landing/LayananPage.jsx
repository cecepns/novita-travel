import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Filter } from 'lucide-react';
import { servicesAPI } from '../../utils/api';
import { getImageUrl } from '../../utils/imageUtils';

export default function LayananPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const serviceTypes = ['Travel', 'Logistik', 'Charter'];

  useEffect(() => {
    fetchServices();
  }, [currentPage, searchTerm, filterType]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getAll(currentPage, 10);
      setServices(response.data.services || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === i
              ? 'bg-primary-600 text-white'
              : 'bg-white text-primary-600 hover:bg-primary-50 border border-primary-600'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-12">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 rounded bg-white text-primary-600 hover:bg-primary-50 border border-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 rounded bg-white text-primary-600 hover:bg-primary-50 border border-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6" data-aos="fade-up">
            Layanan Kami
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Berbagai pilihan layanan transportasi dan logistik untuk memenuhi kebutuhan perjalanan dan pengiriman Anda
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari layanan..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filterType}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Semua Layanan</option>
                {serviceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Tidak ada layanan yang ditemukan</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <div 
                    key={service.id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <img 
                      src={getImageUrl(service.image)} 
                      alt={service.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                          {service.type}
                        </span>
                        {service.isPopular && (
                          <span className="ml-2 bg-secondary-100 text-secondary-600 px-3 py-1 rounded-full text-sm font-medium">
                            Popular
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{service.name}</h3>
                      <div className="text-gray-600 mb-4">
                        <p className="mb-2"><strong>Rute:</strong> {service.route}</p>
                        <p className="text-sm line-clamp-3">{service.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-primary-600 font-bold text-lg">
                            Rp {parseInt(service.price || 0).toLocaleString('id-ID')}
                          </span>
                          <p className="text-sm text-gray-500">per orang/kg</p>
                        </div>
                        <Link 
                          to={`/layanan/${service.id}`}
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium flex items-center"
                        >
                          Detail <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {renderPagination()}
            </>
          )}
        </div>
      </section>

      {/* Service Types Info */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Jenis Layanan Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tiga kategori utama layanan untuk memenuhi berbagai kebutuhan transportasi Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center" data-aos="fade-up">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🚌</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Travel</h3>
              <p className="text-gray-600">
                Layanan transportasi penumpang antar kota dengan armada nyaman dan driver berpengalaman
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Logistik</h3>
              <p className="text-gray-600">
                Pengiriman barang aman dan cepat dengan tracking real-time untuk berbagai jenis barang
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🚐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Charter</h3>
              <p className="text-gray-600">
                Sewa kendaraan dengan driver untuk keperluan khusus, wisata, atau event perusahaan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Butuh Layanan Khusus?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Hubungi kami untuk konsultasi layanan yang sesuai dengan kebutuhan spesifik Anda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact"
                className="bg-secondary-500 text-white px-8 py-4 rounded-lg hover:bg-secondary-600 transition-colors duration-200 font-semibold"
              >
                Hubungi Kami
              </Link>
              <Link 
                to="/reservasi"
                className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-200 font-semibold"
              >
                Reservasi Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}