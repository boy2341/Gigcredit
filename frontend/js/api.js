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

    // offers
    getOffersForWorker: () => request('/offers/worker'),
    acceptOffer: (id) => request(`/offers/${id}/accept`, { method: 'POST' }),
    rejectOffer: (id) => request(`/offers/${id}/reject`, { method: 'POST' }),
    createOffer: (payload) => request('/offers', { method: 'POST', body: payload }),
    getOffersByLender: () => request('/offers/lender'),

    // loans
    getWorkerLoans: () => request('/loans/worker'),
    getLenderLoans: () => request('/loans/lender'),
    repayLoan: (id, amount) => request(`/loans/${id}/repay`, { method: 'POST', body: { amount } }),
  };
})();
