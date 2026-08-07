(() => {
  if (!GigCreditAPI.requireAuth('lender')) return;

  const $ = (id) => document.getElementById(id);
  const fmtMoney = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  let workersCache = [];

  async function loadDashboard() {
    try {
      const { dashboard } = await GigCreditAPI.getLenderDashboard();

      if ($('header-user-name')) $('header-user-name').textContent = dashboard.name || 'Bharat Gig Finance Ltd.';
      if ($('header-user-inst')) $('header-user-inst').textContent = dashboard.institutionName || 'Bharat Gig Finance Ltd.';
      if ($('sidebar-nbfc-no')) $('sidebar-nbfc-no').textContent = dashboard.nbfcLicenseNo || 'FIN-INST-03290';
      if (dashboard.avatarUrl && $('header-avatar')) $('header-avatar').src = dashboard.avatarUrl;

      if ($('kpi-capital')) $('kpi-capital').textContent = fmtMoney(dashboard.activePortfolioValue || 12500000);
      if ($('kpi-collection')) $('kpi-collection').textContent = `${dashboard.collectionRate || 99.6}%`;
      if ($('kpi-workers')) $('kpi-workers').textContent = `${dashboard.totalApplicants || 6} Workers`;

      loadDemoSwitcher();
    } catch (err) {
      GigCreditAPI.showToast(err.message || 'Error loading dashboard', 'error');
    }
  }

  async function loadWorkers(search = '') {
    const tbody = $('workers-table-body');
    if (!tbody) return;

    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      const { workers } = await GigCreditAPI.listWorkers(query);
      workersCache = workers;

      tbody.innerHTML = workers.length
        ? workers
            .map((w) => {
              const dailyEMI = w.microEMIDeductionRate || Math.ceil(((w.monthlyIncome * 3.5) / 360) * 1.03);
              return `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="py-3.5 px-3">
            <div class="flex items-center gap-3">
              <img src="${GigCreditAPI.escapeHtml(w.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80')}" class="w-9 h-9 rounded-full object-cover border border-slate-200"/>
              <div>
                <div class="font-bold text-on-surface font-headline">${GigCreditAPI.escapeHtml(w.name)}</div>
                <div class="text-[10px] text-slate-400 font-mono">${GigCreditAPI.escapeHtml(w.city || 'Delhi NCR')} • ${GigCreditAPI.escapeHtml(w.vehicleType || 'EV Scooter')}</div>
              </div>
            </div>
          </td>
          <td class="py-3.5 px-3 font-mono font-bold text-primary text-sm">${w.gigCreditScore}</td>
          <td class="py-3.5 px-3 font-mono font-semibold text-slate-800">${fmtMoney(w.monthlyIncome)}/mo</td>
          <td class="py-3.5 px-3">
            <span class="font-mono text-emerald-600 font-semibold text-[11px] block">+${w.underwritingMetrics?.multiAppIncomeVelocity || 14.8}% Velocity</span>
            <span class="text-[10px] text-slate-400 font-mono">${w.accountAggregatorConsent?.aaHandle || 'worker@finvu'}</span>
          </td>
          <td class="py-3.5 px-3 font-mono font-bold text-emerald-600">${fmtMoney(dailyEMI)} / day</td>
          <td class="py-3.5 px-3 text-right flex items-center justify-end gap-2">
            <button onclick="viewWorkerDetail('${w._id}')" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] px-3 py-1.5 rounded-lg transition-all">
              View Full Analysis
            </button>
            <button onclick="openOfferModalFor('${w._id}')" class="bg-emerald-700 text-white font-semibold text-[11px] px-3 py-1.5 rounded-lg hover:bg-emerald-800 transition-all shadow-sm">
              Send Offer
            </button>
          </td>
        </tr>`;
            })
            .join('')
        : '<tr><td colspan="6" class="py-4 text-center text-slate-400">No applicants match your search.</td></tr>';
    } catch (err) {
      GigCreditAPI.showToast(err.message, 'error');
    }
  }

  window.viewWorkerDetail = async (workerId) => {
    try {
      GigCreditAPI.showToast('Fetching full AA & SMS underwriting analysis...', 'info');
      const { worker } = await GigCreditAPI.getWorkerDetail(workerId);

      if ($('modal-worker-name')) $('modal-worker-name').textContent = `${worker.name} - Underwriting Report`;
      if ($('modal-score')) $('modal-score').textContent = worker.gigCreditScore;
      if ($('modal-income')) $('modal-income').textContent = fmtMoney(worker.monthlyIncome);

      const approvedLine = Math.round((worker.monthlyIncome * 3.5) / 1000) * 1000;
      const dailyEMI = worker.microEMIDeductionRate || Math.ceil((approvedLine / 360) * 1.03);

      if ($('modal-credit-line')) $('modal-credit-line').textContent = fmtMoney(approvedLine);
      if ($('modal-daily-emi')) $('modal-daily-emi').textContent = `${fmtMoney(dailyEMI)} / day`;

      if ($('modal-city-vehicle')) $('modal-city-vehicle').textContent = `${worker.city || 'Delhi NCR'} • ${worker.vehicleType || 'EV Scooter'}`;
      if ($('modal-upi')) $('modal-upi').textContent = worker.upiId || 'worker@okaxis';
      if ($('modal-pan')) $('modal-pan').textContent = `${worker.kycStatus?.panNumber || 'ABCDE1234F'} (Verified)`;
      if ($('modal-aadhaar')) $('modal-aadhaar').textContent = `•••• •••• ${worker.kycStatus?.aadhaarLast4 || '9920'}`;

      if ($('modal-aa-handle')) $('modal-aa-handle').textContent = worker.accountAggregatorConsent?.aaHandle || `${worker.email.split('@')[0]}@finvu`;
      if ($('modal-sms-sample')) $('modal-sms-sample').textContent = `Alert: Verified weekly payouts ingested via SMS into Escrow ${worker.escrowVirtualAccount?.accountId || 'ESCROW-9042-8819'}.`;

      // Render connected platforms
      const grid = $('modal-platforms-grid');
      if (grid) {
        grid.innerHTML = (worker.connectedPlatforms || [])
          .map(
            (p) => `
          <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-left">
            <span class="font-bold text-slate-800 text-xs block">${p.platform}</span>
            <span class="text-[11px] font-mono text-primary font-bold block">${fmtMoney(p.monthlyEarnings)}/mo</span>
            <span class="text-[10px] text-slate-500 font-mono">${p.rating.toFixed(1)}★ • ${p.cancellationRate}% Cancel</span>
          </div>`
          )
          .join('');
      }

      if ($('modal-dispatch-btn')) {
        $('modal-dispatch-btn').onclick = () => {
          closeWorkerDetailModal();
          openOfferModalFor(workerId);
        };
      }

      $('worker-detail-modal').classList.remove('hidden');
      $('worker-detail-modal').classList.add('flex');
    } catch (err) {
      GigCreditAPI.showToast(err.message || 'Error fetching worker analysis', 'error');
    }
  };

  window.closeWorkerDetailModal = () => {
    $('worker-detail-modal').classList.add('hidden');
    $('worker-detail-modal').classList.remove('flex');
  };

  async function loadLoans() {
    const container = $('lender-loans-container');
    if (!container) return;

    try {
      const { loans } = await GigCreditAPI.getLenderLoans();
      container.innerHTML = loans.length
        ? loans
            .map(
              (l) => `
        <div class="p-4 bg-white rounded-xl border border-slate-200 flex justify-between items-center text-xs">
          <div>
            <span class="font-bold font-headline text-on-surface block">${GigCreditAPI.escapeHtml(l.title)}</span>
            <span class="text-slate-500">Borrower: ${GigCreditAPI.escapeHtml(l.worker ? l.worker.name : 'Ramesh Kumar')} • GigScore: ${l.worker ? l.worker.gigCreditScore : 843}</span>
          </div>
          <div class="text-right font-mono">
            <span class="font-bold text-emerald-600 block">${fmtMoney(l.outstandingBalance)} left</span>
            <span class="text-slate-400 capitalize">${l.status}</span>
          </div>
        </div>`
            )
            .join('')
        : '<p class="text-xs text-slate-400 p-3 bg-slate-50 rounded-xl">No active portfolio loans yet. Dispatch an offer from the table above.</p>';
    } catch (err) {
      container.innerHTML = '<p class="text-xs text-slate-400">Could not load portfolio loans.</p>';
    }
  }

  window.openOfferModal = () => openOfferModalFor(workersCache[0]?._id);
  window.openOfferModalFor = (workerId) => {
    const select = $('offer-worker-select');
    if (select) {
      select.innerHTML = workersCache
        .map((w) => `<option value="${w._id}" ${w._id === workerId ? 'selected' : ''}>${GigCreditAPI.escapeHtml(w.name)} (Score ${w.gigCreditScore})</option>`)
        .join('');
    }
    $('offer-modal').classList.remove('hidden');
    $('offer-modal').classList.add('flex');
  };

  window.closeOfferModal = () => {
    $('offer-modal').classList.add('hidden');
    $('offer-modal').classList.remove('flex');
  };

  window.submitOffer = async () => {
    const workerId = $('offer-worker-select').value;
    const title = $('offer-title').value.trim();
    const amount = Number($('offer-amount').value);
    const interestRate = Number($('offer-rate').value);
    const tenureMonths = Number($('offer-tenure').value);

    if (!workerId || !title || !amount || !interestRate || !tenureMonths) {
      GigCreditAPI.showToast('Please complete all offer fields.', 'error');
      return;
    }

    try {
      await GigCreditAPI.createOffer({ workerId, title, amount, interestRate, tenureMonths });
      GigCreditAPI.showToast(`Custom loan offer of ${fmtMoney(amount)} dispatched to worker!`, 'success');
      closeOfferModal();
      loadDashboard();
      loadLoans();
    } catch (err) {
      GigCreditAPI.showToast(err.message, 'error');
    }
  };

  window.loadDemoSwitcher = async () => {
    try {
      const data = await GigCreditAPI.getDemoAccounts();
      const list = $('switcher-items-list');
      if (!list) return;
      list.innerHTML = '';

      (data.workers || []).forEach((w) => {
        const item = document.createElement('div');
        item.className = 'profile-item-row text-xs font-semibold text-slate-700';
        item.onclick = async () => {
          const res = await GigCreditAPI.switchDemoAccount(w.id, 'worker');
          GigCreditAPI.saveSession(res.token, res.role, res.user);
          window.location.href = 'worker.html';
        };
        item.innerHTML = `
          <img src="${GigCreditAPI.escapeHtml(w.avatarUrl)}" class="w-6 h-6 rounded-full object-cover"/>
          <span>${GigCreditAPI.escapeHtml(w.name)} (${w.gigCreditScore})</span>`;
        list.appendChild(item);
      });

      (data.lenders || []).forEach((l) => {
        const item = document.createElement('div');
        item.className = 'profile-item-row text-xs font-semibold text-emerald-700';
        item.onclick = async () => {
          const res = await GigCreditAPI.switchDemoAccount(l.id, 'lender');
          GigCreditAPI.saveSession(res.token, res.role, res.user);
          window.location.reload();
        };
        item.innerHTML = `
          <img src="${GigCreditAPI.escapeHtml(l.avatarUrl)}" class="w-6 h-6 rounded-full object-cover"/>
          <span>${GigCreditAPI.escapeHtml(l.name)}</span>`;
        list.appendChild(item);
      });
    } catch (err) {
      console.log('Error loading demo switcher:', err);
    }
  };

  let searchTimer;
  if ($('worker-search')) {
    $('worker-search').addEventListener('input', (e) => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => loadWorkers(e.target.value.trim()), 300);
    });
  }

  $('logout-btn').addEventListener('click', () => {
    GigCreditAPI.logout();
    window.location.href = 'login.html';
  });

  window.filterLenderMarketplace = () => {
    const query = ($('lender-search-input')?.value || '').trim();
    loadWorkers(query);
  };

  loadDashboard();
  loadWorkers();
  loadLoans();
})();
