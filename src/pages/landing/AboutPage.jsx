import { Users, Target, Award, Heart } from 'lucide-react';
import Banner from '../../assets/logo.jpeg';

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Visi',
      description: 'Menjadi perusahaan transportasi dan logistik terdepan di Kalimantan Timur yang memberikan pelayanan berkualitas tinggi dengan teknologi modern.'
    },
    {
      icon: Heart,
      title: 'Misi',
      description: 'Memberikan layanan transportasi yang aman, nyaman, dan terpercaya untuk mendukung mobilitas masyarakat dan kelancaran distribusi barang.'
    },
    {
      icon: Award,
      title: 'Komitmen',
      description: 'Berkomitmen penuh terhadap keselamatan, kenyamanan, dan kepuasan pelanggan dengan standar pelayanan terbaik.'
    }
  ];

  const history = [
    {
      year: '2010',
      title: 'Pendirian Perusahaan',
      description: 'PT Novita Travel didirikan dengan 5 unit kendaraan untuk melayani rute Samarinda-Balikpapan'
    },
    {
      year: '2015',
      title: 'Ekspansi Layanan',
      description: 'Menambah layanan antar barang dan logistik dengan 20 unit kendaraan berbagai ukuran'
    },
    {
      year: '2018',
      title: 'Sertifikasi ISO',
      description: 'Memperoleh sertifikasi ISO 9001:2015 untuk sistem manajemen kualitas'
    },
    {
      year: '2020',
      title: 'Digitalisasi Layanan',
      description: 'Meluncurkan sistem reservasi online dan tracking pengiriman real-time'
    },
    {
      year: '2024',
      title: 'Armada Modern',
      description: 'Memiliki 50+ unit armada modern dengan standar keselamatan terkini'
    }
  ];

  const team = [
    {
      name: 'Drs. Novita Sari, M.M',
      position: 'Direktur Utama',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg',
      experience: '25 tahun pengalaman di bidang transportasi'
    },
    {
      name: 'Ir. Bambang Hermanto',
      position: 'Direktur Operasional',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
      experience: '20 tahun pengalaman operasional logistik'
    },
    {
      name: 'Siti Rahayu, S.E',
      position: 'Manager Keuangan',
      image: 'https://images.pexels.com/photos/3823207/pexels-photo-3823207.jpeg',
      experience: '15 tahun pengalaman keuangan perusahaan'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6" data-aos="fade-up">
            Tentang PT Novita Travel
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Melayani dengan sepenuh hati sejak 2010, menghadirkan solusi transportasi dan logistik terpercaya di Kalimantan Timur
          </p>
        </div>
      </section>

      {/* Company Profile */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2" data-aos="fade-right">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
                Perjalanan Kami Selama 14 Tahun
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                PT Novita Travel didirikan pada tahun 2010 dengan visi menjadi perusahaan transportasi terdepan di Kalimantan Timur. Dimulai dari 5 unit kendaraan, kini kami telah berkembang menjadi perusahaan dengan lebih dari 50 unit armada modern.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Dengan pengalaman lebih dari satu dekade, kami telah melayani puluhan ribu pelanggan dan membangun kepercayaan sebagai partner terbaik untuk kebutuhan transportasi dan logistik di wilayah Kalimantan Timur.
              </p>
              {/* <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-primary-600 mb-2">10,000+</h3>
                  <p className="text-gray-600">Pelanggan Puas</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-primary-600 mb-2">50+</h3>
                  <p className="text-gray-600">Unit Armada</p>
                </div>
              </div> */}
            </div>
            <div className="lg:w-1/2" data-aos="fade-left">
              <img 
                src={Banner}
                alt="PT Novita Travel Office" 
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Visi, Misi & Komitmen Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nilai-nilai yang menjadi pedoman dalam setiap langkah perjalanan kami
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg text-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* History Timeline */}
      {/* <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Sejarah & Milestone
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Perjalanan panjang kami dalam membangun kepercayaan pelanggan
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {history.map((item, index) => (
              <div 
                key={index}
                className="flex flex-col md:flex-row items-center mb-12 last:mb-0"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="md:w-1/4 mb-4 md:mb-0">
                  <div className="bg-primary-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                    <span className="text-lg font-bold">{item.year}</span>
                  </div>
                </div>
                <div className="md:w-3/4 md:pl-8">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Team Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Tim Manajemen Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dipimpin oleh profesional berpengalaman di bidang transportasi dan logistik
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg text-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-semibold mb-3">{member.position}</p>
                <p className="text-gray-600 text-sm">{member.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Certificates Section */}
      {/* <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Sertifikasi & Penghargaan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Komitmen kami terhadap kualitas dibuktikan dengan berbagai sertifikasi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              'Sertifikat ISO 9001:2015',
              'Sertifikat K3 Keselamatan Kerja',
              'SIUP & TDP Terdaftar',
              'Asuransi Kendaraan Menyeluruh'
            ].map((cert, index) => (
              <div 
                key={index}
                className="bg-gray-50 p-6 rounded-lg text-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-800">{cert}</h3>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
}