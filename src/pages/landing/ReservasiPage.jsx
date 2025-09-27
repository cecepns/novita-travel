import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, Users, MapPin, Phone, Mail, CreditCard } from 'lucide-react';
import { servicesAPI, reservationsAPI } from '../../utils/api';

export default function ReservasiPage() {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('service');

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    serviceId: serviceId || '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    travelDate: '',
    passengers: 1,
    pickupLocation: '',
    dropoffLocation: '',
    notes: '',
    paymentMethod: 'bank_transfer'
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (serviceId && services.length > 0) {
      const service = services.find(s => s.id === parseInt(serviceId));
      if (service) {
        setSelectedService(service);
        setFormData(prev => ({
          ...prev,
          serviceId: serviceId
        }));
      }
    }
  }, [serviceId, services]);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll(1, 100);
      setServices(response.data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'serviceId') {
      const service = services.find(s => s.id === parseInt(value));
      setSelectedService(service);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await reservationsAPI.create(formData);
      alert('Reservasi berhasil dibuat! Kami akan menghubungi Anda untuk konfirmasi.');
      
      // Reset form
      setFormData({
        serviceId: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        travelDate: '',
        passengers: 1,
        pickupLocation: '',
        dropoffLocation: '',
        notes: '',
        paymentMethod: 'bank_transfer'
      });
      setSelectedService(null);
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Terjadi kesalahan saat membuat reservasi. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedService) return 0;
    return selectedService.price * formData.passengers;
  };

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Transfer Bank' },
    { value: 'cash', label: 'Bayar di Tempat' },
    { value: 'credit_card', label: 'Kartu Kredit' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
            Reservasi Perjalanan
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Isi form di bawah ini untuk membuat reservasi perjalanan Anda bersama PT Novita Travel
          </p>
        </div>
      </section>

      {/* Reservation Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Form Header */}
              <div className="bg-primary-600 text-white px-8 py-6">
                <h2 className="text-2xl font-bold">Form Reservasi</h2>
                <p>Lengkapi informasi di bawah ini untuk membuat reservasi</p>
              </div>

              <div className="p-8 space-y-8">
                {/* Service Selection */}
                <div data-aos="fade-up">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <MapPin className="w-6 h-6 mr-2 text-primary-600" />
                    Pilih Layanan
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-2">
                        Layanan *
                      </label>
                      <select
                        id="serviceId"
                        name="serviceId"
                        value={formData.serviceId}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Pilih layanan</option>
                        {services.map(service => (
                          <option key={service.id} value={service.id}>
                            {service.name} - Rp {parseInt(service.price || 0).toLocaleString('id-ID')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="travelDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Perjalanan *
                      </label>
                      <input
                        type="date"
                        id="travelDate"
                        name="travelDate"
                        value={formData.travelDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  {selectedService && (
                    <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-gray-800">{selectedService.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{selectedService.route}</p>
                      <p className="text-lg font-bold text-primary-600 mt-2">
                        Rp {parseInt(selectedService.price || 0).toLocaleString('id-ID')} / orang
                      </p>
                    </div>
                  )}
                </div>

                {/* Customer Information */}
                <div data-aos="fade-up" data-aos-delay="100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Users className="w-6 h-6 mr-2 text-primary-600" />
                    Informasi Pemesan
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="customerEmail"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Masukkan email"
                      />
                    </div>
                    <div>
                      <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                        No. Telepon *
                      </label>
                      <input
                        type="tel"
                        id="customerPhone"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Masukkan no. telepon"
                      />
                    </div>
                    <div>
                      <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-2">
                        Jumlah Penumpang *
                      </label>
                      <select
                        id="passengers"
                        name="passengers"
                        value={formData.passengers}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1} orang</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div data-aos="fade-up" data-aos-delay="200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <MapPin className="w-6 h-6 mr-2 text-primary-600" />
                    Detail Lokasi
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-2">
                        Lokasi Penjemputan
                      </label>
                      <input
                        type="text"
                        id="pickupLocation"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Alamat penjemputan (opsional)"
                      />
                    </div>
                    <div>
                      <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700 mb-2">
                        Lokasi Tujuan
                      </label>
                      <input
                        type="text"
                        id="dropoffLocation"
                        name="dropoffLocation"
                        value={formData.dropoffLocation}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Alamat tujuan (opsional)"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                      Catatan Tambahan
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Catatan khusus untuk perjalanan (opsional)"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div data-aos="fade-up" data-aos-delay="300">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <CreditCard className="w-6 h-6 mr-2 text-primary-600" />
                    Metode Pembayaran
                  </h3>
                  <div className="space-y-3">
                    {paymentMethods.map(method => (
                      <label key={method.value} className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={formData.paymentMethod === method.value}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <span className="ml-3 text-gray-700">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                {selectedService && (
                  <div className="bg-gray-50 p-6 rounded-lg" data-aos="fade-up" data-aos-delay="400">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Ringkasan Pesanan</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Layanan:</span>
                        <span className="font-medium">{selectedService.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Harga per orang:</span>
                        <span>Rp {parseInt(selectedService.price || 0).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jumlah penumpang:</span>
                        <span>{formData.passengers} orang</span>
                      </div>
                      <hr />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-primary-600">
                          Rp {calculateTotal().toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="text-center" data-aos="fade-up" data-aos-delay="500">
                  <button
                    type="submit"
                    disabled={submitting || !selectedService}
                    className="bg-primary-600 text-white px-12 py-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block" />
                        Memproses Reservasi...
                      </>
                    ) : (
                      'Buat Reservasi'
                    )}
                  </button>
                  <p className="mt-4 text-sm text-gray-600">
                    Dengan melakukan reservasi, Anda menyetujui syarat dan ketentuan yang berlaku
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Informasi Penting
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-3">Syarat & Ketentuan</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Reservasi harus dilakukan minimal 2 jam sebelum keberangkatan</li>
                  <li>• Pembatalan gratis hingga 4 jam sebelum keberangkatan</li>
                  <li>• Harap datang 15 menit sebelum waktu keberangkatan</li>
                  <li>• Bawa identitas diri yang masih berlaku</li>
                </ul>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-3">Metode Pembayaran</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Transfer Bank: BCA, Mandiri, BRI, BNI</li>
                  <li>• Bayar di Tempat: Cash saat keberangkatan</li>
                  <li>• Kartu Kredit: Visa, Mastercard</li>
                  <li>• Konfirmasi pembayaran melalui WhatsApp</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}