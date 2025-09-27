import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Calendar, User, Phone } from 'lucide-react';
import { reservationsAPI } from '../../utils/api';

export default function ManajemenReservasi() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    fetchReservations();
  }, [currentPage, searchTerm, filterStatus]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await reservationsAPI.getAll(currentPage, 10);
      setReservations(response.data.reservations || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await reservationsAPI.update(id, { status: newStatus });
      fetchReservations();
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Gagal mengubah status reservasi');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus reservasi ini?')) return;

    try {
      await reservationsAPI.delete(id);
      fetchReservations();
    } catch (error) {
      console.error('Error deleting reservation:', error);
      alert('Gagal menghapus reservasi');
    }
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
      <div className="flex justify-center items-center mt-6">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 rounded bg-white text-primary-600 hover:bg-primary-50 border border-primary-600 disabled:opacity-50"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 rounded bg-white text-primary-600 hover:bg-primary-50 border border-primary-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Reservasi</h1>
          <p className="text-gray-600">Kelola reservasi pelanggan</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Reservasi</p>
          <p className="text-2xl font-bold text-primary-600">{reservations.length}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari reservasi..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Filter className="w-5 h-5 text-gray-600 mr-2" />
              <select
                value={filterStatus}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">Tidak ada reservasi yang ditemukan</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Pelanggan</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Layanan</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Tanggal Travel</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Penumpang</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm">#RES-{reservation.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center mb-1">
                            <User className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="font-medium text-gray-800">{reservation.customerName}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400 mr-2" />
                            <span>{reservation.customerPhone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <h3 className="font-medium text-gray-800">{reservation.serviceName}</h3>
                          <p className="text-sm text-gray-600">{reservation.serviceRoute}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm">
                            {new Date(reservation.travelDate).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                          {reservation.passengers} orang
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-800">
                          Rp {(reservation.totalPrice || 0).toLocaleString('id-ID')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={reservation.status || 'pending'}
                          onChange={(e) => handleStatusUpdate(reservation.id, e.target.value)}
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium border-none ${
                            statusColors[reservation.status || 'pending']
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => alert('Detail reservasi akan ditampilkan')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(reservation.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPagination()}
          </>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {statusOptions.slice(1).map((status) => {
          const count = reservations.filter(r => r.status === status.value).length;
          const total = reservations
            .filter(r => r.status === status.value)
            .reduce((sum, r) => sum + (r.totalPrice || 0), 0);
          
          return (
            <div key={status.value} className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{status.label}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status.value]}`}>
                  {count}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                Rp {total.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Total revenue dari {count} reservasi
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}