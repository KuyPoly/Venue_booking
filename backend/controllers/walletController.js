// controllers/walletController.js
const { OwnerWallet, WalletTransaction, User, Booking } = require('../model/Association');
const { Op } = require('sequelize');
const sequelize = require('../database/sequelize');

// Get wallet information for the authenticated owner
exports.getWalletInfo = async (req, res) => {
  try {
    const ownerId = req.user?.user_id;
    
    if (!ownerId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    let wallet = await OwnerWallet.findOne({
      where: { ownerId }
    });

    if (!wallet) {
      // Create wallet if it doesn't exist
      wallet = await OwnerWallet.create({
        ownerId,
        balance: 0.00,
        totalEarnings: 0.00,
        totalWithdrawals: 0.00,
        status: 'active'
      });
    }

    res.json({
      balance: parseFloat(wallet.balance || 0),
      totalEarnings: parseFloat(wallet.totalEarnings || 0),
      totalWithdrawals: parseFloat(wallet.totalWithdrawals || 0),
      status: wallet.status || 'active'
    });
  } catch (error) {
    console.error('Error fetching wallet info:', error);
    res.status(500).json({ error: 'Failed to fetch wallet info' });
  }
};

// Get transaction history
exports.getTransactionHistory = async (req, res) => {
  try {
    const ownerId = req.user?.user_id;
    
    if (!ownerId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Use raw SQL query to completely avoid association issues
    const transactions = await sequelize.query(`
      SELECT 
        id,
        ownerId,
        bookingId,
        type,
        amount,
        description,
        status,
        metadata,
        processedAt,
        createdAt,
        updatedAt
      FROM wallet_transactions 
      WHERE ownerId = :ownerId 
      ORDER BY createdAt DESC 
      LIMIT :limit OFFSET :offset
    `, {
      replacements: { 
        ownerId: ownerId, 
        limit: parseInt(limit), 
        offset: parseInt(offset) 
      },
      type: sequelize.QueryTypes.SELECT
    });

    // Get total count
    const countResult = await sequelize.query(`
      SELECT COUNT(*) as total 
      FROM wallet_transactions 
      WHERE ownerId = :ownerId
    `, {
      replacements: { ownerId: ownerId },
      type: sequelize.QueryTypes.SELECT
    });

    const total = countResult[0].total;

    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      type: transaction.type,
      amount: parseFloat(transaction.amount),
      description: transaction.description,
      status: transaction.status,
      date: new Date(transaction.createdAt).toISOString().split('T')[0],
      createdAt: transaction.createdAt,
      bookingId: transaction.bookingId,
      metadata: transaction.metadata
    }));

    res.json({
      transactions: formattedTransactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch transaction history',
      details: error.message
    });
  }
};

// Process simple withdrawal request (no external payment service)
exports.withdrawFunds = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const ownerId = req.user?.user_id;
    const { amount, bankAccountNumber, bankName, accountHolderName, routingNumber } = req.body;

    if (!ownerId) {
      await transaction.rollback();
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!amount || amount <= 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Invalid withdrawal amount' });
    }

    if (!bankAccountNumber || !bankName || !accountHolderName) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Bank account details are required' });
    }

    const wallet = await OwnerWallet.findOne({
      where: { ownerId },
      transaction
    });

    if (!wallet) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Wallet not found' });
    }

    if (parseFloat(wallet.balance) < parseFloat(amount)) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Update wallet balance
    await wallet.update({
      balance: parseFloat(wallet.balance) - parseFloat(amount),
      totalWithdrawals: parseFloat(wallet.totalWithdrawals || 0) + parseFloat(amount)
    }, { transaction });

    // Create withdrawal transaction record
    const withdrawalTransaction = await WalletTransaction.create({
      ownerId,
      type: 'withdrawal',
      amount: -parseFloat(amount), // Negative for withdrawals
      description: `Withdrawal to ${bankName} - ***${bankAccountNumber.slice(-4)}`,
      status: 'completed', // Simple system - immediately mark as completed
      metadata: {
        bankName,
        bankAccountNumber: `***${bankAccountNumber.slice(-4)}`, // Store masked version
        accountHolderName,
        routingNumber: routingNumber || null
      },
      processedAt: new Date()
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Withdrawal request processed successfully',
      transaction: {
        id: withdrawalTransaction.id,
        amount: parseFloat(amount),
        status: 'completed',
        description: withdrawalTransaction.description,
        date: withdrawalTransaction.createdAt.toISOString().split('T')[0]
      },
      newBalance: parseFloat(wallet.balance) - parseFloat(amount)
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error processing withdrawal:', error);
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
};

// Credit wallet when booking is completed (called from booking controller)
exports.creditWalletFromBooking = async (bookingId, amount, ownerId, description = null) => {
  const dbTransaction = await sequelize.transaction();
  
  try {
    if (!bookingId || !amount || !ownerId) {
      throw new Error('Missing required fields for wallet credit');
    }

    // Check if booking exists
    const booking = await Booking.findByPk(bookingId, { transaction: dbTransaction });
    if (!booking) {
      throw new Error('Booking not found');
    }

    let wallet = await OwnerWallet.findOne({
      where: { ownerId },
      transaction: dbTransaction
    });

    if (!wallet) {
      wallet = await OwnerWallet.create({
        ownerId,
        balance: 0.00,
        totalEarnings: 0.00,
        totalWithdrawals: 0.00,
        status: 'active'
      }, { transaction: dbTransaction });
    }

    // Update wallet balance
    await wallet.update({
      balance: parseFloat(wallet.balance || 0) + parseFloat(amount),
      totalEarnings: parseFloat(wallet.totalEarnings || 0) + parseFloat(amount)
    }, { transaction: dbTransaction });

    // Create earning transaction record
    const earningTransaction = await WalletTransaction.create({
      ownerId,
      bookingId,
      type: 'earning',
      amount: parseFloat(amount),
      description: description || `Booking payment received - ${booking.bookingReference || booking.id}`,
      status: 'completed',
      processedAt: new Date()
    }, { transaction: dbTransaction });

    await dbTransaction.commit();

    console.log(`Wallet credited: $${amount} for owner ${ownerId} from booking ${bookingId}`);
    
    return {
      success: true,
      message: 'Wallet credited successfully',
      transaction: {
        id: earningTransaction.id,
        amount: parseFloat(amount),
        type: 'earning',
        description: earningTransaction.description
      },
      newBalance: parseFloat(wallet.balance || 0) + parseFloat(amount)
    };
  } catch (error) {
    await dbTransaction.rollback();
    console.error('Error crediting wallet:', error);
    throw error;
  }
};

// API endpoint version for manual wallet crediting (for testing)
exports.creditWalletAPI = async (req, res) => {
  try {
    const { bookingId, amount, ownerId, description } = req.body;
    
    const result = await exports.creditWalletFromBooking(bookingId, amount, ownerId, description);
    res.json(result);
  } catch (error) {
    console.error('Error in credit wallet API:', error);
    res.status(500).json({ error: error.message || 'Failed to credit wallet' });
  }
};

// Get wallet statistics
exports.getWalletStats = async (req, res) => {
  try {
    const ownerId = req.user?.user_id;
    
    if (!ownerId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const wallet = await OwnerWallet.findOne({
      where: { ownerId }
    });

    if (!wallet) {
      return res.json({
        totalEarnings: 0,
        totalWithdrawals: 0,
        availableBalance: 0,
        transactionCount: 0,
        lastTransactionDate: null
      });
    }

    // Get transaction counts and latest transaction
    const transactionStats = await WalletTransaction.findAll({
      where: { ownerId },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalTransactions'],
        [sequelize.fn('MAX', sequelize.col('createdAt')), 'lastTransactionDate']
      ],
      raw: true
    });

    res.json({
      totalEarnings: parseFloat(wallet.totalEarnings || 0),
      totalWithdrawals: parseFloat(wallet.totalWithdrawals || 0),
      availableBalance: parseFloat(wallet.balance || 0),
      transactionCount: parseInt(transactionStats[0]?.totalTransactions || 0),
      lastTransactionDate: transactionStats[0]?.lastTransactionDate
    });
  } catch (error) {
    console.error('Error fetching wallet stats:', error);
    res.status(500).json({ error: 'Failed to fetch wallet statistics' });
  }
};
