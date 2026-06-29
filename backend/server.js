const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, '..')));


// Create/connect to database file
const db = new Database('bookstore.db');
console.log('Connected to SQLite database: bookstore.db');

// Read and execute your database.sql file
const sqlFilePath = path.join(__dirname, '..', 'database.sql');
const sqlFile = fs.readFileSync(sqlFilePath, 'utf8');

// Split SQL statements and execute them
const statements = sqlFile
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

// Execute schema and data insertion
statements.forEach(stmt => {
  const cleanStmt = stmt
    .replace(/CREATE DATABASE.*?;/gi, '')
    .replace(/USE\s+\w+\s*;?/gi, '')
    .replace(/SHOW\s+TABLES\s*;?/gi, '')
    .replace(/SELECT\s+'Categories'.*?;/gi, '')
    .replace(/UNION\s+ALL.*?;/gi, '')
    .trim();
  
  if (!cleanStmt) return;
  
  try {
    db.exec(cleanStmt + ';');
  } catch (err) {
    if (!err.message.includes('already exists')) {
      console.log('Note:', err.message);
    }
  }
});

// Create contact_messages table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Unread',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('Database schema loaded from database.sql');

// API ROUTES

// GET all books
app.get('/api/books', (req, res) => {
  const books = db.prepare(`
    SELECT b.*, c.name as category_name 
    FROM books b 
    LEFT JOIN categories c ON b.category_id = c.category_id
    WHERE b.is_active = 1
  `).all();
  
  console.log('[' + new Date().toLocaleTimeString() + '] GET /api/books - ' + books.length + ' books returned');
  res.json(books);
});

// GET single book
app.get('/api/books/:id', (req, res) => {
  const book = db.prepare('SELECT * FROM books WHERE book_id = ?').get(req.params.id);
  if (book) {
    console.log('[' + new Date().toLocaleTimeString() + '] GET /api/books/' + req.params.id + ' - "' + book.title + '"');
    res.json(book);
  } else {
    console.log('[' + new Date().toLocaleTimeString() + '] Book #' + req.params.id + ' not found');
    res.status(404).json({ error: 'Book not found' });
  }
});

// ADD book - FULL DATA
app.post('/api/books', (req, res) => {
  const { 
    title, 
    author, 
    isbn, 
    price, 
    stock_quantity, 
    description, 
    publisher, 
    publication_year, 
    page_count, 
    format, 
    category_id,
    cover_image,
    is_bestseller,
    is_new_arrival
  } = req.body;
  
  const result = db.prepare(`
    INSERT INTO books (
      title, author, isbn, price, stock_quantity, description, 
      publisher, publication_year, page_count, format, category_id, 
      cover_image, rating_average, rating_count, 
      is_bestseller, is_new_arrival, is_active
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, 1)
  `).run(
    title, 
    author, 
    isbn || '', 
    price, 
    stock_quantity || 0, 
    description || '', 
    publisher || '', 
    publication_year || 2026, 
    page_count || 0, 
    format || 'Paperback', 
    category_id,
    cover_image || 'images/ThreeSummers.jpg',
    is_bestseller ? 1 : 0,
    is_new_arrival ? 1 : 0
  );
  
  console.log('[' + new Date().toLocaleTimeString() + '] POST /api/books - New book "' + title + '" added (ID: ' + result.lastInsertRowid + ')');
  console.log('    ISBN: ' + (isbn || 'N/A'));
  console.log('    Price: R' + price);
  console.log('    Stock: ' + (stock_quantity || 0));
  console.log('    Category: ' + category_id);
  console.log('    Bestseller: ' + (is_bestseller ? 'Yes' : 'No'));
  console.log('    New Arrival: ' + (is_new_arrival ? 'Yes' : 'No'));
  res.json({ id: result.lastInsertRowid, message: 'Book added successfully' });
});

// UPDATE book - FULL DATA
app.put('/api/books/:id', (req, res) => {
  const { 
    title, 
    author, 
    isbn,
    price, 
    stock_quantity, 
    description, 
    publisher,
    publication_year,
    page_count,
    format, 
    category_id,
    is_bestseller,
    is_new_arrival
  } = req.body;
  
  db.prepare(`
    UPDATE books 
    SET title = ?, author = ?, isbn = ?, price = ?, stock_quantity = ?, 
        description = ?, publisher = ?, publication_year = ?, page_count = ?,
        format = ?, category_id = ?, is_bestseller = ?, is_new_arrival = ?
    WHERE book_id = ?
  `).run(
    title, 
    author, 
    isbn || '',
    price, 
    stock_quantity, 
    description || '', 
    publisher || '',
    publication_year || 2026,
    page_count || 0,
    format, 
    category_id,
    is_bestseller ? 1 : 0,
    is_new_arrival ? 1 : 0,
    req.params.id
  );
  
  console.log('[' + new Date().toLocaleTimeString() + '] PUT /api/books/' + req.params.id + ' - Book updated');
  res.json({ message: 'Book updated successfully' });
});

// DELETE book (soft delete - set inactive)
app.delete('/api/books/:id', (req, res) => {
  db.prepare('UPDATE books SET is_active = 0 WHERE book_id = ?').run(req.params.id);
  console.log('[' + new Date().toLocaleTimeString() + '] DELETE /api/books/' + req.params.id + ' - Book marked as inactive');
  res.json({ message: 'Book deleted successfully' });
});

// HARD DELETE book (admin only)
app.delete('/api/admin/books/:id', (req, res) => {
  db.prepare('DELETE FROM books WHERE book_id = ?').run(req.params.id);
  console.log('[' + new Date().toLocaleTimeString() + '] ADMIN DELETE /api/admin/books/' + req.params.id + ' - Book permanently deleted');
  res.json({ message: 'Book permanently deleted' });
});

// GET all categories
app.get('/api/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories WHERE is_active = 1').all();
  console.log('[' + new Date().toLocaleTimeString() + '] GET /api/categories - ' + categories.length + ' categories returned');
  res.json(categories);
});

// GET all orders
app.get('/api/orders', (req, res) => {
  const orders = db.prepare(`
    SELECT o.*, u.first_name, u.last_name, u.email 
    FROM orders o 
    JOIN users u ON o.user_id = u.user_id
    ORDER BY o.created_at DESC
  `).all();
  
  console.log('[' + new Date().toLocaleTimeString() + '] GET /api/orders - ' + orders.length + ' orders returned');
  orders.forEach(o => {
    console.log('    Order #' + o.order_number + ' | ' + o.first_name + ' ' + o.last_name + ' | R' + o.total_amount + ' | ' + o.status);
  });
  res.json(orders);
});

// PLACE ORDER
app.post('/api/orders', (req, res) => {
  const { user_id, total_amount, shipping_amount, payment_method, shipping_address } = req.body;
  const orderNum = 'ORD-' + (1000 + Math.floor(Math.random() * 9000));
  
  const result = db.prepare(`
    INSERT INTO orders (user_id, order_number, total_amount, shipping_amount, payment_method, shipping_address, status, final_amount) 
    VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?)
  `).run(user_id || 1, orderNum, total_amount, shipping_amount || 0, payment_method, shipping_address, total_amount + (shipping_amount || 0));
  
  console.log('[' + new Date().toLocaleTimeString() + '] NEW ORDER PLACED:');
  console.log('    Order #: ' + orderNum);
  console.log('    Total: R' + total_amount);
  console.log('    Shipping: R' + (shipping_amount || 0));
  console.log('    Final: R' + (total_amount + (shipping_amount || 0)));
  console.log('    Status: Pending');
  console.log('    Time: ' + new Date().toLocaleString());
  
  res.json({ order_id: result.lastInsertRowid, order_number: orderNum });
});

// GET dashboard stats
app.get('/api/stats', (req, res) => {
  const books = db.prepare('SELECT COUNT(*) as count FROM books WHERE is_active = 1').get();
  const orders = db.prepare('SELECT COUNT(*) as count FROM orders').get();
  const users = db.prepare('SELECT COUNT(*) as count FROM users').get();
  const categories = db.prepare('SELECT COUNT(*) as count FROM categories WHERE is_active = 1').get();
  const reviews = db.prepare('SELECT COUNT(*) as count FROM reviews').get();
  const contacts = db.prepare('SELECT COUNT(*) as count FROM contact_messages').get();
  
  console.log('[' + new Date().toLocaleTimeString() + '] GET /api/stats requested');
  res.json({
    totalBooks: books.count,
    totalOrders: orders.count,
    totalUsers: users.count,
    totalCategories: categories.count,
    totalReviews: reviews.count,
    totalContacts: contacts.count
  });
});

// GET all users
app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT user_id, email, first_name, last_name, phone, is_admin, loyalty_points, created_at FROM users ORDER BY created_at DESC').all();
  console.log('[' + new Date().toLocaleTimeString() + '] GET /api/users - ' + users.length + ' users returned');
  res.json(users);
});

// REGISTER USER - STORES IN DATABASE
app.post('/api/users/register', (req, res) => {
  const { first_name, last_name, email, password, phone } = req.body;
  
  try {
    const result = db.prepare(`
      INSERT INTO users (email, password, first_name, last_name, phone, is_admin, loyalty_points) 
      VALUES (?, ?, ?, ?, ?, 0, 0)
    `).run(email, password, first_name, last_name, phone || '');
    
    console.log('');
    console.log('========================================');
    console.log('  NEW USER REGISTERED IN DATABASE');
    console.log('========================================');
    console.log('  Name: ' + first_name + ' ' + last_name);
    console.log('  Email: ' + email);
    console.log('  Phone: ' + (phone || 'N/A'));
    console.log('  User ID: ' + result.lastInsertRowid);
    console.log('  Time: ' + new Date().toLocaleString());
    console.log('========================================');
    console.log('');
    
    res.json({ user_id: result.lastInsertRowid, message: 'User registered successfully' });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      console.log('[' + new Date().toLocaleTimeString() + '] REGISTRATION FAILED: Email ' + email + ' already exists');
      res.status(400).json({ error: 'Email already exists' });
    } else {
      console.log('[' + new Date().toLocaleTimeString() + '] REGISTRATION ERROR: ' + err.message);
      res.status(500).json({ error: err.message });
    }
  }
});

// GET reviews for a book
app.get('/api/reviews/:bookId', (req, res) => {
  const reviews = db.prepare(`
    SELECT r.*, u.first_name, u.last_name 
    FROM reviews r 
    JOIN users u ON r.user_id = u.user_id 
    WHERE r.book_id = ?
    ORDER BY r.created_at DESC
  `).all(req.params.bookId);
  
  console.log('[' + new Date().toLocaleTimeString() + '] GET /api/reviews/' + req.params.bookId + ' - ' + reviews.length + ' reviews');
  res.json(reviews);
});

// POST a review
app.post('/api/reviews', (req, res) => {
  const { book_id, user_id, rating, comment } = req.body;
  
  const result = db.prepare(`
    INSERT INTO reviews (book_id, user_id, rating, comment) 
    VALUES (?, ?, ?, ?)
  `).run(book_id, user_id || 1, rating, comment);
  
  // Update book rating average
  const bookReviews = db.prepare('SELECT rating FROM reviews WHERE book_id = ?').all(book_id);
  const avgRating = bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length;
  
  db.prepare('UPDATE books SET rating_average = ?, rating_count = ? WHERE book_id = ?')
    .run(avgRating.toFixed(1), bookReviews.length, book_id);
  
  console.log('[' + new Date().toLocaleTimeString() + '] NEW REVIEW POSTED:');
  console.log('    Book ID: ' + book_id);
  console.log('    User ID: ' + (user_id || 1));
  console.log('    Rating: ' + rating + '/5');
  console.log('    Comment: ' + comment.substring(0, 50) + (comment.length > 50 ? '...' : ''));
  console.log('    Time: ' + new Date().toLocaleString());
  
  res.json({ review_id: result.lastInsertRowid, message: 'Review posted successfully' });
});

// GET all reviews (admin)
app.get('/api/admin/reviews', (req, res) => {
  const reviews = db.prepare(`
    SELECT r.*, b.title as book_title, u.first_name, u.last_name 
    FROM reviews r 
    JOIN books b ON r.book_id = b.book_id 
    JOIN users u ON r.user_id = u.user_id
    ORDER BY r.created_at DESC
  `).all();
  
  console.log('[' + new Date().toLocaleTimeString() + '] GET /api/admin/reviews - ' + reviews.length + ' reviews returned');
  res.json(reviews);
});

// POST contact message
app.post('/api/contact', (req, res) => {
  const { first_name, last_name, email, phone, subject, message } = req.body;
  
  const result = db.prepare(`
    INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message) 
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(first_name, last_name || '', email, phone || '', subject || '', message);
  
  console.log('[' + new Date().toLocaleTimeString() + '] NEW CONTACT MESSAGE:');
  console.log('    From: ' + first_name + ' ' + (last_name || ''));
  console.log('    Email: ' + email);
  console.log('    Subject: ' + (subject || 'General'));
  console.log('    Message: ' + message.substring(0, 50) + (message.length > 50 ? '...' : ''));
  console.log('    Time: ' + new Date().toLocaleString());
  
  res.json({ message_id: result.lastInsertRowid, message: 'Message sent successfully' });
});

// GET all contact messages (admin)
app.get('/api/admin/contacts', (req, res) => {
  const messages = db.prepare(`
    SELECT * FROM contact_messages 
    ORDER BY created_at DESC
  `).all();
  
  console.log('[' + new Date().toLocaleTimeString() + '] GET /api/admin/contacts - ' + messages.length + ' messages returned');
  messages.forEach(m => {
    console.log('    Message #' + m.message_id + ' | ' + m.first_name + ' ' + m.last_name + ' | ' + m.subject + ' | ' + m.status);
  });
  res.json(messages);
});

// UPDATE contact message status
app.put('/api/admin/contacts/:id', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE contact_messages SET status = ? WHERE message_id = ?').run(status, req.params.id);
  console.log('[' + new Date().toLocaleTimeString() + '] Contact message #' + req.params.id + ' marked as ' + status);
  res.json({ message: 'Status updated' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('');
  console.log('==============================================');
  console.log('    THE COLLOQUIUM - Book Store API Server');
  console.log('    Running at http://localhost:3000');
  console.log('==============================================');
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /api/books              - List all books');
  console.log('  GET  /api/books/:id          - Get single book');
  console.log('  POST /api/books              - Add new book (FULL DATA)');
  console.log('  PUT  /api/books/:id          - Update book (FULL DATA)');
  console.log('  DEL  /api/books/:id          - Soft delete book');
  console.log('  DEL  /api/admin/books/:id    - Hard delete book');
  console.log('  GET  /api/categories         - List categories');
  console.log('  GET  /api/orders             - List orders');
  console.log('  POST /api/orders             - Place new order');
  console.log('  GET  /api/stats              - Dashboard stats');
  console.log('  GET  /api/users              - List users');
  console.log('  POST /api/users/register     - Register new user (SAVES TO DB)');
  console.log('  GET  /api/reviews/:bookId    - Book reviews');
  console.log('  POST /api/reviews            - Post a review');
  console.log('  GET  /api/admin/reviews      - All reviews (admin)');
  console.log('  POST /api/contact            - Send contact message');
  console.log('  GET  /api/admin/contacts     - All contact messages');
  console.log('  PUT  /api/admin/contacts/:id - Update contact status');
  console.log('');
  console.log('Real-time Database Terminal:');
  console.log('----------------------------------------------');
  console.log('');
});