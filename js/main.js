/* ==========================================================================
   STACKLY INSURANCE - MAIN JAVASCRIPT
   Navbar, Animations, FAQ Accordion, Testimonials Slider, Toasts, Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initCounters();
  initFaqAccordion();
  initTestimonialSlider();
  initBackToTop();
  initQuoteModal();
  initNewsletter();
  highlightActiveNavLink();
});

/* --------------------------------------------------------------------------
   1. NAVBAR & MOBILE MENU TOGGLE
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  if (mobileToggle && navMenu) {
    // Create backdrop overlay for mobile menu
    let backdrop = document.querySelector('.mobile-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'mobile-backdrop';
      backdrop.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(15, 23, 42, 0.5); z-index: 999;
        opacity: 0; visibility: hidden; transition: all 0.3s ease;
      `;
      document.body.appendChild(backdrop);
    }

    const toggleMenu = (open) => {
      if (open) {
        navMenu.classList.add('active');
        backdrop.style.opacity = '1';
        backdrop.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
      } else {
        navMenu.classList.remove('active');
        backdrop.style.opacity = '0';
        backdrop.style.visibility = 'hidden';
        document.body.style.overflow = '';
      }
    };

    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('active');
      toggleMenu(!isOpen);
    });

    backdrop.addEventListener('click', () => toggleMenu(false));

    // Close menu when clicking links inside nav
    const navLinks = navMenu.querySelectorAll('.nav-link, .btn');
    navLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }
}

function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   2. SCROLL REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.card, .service-card, .feature-box, .process-step, .stat-card, .plan-card, .faq-item, .section-header');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   3. ANIMATED COUNTERS
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target') || counter.innerText.replace(/[^0-9]/g, ''));
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        let start = 0;
        const duration = 2000;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            counter.innerText = prefix + target.toLocaleString() + suffix;
            clearInterval(timer);
          } else {
            counter.innerText = prefix + Math.floor(start).toLocaleString() + suffix;
          }
        }, 16);

        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* --------------------------------------------------------------------------
   4. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');

    if (header && content) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other accordion items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.faq-content');
          if (otherContent) otherContent.style.maxHeight = null;
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   5. TESTIMONIAL SLIDER / CAROUSEL
   -------------------------------------------------------------------------- */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  const dotsContainer = document.querySelector('.slider-dots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoSlideInterval;

  // Generate Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  const updateDots = () => {
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  };

  const goToSlide = (index) => {
    currentIndex = index;
    if (currentIndex < 0) currentIndex = slides.length - 1;
    if (currentIndex >= slides.length) currentIndex = 0;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  };

  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

  // Auto Play
  const startAutoSlide = () => {
    autoSlideInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
  };

  const stopAutoSlide = () => clearInterval(autoSlideInterval);

  track.addEventListener('mouseenter', stopAutoSlide);
  track.addEventListener('mouseleave', startAutoSlide);

  startAutoSlide();
}

/* --------------------------------------------------------------------------
   6. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  let backBtn = document.querySelector('.back-to-top');
  
  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.className = 'back-to-top';
    backBtn.setAttribute('aria-label', 'Back to top');
    backBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(backBtn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backBtn.classList.add('show');
    } else {
      backBtn.classList.remove('show');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   7. GET A QUOTE MODAL HANDLER
   -------------------------------------------------------------------------- */
function initQuoteModal() {
  const quoteBtns = document.querySelectorAll('[data-modal="quote"]');
  let modalOverlay = document.querySelector('#quoteModal');

  if (!modalOverlay && quoteBtns.length > 0) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'quoteModal';
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>Get an Instant Insurance Quote</h3>
          <button class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <form id="quoteModalForm">
            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-input" style="padding-left:1rem;" placeholder="John Doe" required>
            </div>
            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" style="padding-left:1rem;" placeholder="john@example.com" required>
            </div>
            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="form-label">Insurance Category</label>
              <select class="form-select" style="padding-left:1rem;" required>
                <option value="health">Health Insurance</option>
                <option value="life">Life Insurance</option>
                <option value="vehicle">Vehicle Insurance</option>
                <option value="home">Home Insurance</option>
                <option value="travel">Travel Insurance</option>
                <option value="business">Business Insurance</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%; margin-top:0.5rem;">Calculate Instant Quote</button>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);
  }

  if (modalOverlay) {
    const closeBtn = modalOverlay.querySelector('.modal-close');
    const form = modalOverlay.querySelector('#quoteModalForm');

    const closeModal = () => modalOverlay.classList.remove('active');
    const openModal = () => modalOverlay.classList.add('active');

    quoteBtns.forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    }));

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        closeModal();
        showToast('Quote calculation ready! Check your email for full estimate details.', 'success');
      });
    }
  }
}

/* --------------------------------------------------------------------------
   8. NEWSLETTER SUBSCRIPTION
   -------------------------------------------------------------------------- */
function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input && input.value.trim() !== '') {
        showToast('Thank you for subscribing to Stackly Insurance updates!', 'success');
        input.value = '';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. GLOBAL TOAST NOTIFICATION UTILITY
   -------------------------------------------------------------------------- */
function showToast(message, type = 'success') {
  let container = document.querySelector('#toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-circle-exclamation';
  if (type === 'warning') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Make showToast available globally
window.showToast = showToast;
