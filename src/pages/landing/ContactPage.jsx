import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Facebook } from 'lucide-react';
import { settingsAPI } from '../../utils/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState({
    companyName: 'PT NOVITA TRAVEL',
    address: 'Jl. Mugirejo, Mugirejo, Kec. Sungai Pinang, Kota Samarinda, Kalimantan Timur 75119',
    phone: '+62 123 456 789',
    email: 'info@novitatravel.com',
    whatsapp: '+62 812 3456 789',
    facebook: 'Novita Transpot Samarinda',
    operatingHours: {
      weekdays: '06:00 - 22:00',
      weekends: '07:00 - 20:00'
    },
    maps: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      setSettings(prev => ({
        ...prev,
        ...response.data
      }));
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Pesan Anda telah dikirim! Kami akan segera menghubungi Anda.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Alamat Kantor',
      content: settings.address,
      color: 'text-red-600'
    },
    {
      icon: Phone,
      title: 'Telepon',
      content: settings.phone,
      color: 'text-blue-600'
    },
    {
      icon: Mail,
      title: 'Email',
      content: settings.email,
      color: 'text-green-600'
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      content: `Senin-Sabtu: ${settings.operatingHours.weekdays}\nMinggu: ${settings.operatingHours.weekends}`,
      color: 'text-purple-600'
    }
  ];

  // Helper function to convert Google Maps URL to embed URL
  const getEmbedUrl = (mapsUrl) => {
    if (!mapsUrl) return '';
    
    // If it's already an embed URL, return as is
    if (mapsUrl.includes('embed')) {
      return mapsUrl;
    }
    
    // Handle Google Maps sharing URLs (maps.app.goo.gl)
    if (mapsUrl.includes('maps.app.goo.gl')) {
      // For maps.app.goo.gl URLs, we'll use a simple approach
      // The URL will be converted to a basic embed format
      // Note: For production use, you might want to implement proper URL resolution
      return mapsUrl.replace('maps.app.goo.gl', 'www.google.com/maps/embed');
    }
    
    // Handle regular Google Maps URLs
    if (mapsUrl.includes('google.com/maps')) {
      // Convert to embed format
      return mapsUrl.replace('/maps/', '/maps/embed/');
    }
    
    // If it's a direct embed URL or other format, return as is
    return mapsUrl;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6" data-aos="fade-up">
            Hubungi Kami
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Kami siap membantu Anda dengan informasi layanan dan reservasi perjalanan Anda
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4`}>
                  <info.icon className={`w-8 h-8 ${info.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">{info.title}</h3>
                <p className="text-gray-600 whitespace-pre-line">{info.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div data-aos="fade-right">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Kirim Pesan
              </h2>
              <p className="text-gray-600 mb-8">
                Isi form di bawah ini dan kami akan menghubungi Anda sesegera mungkin
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Masukkan email"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      No. Telepon *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Masukkan no. telepon"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subjek *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Pilih subjek</option>
                      <option value="reservasi">Reservasi</option>
                      <option value="informasi">Informasi Layanan</option>
                      <option value="keluhan">Keluhan</option>
                      <option value="saran">Saran</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tuliskan pesan Anda..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 text-white py-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  ) : (
                    <Send className="w-5 h-5 mr-2" />
                  )}
                  {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div data-aos="fade-left">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Lokasi Kami
              </h2>
              
              {/* Google Maps Embedded */}
              <div className="h-64 rounded-lg mb-6 overflow-hidden">
                {settings.maps ? (
                  <iframe
                    src={getEmbedUrl(settings.maps)}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi Kantor"
                  />
                ) : (
                  <div className="bg-gray-200 h-full flex items-center justify-center">
                    <p className="text-gray-600">Google Maps akan dimuat di sini</p>
                  </div>
                )}
              </div>

              {/* Additional Contact Methods */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">WhatsApp</h3>
                  <p className="text-gray-600 mb-4">
                    Untuk respon lebih cepat, hubungi kami langsung melalui WhatsApp
                  </p>
                  <a 
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium inline-block"
                  >
                    Chat WhatsApp
                  </a>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Media Sosial</h3>
                  <p className="text-gray-600 mb-4">
                    Ikuti kami di media sosial untuk update terbaru
                  </p>
                  <div className="flex space-x-4">
                    <a 
                      href={`https://facebook.com/${settings.facebook.replace(/\s+/g, '').toLowerCase()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                <div className="bg-primary-50 p-6 rounded-lg border border-primary-200">
                  <h3 className="text-lg font-bold text-primary-800 mb-2">Customer Service 24/7</h3>
                  <p className="text-primary-700">
                    Tim customer service kami siap membantu Anda 24 jam sehari, 7 hari seminggu untuk keperluan darurat dan reservasi mendesak.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Beberapa pertanyaan umum yang mungkin membantu Anda
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: 'Bagaimana cara melakukan reservasi?',
                answer: 'Anda dapat melakukan reservasi melalui website, telepon, atau WhatsApp. Tim kami akan membantu proses reservasi hingga selesai.'
              },
              {
                question: 'Apakah ada diskon untuk pelanggan reguler?',
                answer: 'Ya, kami memberikan diskon khusus untuk pelanggan yang sering menggunakan layanan kami. Hubungi customer service untuk informasi lebih lanjut.'
              },
              {
                question: 'Berapa lama waktu tempuh dari Samarinda ke Balikpapan?',
                answer: 'Waktu tempuh normal sekitar 2-3 jam tergantung kondisi lalu lintas dan cuaca.'
              },
              {
                question: 'Apakah tersedia asuransi perjalanan?',
                answer: 'Ya, semua penumpang dan barang yang kami angkut sudah diasuransikan sesuai dengan peraturan yang berlaku.'
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}