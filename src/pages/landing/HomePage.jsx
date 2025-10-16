import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Clock,
  CheckCircle,
} from "lucide-react";
import { servicesAPI } from "../../utils/api";
import { getImageUrl } from "../../utils/imageUtils";
import Banner from '../../assets/logo.jpeg';

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll(1, 6);
      setServices(response.data.services || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  // stats section is currently not used

  const features = [
    {
      title: "🚐 Layanan Profesional",
      description:
        "Proses pemesanan mudah dan transparan, didukung tim yang ramah serta siap membantu dari pemesanan hingga keberangkatan.",
      icon: CheckCircle,
    },
    {
      title: "💻 Pemesanan Online Cepat",
      description:
        "Nikmati kemudahan reservasi tiket secara online melalui website resmi kami—praktis, efisien, dan bisa diakses kapan saja.",
      icon: Clock,
    },
    {
      title: "💸 Harga Terjangkau & Jelas",
      description:
        "Kami menawarkan tarif kompetitif tanpa biaya tersembunyi, dengan layanan lengkap mulai dari travel reguler, carter, hingga ekspedisi barang.",
      icon: Award,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0" data-aos="fade-right">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Perjalanan Aman &
                <span className="text-secondary-300"> Nyaman</span>
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                PT Novita Travel - Partner terpercaya untuk perjalanan dan
                pengiriman barang Anda di Kalimantan Timur
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/reservasi"
                  className="bg-secondary-500 text-white px-8 py-4 rounded-lg hover:bg-secondary-600 transition-colors duration-200 font-semibold text-center"
                >
                  Reservasi Sekarang
                </Link>
                <Link
                  to="/layanan"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-200 font-semibold text-center"
                >
                  Lihat Layanan
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2" data-aos="fade-left">
              <img
                src={Banner}
                alt="Travel Bus"
                className="rounded-2xl shadow-2xl w-full max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Mengapa Memilih PT Novita Travel?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              PT Novita Travel adalah penyedia jasa travel dan ekspedisi terpercaya di Samarinda yang telah beroperasi sejak 2010. Kami berkomitmen memberikan layanan perjalanan aman, nyaman, dan tepat waktu bagi pelanggan di seluruh Kalimantan Timur.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Layanan Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Berbagai layanan transportasi dan logistik untuk memenuhi
              kebutuhan perjalanan Anda
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
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
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {service.name}
                    </h3>
                    <p
                      dangerouslySetInnerHTML={{ __html: service.description }}
                      className="text-gray-600 mb-4 line-clamp-3"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-primary-600 font-bold text-lg">
                        Rp{" "}
                        {parseInt(service.price || 0).toLocaleString("id-ID")}
                      </span>
                      <Link
                        to={`/layanan/${service.id}`}
                        className="text-primary-600 font-medium hover:text-primary-800 flex items-center"
                      >
                        Detail <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12" data-aos="fade-up">
            <Link
              to="/layanan"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-semibold inline-flex items-center"
            >
              Lihat Semua Layanan <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Apa Kata Pelanggan Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kepuasan pelanggan adalah prioritas utama kami
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Budi Santoso",
                role: "Pengusaha",
                image:
                  "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg",
                rating: 5,
                review:
                  "Pelayanan sangat memuaskan! Driver ramah dan perjalanan sangat nyaman. Pasti akan menggunakan jasa Novita Travel lagi.",
              },
              {
                name: "Siti Nurhaliza",
                role: "Ibu Rumah Tangga",
                image:
                  "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg",
                rating: 5,
                review:
                  "Pengiriman barang selalu tepat waktu dan aman. Tarif juga sangat terjangkau. Terima kasih Novita Travel!",
              },
              {
                name: "Ahmad Rifai",
                role: "Karyawan Swasta",
                image:
                  "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
                rating: 5,
                review:
                  "Sudah berlangganan lebih dari 2 tahun. Tidak pernah kecewa dengan layanan mereka. Sangat recommended!",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.review}"</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Siap Untuk Perjalanan Selanjutnya?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Reservasi sekarang dan nikmati perjalanan yang aman, nyaman, dan
              terpercaya bersama PT Novita Travel
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/reservasi"
                className="bg-secondary-500 text-white px-8 py-4 rounded-lg hover:bg-secondary-600 transition-colors duration-200 font-semibold"
              >
                Reservasi Sekarang
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-200 font-semibold"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
