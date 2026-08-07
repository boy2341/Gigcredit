/**
 * GigCredit frontend API client.
 * Handles token storage and talks to the Express backend.
 * Include this on every page BEFORE your page-specific script.
 */
const GigCreditAPI = (() => {
  // Defaults to same-origin '/api', which works out of the box since Express
  // serves this frontend folder directly. Override by setting
  // window.GIGCREDIT_API_BASE before this script loads if you host the
  // frontend somewhere else (e.g. a separate static server).
  const BASE_URL = window.GIGCREDIT_API_BASE || '/api';

  const TOKEN_KEY = 'gc_token';
  const ROLE_KEY = 'gc_role';
  const USER_KEY = 'gc_user';

  function saveSession(token, role, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem(USER_KEY, JSON.stringify(user || {}));
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_KEY);
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function getRole() {
    return localStorage.getItem(ROLE_KEY);
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || '{}');
    } catch {
      return {};
    }
  }

  function isLoggedIn() {
    return !!getToken();
  }

  /**
   * Escapes a value for safe insertion into innerHTML. Always use this when
   * interpolating user-supplied strings (worker/lender names, offer titles,
   * etc.) into template literals — never insert them raw.
   */
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[ch]));
  }

  /** Redirects to login.html if there's no token, or to the wrong dashboard if the role doesn't match */
  function requireAuth(expectedRole) {
    if (!isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    if (expectedRole && getRole() !== expectedRole) {
      window.location.href = getRole() === 'lender' ? 'lender.html' : 'worker.html';
      return false;
    }
    return true;
  }

  async function request(path, { method = 'GET', body, auth = true } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
      const token = getToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    let res;
    try {
      res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (networkErr) {
      throw new Error('Could not reach the GigCredit API. Is the backend server running?');
    }

    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      throw new Error(data.message || `Request failed (${res.status})`);
    }
    return data;
  }

  return {
    // auth
    register: (payload) => request('/auth/register', { method: 'POST', body: payload, auth: false }),
    login: (payload) => request('/auth/login', { method: 'POST', body: payload, auth: false }),
    me: () => request('/auth/me'),
    logout: () => clearSession(),
    saveSession,
    clearSession,
    getToken,
    getRole,
    getUser,
    isLoggedIn,
    requireAuth,
    escapeHtml,

    // worker
    getWorkerProfile: () => request('/workers/me'),
    updateWorkerProfile: (payload) => request('/workers/me', { method: 'PUT', body: payload }),
    listPlatforms: () => request('/workers/platforms'),
    connectPlatform: (platform) => request('/workers/platforms/connect', { method: 'POST', body: { platform } }),
    disconnectPlatform: (platform) => request(`/workers/platforms/${encodeURIComponent(platform)}`, { method: 'DELETE' }),
    connectBank: (payload) => request('/workers/bank/connect', { method: 'POST', body: payload }),

    // lender
    getLenderProfile: () => request('/lenders/me'),
    listWorkers: (query = '') => request(`/lenders/workers${query}`),
    getWorkerDetail: (id) => request(`/lenders/workers/${id}`),

    // dashboard
    getWorkerDashboard: () => request('/dashboard/worker'),
    getLenderDashboard: () => request('/dashboard/lender'),

    // gig score
    getMyScore: () => request('/gigscore/me'),
    recalculateScore: () => request('/gigscore/recalculate', { method: 'POST' }),

    // wallet
    getWallet: () => request('/wallet/me'),
    getTransactions: () => request('/wallet/transactions'),
    addMoney: (amount) => request('/wallet/add-money', { method: 'POST', body: { amount } }),
    withdraw: (amount) => request('/wallet/withdraw', { method: 'POST', body: { amount } }),

    // 9-step Workflow & Indian AA Additions
    fmtRupee: (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
    getDemoAccounts: () => request('/auth/demo-accounts', { auth: false }),
    switchDemoAccount: (id, role) => request('/auth/switch-demo', { method: 'POST', body: { id, role }, auth: false }),
    workerOTPLogin: (payload) => request('/auth/worker-otp-login', { method: 'POST', body: payload, auth: false }),
    verifyAadhaarOTP: (payload) => request('/workers/verify-aadhaar-otp', { method: 'POST', body: payload }),
    fetchAAData: (aaHandle) => request('/workers/aa/fetch', { method: 'POST', body: { aaHandle } }),
    underwriteFullAnalysis: (payload) => request('/workers/underwrite-full-analysis', { method: 'POST', body: payload }),
    simulatePayout: (amount = 1500, platformName = 'Swiggy') => request('/wallet/simulate-payout', { method: 'POST', body: { amount, platformName } }),
    parseSMS: (smsBody) => request('/wallet/parse-sms', { method: 'POST', body: { smsBody } }),
    requestBids: () => request('/offers/request-bids', { method: 'POST' }),

    // Global Toast Notification System
    showToast: (message, type = 'info') => {
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = `toast-message ${type}`;
      const icon = type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info';
      toast.innerHTML = `<span class="material-symbols-outlined text-[20px] ${type === 'success' ? 'text-emerald-600' : 'text-primary'}">${icon}</span> <span>${escapeHtml(message)}</span>`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    },
  };
})();
