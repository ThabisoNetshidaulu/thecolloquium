# User Manual - Book Store Online

---

## System Overview

**Book Store Online** is a dynamic web-based e-commerce application for purchasing books. The system allows users to browse, search, add to cart, and checkout with their favourite books. It also includes an Admin Panel for managing the book inventory.

**Website URL:** [thecolloquium.netlify.app](thecolloquium.netlify.app)

---

## Table of Contents

1. [Customer (User) Features](#1-customer-user-features)
2. [Administrator Features](#2-administrator-features)
3. [Login Credentials](#3-login-credentials)
4. [How to Navigate](#4-how-to-navigate)
5. [Technical Information](#5-technical-information)

---

## 1. Customer (User) Features

### 1.1 Browse Books

1. Open the homepage to see bestsellers, new arrivals, and categories
2. Click on any category card (e.g., Fiction, Non-Fiction) to filter books
3. Use the navigation menu to browse different sections

### 1.2 Search Books

1. Click on the search bar at the top of the page
2. Type a book title, author name, or ISBN
3. Press Enter or click the search icon
4. Results will display on the Catalogue page

### 1.3 View Book Details

1. Click on any book cover or title
2. The Book Details page shows:
   - Full description and cover image
   - Author, publisher, format, pages, ISBN
   - Customer reviews and ratings
   - Related book recommendations

### 1.4 Add to Cart

1. On any book card or the book detail page, click **"Add to Cart"**
2. A success message will appear
3. The cart icon in the header will update with the item count
4. To add multiple copies, use the quantity selector on the book detail page

### 1.5 View Cart

1. Click the **Cart** icon in the top right header
2. The Shopping Cart page displays:
   - All items with cover images, titles, and prices
   - Quantity controls to increase/decrease amounts
   - Remove button to delete items
   - Order summary with subtotal, shipping, and total

### 1.6 Checkout

1. From the Cart page, click **"Proceed to Checkout"**
2. Fill in the shipping details (all fields marked \* are required)
3. Select a payment method (Credit Card, Instant EFT, or Cash on Delivery)
4. Click **"Place Order"** to complete your purchase
5. Free delivery applies to orders over R450

### 1.7 Register Account

1. Click **"Sign In"** in the header
2. Click **"Create one"** to switch to the registration form
3. Fill in your first name, last name, email, and password
4. Click **"Create Account"**

### 1.8 Login

1. Click **"Sign In"** in the header
2. Enter your email and password
3. Click **"Sign In"**
4. Regular users will be redirected to the homepage

### 1.9 Contact Support

1. Click **"Contact"** in the navigation menu
2. Fill in the contact form with your details
3. Select a subject from the dropdown
4. Type your message and click **"Send Message"**
5. You can also view the FAQ section for common questions

---

## 2. Administrator Features

### 2.1 Access Admin Panel

1. Login with admin credentials (see Section 3 below)
2. You will be automatically redirected to the Admin Panel

### 2.2 Dashboard Overview

- View summary statistics: Total Books, Total Orders, Total Users, Categories
- See recent bestsellers displayed in a grid

### 2.3 Manage Books (CRUD)

1. Click **"Manage Books"** in the left sidebar
2. **Add a new book:**
   - Click **"+ Add New Book"** button
   - Fill in the form with title, author, price, stock, category, etc.
   - Click **"Save Book"**
3. **Edit an existing book:**
   - Find the book in the table
   - Click the **"Edit"** button
   - Modify the details in the modal form
   - Click **"Save Book"**
4. **Delete a book:**
   - Find the book in the table
   - Click the **"Delete"** button
   - Confirm the deletion

### 2.4 View Orders

1. Click **"Orders"** in the left sidebar
2. View all orders with details: Order Number, Customer, Items, Total, Status, Date
3. Order statuses include: Delivered, Processing, Shipped, Pending

### 2.5 View Users

1. Click **"Users"** in the left sidebar
2. View all registered users with their ID, Name, Email, Role, and Join Date

---

## 3. Login Credentials

| Role              | Email                 | Password |
| ----------------- | --------------------- | -------- |
| **Administrator** | admin@bookstore.co.za | admin123 |
| **Customer**      | user@bookstore.co.za  | user123  |

---

## 4. How to Navigate

| Page           | How to Access                               |
| -------------- | ------------------------------------------- |
| Homepage       | Default landing page or click "Home" in nav |
| Book Catalogue | Click "New Fiction" or any category link    |
| Book Details   | Click any book cover or title               |
| Shopping Cart  | Click the cart icon in the header           |
| Checkout       | Click "Proceed to Checkout" from Cart       |
| Login/Register | Click "Sign In" in the header               |
| Contact        | Click "Contact" in the navigation menu      |
| Admin Panel    | Login with admin credentials                |

---

## 5. Technical Information

### Technologies Used

- **HTML5** - Semantic page structure
- **CSS3** - Styling with Flexbox, Grid, and media queries
- **JavaScript** - Client-side interactivity and data management
- **MySQL** - Database for storing books, users, orders, and reviews

### Browser Compatibility

The application is compatible with:

- Google Chrome (recommended)
- Mozilla Firefox
- Microsoft Edge
- Safari

### Responsive Design

The application adapts to different screen sizes:

- **Desktop** (1024px+): Full layout with sidebars and grids
- **Tablet** (768px-1023px): Optimised two-column layouts
- **Mobile** (up to 767px): Single column, hamburger menu, horizontal scroll cards

---
