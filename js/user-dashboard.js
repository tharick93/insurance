/* ==========================================================================
   STACKLY INSURANCE - USER DASHBOARD JAVASCRIPT
   Chart.js charts, Sidebar Toggle, Policy & Claim tables, Downloads, Logout
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  checkUserAuth();
  initDashboardSidebar();
  initUserCharts();
  initTableFilters();
  initDocumentDownloads();
  initClaimModal();
  initLogout();
  setCurrentDate();
});

/* --------------------------------------------------------------------------
   1. AUTHENTICATION & USER PROFILE DISPLAY
   -------------------------------------------------------------------------- */
function checkUserAuth() {
  const isLoggedIn = localStorage.getItem('stackly_is_logged_in');
  const role = localStorage.getItem('stackly_user_role');
  const email = localStorage.getItem('stackly_user_email') || 'alex.smith@example.com';
  const name = localStorage.getItem('stackly_user_name') || 'Alex Smith';

  if (!isLoggedIn || isLoggedIn !== 'true') {
    window.location.href = 'login.html';
    return;
  }

  // Update UI with user info
  const userNameElements = document.querySelectorAll('.user-name-display');
  const userEmailElements = document.querySelectorAll('.user-email-display');

  userNameElements.forEach(el => el.innerText = name);
  userEmailElements.forEach(el => el.innerText = email);
}

function setCurrentDate() {
  const dateEl = document.querySelector('#currentDateDisplay');
  if (dateEl) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    dateEl.innerText = new Date().toLocaleDateString('en-US', options);
  }
}

/* --------------------------------------------------------------------------
   2. SIDEBAR RESPONSIVE TOGGLE
   -------------------------------------------------------------------------- */
function initDashboardSidebar() {
  const sidebar = document.querySelector('.dashboard-sidebar');
  const toggleBtn = document.querySelector('.topbar-toggle');
  
  if (!sidebar) return;

  // Create overlay if missing
  let overlay = document.querySelector('.dashboard-sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'dashboard-sidebar-overlay';
    document.body.appendChild(overlay);
  }

  const toggleSidebar = (open) => {
    if (open) {
      sidebar.classList.add('active');
      overlay.classList.add('active');
    } else {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    }
  };

  if (toggleBtn) toggleBtn.addEventListener('click', () => toggleSidebar(true));
  overlay.addEventListener('click', () => toggleSidebar(false));

  const sidebarLinks = sidebar.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) toggleSidebar(false);
    });
  });
}

/* --------------------------------------------------------------------------
   3. RENDER CHART.JS CHARTS
   -------------------------------------------------------------------------- */
function initUserCharts() {
  if (typeof Chart === 'undefined') return;

  // Chart 1: Premium Payment Trend (Line Chart)
  const ctxTrend = document.getElementById('paymentTrendChart')?.getContext('2d');
  if (ctxTrend) {
    new Chart(ctxTrend, {
      type: 'line',
      data: {
        labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{
          label: 'Premium Paid (₹)',
          data: [6500, 8500, 8500, 12000, 8500, 8500],
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#2563eb'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: '#e2e8f0' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Chart 2: Policy Distribution (Doughnut Chart)
  const ctxPolicy = document.getElementById('policyDistributionChart')?.getContext('2d');
  if (ctxPolicy) {
    new Chart(ctxPolicy, {
      type: 'doughnut',
      data: {
        labels: ['Health Care', 'Life Shield', 'Vehicle Total', 'Home Protect'],
        datasets: [{
          data: [40, 30, 20, 10],
          backgroundColor: ['#2563eb', '#06b6d4', '#10b981', '#f59e0b'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        cutout: '70%'
      }
    });
  }

  // Chart 3: Claims Overview (Bar Chart)
  const ctxClaims = document.getElementById('claimsOverviewChart')?.getContext('2d');
  if (ctxClaims) {
    new Chart(ctxClaims, {
      type: 'bar',
      data: {
        labels: ['Health Claim', 'Motor Claim', 'Travel Claim'],
        datasets: [{
          label: 'Claim Amount (₹)',
          data: [45000, 18500, 8000],
          backgroundColor: ['#10b981', '#38bdf8', '#f59e0b'],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: '#e2e8f0' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Chart 4: Coverage Distribution (Pie Chart)
  const ctxCoverage = document.getElementById('coverageDistributionChart')?.getContext('2d');
  if (ctxCoverage) {
    new Chart(ctxCoverage, {
      type: 'pie',
      data: {
        labels: ['Health Coverage', 'Term Life', 'Vehicle Cover', 'Property'],
        datasets: [{
          data: [2500000, 3500000, 1000000, 500000],
          backgroundColor: ['#2563eb', '#06b6d4', '#10b981', '#38bdf8']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}

/* --------------------------------------------------------------------------
   4. TABLE SEARCH & STATUS FILTERING
   -------------------------------------------------------------------------- */
function initTableFilters() {
  const searchInput = document.querySelector('#policySearchInput');
  const statusFilter = document.querySelector('#policyStatusFilter');
  const tableRows = document.querySelectorAll('#policiesTableBody tr');

  if (!searchInput || tableRows.length === 0) return;

  const filterRows = () => {
    const query = searchInput.value.toLowerCase();
    const status = statusFilter ? statusFilter.value.toLowerCase() : 'all';

    tableRows.forEach(row => {
      const text = row.innerText.toLowerCase();
      const rowStatus = row.querySelector('.badge')?.innerText.toLowerCase() || '';

      const matchesSearch = text.includes(query);
      const matchesStatus = status === 'all' || rowStatus.includes(status);

      if (matchesSearch && matchesStatus) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  };

  searchInput.addEventListener('input', filterRows);
  if (statusFilter) statusFilter.addEventListener('change', filterRows);
}

/* --------------------------------------------------------------------------
   5. DEMO DOCUMENT DOWNLOADS
   -------------------------------------------------------------------------- */
function initDocumentDownloads() {
  const downloadBtns = document.querySelectorAll('.btn-download-doc');

  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const docTitle = btn.getAttribute('data-doc') || 'Insurance_Document';

      // Create a dummy text file blob download
      const content = `Stackly Insurance Official Document\nDocument Type: ${docTitle}\nGenerated: ${new Date().toLocaleString()}\nStatus: Verified & Signed.`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${docTitle.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (window.showToast) window.showToast(`Downloading ${docTitle}...`, 'success');
    });
  });
}

/* --------------------------------------------------------------------------
   6. RAISE A CLAIM MODAL HANDLER
   -------------------------------------------------------------------------- */
function initClaimModal() {
  const raiseBtns = document.querySelectorAll('.btn-raise-claim');
  let modalOverlay = document.querySelector('#claimModal');

  if (!modalOverlay && raiseBtns.length > 0) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'claimModal';
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>File an Insurance Claim</h3>
          <button class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <form id="claimSubmitForm">
            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="form-label">Select Policy</label>
              <select class="form-select" style="padding-left:1rem;" required>
                <option value="POL-8821">POL-8821 (Health Optimum)</option>
                <option value="POL-9932">POL-9932 (Life Term Shield)</option>
                <option value="POL-4412">POL-4412 (Comprehensive Car)</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="form-label">Estimated Claim Amount (₹)</label>
              <input type="number" class="form-input" style="padding-left:1rem;" placeholder="e.g. 25000" required>
            </div>
            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="form-label">Incident Date</label>
              <input type="date" class="form-input" style="padding-left:1rem;" required>
            </div>
            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="form-label">Claim Description</label>
              <textarea class="form-input" style="padding-left:1rem; height:80px;" placeholder="Provide brief details about the claim event..." required></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;">Submit Claim</button>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);
  }

  if (modalOverlay) {
    const closeModal = () => modalOverlay.classList.remove('active');
    const openModal = () => modalOverlay.classList.add('active');

    raiseBtns.forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    }));

    modalOverlay.querySelector('.modal-close')?.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    const form = modalOverlay.querySelector('#claimSubmitForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        closeModal();
        if (window.showToast) window.showToast('Claim submitted successfully! Track progress in your Claims tab.', 'success');
      });
    }
  }
}

/* --------------------------------------------------------------------------
   7. LOGOUT HANDLER
   -------------------------------------------------------------------------- */
function initLogout() {
  const logoutBtns = document.querySelectorAll('.btn-logout, [href="logout"]');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('stackly_is_logged_in');
      localStorage.removeItem('stackly_user_role');
      localStorage.removeItem('stackly_user_email');
      localStorage.removeItem('stackly_user_name');
      
      if (window.showToast) window.showToast('Logging out...', 'info');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 800);
    });
  });
}
