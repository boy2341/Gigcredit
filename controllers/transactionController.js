const { getTransactions } = require('./walletController');

// @desc GET /api/transactions - alias for the worker's wallet transaction history
module.exports = { getTransactions };
