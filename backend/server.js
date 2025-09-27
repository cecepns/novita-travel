const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'novita-travel-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads-apotik-ghanim')));

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'novita_travel',
  port: process.env.DB_PORT || 3306
};

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads-apotik-ghanim'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'img-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Database connection helper
async function getDbConnection() {
  return await mysql.createConnection(dbConfig);
}

// Helper function to delete image file
function deleteImageFile(imageUrl) {
  if (!imageUrl) return;
  
  try {
    // Extract filename from URL
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, 'uploads-apotik-ghanim', filename);
    
    // Check if file exists and delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted image file: ${filename}`);
    }
  } catch (error) {
    console.error('Error deleting image file:', error);
  }
}

// Initialize database tables
async function initDatabase() {
  const connection = await getDbConnection();
  
  try {
    // Create users table (for admin)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create services table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type ENUM('Travel', 'Logistik', 'Charter') NOT NULL,
        route VARCHAR(255) NOT NULL,
        price DECIMAL(12,0) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        isActive BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create reservations table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        serviceId INT NOT NULL,
        customerName VARCHAR(255) NOT NULL,
        customerEmail VARCHAR(255) NOT NULL,
        customerPhone VARCHAR(50) NOT NULL,
        travelDate DATE NOT NULL,
        passengers INT NOT NULL DEFAULT 1,
        pickupLocation TEXT,
        dropoffLocation TEXT,
        notes TEXT,
        paymentMethod VARCHAR(50) NOT NULL,
        totalPrice DECIMAL(12,0) NOT NULL,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (serviceId) REFERENCES services(id)
      )
    `);

    // Create settings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Insert default admin user if not exists
    const [adminUsers] = await connection.execute(
      'SELECT COUNT(*) as count FROM users WHERE role = "admin"'
    );

    if (adminUsers[0].count === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.execute(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        ['admin@novitatravel.com', hashedPassword, 'admin']
      );
      console.log('Default admin user created: admin@novitatravel.com / admin123');
    }

    // Insert default settings if not exists
    const defaultSettings = [
      ['companyName', 'PT NOVITA TRAVEL'],
      ['address', 'Jl. Mugirejo, Mugirejo, Kec. Sungai Pinang, Kota Samarinda, Kalimantan Timur 75119'],
      ['phone', '+62 123 456 789'],
      ['email', 'info@novitatravel.com'],
      ['whatsapp', '+62 812 3456 789'],
      ['facebook', 'Novita Transpot Samarinda'],
      ['operatingHours', JSON.stringify({ weekdays: '06:00 - 22:00', weekends: '07:00 - 20:00' })],
      ['aboutUs', 'PT Novita Travel adalah perusahaan transportasi terpercaya yang telah melayani masyarakat Kalimantan Timur sejak 2010.'],
      ['vision', 'Menjadi perusahaan transportasi dan logistik terdepan di Kalimantan Timur.'],
      ['mission', 'Memberikan layanan transportasi yang aman, nyaman, dan terpercaya.']
    ];

    for (const [key, value] of defaultSettings) {
      await connection.execute(
        'INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)',
        [key, value]
      );
    }

    // Insert sample services if table is empty
    const [services] = await connection.execute('SELECT COUNT(*) as count FROM services');
    if (services[0].count === 0) {
      const sampleServices = [
        ['Travel Samarinda - Balikpapan', 'Travel', 'Samarinda - Balikpapan', 75000, 'Layanan travel nyaman dengan AC dan driver berpengalaman untuk rute Samarinda - Balikpapan. Berangkat setiap hari mulai pukul 06:00 WIB.', null, true],
        ['Travel Samarinda - Bontang', 'Travel', 'Samarinda - Bontang', 100000, 'Layanan travel door to door untuk rute Samarinda - Bontang. Armada terawat dengan fasilitas lengkap.', null, true],
        ['Pengiriman Barang Express', 'Logistik', 'Samarinda - Balikpapan', 25000, 'Layanan pengiriman barang cepat dan aman. Barang sampai di hari yang sama untuk pengiriman sebelum jam 12 siang.', null, true],
        ['Charter Bus Wisata', 'Charter', 'Flexible Route', 800000, 'Sewa bus untuk keperluan wisata, study tour, atau acara perusahaan. Kapasitas 25-45 penumpang dengan driver berpengalaman.', null, true],
        ['Travel Samarinda - Kutai Kartanegara', 'Travel', 'Samarinda - Kutai Kartanegara', 50000, 'Layanan travel ekonomis untuk rute Samarinda - Kutai Kartanegara. Berangkat setiap 2 jam sekali.', null, true],
        ['Pengiriman Dokumen Same Day', 'Logistik', 'Dalam Kota Samarinda', 15000, 'Layanan pengiriman dokumen penting di hari yang sama. Garansi sampai tepat waktu dengan tracking real-time.', null, true]
      ];

      for (const service of sampleServices) {
        await connection.execute(
          'INSERT INTO services (name, type, route, price, description, image, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)',
          service
        );
      }
      console.log('Sample services inserted');
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    await connection.end();
  }
}

// Initialize database on startup
initDatabase();

// ===================
// AUTH ROUTES
// ===================

// Admin login
app.post('/api/auth/login', async (req, res) => {
  const connection = await getDbConnection();
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await connection.end();
  }
});

// Verify token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// ===================
// SERVICES ROUTES
// ===================

// Get all services with pagination
app.get('/api/services', async (req, res) => {
  const connection = await getDbConnection();
  
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const type = req.query.type || '';

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (search) {
      whereClause += ' AND (name LIKE ? OR route LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (type) {
      whereClause += ' AND type = ?';
      params.push(type);
    }

    // Get total count
    const [totalResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM services ${whereClause}`,
      params
    );
    const total = totalResult[0].total;

    // Get services with pagination
    const [services] = await connection.execute(
      `SELECT * FROM services ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      services,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await connection.end();
  }
});

// Get service by ID
app.get('/api/services/:id', async (req, res) => {
  const connection = await getDbConnection();
  
  try {
    const { id } = req.params;
    const [services] = await connection.execute(
      'SELECT * FROM services WHERE id = ?',
      [id]
    );

    if (services.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(services[0]);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await connection.end();
  }
});

// Create new service
app.post('/api/services', authenticateToken, async (req, res) => {
  const connection = await getDbConnection();
  
  try {
    const { name, type, route, price, description, image, isActive } = req.body;

    if (!name || !type || !route || !price) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const [result] = await connection.execute(
      'INSERT INTO services (name, type, route, price, description, image, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, type, route, price, description || '', image || null, isActive !== false]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Service created successfully'
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await connection.end();
  }
});

// Update service
app.put('/api/services/:id', authenticateToken, async (req, res) => {
  const connection = await getDbConnection();
  
  try {
    const { id } = req.params;
    const { name, type, route, price, description, image, isActive } = req.body;

    // Get current service data to check for old image
    const [currentServices] = await connection.execute(
      'SELECT image FROM services WHERE id = ?',
      [id]
    );

    if (currentServices.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const currentService = currentServices[0];
    const oldImageUrl = currentService.image;

    const [result] = await connection.execute(
      'UPDATE services SET name = ?, type = ?, route = ?, price = ?, description = ?, image = ?, isActive = ? WHERE id = ?',
      [name, type, route, price, description || '', image || null, isActive !== false, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Delete old image file if it exists and is different from new image
    if (oldImageUrl && oldImageUrl !== image) {
      deleteImageFile(oldImageUrl);
    }

    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await connection.end();
  }
});

// Delete service
app.delete('/api/services/:id', authenticateToken, async (req, res) => {
  const connection = await getDbConnection();
  
  try {
    const { id } = req.params;

    // Get service data to check for image before deletion
    const [services] = await connection.execute(
      'SELECT image FROM services WHERE id = ?',
      [id]
    );

    if (services.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const service = services[0];
    const imageUrl = service.image;

    // Check if service has reservations
    const [reservations] = await connection.execute(
      'SELECT COUNT(*) as count FROM reservations WHERE serviceId = ?',
      [id]
    );

    if (reservations[0].count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete service with existing reservations' 
      });
    }

    const [result] = await connection.execute(
      'DELETE FROM services WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Delete associated image file if it exists
    if (imageUrl) {
      deleteImageFile(imageUrl);
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await connection.end();
  }
});

// ===================
// RESERVATIONS ROUTES
// ===================

// Get all reservations with pagination
app.get('/api/reservations', authenticateToken, async (req, res) => {
  const connection = await getDbConnection();
  
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || '';

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (search) {
      whereClause += ' AND (r.customerName LIKE ? OR r.customerEmail LIKE ? OR r.customerPhone LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (status) {
      whereClause += ' AND r.status = ?';
      params.push(status);
    }

    // Get total count
    const [totalResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM reservations r ${whereClause}`,
      params
    );
    const total = totalResult[0].total;

    // Get reservations with service details
    const [reservations] = await connection.execute(
      `SELECT 
        r.*,
        s.name as serviceName,
        s.route as serviceRoute
      FROM reservations r
      LEFT JOIN services s ON r.serviceId = s.id
      ${whereClause}
      ORDER BY r.created_at DESC 
      LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      reservations,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await connection.end();
  }
});

// Create new reservation
app.post('/api/reservations', async (req, res) => {
  const connection = await getDbConnection();
  
  try {
    const {
      serviceId,
      customerName,
      customerEmail,
      customerPhone,
      travelDate,
      passengers,
      pickupLocation,
      dropoffLocation,
      notes,
      paymentMethod
    } = req.body;

    if (!serviceId || !customerName || !customerEmail || !customerPhone || !travelDate || !passengers || !paymentMethod) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Get service price
    const [services] = await connection.execute(
      'SELECT price FROM services WHERE id = ?',
      [serviceId]
    );

    if (services.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const totalPrice = services[0].price * passengers;

    const [result] = await connection.execute(
      `INSERT INTO reservations 
      (serviceId, customerName, customerEmail, customerPhone, travelDate, passengers, 
       pickupLocation, dropoffLocation, notes, paymentMethod, totalPrice) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        serviceId, customerName, customerEmail, customerPhone, travelDate, passengers,
        pickupLocation || null, dropoffLocation || null, notes || null, paymentMethod, totalPrice
      ]
    );

    res.status(201).json({
      id: result.insertId,
      totalPrice,
      message: 'Reservation created successfully'
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await connection.end();
  }
});

// Update reservation
app.put('/api/reservations/:id', authenticateToken, async (req, res) => {
  const connection = await getDbConnection();
  
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const [result] = await connection.execute(
      'UPDATE reservations SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.json({ message: 'Reservation updated successfully' });
  } catch (error) {
    console.error('Update reservation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await connection.end();
  }
});

// Delete reservation
app.delete('/api/reservations/:id', authenticateToken, async (req, res) => {
  const connection = await getDbConnection();
  
  try {
    const { id } = req.params;

    const [result] = await connection.execute(
      'DELETE FROM reservations WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error('Delete reservation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await connection.end();
  }
});

// ===================
// SETTINGS ROUTES
// ===================

// Get all settings
app.get('/api/settings', async (req, res) => {
  const connection = await getDbConnection();
  
  try {
    const [settings] = await connection.execute(
      'SELECT setting_key, setting_value FROM settings'
    );

    const result = {};
    settings.forEach(setting => {
      try {
        // Try to parse JSON values
        result[setting.setting_key] = JSON.parse(setting.setting_value);
      } catch {
        // If not JSON, use as string
        result[setting.setting_key] = setting.setting_value;
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await connection.end();
  }
});

// Update settings
app.put('/api/settings', authenticateToken, async (req, res) => {
  const connection = await getDbConnection();
  
  try {
    const settings = req.body;

    for (const [key, value] of Object.entries(settings)) {
      const settingValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      
      await connection.execute(
        'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, settingValue, settingValue]
      );
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await connection.end();
  }
});

// ===================
// FILE UPLOAD ROUTE
// ===================

// Upload image
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      imageUrl: `http://localhost:${PORT}${imageUrl}`,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// ===================
// ERROR HANDLING
// ===================

// Handle multer errors
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum 5MB allowed.' });
    }
  }
  
  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({ error: error.message });
  }

  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}/api`);
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
});