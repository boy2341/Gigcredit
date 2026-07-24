(() => {
  if (!GigCreditAPI.requireAuth('lender')) return;

  const $ = (id) => document.getElementById(id);
  const fmtMoney = (n) => `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  let workersCache = [];

  function showStatus(message) {
    const banner = $('status-banner');
    if (!message) {
      banner.classList.add('hidden');
      return;
    }
    banner.textContent = message;
    banner.classList.remove('hidden');
  }

  async function loadDashboard() {
    try {
      const { dashboard } = await GigCreditAPI.getLenderDashboard();
      showStatus('');

      $('sidebar-institution').textContent = dashboard.institutionName || 'Lender Portal';
      $('sidebar-portfolio').textContent = `Active Portfolio: ${fmtMoney(dashboard.activePortfolioValue)}`;
      $('lender-welcome').textContent = `Welcome back. Here is the latest on your lending portfolio.`;

      $('kpi-applicants').textContent = dashboard.totalApplicants.toLocaleString();
      $('kpi-money-lent').textContent = fmtMoney(dashboard.moneyLent);
      $('kpi-active-loans').textContent = dashboard.activeLoansCount;
      $('kpi-outstanding').textContent = `${fmtMoney(dashboard.totalOutstanding)} outstanding`;
      $('kpi-collection-rate').textContent = `${dashboard.collectionRate}%`;
    } catch (err) {
      showStatus(err.message);
    }
  }

  async function loadWorkers(search = '') {
    const tbody = $('workers-table-body');
    tbody.innerHTML = '<tr><td class="py-md px-sm font-body-md text-body-md text-on-surface-variant" colspan="6">Loading applicants...</td></tr>';
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      const { workers } = await GigCreditAPI.listWorkers(query);
      workersCache = workers;

      tbody.innerHTML = workers.length
        ? workers
            .map(
              (w) => `
        <tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
          <td class="py-sm px-sm font-body-md text-body-md text-on-surface">
            <div class="font-bold">${w.name}</div>
            <div class="font-label-md text-label-md text-on-surface-variant">${w.email}</div>
          </td>
          <td class="py-sm px-sm font-data-mono text-data-mono text-primary">${w.gigCreditScore}</td>
          <td class="py-sm px-sm font-data-mono text-data-mono text-on-surface">${fmtMoney(w.monthlyIncome)}</td>
          <td class="py-sm px-sm font-data-mono text-data-mono text-on-surface">${fmtMoney(w.loanEligibility)}</td>
          <td class="py-sm px-sm">
            <span class="font-label-md text-label-md px-sm py-xs rounded-full ${riskBadgeClasses(w.riskTier)}">${w.riskTier}</span>
          </td>
          <td class="py-sm px-sm text-right">
            <button class="make-offer-btn bg-primary text-on-primary font-label-md text-label-md rounded-md px-md py-xs hover:opacity-90 transition-opacity" data-id="${w._id}" data-name="${w.name}">Make Offer</button>
          </td>
        </tr>`
            )
            .join('')
        : '<tr><td class="py-md px-sm font-body-md text-body-md text-on-surface-variant" colspan="6">No applicants match your search.</td></tr>';

      tbody.querySelectorAll('.make-offer-btn').forEach((btn) =>
        btn.addEventListener('click', () => openOfferModal(btn.dataset.id, btn.dataset.name))
      );
    } catch (err) {
      showStatus(err.message);
    }
  }

  function riskBadgeClasses(tier) {
    if (tier === 'Low Risk') return 'bg-secondary-container text-on-secondary-container';
    if (tier === 'Medium Risk') return 'bg-tertiary-fixed text-on-tertiary-fixed-variant';
    return 'bg-error-container text-on-error-container';
  }

  async function loadLoans() {
    const el = $('lender-loans-list');
    try {
      const { loans } = await GigCreditAPI.getLenderLoans();
      el.innerHTML = loans.length
        ? loans
            .map(
              (l) => `
        <div class="border border-outline-variant rounded-lg p-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sm">
          <div>
            <p class="font-body-lg text-body-lg font-bold text-on-surface">${l.title}</p>
            <p class="font-label-md text-label-md text-on-surface-variant">Borrower: ${l.worker ? l.worker.name : 'Unknown'} &middot; Score ${l.worker ? l.worker.gigCreditScore : '--'}</p>
          </div>
          <div class="text-right">
            <p class="font-data-mono text-data-mono text-on-surface">${fmtMoney(l.outstandingBalance)} outstanding</p>
            <p class="font-label-md text-label-md text-on-surface-variant capitalize">${l.status}</p>
          </div>
        </div>`
            )
            .join('')
        : '<p class="font-body-md text-body-md text-on-surface-variant">No loans issued yet. Make an offer from the marketplace above to get started.</p>';
    } catch (err) {
      el.innerHTML = '<p class="font-body-md text-body-md text-on-surface-variant">Could not load your loan portfolio.</p>';
    }
  }

  // --- Offer modal ---
  function openOfferModal(workerId, workerName) {
    const select = $('offer-worker-select');
    select.innerHTML = workersCache
      .map((w) => `<option value="${w._id}" ${w._id === workerId ? 'selected' : ''}>${w.name} (Score ${w.gigCreditScore})</option>`)
      .join('');
    $('offer-title').value = '';
    $('offer-amount').value = '';
    $('offer-rate').value = '';
    $('offer-tenure').value = '';
    setModalError('');
    $('offer-modal').classList.remove('hidden');
  }

  function closeOfferModal() {
    $('offer-modal').classList.add('hidden');
  }

  function setModalError(message) {
    const el = $('offer-modal-error');
    el.textContent = message;
    el.classList.toggle('hidden', !message);
  }

  async function submitOffer() {
    const workerId = $('offer-worker-select').value;
    const title = $('offer-title').value.trim();
    const amount = Number($('offer-amount').value);
    const interestRate = Number($('offer-rate').value);
    const tenureMonths = Number($('offer-tenure').value);

    if (!workerId || !title || !amount || !interestRate || !tenureMonths) {
      setModalError('Please fill in every field.');
      return;
    }

    const btn = $('offer-submit');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    try {
      await GigCreditAPI.createOffer({ workerId, title, amount, interestRate, tenureMonths });
      closeOfferModal();
      await loadDashboard();
      await loadLoans();
    } catch (err) {
      setModalError(err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Offer';
    }
  }

  $('new-investment-btn').addEventListener('click', () => openOfferModal(workersCache[0] ? workersCache[0]._id : '', ''));
  $('offer-modal-close').addEventListener('click', closeOfferModal);
  $('offer-submit').addEventListener('click', submitOffer);

  $('export-btn').addEventListener('click', () => {
    if (!workersCache.length) return;
    const rows = [['Name', 'Email', 'GigCredit Score', 'Monthly Income', 'Eligibility', 'Risk Tier']];
    workersCache.forEach((w) => rows.push([w.name, w.email, w.gigCreditScore, w.monthlyIncome, w.loanEligibility, w.riskTier]));
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gigcredit-applicants.csv';
    a.click();
  });

  let searchTimer;
  $('worker-search').addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => loadWorkers(e.target.value.trim()), 300);
  });

  $('logout-btn').addEventListener('click', () => {
    GigCreditAPI.logout();
    window.location.href = 'login.html';
  });

  loadDashboard();
  loadWorkers();
  loadLoans();
})();
