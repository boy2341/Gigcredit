(() => {
  if (!GigCreditAPI.requireAuth('worker')) return; // redirects if not logged in as worker

  const $ = (id) => document.getElementById(id);
  const fmtMoney = (n) => `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  const ALL_PLATFORMS = ['Swiggy', 'Uber', 'Blinkit', 'Rapido', 'Zepto', 'Amazon Flex', 'Porter'];

  function showStatus(message, isError = true) {
    const banner = $('status-banner');
    if (!message) {
      banner.classList.add('hidden');
      return;
    }
    banner.textContent = message;
    banner.classList.toggle('bg-error-container', isError);
    banner.classList.toggle('text-on-error-container', isError);
    banner.classList.remove('hidden');
  }

  async function loadDashboard() {
    try {
      const { dashboard } = await GigCreditAPI.getWorkerDashboard();
      showStatus('');

      $('welcome-message').textContent = `Welcome back, ${dashboard.name.split(' ')[0]}. Your financial health is ${dashboard.riskTier === 'Low Risk' ? 'strong' : dashboard.riskTier === 'Medium Risk' ? 'building' : 'just getting started'}.`;
      $('sidebar-score').textContent = dashboard.gigCreditScore;

      $('score-value').textContent = dashboard.gigCreditScore;
      $('score-delta').textContent = `+${dashboard.scoreDelta} pts`;
      const pct = Math.min(Math.max(((dashboard.gigCreditScore - 300) / 600) * 100, 2), 100);
      $('score-bar').style.width = `${pct}%`;

      $('income-value').textContent = fmtMoney(dashboard.monthlyIncome);
      $('eligibility-value').textContent = fmtMoney(dashboard.loanEligibility);
      $('eligibility-sub').textContent = dashboard.loanOffers.length ? `${dashboard.loanOffers.length} pre-approved offers available` : 'Connect a platform to unlock offers';

      $('risk-value').textContent = dashboard.riskTier;
      $('risk-sub').textContent = dashboard.riskTier === 'Low Risk' ? 'Prime Tier Borrower' : dashboard.riskTier === 'Medium Risk' ? 'Standard Tier Borrower' : 'Building Credit History';

      $('wallet-balance').textContent = fmtMoney(dashboard.walletBalance);
      $('bank-status').textContent = dashboard.bankConnected ? 'Bank account linked' : 'No bank account linked yet';

      renderPlatforms(dashboard.connectedPlatforms);
      renderOffers(dashboard.loanOffers);
      renderActiveLoans(dashboard.activeLoans);
      loadTransactions();
    } catch (err) {
      showStatus(err.message);
    }
  }

  function renderPlatforms(connected) {
    const connectedNames = connected.map((p) => p.platform);
    const listEl = $('connected-platforms-list');

    listEl.innerHTML = connected.length
      ? connected
          .map(
            (p) => `
        <div class="border border-outline-variant rounded-lg p-sm flex items-center justify-between">
          <div>
            <p class="font-body-md text-body-md font-bold text-on-surface">${p.platform}</p>
            <p class="font-label-md text-label-md text-on-surface-variant">${fmtMoney(p.monthlyEarnings)}/mo &middot; ${p.rating.toFixed(1)}&#9733; &middot; ${p.completedJobs} jobs</p>
          </div>
          <span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
        </div>`
          )
          .join('')
      : '<p class="font-body-md text-body-md text-on-surface-variant">No platforms connected yet. Connect one below to start building your score.</p>';

    const availableEl = $('available-platforms-list');
    const remaining = ALL_PLATFORMS.filter((p) => !connectedNames.includes(p));
    availableEl.innerHTML = remaining.length
      ? remaining
          .map(
            (p) => `<button class="platform-connect-btn border border-outline-variant text-on-surface font-label-md text-label-md rounded-full px-md py-xs hover:border-primary hover:text-primary transition-colors" data-platform="${p}">+ ${p}</button>`
          )
          .join('')
      : '<p class="font-label-md text-label-md text-on-surface-variant">All supported platforms connected.</p>';

    availableEl.querySelectorAll('.platform-connect-btn').forEach((btn) => {
      btn.addEventListener('click', () => connectPlatform(btn.dataset.platform, btn));
    });
  }

  async function connectPlatform(platform, btn) {
    btn.disabled = true;
    btn.textContent = 'Connecting...';
    try {
      await GigCreditAPI.connectPlatform(platform);
      await loadDashboard();
    } catch (err) {
      showStatus(err.message);
      btn.disabled = false;
      btn.textContent = `+ ${platform}`;
    }
  }

  function renderOffers(offers) {
    const el = $('loan-offers-list');
    const available = offers.filter((o) => o.status === 'available');

    el.innerHTML = available.length
      ? available
          .map(
            (o) => `
        <div class="border border-outline-variant rounded-lg p-md flex flex-col gap-sm">
          <p class="font-body-lg text-body-lg font-bold text-on-surface">${o.title}</p>
          <p class="font-headline-md text-headline-md text-primary font-data-mono">${fmtMoney(o.amount)}</p>
          <p class="font-label-md text-label-md text-on-surface-variant">${o.interestRate}% APR &middot; ${o.tenureMonths} mo</p>
          <div class="flex gap-xs mt-xs">
            <button class="offer-accept-btn flex-1 bg-secondary text-on-secondary font-label-md text-label-md rounded-md py-xs hover:opacity-90 transition-opacity" data-id="${o._id}">Apply Now</button>
            <button class="offer-reject-btn border border-outline-variant text-on-surface-variant font-label-md text-label-md rounded-md py-xs px-sm hover:border-error hover:text-error transition-colors" data-id="${o._id}">Skip</button>
          </div>
        </div>`
          )
          .join('')
      : '<p class="font-body-md text-body-md text-on-surface-variant">No loan offers available yet. Connect a gig platform to unlock pre-approved offers.</p>';

    el.querySelectorAll('.offer-accept-btn').forEach((btn) => btn.addEventListener('click', () => respondToOffer(btn.dataset.id, 'accept', btn)));
    el.querySelectorAll('.offer-reject-btn').forEach((btn) => btn.addEventListener('click', () => respondToOffer(btn.dataset.id, 'reject', btn)));
  }

  async function respondToOffer(id, action, btn) {
    btn.disabled = true;
    try {
      if (action === 'accept') await GigCreditAPI.acceptOffer(id);
      else await GigCreditAPI.rejectOffer(id);
      await loadDashboard();
    } catch (err) {
      showStatus(err.message);
      btn.disabled = false;
    }
  }

  function renderActiveLoans(loans) {
    const el = $('active-loans-list');
    el.innerHTML = loans.length
      ? loans
          .map(
            (l) => `
        <div class="border border-outline-variant rounded-lg p-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sm">
          <div>
            <p class="font-body-lg text-body-lg font-bold text-on-surface">${l.title}</p>
            <p class="font-label-md text-label-md text-on-surface-variant">Lender: ${l.lender ? (l.lender.institutionName || l.lender.name) : 'GigCredit Capital'} &middot; EMI ${fmtMoney(l.monthlyEMI)}/mo</p>
          </div>
          <div class="flex items-center gap-md">
            <div class="text-right">
              <p class="font-data-mono text-data-mono text-on-surface">${fmtMoney(l.outstandingBalance)} left</p>
              <p class="font-label-md text-label-md text-on-surface-variant">of ${fmtMoney(l.principal)}</p>
            </div>
            <button class="repay-btn bg-primary text-on-primary font-label-md text-label-md rounded-md px-md py-xs hover:opacity-90 transition-opacity" data-id="${l._id}" data-emi="${l.monthlyEMI}">Pay EMI</button>
          </div>
        </div>`
          )
          .join('')
      : '<p class="font-body-md text-body-md text-on-surface-variant">No active loans. Accept an offer above to get started.</p>';

    el.querySelectorAll('.repay-btn').forEach((btn) => btn.addEventListener('click', () => repay(btn.dataset.id, btn)));
  }

  async function repay(loanId, btn) {
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = 'Processing...';
    try {
      await GigCreditAPI.repayLoan(loanId, Number(btn.dataset.emi));
      await loadDashboard();
    } catch (err) {
      showStatus(err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  }

  async function loadTransactions() {
    try {
      const { transactions } = await GigCreditAPI.getTransactions();
      const el = $('transactions-list');
      el.innerHTML = transactions.length
        ? transactions
            .slice(0, 6)
            .map(
              (t) => `
          <li class="flex items-center justify-between font-body-md text-body-md">
            <span class="text-on-surface-variant">${t.description}</span>
            <span class="font-data-mono ${t.type === 'credit' ? 'text-secondary' : 'text-error'}">${t.type === 'credit' ? '+' : '-'}${fmtMoney(t.amount)}</span>
          </li>`
            )
            .join('')
        : '<li class="font-body-md text-body-md text-on-surface-variant">No transactions yet.</li>';
    } catch (err) {
      // non-fatal
      $('transactions-list').innerHTML = '<li class="font-body-md text-body-md text-on-surface-variant">Could not load transactions.</li>';
    }
  }

  async function promptAmount(actionLabel, apiFn) {
    const amount = window.prompt(`${actionLabel} amount ($):`);
    if (!amount) return;
    const num = Number(amount);
    if (!num || num <= 0) {
      showStatus('Please enter a valid positive amount.');
      return;
    }
    try {
      await apiFn(num);
      await loadDashboard();
    } catch (err) {
      showStatus(err.message);
    }
  }

  $('add-money-btn').addEventListener('click', () => promptAmount('Add money', GigCreditAPI.addMoney));
  $('withdraw-btn').addEventListener('click', () => promptAmount('Withdraw', GigCreditAPI.withdraw));
  $('logout-link').addEventListener('click', () => {
    GigCreditAPI.logout();
    window.location.href = 'login.html';
  });

  loadDashboard();
})();
