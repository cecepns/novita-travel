-- Database: novita_travel
-- PT Novita Travel Database Schema

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Create database
CREATE DATABASE IF NOT EXISTS `novita_travel` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `novita_travel`;

-- --------------------------------------------------------

-- Table structure for table `users`
-- Table untuk admin login

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'admin',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user
-- Email: admin@novitatravel.com
-- Password: admin123 (akan di-hash oleh aplikasi)
INSERT INTO `users` (`email`, `password`, `role`) VALUES
('admin@novitatravel.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- --------------------------------------------------------

-- Table structure for table `services`
-- Table untuk layanan travel dan logistik

CREATE TABLE `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` enum('Travel','Logistik','Charter') NOT NULL,
  `route` varchar(255) NOT NULL,
  `price` decimal(12,0) NOT NULL,
  `description` text,
  `image` varchar(500) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample services
INSERT INTO `services` (`name`, `type`, `route`, `price`, `description`, `image`, `isActive`) VALUES
('Travel Samarinda - Balikpapan', 'Travel', 'Samarinda - Balikpapan', 75000, '<p>Layanan travel nyaman dengan AC dan driver berpengalaman untuk rute Samarinda - Balikpapan. Berangkat setiap hari mulai pukul 06:00 WIB.</p><ul><li>AC dan ventilasi baik</li><li>Kursi nyaman</li><li>Driver berpengalaman</li><li>Asuransi perjalanan</li></ul>', NULL, 1),

('Travel Samarinda - Bontang', 'Travel', 'Samarinda - Bontang', 100000, '<p>Layanan travel door to door untuk rute Samarinda - Bontang. Armada terawat dengan fasilitas lengkap.</p><ul><li>Door to door service</li><li>Armada terawat</li><li>Berangkat 4x sehari</li><li>Customer service 24/7</li></ul>', NULL, 1),

('Pengiriman Barang Express', 'Logistik', 'Samarinda - Balikpapan', 25000, '<p>Layanan pengiriman barang cepat dan aman. Barang sampai di hari yang sama untuk pengiriman sebelum jam 12 siang.</p><ul><li>Same day delivery</li><li>Tracking real-time</li><li>Asuransi barang</li><li>Kemasan aman</li></ul>', NULL, 1),

('Charter Bus Wisata', 'Charter', 'Flexible Route', 800000, '<p>Sewa bus untuk keperluan wisata, study tour, atau acara perusahaan. Kapasitas 25-45 penumpang dengan driver berpengalaman.</p><ul><li>Kapasitas besar</li><li>AC dan sound system</li><li>Driver berpengalaman</li><li>Flexible route</li></ul>', NULL, 1),

('Travel Samarinda - Kutai Kartanegara', 'Travel', 'Samarinda - Kutai Kartanegara', 50000, '<p>Layanan travel ekonomis untuk rute Samarinda - Kutai Kartanegara. Berangkat setiap 2 jam sekali.</p><ul><li>Harga ekonomis</li><li>Jadwal reguler</li><li>Aman dan nyaman</li><li>Tepat waktu</li></ul>', NULL, 1),

('Pengiriman Dokumen Same Day', 'Logistik', 'Dalam Kota Samarinda', 15000, '<p>Layanan pengiriman dokumen penting di hari yang sama. Garansi sampai tepat waktu dengan tracking real-time.</p><ul><li>Same day delivery</li><li>Khusus dokumen</li><li>Tracking online</li><li>Garansi tepat waktu</li></ul>', NULL, 1),

('Travel Samarinda - Tenggarong', 'Travel', 'Samarinda - Tenggarong', 35000, '<p>Layanan travel untuk rute Samarinda - Tenggarong dengan armada yang nyaman dan aman.</p><ul><li>Armada nyaman</li><li>Harga terjangkau</li><li>Berangkat setiap jam</li><li>Penjemputan area Samarinda</li></ul>', NULL, 1),

('Logistik Antar Pulau', 'Logistik', 'Kalimantan - Sulawesi', 150000, '<p>Layanan pengiriman barang antar pulau dengan kapal cargo terpercaya. Cocok untuk barang dalam jumlah besar.</p><ul><li>Antar pulau</li><li>Kapal cargo terpercaya</li><li>Asuransi penuh</li><li>Tracking pengiriman</li></ul>', NULL, 1);

-- --------------------------------------------------------

-- Table structure for table `reservations`
-- Table untuk reservasi pelanggan

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serviceId` int(11) NOT NULL,
  `customerName` varchar(255) NOT NULL,
  `customerEmail` varchar(255) NOT NULL,
  `customerPhone` varchar(50) NOT NULL,
  `travelDate` date NOT NULL,
  `passengers` int(11) NOT NULL DEFAULT '1',
  `pickupLocation` text,
  `dropoffLocation` text,
  `notes` text,
  `paymentMethod` varchar(50) NOT NULL,
  `totalPrice` decimal(12,0) NOT NULL,
  `status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `serviceId` (`serviceId`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample reservations
INSERT INTO `reservations` (`serviceId`, `customerName`, `customerEmail`, `customerPhone`, `travelDate`, `passengers`, `pickupLocation`, `dropoffLocation`, `notes`, `paymentMethod`, `totalPrice`, `status`) VALUES
(1, 'Budi Santoso', 'budi@gmail.com', '081234567890', '2024-02-15', 2, 'Jl. Ahmad Yani No. 123', 'Terminal Bontang', 'Tolong jemput tepat waktu', 'bank_transfer', 150000, 'confirmed'),
(2, 'Siti Nurhaliza', 'siti@gmail.com', '085678901234', '2024-02-16', 1, NULL, NULL, NULL, 'cash', 100000, 'pending'),
(3, 'Ahmad Rifai', 'ahmad@gmail.com', '087890123456', '2024-02-14', 1, 'Kantor Pos Samarinda', 'Jl. Mulawarman Balikpapan', 'Dokumen penting, mohon hati-hati', 'bank_transfer', 25000, 'completed'),
(1, 'Maria Dewi', 'maria@gmail.com', '082345678901', '2024-02-17', 3, 'Hotel Mesra Samarinda', 'Bandara Sepinggan', NULL, 'credit_card', 225000, 'pending'),
(4, 'PT Kalimantan Jaya', 'info@kalimantanjaya.com', '081567890123', '2024-02-20', 35, 'Kantor Pusat Samarinda', 'Wisata Danau Jempang', 'Study tour karyawan', 'bank_transfer', 800000, 'confirmed');

-- --------------------------------------------------------

-- Table structure for table `settings`
-- Table untuk pengaturan sistem

CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default settings
INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('companyName', 'PT NOVITA TRAVEL'),
('address', 'Jl. Mugirejo, Mugirejo, Kec. Sungai Pinang, Kota Samarinda, Kalimantan Timur 75119'),
('phone', '+62 123 456 789'),
('email', 'info@novitatravel.com'),
('whatsapp', '+62 812 3456 789'),
('facebook', 'Novita Transpot Samarinda'),
('operatingHours', '{"weekdays":"06:00 - 22:00","weekends":"07:00 - 20:00"}'),
('aboutUs', '<p>PT Novita Travel adalah perusahaan transportasi terpercaya yang telah melayani masyarakat Kalimantan Timur sejak 2010. Kami berkomitmen memberikan layanan transportasi dan logistik yang aman, nyaman, dan terpercaya.</p><p>Dengan armada yang terawat dan driver berpengalaman, kami siap melayani kebutuhan perjalanan Anda dengan standar pelayanan terbaik.</p>'),
('vision', '<p>Menjadi perusahaan transportasi dan logistik terdepan di Kalimantan Timur yang memberikan pelayanan berkualitas tinggi dengan teknologi modern.</p>'),
('mission', '<p>Memberikan layanan transportasi yang aman, nyaman, dan terpercaya untuk mendukung mobilitas masyarakat dan kelancaran distribusi barang di wilayah Kalimantan Timur.</p>'),
('maps', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.678234567890!2d117.1234567!3d-0.5012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMzAnMDQuNCJTIDExN8KwMDcnMjQuNCJF!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid');

-- --------------------------------------------------------

-- AUTO_INCREMENT for dumped tables

ALTER TABLE `users` AUTO_INCREMENT=2;
ALTER TABLE `services` AUTO_INCREMENT=9;
ALTER TABLE `reservations` AUTO_INCREMENT=6;
ALTER TABLE `settings` AUTO_INCREMENT=11;

COMMIT;

-- End of SQL file
-- Database schema for PT Novita Travel application
-- Total tables: 4 (users, services, reservations, settings)
-- Default admin: admin@novitatravel.com / admin123