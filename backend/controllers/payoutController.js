const { Payout } = require('../model/Association');

exports.getPayoutHistory = async (req, res) => {
  const ownerId = req.user.user_id; // Get from authenticated user

  try {
    // Check if Payout model is available
    if (!Payout) {
      return res.json({ payouts: [] });
    }

    const payouts = await Payout.findAll({
      where: { owner_id: ownerId },
      order: [['createdAt', 'DESC']]
    });
    res.json({ payouts });
  } catch (err) {
    console.error('Payout controller error:', err);
    // Return empty array if table doesn't exist yet
    if (err.message.includes('table') || err.message.includes('relation')) {
      return res.json({ payouts: [] });
    }
    res.status(500).json({ message: 'Failed to fetch payouts' });
  }
};
