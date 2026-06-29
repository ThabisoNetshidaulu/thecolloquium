-- Book Store Online Database Schema
-- MySQL Database

CREATE DATABASE IF NOT EXISTS bookstore;
USE bookstore;

-- 1. Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_admin BOOLEAN DEFAULT FALSE,
    loyalty_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. Books Table
CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(13) UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    description TEXT,
    publisher VARCHAR(100),
    publication_year INT,
    page_count INT,
    format VARCHAR(50),
    cover_image VARCHAR(255),
    rating_average DECIMAL(2,1) DEFAULT 0.0,
    rating_count INT DEFAULT 0,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- 4. Reviews Table
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 5. Cart Table
CREATE TABLE carts (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 6. Cart Items Table
CREATE TABLE cart_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);

-- 7. Orders Table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    final_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 8. Order Items Table
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Categories
INSERT INTO categories (name, description, image_url) VALUES
('Fiction', 'Novels, short stories, and literary fiction', 'images/cat-fiction.jpg'),
('Non-Fiction', 'Biographies, self-help, history, and more', 'images/cat-nonfiction.jpg'),
('Children', 'Books for kids of all ages', 'images/cat-children.jpg'),
('Teen & Young Adult', 'Coming-of-age stories and YA fiction', 'images/cat-teen.jpg'),
('Crime & Mystery', 'Thrillers, detective stories, and suspense', 'images/cat-crime.jpg'),
('Science & Technology', 'Science, tech, and computing books', 'images/cat-science.jpg'),
('Business', 'Business, finance, and entrepreneurship', 'images/cat-business.jpg'),
('Mind, Body & Spirit', 'Wellness, spirituality, and personal growth', 'images/cat-mind.jpg');

-- Books
INSERT INTO books (title, author, isbn, price, stock_quantity, description, publisher, publication_year, page_count, format, cover_image, rating_average, rating_count, is_bestseller, is_new_arrival, category_id) VALUES
('Three Summers', 'Karen Swan', '9780857507532', 390.00, 45, 'A sweeping and escapist summer romance set in Italy. Every summer tells a story...', 'Transworld Publishers', 2026, 464, 'Paperback', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 4.5, 24, TRUE, FALSE, 1),
('Atomic Habits', 'James Clear', '9781847941831', 465.00, 120, 'Transform your life with tiny changes in behaviour. The million-copy bestseller.', 'Penguin Random House', 2018, 320, 'Paperback', 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400', 4.8, 156, TRUE, FALSE, 2),
('Falling Forward', 'Rachel Kolisi', '9780639881744', 360.00, 30, 'An inspiring memoir about resilience, faith, and finding purpose after life''s setbacks.', 'Pan Macmillan', 2025, 288, 'Hardcover', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', 4.3, 18, TRUE, TRUE, 2),
('The Let Them Theory', 'Mel Robbins', '9781788176187', 665.00, 55, 'A groundbreaking approach to relationships, boundaries, and letting go of control.', 'Hay House', 2025, 336, 'Hardcover', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', 4.6, 42, TRUE, TRUE, 2),
('The Psychology of Money', 'Morgan Housel', '9780857197681', 440.00, 85, 'Timeless lessons on wealth, greed, and happiness. A must-read for everyone.', 'Harriman House', 2020, 252, 'Paperback', 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400', 4.7, 89, TRUE, FALSE, 7),
('Diary of a Wimpy Kid', 'Jeff Kinney', '9780141324906', 205.00, 200, 'The hilarious illustrated story of middle school life from Greg Heffley.', 'Puffin Books', 2007, 217, 'Paperback', 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400', 4.4, 312, TRUE, FALSE, 3),
('The Hunger Games', 'Suzanne Collins', '9781407132082', 300.00, 150, 'In a dark vision of the future, teenagers are forced to fight to the death on live television.', 'Scholastic', 2008, 374, 'Paperback', 'https://images.unsplash.com/photo-1629196911514-cfd8d63f5e27?w=400', 4.6, 245, TRUE, FALSE, 4),
('The Silent Patient', 'Alex Michaelides', '9781409181634', 350.00, 60, 'A famous painter shoots her husband and never speaks again. A gripping psychological thriller.', 'Celadon Books', 2019, 325, 'Paperback', 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400', 4.4, 178, TRUE, FALSE, 5),
('Sapiens', 'Yuval Noah Harari', '9780099590088', 425.00, 70, 'A brief history of humankind. From the Stone Age to the Silicon Age.', 'Vintage', 2011, 443, 'Paperback', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 4.6, 203, TRUE, FALSE, 2),
('Clean Code', 'Robert C. Martin', '9780132350884', 520.00, 40, 'A Handbook of Agile Software Craftsmanship. Essential for every developer.', 'Prentice Hall', 2008, 464, 'Paperback', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 4.7, 134, FALSE, FALSE, 6),
('Dune', 'Frank Herbert', '9780441013593', 380.00, 95, 'The epic science fiction masterpiece set on the desert planet Arrakis.', 'Ace Books', 1965, 688, 'Paperback', 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400', 4.8, 567, TRUE, FALSE, 1),
('Becoming', 'Michelle Obama', '9780241334140', 450.00, 65, 'The intimate and inspiring memoir from the former First Lady of the United States.', 'Viking', 2018, 448, 'Hardcover', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 4.7, 189, TRUE, FALSE, 2),
('The Very Hungry Caterpillar', 'Eric Carle', '9780399226908', 180.00, 250, 'The classic children''s story about a caterpillar''s transformation into a butterfly.', 'World of Eric Carle', 1969, 26, 'Board Book', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', 4.9, 445, TRUE, FALSE, 3),
('Where the Crawdads Sing', 'Delia Owens', '9780735219106', 365.00, 80, 'A coming-of-age murder mystery set in the marshlands of North Carolina.', 'G.P. Putnam', 2018, 384, 'Paperback', 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400', 4.5, 267, TRUE, FALSE, 1),
('Thinking, Fast and Slow', 'Daniel Kahneman', '9780141033570', 410.00, 50, 'The groundbreaking book about the two systems that drive the way we think.', 'Penguin', 2011, 499, 'Paperback', 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400', 4.4, 156, FALSE, FALSE, 7),
('A Good Girl''s Guide to Murder', 'Holly Jackson', '9781405293181', 245.00, 110, 'A gripping YA thriller about a student who investigates a closed murder case.', 'Electric Monkey', 2019, 433, 'Paperback', 'https://images.unsplash.com/photo-1629196911514-cfd8d63f5e27?w=400', 4.3, 98, FALSE, TRUE, 4);

-- Admin User (password: admin123)
INSERT INTO users (email, password, first_name, last_name, phone, is_admin, loyalty_points) VALUES
('admin@bookstore.co.za', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', '0873654677', TRUE, 0);

-- Sample Reviews
INSERT INTO reviews (book_id, user_id, rating, comment) VALUES
(1, 1, 5, 'Absolutely loved this book! Could not put it down.'),
(1, 1, 4, 'Beautiful writing and great characters.'),
(2, 1, 5, 'Life-changing read. Highly recommend!'),
(2, 1, 5, 'The best self-help book I have ever read.'),
(3, 1, 4, 'Inspiring and heartfelt memoir.'),
(4, 1, 5, 'Mel Robbins does it again! Amazing advice.'),
(5, 1, 5, 'Essential reading for everyone interested in finance.');

-- Verify tables
SHOW TABLES;

-- Count records
SELECT 'Categories' as table_name, COUNT(*) as records FROM categories
UNION ALL
SELECT 'Books', COUNT(*) FROM books
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews;
