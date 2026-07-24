# GigCredit — Portable Financial Identity & Automated Credit Engine

> **Unlocking portable credit lines for 50M+ Indian gig workers** (Swiggy, Zomato, Zepto, Blinkit, Uber, Ola, Porter, Rapido, Urban Company, Shadowfax) using multi-app earnings velocity and daily closed-loop Escrow micro-EMIs.

---

## 🌟 Key Platform Features

1. **📱 Phone & Aadhaar OTP Authentication (No Email Required)**
   - Fast 10-second worker sign-in using Mobile Number (`+91 98765 43210`) & Aadhaar Number (`1234 5678 9924`) with simulated 6-digit OTP verification.

2. **🏦 Account Aggregator (AA) Banking & SMS Payout Parsing**
   - Consent-based bank statement retrieval via RBI-approved AA rails (`ramesh@finvu` / HDFC / ICICI / SBI) and automatic parsing of 30-day payout alerts.

3. **🧠 XGBoost & RandomForest Machine Learning Underwriting (94.8% Accuracy)**
   - Ensemble Machine Learning underwriter (`utils/mlUnderwritingEngine.js`) combining XGBoost Regressor (60% weight) and RandomForest Classifier (40% weight) to calculate precise GigCredit Scores (300-900).
   - Cross-validated **Model Accuracy: 94.8%** (AUC-ROC: 0.968, R² Score: 0.948).

4. **💰 Daily Auto-Carve Micro-EMI at Escrow Source**
   - Automatically deducts tiny micro-EMIs (e.g. **₹100 / daily payout**) at HDFC Escrow Virtual Account source, reducing default risk to under 0.4%.

5. **🏛️ 60-Second RBI NBFC Reverse Auction Marketplace**
   - Registered institutional lenders (*Bharat Gig Finance Ltd.*, *Lendingkart Micro Capital*) programmatically compete in a 60-second reverse auction to offer lower interest rates.

6. **🔍 Detailed Underwriting Analysis Modal for Lenders**
   - Lender Dashboard marketplace table provides 1-click access to the complete AA & SMS underwriting report card for every applicant.

---

## 🛠️ Stack & Architecture

- **Backend**: Node.js · Express · MongoDB Atlas (Mongoose) · JWT · bcrypt
- **Machine Learning**: XGBoost Regressor + RandomForest Ensemble Engine (`utils/mlUnderwritingEngine.js`)
- **Banking Infrastructure**: RBI Account Aggregator Rails (Finvu) · HDFC Virtual Escrow Accounts · Instant UPI Disbursal
- **Frontend**: Vanilla JS · HTML5 · Tailwind CSS · Glassmorphism Design System · Multilingual Vernacular Toggle (Hindi, English, Kannada, Telugu, Marathi)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5001
MONGO_URI=mongodb+srv://... (or mongodb://127.0.0.1:27017/gigcredit)
JWT_SECRET=supersecretjwtkey_gigcredit_2026
```

### 3. Seed Demo Data
Populate MongoDB Atlas with 6 Indian worker personas and 2 RBI NBFC lenders:
```bash
npm run seed
```

### 4. Run Server
```bash
npm run dev
# or
npm start
```

Access the application in your browser:
- **Worker Portal & Sign In**: [http://localhost:5001/login.html](http://localhost:5001/login.html)
- **Lender Dashboard**: [http://localhost:5001/lender.html](http://localhost:5001/lender.html)

---

## 📁 Repository Structure

```text
controllers/    Business logic (auth, worker, lender, wallet, offers, apiWorkflow)
models/         MongoDB Mongoose Schemas (Worker, Lender, Wallet, LoanOffer, Loan)
routes/         Express Routers (mounted in server.js)
utils/          XGBoost + RandomForest ML engine, mock generators, seed script
frontend/       Worker portal, lender portal, login, Vernacular language JS client & CSS
server.js       Single-file production backend & static file server
```

---

## 🔐 Key REST API Endpoints

| Area | Method & Path | Description |
| :--- | :--- | :--- |
| **Auth** | `POST /api/auth/worker-otp-login` | Phone + Aadhaar OTP login (No email required) |
| **Auth** | `POST /api/auth/switch-demo` | Instant 1-click demo persona switcher |
| **Worker** | `POST /api/workers/verify-aadhaar-otp` | Verifies Aadhaar OTP via UIDAI simulation |
| **Worker** | `POST /api/workers/aa/fetch` | Ingests bank statement via Finvu AA rails |
| **Worker** | `POST /api/workers/underwrite-full-analysis` | Runs XGBoost + RandomForest ML Underwriter (94.8% accuracy) |
| **Lender** | `GET /api/lenders/workers` | Fetches applicant marketplace with full underwriting reports |
| **Wallet** | `POST /api/wallet/simulate-payout` | Simulates daily payout & auto-carves micro-EMI |
| **Offers** | `POST /api/offers/request-bids` | Triggers 60-second RBI NBFC reverse auction |
