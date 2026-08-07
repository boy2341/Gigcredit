/**
 * ============================================================================
 * GigCredit - Advanced AI Copilot Chatbot & Financial Identity Client Manager
 * ============================================================================
 */

// Revocable Consent State Toggle
let isConsentActive = true;

function toggleConsentState() {
  isConsentActive = !isConsentActive;
  const statusBadge = document.getElementById('consent-status-badge');
  const toggleBtn = document.getElementById('revoke-consent-btn');
  const auditText = document.getElementById('consent-audit-text');

  if (isConsentActive) {
    if (statusBadge) {
      statusBadge.className = 'px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono rounded-full border border-emerald-200';
      statusBadge.innerText = 'ACTIVE_CONSENT (Finvu AA)';
    }
    if (toggleBtn) {
      toggleBtn.className = 'px-3 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold transition-all';
      toggleBtn.innerText = 'Revoke Consent';
    }
    if (auditText) auditText.innerText = 'Data Sharing Active: Banks & NBFCs can audit verified cashflows.';
    showToastNotification('✅ Account Aggregator Consent Activated.', 'success');
  } else {
    if (statusBadge) {
      statusBadge.className = 'px-2.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold font-mono rounded-full border border-rose-200';
      statusBadge.innerText = 'REVOKED (Data Sharing Paused)';
    }
    if (toggleBtn) {
      toggleBtn.className = 'px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold transition-all';
      toggleBtn.innerText = 'Re-Enable Consent';
    }
    if (auditText) auditText.innerText = 'Data Sharing Paused: Financial identity hidden from lender search.';
    showToastNotification('🔒 Consent Revoked: Financial data sharing paused.', 'error');
  }
}

// Ensure Copilot Floating Drawer Exists on Every Page
function ensureCopilotWidgetExists() {
  if (document.getElementById('copilot-floating-container')) return;

  const isLender = window.location.pathname.includes('lender');
  const container = document.createElement('div');
  container.id = 'copilot-floating-container';
  container.className = 'fixed bottom-6 right-6 z-50';
  container.innerHTML = `
    <button id="copilot-floating-btn" class="bg-gradient-to-r ${isLender ? 'from-emerald-700 to-teal-700 hover:from-emerald-800' : 'from-indigo-600 to-blue-600 hover:from-indigo-700'} text-white font-bold text-xs px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-white/20 transition-all transform hover:scale-105 cursor-pointer" onclick="toggleCopilotDrawer()">
      <span class="material-symbols-outlined text-[20px]">smart_toy</span>
      <span>${isLender ? 'Lender AI Copilot 🤖' : 'Ask AI Copilot 🤖'}</span>
    </button>

    <div id="copilot-chat-drawer" class="hidden absolute bottom-14 right-0 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[490px]">
      <div class="bg-gradient-to-r ${isLender ? 'from-slate-900 to-teal-950' : 'from-slate-900 to-indigo-950'} text-white p-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full ${isLender ? 'bg-emerald-600' : 'bg-indigo-600'} flex items-center justify-center font-bold text-xs">🤖</div>
          <div>
            <div class="text-xs font-bold text-white">${isLender ? 'Institutional AI Copilot' : 'GigCredit AI Copilot'}</div>
            <div class="text-[10px] text-emerald-400 font-mono">Verified Underwriting Context Active</div>
          </div>
        </div>
        <button class="text-slate-400 hover:text-white cursor-pointer" onclick="toggleCopilotDrawer()">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <div id="copilot-messages-box" class="flex-1 p-4 overflow-y-auto space-y-3">
        <div class="flex justify-start">
          <div class="bg-indigo-50/90 border border-indigo-100 text-slate-800 text-xs font-medium px-4 py-3 rounded-2xl rounded-tl-none max-w-[92%] space-y-1 shadow-md">
            <div class="text-[10px] font-bold text-indigo-700 font-mono">🤖 GIGCREDIT AI COPILOT</div>
            <div>Namaste! I am your GigCredit AI Copilot. Ask me about credit scores, loan limits, multi-app velocity, or flex-leave rules!</div>
          </div>
        </div>
      </div>

      <div class="p-2 border-t border-slate-100 bg-slate-50 flex gap-1.5 overflow-x-auto text-[10px] font-semibold text-indigo-700">
        <button class="px-2.5 py-1 bg-white border border-slate-200 rounded-full shrink-0 hover:border-indigo-400 cursor-pointer" onclick="sendCopilotQuery('Why is my score 748?')">Why score 748?</button>
        <button class="px-2.5 py-1 bg-white border border-slate-200 rounded-full shrink-0 hover:border-indigo-400 cursor-pointer" onclick="sendCopilotQuery('How to get ₹1.5 Lakh limit?')">Increase Limit 🚀</button>
        <button class="px-2.5 py-1 bg-white border border-slate-200 rounded-full shrink-0 hover:border-indigo-400 cursor-pointer" onclick="sendCopilotQuery('What if I work fewer hours?')">Day Off Advice 🌴</button>
      </div>

      <div class="p-3 border-t border-slate-200 bg-white flex gap-2">
        <input id="copilot-user-input" class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 font-medium" placeholder="Ask AI Copilot anything..." onkeypress="if(event.key==='Enter') sendCopilotQuery()"/>
        <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer" onclick="sendCopilotQuery()">
          <span class="material-symbols-outlined text-[18px]">send</span>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(container);
}

// AI Copilot Chat Drawer Open/Close/Toggle Helpers
function openCopilotDrawer() {
  ensureCopilotWidgetExists();
  const drawers = document.querySelectorAll('#copilot-chat-drawer');
  drawers.forEach(d => {
    d.classList.remove('hidden');
    d.style.display = 'flex';
  });
  const inputEl = document.getElementById('copilot-user-input');
  if (inputEl) inputEl.focus();
}

function closeCopilotDrawer() {
  const drawers = document.querySelectorAll('#copilot-chat-drawer');
  drawers.forEach(d => {
    d.classList.add('hidden');
    d.style.display = 'none';
  });
}

function toggleCopilotDrawer() {
  ensureCopilotWidgetExists();
  const drawers = document.querySelectorAll('#copilot-chat-drawer');
  let isAnyVisible = false;
  drawers.forEach(d => {
    if (!d.classList.contains('hidden') && d.style.display !== 'none') {
      isAnyVisible = true;
    }
  });

  if (isAnyVisible) {
    closeCopilotDrawer();
  } else {
    openCopilotDrawer();
  }
}

// Format Markdown Bold / Bullet text into HTML
function formatCopilotText(text) {
  if (!text) return '';
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n- /g, '<br/>• ')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
  return formatted;
}

// Execute Interactive Copilot Action
function executeCopilotAction(actionName) {
  showToastNotification(`⚡ Executing AI Action: ${actionName}`, 'success');
  
  if (actionName === 'runPipeline') {
    if (typeof window.executeStagePipeline === 'function') {
      window.executeStagePipeline();
    } else if (typeof window.fetchBackendPipelineAudit === 'function') {
      window.fetchBackendPipelineAudit();
    } else {
      showToastNotification('Starting 7-Stage Multi-Agent Audit...', 'success');
    }
  } else if (actionName === 'openWithdrawModal') {
    const modal = document.getElementById('withdraw-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    } else if (typeof window.openQuickCashModal === 'function') {
      window.openQuickCashModal();
    } else {
      alert('💵 Instant UPI Withdrawal simulated: ₹1,000 transferred to ramesh@okaxis!');
    }
  } else if (actionName === 'openDocumentModal') {
    const modal = document.getElementById('doc-preview-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    } else {
      showToastNotification('Opening Finvu AA Statement Verification Report...', 'success');
    }
  } else if (actionName === 'openDispatchOfferModal') {
    const modal = document.getElementById('offer-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    } else {
      showToastNotification('Opening Custom Loan Offer Dispatcher...', 'success');
    }
  } else if (actionName === 'openAgentAuditModal') {
    const modal = document.getElementById('worker-detail-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    } else {
      showToastNotification('Loading 7-Stage Agent Audit Report...', 'success');
    }
  } else if (actionName === 'openWizardStep3') {
    if (typeof window.openWizardModal === 'function') {
      window.openWizardModal();
    } else {
      showToastNotification('Opening App Connection Wizard...', 'success');
    }
  } else if (actionName === 'scrollLoanOffers') {
    const offersSec = document.getElementById('compare-offers-section') || document.getElementById('approved-loan-offers-card');
    if (offersSec) {
      offersSec.scrollIntoView({ behavior: 'smooth' });
    } else {
      showToastNotification('Fetching lowest APR loan offers...', 'success');
    }
  } else if (actionName === 'downloadAuditPDF') {
    showToastNotification('📥 Generating Institutional Risk Audit PDF Report...', 'success');
  }
}

async function sendCopilotQuery(customText = null) {
  openCopilotDrawer();
  const inputEl = document.getElementById('copilot-user-input');
  const messageBox = document.getElementById('copilot-messages-box');
  const queryText = customText || (inputEl ? inputEl.value : '');

  if (!queryText || !queryText.trim()) return;

  if (inputEl) inputEl.value = '';

  // Append user bubble
  if (messageBox) {
    messageBox.innerHTML += `
      <div class="flex justify-end animate-fade-in-up">
        <div class="bg-primary text-white text-xs font-semibold px-3.5 py-2.5 rounded-2xl rounded-tr-none max-w-[85%] shadow-md">
          ${queryText}
        </div>
      </div>
    `;
    messageBox.scrollTop = messageBox.scrollHeight;
  }

  // Show typing indicator
  const typingId = `typing-${Date.now()}`;
  if (messageBox) {
    messageBox.innerHTML += `
      <div class="flex justify-start animate-fade-in-up" id="${typingId}">
        <div class="bg-slate-100 border border-slate-200 text-slate-600 text-xs px-3.5 py-2.5 rounded-2xl rounded-tl-none font-mono flex items-center gap-2 shadow-sm">
          <span class="live-dot"></span>
          <span>🤖 GigCredit AI Thinking...</span>
        </div>
      </div>
    `;
    messageBox.scrollTop = messageBox.scrollHeight;
  }

  try {
    const isLenderPage = window.location.pathname.includes('lender');
    const res = await fetch('/api/agents/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: queryText,
        userRole: isLenderPage ? 'lender' : 'worker',
      }),
    });

    const data = await res.json();
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    if (messageBox) {
      let buttonsHtml = '';
      if (data.actionButtons && data.actionButtons.length > 0) {
        buttonsHtml = `<div class="flex flex-wrap gap-1.5 pt-2 border-t border-indigo-100">`;
        data.actionButtons.forEach(btn => {
          buttonsHtml += `
            <button class="bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 text-indigo-700 font-bold text-[10px] px-2.5 py-1 rounded-lg transition-all shadow-2xs cursor-pointer" onclick="executeCopilotAction('${btn.action}')">
              ${btn.label}
            </button>
          `;
        });
        buttonsHtml += `</div>`;
      }

      const formattedText = formatCopilotText(data.response || 'I am ready to assist with your credit facility!');

      messageBox.innerHTML += `
        <div class="flex justify-start animate-fade-in-up">
          <div class="bg-indigo-50/90 border border-indigo-100 text-slate-800 text-xs font-medium px-4 py-3 rounded-2xl rounded-tl-none max-w-[92%] space-y-2 shadow-md">
            <div class="flex items-center justify-between border-b border-indigo-100 pb-1">
              <span class="text-[10px] font-bold text-indigo-700 font-mono tracking-wider flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">smart_toy</span> GIGCREDIT AI COPILOT
              </span>
              <span class="text-[9px] text-slate-400 font-mono">LIVE</span>
            </div>
            <div class="leading-relaxed text-slate-800">${formattedText}</div>
            ${buttonsHtml}
          </div>
        </div>
      `;
      messageBox.scrollTop = messageBox.scrollHeight;
    }
  } catch (err) {
    console.error('Copilot Query Error:', err);
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();
    if (messageBox) {
      messageBox.innerHTML += `
        <div class="flex justify-start animate-fade-in-up">
          <div class="bg-slate-100 text-slate-700 text-xs px-3.5 py-2.5 rounded-2xl rounded-tl-none">
            🤖 I'm connected and ready! Ask me about your score or loan limits.
          </div>
        </div>
      `;
    }
  }
}

// Toast Notification Helper
function showToastNotification(msg, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast-message ${type}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[18px]">${type === 'success' ? 'check_circle' : 'error'}</span>
    <span>${msg}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Auto-bind or Auto-inject Copilot Floating Widget
document.addEventListener('DOMContentLoaded', () => {
  ensureCopilotWidgetExists();
  const copilotBtn = document.getElementById('copilot-floating-btn');
  if (copilotBtn) {
    copilotBtn.addEventListener('click', toggleCopilotDrawer);
  }

  // Bind all interactive helper buttons across pages
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.currentTarget.getAttribute('data-action');
      if (action) executeCopilotAction(action);
    });
  });
});
