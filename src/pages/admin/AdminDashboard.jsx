import { useState, useEffect } from 'react';
import { Users, Car, Calendar, DollarSign, TrendingUp, Package } from 'lucide-react';
import { servicesAPI, reservationsAPI } from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalServices: 0,
    totalReservations: 0,
    totalRevenue: 0,
    activeServices: 0
  });
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [servicesResponse, reservationsResponse] = await Promise.all([
        servicesAPI.getAll(1, 100),
        reservationsAPI.getAll(1, 10)
      ]);

      const services = servicesResponse.data.services || [];
      const reservations = reservationsResponse.data.reservations || [];

      setStats({
        totalServices: services.length,
        totalReservations: reservations.length,
        totalRevenue: reservations.reduce((sum, res) => sum + (res.totalPrice || 0), 0),
        activeServices: services.filter(s => s.isActive).length
      });

      setRecentReservations(reservations.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Layanan',
      value: stats.totalServices,
      icon: Car,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Reservasi',
      value: stats.totalReservations,
      icon: Calendar,
      color: 'bg-green-500',
      change: '+23%'
    },
    // {
    //   title: 'Revenue Bulan Ini',
    //   value: `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`,
    //   icon: DollarSign,
    //   color: 'bg-yellow-500',
    //   change: '+18%'
    // },
    // {
    //   title: 'Layanan Aktif',
    //   value: stats.activeServices,
    //   icon: Package,
    //   color: 'bg-purple-500',
    //   change: '+5%'
    // }
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
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Overview of PT Novita Travel operations</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Last updated</p>
          <p className="text-sm font-medium text-gray-800">
            {new Date().toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">{card.change}</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`${card.color} p-3 rounded-full`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Reservasi Terbaru</h2>
            <a href="/admin/reservasi" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              Lihat Semua
            </a>
          </div>
          <div className="space-y-4">
            {recentReservations.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Belum ada reservasi</p>
            ) : (
              recentReservations.map((reservation, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">{reservation.customerName}</h3>
                    <p className="text-sm text-gray-600">{reservation.serviceName}</p>
                    <p className="text-xs text-gray-500">{reservation.travelDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">
                      Rp {(reservation.totalPrice || 0).toLocaleString('id-ID')}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      reservation.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : reservation.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {reservation.status || 'pending'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <a 
              href="/admin/layanan"
              className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <Car className="w-8 h-8 text-primary-600 mr-4" />
              <div>
                <h3 className="font-medium text-gray-800">Kelola Layanan</h3>
                <p className="text-sm text-gray-600">Tambah atau edit layanan travel</p>
              </div>
            </a>
            <a 
              href="/admin/reservasi"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Calendar className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <h3 className="font-medium text-gray-800">Lihat Reservasi</h3>
                <p className="text-sm text-gray-600">Monitor reservasi pelanggan</p>
              </div>
            </a>
            <a 
              href="/admin/settings"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Users className="w-8 h-8 text-gray-600 mr-4" />
              <div>
                <h3 className="font-medium text-gray-800">Pengaturan</h3>
                <p className="text-sm text-gray-600">Kelola informasi perusahaan</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Charts/Analytics Placeholder */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Analytics Overview</h2>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Chart analytics akan ditampilkan di sini</p>
        </div>
      </div>
    </div>
  );
}