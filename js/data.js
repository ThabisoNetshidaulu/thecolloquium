/* ============================================
   DATA LAYER - Book Store
   Mock data + API integration
   ============================================ */

const API_BASE = window.location.origin + '/api';

// Fetch wrapper with error handling
async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(API_BASE + endpoint, options);
    if (!response.ok) throw new Error('API Error: ' + response.status);
    return await response.json();
  } catch (err) {
    console.log('API fetch failed, using local data:', err.message);
    return null;
  }
}

// API Functions
const API = {
  async getBooks() {
    const data = await apiFetch('/books');
    return data || BOOKS;
  },
  
  async getBook(id) {
    const data = await apiFetch('/books/' + id);
    return data || getBookById(id);
  },
  
  async getCategories() {
    const data = await apiFetch('/categories');
    return data || CATEGORIES;
  },
  
  async getOrders() {
    const data = await apiFetch('/orders');
    return data || [];
  },
  
  async getUsers() {
    const data = await apiFetch('/users');
    return data || [];
  },
  
  async getStats() {
    const data = await apiFetch('/stats');
    return data || { totalBooks: BOOKS.length, totalOrders: 0, totalUsers: 0, totalCategories: CATEGORIES.length };
  },
  
  async getReviews(bookId) {
    const data = await apiFetch('/reviews/' + bookId);
    return data || getReviewsByBook(bookId);
  },
  
  async addBook(bookData) {
    return await apiFetch('/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    });
  },
  
  async updateBook(id, bookData) {
    return await apiFetch('/books/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    });
  },
  
  async deleteBook(id) {
    return await apiFetch('/books/' + id, { method: 'DELETE' });
  },
  
  async placeOrder(orderData) {
    return await apiFetch('/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
  }
};

const CATEGORIES = [
  { id: 1, name: 'Fiction', description: 'Novels, short stories, and literary fiction', icon: 'F' },
  { id: 2, name: 'Non-Fiction', description: 'Biographies, self-help, history, and more', icon: 'NF' },
  { id: 3, name: 'Children', description: 'Books for kids of all ages', icon: 'C' },
  { id: 4, name: 'Teen & Young Adult', description: 'Coming-of-age stories and YA fiction', icon: 'YA' },
  { id: 5, name: 'Crime & Mystery', description: 'Thrillers, detective stories, and suspense', icon: 'CM' },
  { id: 6, name: 'Science & Technology', description: 'Science, tech, and computing books', icon: 'ST' },
  { id: 7, name: 'Business', description: 'Business, finance, and entrepreneurship', icon: 'B' },
  { id: 8, name: 'Mind, Body & Spirit', description: 'Wellness, spirituality, and personal growth', icon: 'MBS' }
];

const BOOKS = [
  {
    id: 1, title: 'Three Summers', author: 'Karen Swan', isbn: '9780857507532',
    price: 390.00, stock: 45, categoryId: 1,
    description: 'A sweeping and escapist summer romance set in Italy. Every summer tells a story. 1957: The summer of innocence. Amongst the lemon trees, Rafaella Parisi waits for the summer visitors to arrive...',
    publisher: 'Transworld Publishers', year: 2026, pages: 464, format: 'Paperback',
    cover: 'images/ThreeSummers.jpg',
    rating: 4.5, reviewCount: 24, isBestseller: true, isNewArrival: false
  },
  {
    id: 2, title: 'Atomic Habits', author: 'James Clear', isbn: '9781847941831',
    price: 465.00, stock: 120, categoryId: 2,
    description: 'Transform your life with tiny changes in behaviour. No matter your goals, Atomic Habits offers a proven framework for improving -- every day.',
    publisher: 'Penguin Random House', year: 2018, pages: 320, format: 'Paperback',
    cover: 'images/ATOMIC-HABITS.jpg',
    rating: 4.8, reviewCount: 156, isBestseller: true, isNewArrival: false
  },
  {
    id: 3, title: 'Falling Forward', author: 'Rachel Kolisi', isbn: '9780639881744',
    price: 360.00, stock: 30, categoryId: 2,
    description: 'An inspiring memoir about resilience, faith, and finding purpose after life\'s setbacks. Rachel shares her journey of overcoming adversity.',
    publisher: 'Pan Macmillan', year: 2025, pages: 288, format: 'Hardcover',
    cover: 'images/FallingFoward.jpg',
    rating: 4.3, reviewCount: 18, isBestseller: true, isNewArrival: true
  },
  {
    id: 4, title: 'The Let Them Theory', author: 'Mel Robbins', isbn: '9781788176187',
    price: 665.00, stock: 55, categoryId: 8,
    description: 'A groundbreaking approach to relationships, boundaries, and letting go of control. Mel Robbins shares practical strategies for emotional freedom.',
    publisher: 'Hay House', year: 2025, pages: 336, format: 'Hardcover',
    cover: 'images/LetThem.jpg',
    rating: 4.6, reviewCount: 42, isBestseller: true, isNewArrival: true
  },
  {
    id: 5, title: 'The Psychology of Money', author: 'Morgan Housel', isbn: '9780857197681',
    price: 440.00, stock: 85, categoryId: 7,
    description: 'Timeless lessons on wealth, greed, and happiness. Doing well with money isn\'t necessarily about what you know. It\'s about how you behave.',
    publisher: 'Harriman House', year: 2020, pages: 252, format: 'Paperback',
    cover: 'images/ThePsychologyOfMoney.jpg',
    rating: 4.7, reviewCount: 89, isBestseller: true, isNewArrival: false
  },
  {
    id: 6, title: 'Diary of a Wimpy Kid', author: 'Jeff Kinney', isbn: '9780141324906',
    price: 205.00, stock: 200, categoryId: 3,
    description: 'The hilarious illustrated story of middle school life from Greg Heffley. Life was better in middle school when he was the king.',
    publisher: 'Puffin Books', year: 2007, pages: 217, format: 'Paperback',
    cover: 'images/Dairy.jpg',
    rating: 4.4, reviewCount: 312, isBestseller: true, isNewArrival: false
  },
  {
    id: 7, title: 'The Hunger Games', author: 'Suzanne Collins', isbn: '9781407132082',
    price: 300.00, stock: 150, categoryId: 4,
    description: 'In a dark vision of the future, teenagers are forced to fight to the death on live television. May the odds be ever in your favour.',
    publisher: 'Scholastic', year: 2008, pages: 374, format: 'Paperback',
    cover: 'images/HungerGames.jpg',
    rating: 4.6, reviewCount: 245, isBestseller: true, isNewArrival: false
  },
  {
    id: 8, title: 'The Silent Patient', author: 'Alex Michaelides', isbn: '9781409181634',
    price: 350.00, stock: 60, categoryId: 5,
    description: 'A famous painter shoots her husband and never speaks again. A gripping psychological thriller that will keep you guessing until the end.',
    publisher: 'Celadon Books', year: 2019, pages: 325, format: 'Paperback',
    cover: 'images/SilentPatient.jpg',
    rating: 4.4, reviewCount: 178, isBestseller: true, isNewArrival: false
  },
  {
    id: 9, title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '9780099590088',
    price: 425.00, stock: 70, categoryId: 2,
    description: 'A brief history of humankind. From the Stone Age to the Silicon Age, discover how we came to dominate the world.',
    publisher: 'Vintage', year: 2011, pages: 443, format: 'Paperback',
    cover: 'images/Sapiens.jpg',
    rating: 4.6, reviewCount: 203, isBestseller: true, isNewArrival: false
  },
  {
    id: 10, title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884',
    price: 520.00, stock: 40, categoryId: 6,
    description: 'A Handbook of Agile Software Craftsmanship. Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.',
    publisher: 'Prentice Hall', year: 2008, pages: 464, format: 'Paperback',
    cover: 'images/Clean.jpg',
    rating: 4.7, reviewCount: 134, isBestseller: false, isNewArrival: false
  },
  {
    id: 11, title: 'Dune', author: 'Frank Herbert', isbn: '9780441013593',
    price: 380.00, stock: 95, categoryId: 1,
    description: 'The epic science fiction masterpiece set on the desert planet Arrakis. He who controls the spice controls the universe.',
    publisher: 'Ace Books', year: 1965, pages: 688, format: 'Paperback',
    cover: 'images/Dune.jpg',
    rating: 4.8, reviewCount: 567, isBestseller: true, isNewArrival: false
  },
  {
    id: 12, title: 'Becoming', author: 'Michelle Obama', isbn: '9780241334140',
    price: 450.00, stock: 65, categoryId: 2,
    description: 'The intimate and inspiring memoir from the former First Lady of the United States. A deeply personal reckoning of a woman of soul and substance.',
    publisher: 'Viking', year: 2018, pages: 448, format: 'Hardcover',
    cover: 'images/Becoming.jpg',
    rating: 4.7, reviewCount: 189, isBestseller: true, isNewArrival: false
  },
  {
    id: 13, title: 'The Very Hungry Caterpillar', author: 'Eric Carle', isbn: '9780399226908',
    price: 180.00, stock: 250, categoryId: 3,
    description: 'The classic children\'s story about a caterpillar\'s transformation into a beautiful butterfly. A must-have for every child\'s library.',
    publisher: 'World of Eric Carle', year: 1969, pages: 26, format: 'Board Book',
    cover: 'images/TheVeryHungey.jpg',
    rating: 4.9, reviewCount: 445, isBestseller: true, isNewArrival: false
  },
  {
    id: 14, title: 'Where the Crawdads Sing', author: 'Delia Owens', isbn: '9780735219106',
    price: 365.00, stock: 80, categoryId: 1,
    description: 'A coming-of-age murder mystery set in the marshlands of North Carolina. A painfully beautiful first novel.',
    publisher: 'G.P. Putnam', year: 2018, pages: 384, format: 'Paperback',
    cover: 'images/WheretheCrawdads.jpg',
    rating: 4.5, reviewCount: 267, isBestseller: true, isNewArrival: false
  },
  {
    id: 15, title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', isbn: '9780141033570',
    price: 410.00, stock: 50, categoryId: 7,
    description: 'The groundbreaking book about the two systems that drive the way we think. System 1 is fast, System 2 is slow.',
    publisher: 'Penguin', year: 2011, pages: 499, format: 'Paperback',
    cover: 'images/ThinkingFast.jpg',
    rating: 4.4, reviewCount: 156, isBestseller: false, isNewArrival: false
  },
  {
    id: 16, title: 'A Good Girl\'s Guide to Murder', author: 'Holly Jackson', isbn: '9781405293181',
    price: 245.00, stock: 110, categoryId: 4,
    description: 'A gripping YA thriller about a student who investigates a closed murder case for her final year project.',
    publisher: 'Electric Monkey', year: 2019, pages: 433, format: 'Paperback',
    cover: "images/A_Good_Girl's_Guide_to_Murder.jpg",
    rating: 4.3, reviewCount: 98, isBestseller: false, isNewArrival: true
  }
];

const REVIEWS = [
  { id: 1, bookId: 1, author: 'Sarah M.', rating: 5, comment: 'Absolutely loved this book! Could not put it down. The writing is beautiful.', date: '2026-03-15' },
  { id: 2, bookId: 1, author: 'John D.', rating: 4, comment: 'Beautiful writing and great characters. A perfect summer read.', date: '2026-03-10' },
  { id: 3, bookId: 2, author: 'Lisa K.', rating: 5, comment: 'Life-changing read. The strategies in this book actually work!', date: '2026-02-28' },
  { id: 4, bookId: 2, author: 'Michael R.', rating: 5, comment: 'The best self-help book I have ever read. Highly recommend!', date: '2026-02-20' },
  { id: 5, bookId: 3, author: 'Emma W.', rating: 4, comment: 'Inspiring and heartfelt memoir. Rachel is truly remarkable.', date: '2026-03-18' },
  { id: 6, bookId: 4, author: 'David S.', rating: 5, comment: 'Mel Robbins does it again! This theory will change your relationships.', date: '2026-03-12' },
  { id: 7, bookId: 5, author: 'Amy P.', rating: 5, comment: 'Essential reading for everyone interested in personal finance.', date: '2026-03-05' }
];

/* ---- Helper Functions ---- */
function getBookById(id) {
  return BOOKS.find(b => b.id === parseInt(id));
}

function getBooksByCategory(categoryId) {
  return BOOKS.filter(b => b.categoryId === parseInt(categoryId));
}

function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === parseInt(id));
}

function getReviewsByBook(bookId) {
  return REVIEWS.filter(r => r.bookId === parseInt(bookId));
}

function searchBooks(query) {
  const q = query.toLowerCase().trim();
  if (!q) return BOOKS;
  return BOOKS.filter(b =>
    b.title.toLowerCase().includes(q) ||
    b.author.toLowerCase().includes(q) ||
    (b.isbn && b.isbn.toLowerCase().includes(q))
  );
}

function getBestsellers() {
  return BOOKS.filter(b => b.isBestseller);
}

function getNewArrivals() {
  return BOOKS.filter(b => b.isNewArrival);
}

function formatPrice(price) {
  return 'R ' + price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  let stars = '';
  for (let i = 0; i < full; i++) stars += '★';
  if (half) stars += '★';
  for (let i = full + half; i < 5; i++) stars += '☆';
  return stars;
}