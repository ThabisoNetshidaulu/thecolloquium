/* ============================================
   APP.JS - The Colloquium
   Cart, Auth, Search, UI Interactions
   ============================================ */

/* ---- Cart Module ---- */
const Cart = {
  KEY: 'colloquium_cart',

  get() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch { return []; }
  },

  save(cart) {
    localStorage.setItem(this.KEY, JSON.stringify(cart));
    this.updateUI();
  },

  add(bookId) {
    const cart = this.get();
    const existing = cart.find(item => item.bookId === bookId);
    if (existing) {
      existing.quantity += 1;
    } else {
      const book = getBookById(bookId);
      cart.push({ bookId, quantity: 1, price: book.price, title: book.title, cover: book.cover, author: book.author });
    }
    this.save(cart);
    showToast('Added to your collection', 'success');
  },

  remove(bookId) {
    const cart = this.get().filter(item => item.bookId !== bookId);
    this.save(cart);
    showToast('Removed from collection', 'success');
  },

  updateQuantity(bookId, delta) {
    const cart = this.get();
    const item = cart.find(i => i.bookId === bookId);
    if (item) {
      item.quantity += delta;
      if (item.quantity < 1) item.quantity = 1;
      this.save(cart);
    }
  },

  getCount() {
    return this.get().reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotal() {
    return this.get().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  clear() {
    localStorage.removeItem(this.KEY);
    this.updateUI();
  },

  updateUI() {
    const count = this.getCount();
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  }
};

/* ---- Auth Module ---- */
const Auth = {
  KEY: 'colloquium_auth',

  getUser() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY));
    } catch { return null; }
  },

  login(email, password, isAdmin = false) {
    const user = { email, name: email.split('@')[0], isAdmin, loginTime: new Date().toISOString() };
    localStorage.setItem(this.KEY, JSON.stringify(user));
    this.updateUI();
    return user;
  },

  register(firstName, lastName, email, password) {
    const user = { email, name: firstName + ' ' + lastName, isAdmin: false, loginTime: new Date().toISOString() };
    localStorage.setItem(this.KEY, JSON.stringify(user));
    this.updateUI();
    return user;
  },

  logout() {
    localStorage.removeItem(this.KEY);
    Cart.clear();
    this.updateUI();
    window.location.href = 'index.html';
  },

  isLoggedIn() {
    return !!this.getUser();
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.isAdmin;
  },

  updateUI() {
    const user = this.getUser();
    const authLinks = document.querySelectorAll('.auth-link');
    authLinks.forEach(link => {
      if (user) {
        link.innerHTML = `<i class="fa-regular fa-user"></i> ${user.name}`;
        link.href = '#';
        link.onclick = (e) => { e.preventDefault(); Auth.logout(); };
      } else {
        link.innerHTML = `<i class="fa-regular fa-user"></i> Account`;
        link.href = 'login.html';
        link.onclick = null;
      }
    });
  }
};

/* ---- Toast Notifications ---- */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>';
  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ---- Header Component ---- */
function renderHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  header.innerHTML = `
    <div class="announcement-bar">
      <div class="container">
        <i class="fa-solid fa-gem"></i> Curated Academic Editions &nbsp;|&nbsp; <i class="fa-solid fa-truck-fast"></i> Complimentary Delivery on Orders Over R450
      </div>
    </div>
    <div class="container">
      <div class="header-top">
        <a href="index.html" class="logo">
          <div class="logo-mark">
            <i class="fa-solid fa-building-columns"></i>
          </div>
          <div class="logo-text">
            <span class="logo-name">The Colloquium</span>
            <span class="logo-tagline">Curated Books</span>
          </div>
        </a>
        <div class="search-bar">
          <input type="text" id="searchInput" placeholder="Search titles, authors, ISBN..." onkeypress="if(event.key==='Enter') handleSearch()">
          <button onclick="handleSearch()" title="Search"><i class="fa-solid fa-magnifying-glass"></i></button>
        </div>
        <div class="header-actions">
          <a href="#" class="auth-link"><i class="fa-regular fa-user"></i> Account</a>
          <a href="cart.html" class="cart-link">
            <i class="fa-solid fa-bag-shopping"></i>
            <span class="cart-label">Collection</span>
            <span class="cart-count">0</span>
          </a>
        </div>
      </div>
      <nav class="main-nav">
        <ul>
          <li><a href="index.html" class="nav-link" data-page="home">Home</a></li>
          <li><a href="catalog.html" class="nav-link" data-page="catalog">Fiction</a></li>
          <li><a href="catalog.html?cat=2" class="nav-link" data-page="nonfiction">Non-Fiction</a></li>
          <li><a href="catalog.html?cat=3" class="nav-link" data-page="children">Children</a></li>
          <li><a href="catalog.html?cat=4" class="nav-link" data-page="teen">Young Adult</a></li>
          <li><a href="catalog.html?cat=5" class="nav-link" data-page="crime">Crime & Mystery</a></li>
          <li><a href="contact.html" class="nav-link" data-page="contact">Contact</a></li>
          <li><a href="admin.html" class="nav-link admin-nav-link" data-page="admin" style="display:none">Admin</a></li>
        </ul>
      </nav>
    </div>
  `;
}

/* ---- Footer Component ---- */
function renderFooter() {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h3>Scholarly Services</h3>
          <a href="tel:+270873654677"><i class="fa-solid fa-phone"></i> +27 (0) 87 365 4677</a>
          <a href="mailto:info@thecolloquium.co.za"><i class="fa-solid fa-envelope"></i> info@thecolloquium.co.za</a>
          <span><i class="fa-regular fa-clock"></i> Mon–Fri: 8AM–8PM</span>
          <span><i class="fa-regular fa-clock"></i> Sat: 8AM–1PM</span>
        </div>
        <div class="footer-col">
          <h3>The Colloquium</h3>
          <a href="contact.html">Contact Us</a>
          <a href="#">Our Story</a>
          <a href="#">Events</a>
          <a href="#">Membership</a>
        </div>
        <div class="footer-col">
          <h3>Customer Care</h3>
          <a href="#">Track Order</a>
          <a href="#">Delivery Information</a>
          <a href="#">Returns Policy</a>
          <a href="#">FAQs</a>
        </div>
        <div class="footer-col">
          <h3>Connect</h3>
          <a href="#"><i class="fa-brands fa-instagram"></i> Instagram</a>
          <a href="#"><i class="fa-brands fa-facebook-f"></i> Facebook</a>
          <a href="#"><i class="fa-brands fa-x-twitter"></i> Twitter</a>
          <a href="#"><i class="fa-brands fa-tiktok"></i> TikTok</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 The Colloquium. All rights reserved. | <a href="#">Privacy Policy</a> | <a href="#">Terms & Conditions</a></p>
      </div>
    </div>
  `;
}

/* ---- Book Card Component ---- */
function renderBookCard(book) {
  const badges = [];
  if (book.isBestseller) badges.push('<span class="badge badge-bestseller">Bestseller</span>');
  if (book.isNewArrival) badges.push('<span class="badge badge-new">New Arrival</span>');

  return `
    <div class="book-card">
      ${badges.join('')}
      <a href="book-detail.html?id=${book.id}">
        <img src="${book.cover}" alt="${book.title}" class="book-cover" loading="lazy">
      </a>
      <div class="book-info">
        <a href="book-detail.html?id=${book.id}">
          <h3 class="book-title">${book.title}</h3>
        </a>
        <p class="book-author">${book.author}</p>
        <div class="book-rating">
          <span class="stars">${renderStars(book.rating)}</span>
          <span class="rating-count">(${book.reviewCount})</span>
        </div>
        <p class="book-price">${formatPrice(book.price)}</p>
        <div class="book-actions">
          <button class="btn btn-primary btn-sm" onclick="Cart.add(${book.id})">
            <i class="fa-solid fa-plus"></i> Add to Collection
          </button>
          <button class="btn-wishlist" title="Save for later">
            <i class="fa-regular fa-bookmark"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ---- Page Title Component ---- */
function renderPageTitle(title, breadcrumb) {
  const el = document.querySelector('.page-title');
  if (!el) return;
  el.innerHTML = `
    <div class="container">
      <h1>${title}</h1>
      <div class="breadcrumb">${breadcrumb}</div>
    </div>
  `;
}

/* ---- Search Handler ---- */
function handleSearch() {
  const query = document.getElementById('searchInput')?.value.trim();
  if (query) {
    window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
  }
}

/* ---- Form Validation ---- */
function validateForm(form) {
  let isValid = true;
  const required = form.querySelectorAll('[required]');

  required.forEach(field => {
    const errorEl = field.parentElement.querySelector('.form-error');
    if (!field.value.trim()) {
      isValid = false;
      field.style.borderColor = 'var(--danger)';
      if (errorEl) errorEl.classList.add('show');
    } else {
      field.style.borderColor = '';
      if (errorEl) errorEl.classList.remove('show');
    }

    if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
        field.style.borderColor = 'var(--danger)';
      }
    }
  });

  return isValid;
}

/* ---- Tabs ---- */
function initTabs() {
  document.querySelectorAll('.tab-buttons').forEach(container => {
    container.addEventListener('click', e => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;

      const tabId = btn.dataset.tab;
      const parent = btn.closest('.tabs');

      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      parent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      parent.querySelector(`#${tabId}`)?.classList.add('active');
    });
  });
}

/* ---- Initialize App ---- */
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  Cart.updateUI();
  Auth.updateUI();
  initTabs();

  if (Auth.isAdmin()) {
    document.querySelectorAll('.admin-nav-link').forEach(el => el.style.display = '');
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
});