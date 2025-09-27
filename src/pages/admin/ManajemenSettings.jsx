import { useState, useEffect } from 'react';
import { Save, MapPin, Phone, Mail, Clock, Globe } from 'lucide-react';
import ReactQuill from 'react-quill';
import { settingsAPI } from '../../utils/api';

export default function ManajemenSettings() {
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
    aboutUs: '',
    maps: '',
    vision: '',
    mission: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company');

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  };

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

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsAPI.update(settings);
      alert('Pengaturan berhasil disimpan!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const tabs = [
    { id: 'company', name: 'Informasi Perusahaan', icon: Globe },
    { id: 'contact', name: 'Kontak & Alamat', icon: Phone },
    { id: 'about', name: 'Tentang Kami', icon: MapPin },
    { id: 'hours', name: 'Jam Operasional', icon: Clock }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pengaturan</h1>
          <p className="text-gray-600">Kelola informasi perusahaan dan pengaturan sistem</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Company Info Tab */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Informasi Perusahaan</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Perusahaan
                  </label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Perusahaan
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visi Perusahaan
                </label>
                <ReactQuill
                  theme="snow"
                  value={settings.vision}
                  onChange={(value) => handleInputChange('vision', value)}
                  modules={quillModules}
                  placeholder="Masukkan visi perusahaan..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Misi Perusahaan
                </label>
                <ReactQuill
                  theme="snow"
                  value={settings.mission}
                  onChange={(value) => handleInputChange('mission', value)}
                  modules={quillModules}
                  placeholder="Masukkan misi perusahaan..."
                />
              </div>
            </div>
          )}

          {/* Contact Info Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Kontak & Alamat</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Lengkap
                </label>
                <textarea
                  value={settings.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Masukkan alamat lengkap perusahaan"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. Telepon
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={settings.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook Page
                </label>
                <input
                  type="text"
                  value={settings.facebook}
                  onChange={(e) => handleInputChange('facebook', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Nama halaman Facebook"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Maps Embed URL
                </label>
                <input
                  type="url"
                  value={settings.maps}
                  onChange={(e) => handleInputChange('maps', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Masukkan URL embed Google Maps"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Dapatkan URL embed dari Google Maps untuk menampilkan lokasi kantor
                </p>
              </div>
            </div>
          )}

          {/* About Us Tab */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Tentang Kami</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Perusahaan
                </label>
                <ReactQuill
                  theme="snow"
                  value={settings.aboutUs}
                  onChange={(value) => handleInputChange('aboutUs', value)}
                  modules={quillModules}
                  placeholder="Masukkan deskripsi lengkap tentang perusahaan, sejarah, layanan, dan nilai-nilai..."
                  style={{ height: '300px', marginBottom: '50px' }}
                />
              </div>
            </div>
          )}

          {/* Operating Hours Tab */}
          {activeTab === 'hours' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Jam Operasional</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senin - Sabtu
                  </label>
                  <input
                    type="text"
                    value={settings.operatingHours.weekdays}
                    onChange={(e) => handleInputChange('operatingHours.weekdays', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Contoh: 06:00 - 22:00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minggu
                  </label>
                  <input
                    type="text"
                    value={settings.operatingHours.weekends}
                    onChange={(e) => handleInputChange('operatingHours.weekends', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Contoh: 07:00 - 20:00"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3">Preview Jam Operasional</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Senin - Sabtu:</span>
                    <span className="font-medium">{settings.operatingHours.weekdays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minggu:</span>
                    <span className="font-medium">{settings.operatingHours.weekends}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}