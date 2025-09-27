import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, MapPin, Check, Star, Calendar } from 'lucide-react';
import { servicesAPI } from '../../utils/api';
import { getImageUrl } from '../../utils/imageUtils';

export default function LayananDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServiceDetail();
  }, [id]);

  const fetchServiceDetail = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getById(id);
      setService(response.data);
    } catch (error) {
      console.error('Error fetching service detail:', error);
      setError('Layanan tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Layanan Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">Maaf, layanan yang Anda cari tidak tersedia.</p>
          <Link to="/layanan" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
            Kembali ke Layanan
          </Link>
        </div>
      </div>
    );
  }

  const features = [
    'AC dan Ventilasi Baik',
    'Kursi Nyaman',
    'Driver Berpengalaman',
    'Asuransi Perjalanan',
    'Rest Area Strategis',
    'Customer Service 24/7'
  ];

  return (
    <div>
      {/* Back Button */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Link 
            to="/layanan" 
            className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Layanan
          </Link>
        </div>
      </div>

      {/* Service Detail Hero */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div data-aos="fade-right">
              <img 
                src={getImageUrl(service.image)} 
                alt={service.name}
                className="w-full h-80 object-cover rounded-xl shadow-lg"
              />
            </div>
            
            <div data-aos="fade-left">
              <div className="flex items-center mb-4">
                <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium mr-3">
                  {service.type}
                </span>
                {service.isPopular && (
                  <span className="bg-secondary-100 text-secondary-600 px-3 py-1 rounded-full text-sm font-medium">
                    Popular
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                {service.name}
              </h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-gray-600">(4.8/5)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-primary-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Rute</p>
                    <p className="font-medium">{service.route}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-primary-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Durasi</p>
                    <p className="font-medium">{service.duration || '4-6 jam'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-primary-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Kapasitas</p>
                    <p className="font-medium">{service.capacity || '12-16 orang'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Jadwal</p>
                    <p className="font-medium">{service.schedule || 'Setiap hari'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  Rp {parseInt(service.price || 0).toLocaleString('id-ID')}
                </div>
                <p className="text-gray-600">per orang/kg</p>
              </div>

              <Link 
                to={`/reservasi?service=${service.id}`}
                className="w-full bg-primary-600 text-white py-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-semibold text-center block"
              >
                Reservasi Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Description */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-6" data-aos="fade-up">
                Deskripsi Layanan
              </h2>
              <div 
                className="prose prose-lg max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: service.description }}
                data-aos="fade-up"
                data-aos-delay="100"
              />

              {/* Features */}
              <h3 className="text-xl font-bold text-gray-800 mb-6 mt-12" data-aos="fade-up">
                Fasilitas & Keunggulan
              </h3>
              <div className="grid md:grid-cols-2 gap-4" data-aos="fade-up" data-aos-delay="100">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-secondary-500 mr-3" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Contact Info */}
              <div className="bg-white p-6 rounded-lg shadow-lg mb-8" data-aos="fade-up">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Butuh Informasi Lebih?</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">Telepon:</span>
                    <span className="ml-2 text-primary-600">+62 123 456 789</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">WhatsApp:</span>
                    <span className="ml-2 text-primary-600">+62 812 3456 789</span>
                  </div>
                  <Link 
                    to="/contact"
                    className="w-full bg-secondary-600 text-white py-3 rounded-lg hover:bg-secondary-700 transition-colors duration-200 font-medium text-center block mt-4"
                  >
                    Hubungi Kami
                  </Link>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-white p-6 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Jam Operasional</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Senin - Sabtu</span>
                    <span>06:00 - 22:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minggu</span>
                    <span>07:00 - 20:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center" data-aos="fade-up">
            Layanan Terkait
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder for related services */}
            {[1, 2, 3].map((item) => (
              <div 
                key={item}
                className="bg-gray-50 p-6 rounded-lg"
                data-aos="fade-up"
                data-aos-delay={item * 100}
              >
                <h3 className="font-bold text-gray-800 mb-2">Layanan Travel Lainnya</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Eksplorasi layanan travel lainnya yang tersedia
                </p>
                <Link 
                  to="/layanan"
                  className="text-primary-600 font-medium hover:text-primary-800"
                >
                  Lihat Semua Layanan →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}