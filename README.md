# GigCredit

GigCredit is a financial identity and credit underwriting platform for gig workers in India. It enables credit scoring based on multi-platform income data (Swiggy, Zomato, Uber, Blinkit), Account Aggregator bank statement verification, and automated daily micro-EMI repayments via Escrow.

## Tech Stack

- Backend: Node.js, Express, MongoDB Atlas, JWT
- Machine Learning: XGBoost and RandomForest Underwriting Engine
- Frontend: HTML5, JavaScript, Vanilla CSS, Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance (local or MongoDB Atlas)

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/boy2341/Gigcredit.git
   cd Gigcredit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Seed initial demo data (optional):
   ```bash
   npm run seed
   ```

## Running the Application

- Local Development Mode:
  ```bash
  npm run dev
  ```

- Production Start:
  ```bash
  npm start
  ```

Access the application at `http://localhost:5001`.

## Deployment

The project is pre-configured for Vercel serverless deployment using `vercel.json`.

1. Import repository on Vercel (`https://vercel.com/new`).
2. Set environment variables (`MONGO_URI`, `JWT_SECRET`).
3. Deploy.
