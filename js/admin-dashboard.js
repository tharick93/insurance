/* ==========================================================================
   STACKLY INSURANCE - ADMIN DASHBOARD JAVASCRIPT
   Analytics Charts, Customer Search/Filter, Claim Approval/Rejection, Reports
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  initAdminSidebar();
  initAdminCharts();
  initCustomerManagement();
  initClaimManagement();
  initReportsModal();
  initAdminLogout();
});

/* --------------------------------------------------------------------------
   1. ADMIN AUTHENTICATION GUARD
   -------------------------------------------------------------------------- */
function checkAdminAuth() {
  const isLoggedIn = localStorage.getItem('stackly_is_logged_in');
  const role = localStorage.getItem('stackly_user_role');

  if (!isLoggedIn || isLoggedIn !== 'true' || role !== 'admin') {
    if (window.showToast) window.showToast('Admin access required. Please login as Admin.', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
    return;
  }
}

/* --------------------------------------------------------------------------
   2. SIDEBAR RESPONSIVE TOGGLE
   -------------------------------------------------------------------------- */
function initAdminSidebar() {
  const sidebar = document.querySelector('.dashboard-sidebar');
  const toggleBtn = document.querySelector('.topbar-toggle');
  
  if (!sidebar) return;

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
}

/* --------------------------------------------------------------------------
   3. ADMIN ANALYTICS CHARTS (CHART.JS)
   -------------------------------------------------------------------------- */
function initAdminCharts() {
  if (typeof Chart === 'undefined') return;

  // Chart 1: Revenue Line Chart
  const ctxRevenue = document.getElementById('adminRevenueChart')?.getContext('2d');
  if (ctxRevenue) {
    new Chart(ctxRevenue, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{
          label: 'Premium Revenue (₹ Cr)',
          data: [35, 42, 48, 55, 62, 70, 78, 85, 92, 105],
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#2563eb'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { grid: { color: '#e2e8f0' } }, x: { grid: { display: false } } }
      }
    });
  }

  // Chart 2: Customer Growth Line Chart
  const ctxGrowth = document.getElementById('customerGrowthChart')?.getContext('2d');
  if (ctxGrowth) {
    new Chart(ctxGrowth, {
      type: 'line',
      data: {
        labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026'],
        datasets: [{
          label: 'Total Customers',
          data: [12000, 15500, 18200, 21000, 23400, 24800, 26500],
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { grid: { color: '#e2e8f0' } }, x: { grid: { display: false } } }
      }
    });
  }

  // Chart 3: Policy Distribution Doughnut
  const ctxPolicyDist = document.getElementById('adminPolicyDistChart')?.getContext('2d');
  if (ctxPolicyDist) {
    new Chart(ctxPolicyDist, {
      type: 'doughnut',
      data: {
        labels: ['Health', 'Life', 'Vehicle', 'Home', 'Travel', 'Business'],
        datasets: [{
          data: [35, 25, 20, 10, 5, 5],
          backgroundColor: ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#38bdf8', '#8b5cf6']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right' } },
        cutout: '65%'
      }
    });
  }

  // Chart 4: Claims Analytics Grouped Bar Chart
  const ctxClaimsAnalytics = document.getElementById('claimsAnalyticsChart')?.getContext('2d');
  if (ctxClaimsAnalytics) {
    new Chart(ctxClaimsAnalytics, {
      type: 'bar',
      data: {
        labels: ['Health', 'Life', 'Vehicle', 'Home', 'Business'],
        datasets: [
          { label: 'Approved', data: [450, 120, 310, 85, 45], backgroundColor: '#10b981' },
          { label: 'Pending', data: [35, 12, 25, 8, 4], backgroundColor: '#f59e0b' },
          { label: 'Rejected', data: [15, 4, 18, 3, 2], backgroundColor: '#ef4444' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { grid: { color: '#e2e8f0' } }, x: { grid: { display: false } } }
      }
    });
  }

  // Chart 5: Revenue by Insurance Type
  const ctxRevenueType = document.getElementById('revenueByTypeChart')?.getContext('2d');
  if (ctxRevenueType) {
    new Chart(ctxRevenueType, {
      type: 'bar',
      data: {
        labels: ['Health', 'Life', 'Vehicle', 'Home', 'Business'],
        datasets: [{
          label: 'Revenue (₹ Lakhs)',
          data: [240, 180, 130, 75, 95],
          backgroundColor: '#2563eb',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { grid: { color: '#e2e8f0' } }, x: { grid: { display: false } } }
      }
    });
  }
}

/* --------------------------------------------------------------------------
   4. CUSTOMER MANAGEMENT (SEARCH, FILTER & DELETE)
   -------------------------------------------------------------------------- */
function initCustomerManagement() {
  const searchInput = document.querySelector('#adminCustomerSearch');
  const policyFilter = document.querySelector('#adminPolicyFilter');
  const rows = document.querySelectorAll('#customerTableBody tr');

  if (!rows.length) return;

  const filterCustomers = () => {
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    const policyVal = policyFilter ? policyFilter.value.toLowerCase() : 'all';

    rows.forEach(row => {
      const text = row.innerText.toLowerCase();
      const policyCell = row.children[4]?.innerText.toLowerCase() || '';

      const matchesSearch = text.includes(query);
      const matchesPolicy = policyVal === 'all' || policyCell.includes(policyVal);

      row.style.display = matchesSearch && matchesPolicy ? '' : 'none';
    });
  };

  if (searchInput) searchInput.addEventListener('input', filterCustomers);
  if (policyFilter) policyFilter.addEventListener('change', filterCustomers);

  // Delegate Action Buttons
  document.querySelector('#customerTableBody')?.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.btn-delete-cust');
    const viewBtn = e.target.closest('.btn-view-cust');

    if (deleteBtn) {
      const row = deleteBtn.closest('tr');
      const custName = row.children[1].innerText;
      if (confirm(`Are you sure you want to remove customer "${custName}"?`)) {
        row.remove();
        if (window.showToast) window.showToast(`Customer ${custName} removed.`, 'info');
      }
    }

    if (viewBtn) {
      const row = viewBtn.closest('tr');
      const custName = row.children[1].innerText;
      const custEmail = row.children[2].innerText;
      alert(`Customer Details:\n\nName: ${custName}\nEmail: ${custEmail}\nStatus: Active Customer`);
    }
  });
}

/* --------------------------------------------------------------------------
   5. CLAIM MANAGEMENT (DYNAMIC APPROVE & REJECT)
   -------------------------------------------------------------------------- */
function initClaimManagement() {
  const claimsTable = document.querySelector('#adminClaimsTableBody');
  if (!claimsTable) return;

  claimsTable.addEventListener('click', (e) => {
    const approveBtn = e.target.closest('.btn-approve-claim');
    const rejectBtn = e.target.closest('.btn-reject-claim');

    if (approveBtn) {
      const row = approveBtn.closest('tr');
      const claimId = row.children[0].innerText;
      const statusBadge = row.querySelector('.badge');
      
      if (statusBadge) {
        statusBadge.className = 'badge badge-approved';
        statusBadge.innerHTML = '<i class="fa-solid fa-check"></i> Approved';
      }

      approveBtn.style.display = 'none';
      const reject = row.querySelector('.btn-reject-claim');
      if (reject) reject.style.display = 'none';

      updateClaimMetrics(-1, 1); // Decrement pending, increment approved
      if (window.showToast) window.showToast(`Claim ${claimId} approved successfully!`, 'success');
    }

    if (rejectBtn) {
      const row = rejectBtn.closest('tr');
      const claimId = row.children[0].innerText;
      const statusBadge = row.querySelector('.badge');

      if (statusBadge) {
        statusBadge.className = 'badge badge-rejected';
        statusBadge.innerHTML = '<i class="fa-solid fa-xmark"></i> Rejected';
      }

      rejectBtn.style.display = 'none';
      const approve = row.querySelector('.btn-approve-claim');
      if (approve) approve.style.display = 'none';

      updateClaimMetrics(-1, 0); // Decrement pending
      if (window.showToast) window.showToast(`Claim ${claimId} rejected.`, 'warning');
    }
  });
}

function updateClaimMetrics(pendingDelta, approvedDelta) {
  const pendingEl = document.querySelector('#kpiPendingClaims');
  const approvedEl = document.querySelector('#kpiApprovedClaims');

  if (pendingEl) {
    let current = parseInt(pendingEl.innerText) || 0;
    pendingEl.innerText = Math.max(0, current + pendingDelta);
  }

  if (approvedEl && approvedDelta !== 0) {
    let current = parseInt(approvedEl.innerText) || 0;
    approvedEl.innerText = Math.max(0, current + approvedDelta);
  }
}

/* --------------------------------------------------------------------------
   6. REPORT GENERATION MODAL
   -------------------------------------------------------------------------- */
function initReportsModal() {
  const genReportBtns = document.querySelectorAll('.btn-gen-report');

  genReportBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const reportType = btn.getAttribute('data-report') || 'Monthly Performance';

      const content = `STACKLY INSURANCE SYSTEM REPORT\nReport Title: ${reportType}\nGenerated On: ${new Date().toLocaleString()}\nAuthor: System Administrator\n\nSummary:\n- Total Active Policies: 4,850\n- Monthly Gross Premium: ₹4,85,00,000\n- Total Claims Processed: 142\n- Claim Approval Ratio: 98.2%\n- Customer Retention Rate: 94.5%`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `Stackly_${reportType.replace(/\s+/g, '_')}_Report.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (window.showToast) window.showToast(`Report "${reportType}" generated & downloaded!`, 'success');
    });
  });
}

/* --------------------------------------------------------------------------
   7. ADMIN LOGOUT HANDLER
   -------------------------------------------------------------------------- */
function initAdminLogout() {
  const logoutBtns = document.querySelectorAll('.btn-admin-logout');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('stackly_is_logged_in');
      localStorage.removeItem('stackly_user_role');
      localStorage.removeItem('stackly_user_email');
      
      if (window.showToast) window.showToast('Logging out from Admin panel...', 'info');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 800);
    });
  });
}
