/* ==========================================================================
   STACKLY INSURANCE - AUTHENTICATION JAVASCRIPT (LOGIN & SIGNUP)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
  initPasswordStrength();
  initLoginForm();
  initSignupForm();
  initContactFormValidation();
});

/* --------------------------------------------------------------------------
   1. SHOW / HIDE PASSWORD TOGGLE
   -------------------------------------------------------------------------- */
function initPasswordToggles() {
  const toggleBtns = document.querySelectorAll('.password-toggle');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const input = btn.previousElementSibling || btn.parentElement.querySelector('input');
      if (input) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.innerHTML = isPassword ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. PASSWORD STRENGTH METER
   -------------------------------------------------------------------------- */
function initPasswordStrength() {
  const passwordInput = document.querySelector('#signupPassword');
  const bar = document.querySelector('.strength-bar');
  const text = document.querySelector('.strength-text');

  if (!passwordInput || !bar || !text) return;

  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    let score = 0;

    if (val.length >= 6) score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    bar.className = 'strength-bar';

    if (val.length === 0) {
      bar.style.width = '0%';
      text.innerText = 'Password strength';
    } else if (score <= 1) {
      bar.classList.add('strength-weak');
      text.innerText = 'Weak password';
      text.style.color = '#ef4444';
    } else if (score <= 3) {
      bar.classList.add('strength-medium');
      text.innerText = 'Medium password';
      text.style.color = '#f59e0b';
    } else {
      bar.classList.add('strength-strong');
      text.innerText = 'Strong password!';
      text.style.color = '#10b981';
    }
  });
}

/* --------------------------------------------------------------------------
   3. LOGIN DEMO HANDLER (USER & ADMIN)
   -------------------------------------------------------------------------- */
function initLoginForm() {
  const loginForm = document.querySelector('#loginForm');
  if (!loginForm) return;

  // Autofill helpers if present
  const demoUserBtn = document.querySelector('#fillDemoUser');
  const demoAdminBtn = document.querySelector('#fillDemoAdmin');

  if (demoUserBtn) {
    demoUserBtn.addEventListener('click', () => {
      document.querySelector('#loginEmail').value = 'alex.customer@example.com';
      document.querySelector('#loginPassword').value = 'user123';
      document.querySelector('input[name="role"][value="user"]').checked = true;
    });
  }

  if (demoAdminBtn) {
    demoAdminBtn.addEventListener('click', () => {
      document.querySelector('#loginEmail').value = 'admin@stackly.com';
      document.querySelector('#loginPassword').value = 'admin123';
      document.querySelector('input[name="role"][value="admin"]').checked = true;
    });
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = document.querySelector('#loginEmail');
    const passwordInput = document.querySelector('#loginPassword');
    const roleInput = document.querySelector('input[name="role"]:checked');
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';
    const role = roleInput ? roleInput.value : 'user';

    if (!email || !password) {
      if (window.showToast) window.showToast('Please enter both email and password.', 'error');
      return;
    }

    // Save session details in localStorage
    localStorage.setItem('stackly_is_logged_in', 'true');
    localStorage.setItem('stackly_user_role', role);
    localStorage.setItem('stackly_user_email', email);

    // Extract name from email for personal greeting
    const namePart = email.split('@')[0].replace('.', ' ');
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    localStorage.setItem('stackly_user_name', formattedName);

    // Visual button loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';

    setTimeout(() => {
      if (window.showToast) window.showToast(`Login successful! Welcome back, ${formattedName}.`, 'success');

      setTimeout(() => {
        if (role === 'admin') {
          window.location.href = 'admin-dashboard.html';
        } else {
          window.location.href = 'user-dashboard.html';
        }
      }, 1000);
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   4. SIGNUP FORM VALIDATION
   -------------------------------------------------------------------------- */
function initSignupForm() {
  const signupForm = document.querySelector('#signupForm');
  if (!signupForm) return;

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.querySelector('#signupName').value.trim();
    const email = document.querySelector('#signupEmail').value.trim();
    const phone = document.querySelector('#signupPhone').value.trim();
    const password = document.querySelector('#signupPassword').value.trim();
    const confirmPassword = document.querySelector('#signupConfirmPassword').value.trim();
    const terms = document.querySelector('#signupTerms').checked;
    const submitBtn = signupForm.querySelector('button[type="submit"]');

    if (!name || !email || !phone || !password || !confirmPassword) {
      if (window.showToast) window.showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      if (window.showToast) window.showToast('Passwords do not match.', 'error');
      return;
    }

    if (!terms) {
      if (window.showToast) window.showToast('You must agree to the Terms & Conditions.', 'warning');
      return;
    }

    // Save demo user info to localStorage
    const demoUsers = JSON.parse(localStorage.getItem('stackly_registered_users') || '[]');
    demoUsers.push({ name, email, phone, createdAt: new Date().toISOString() });
    localStorage.setItem('stackly_registered_users', JSON.stringify(demoUsers));

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';

    setTimeout(() => {
      if (window.showToast) window.showToast('Account created successfully! Redirecting to login...', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   5. CONTACT FORM VALIDATION
   -------------------------------------------------------------------------- */
function initContactFormValidation() {
  const contactForm = document.querySelector('#contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = contactForm.querySelector('[name="name"]')?.value.trim();
    const email = contactForm.querySelector('[name="email"]')?.value.trim();
    const phone = contactForm.querySelector('[name="phone"]')?.value.trim();
    const message = contactForm.querySelector('[name="message"]')?.value.trim();

    if (!name || !email || !message) {
      if (window.showToast) window.showToast('Please fill in all required contact fields.', 'error');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...';

    setTimeout(() => {
      if (window.showToast) window.showToast('Thank you! Your message has been sent to our support team.', 'success');
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
    }, 1200);
  });
}
