const { Payout } = require('../model/Association');

exports.getPayoutHistory = async (req, res) => {
  const ownerId = req.user.user_id; // Get from authenticated user

  try {
    const payouts = await Payout.findAll({
      where: { owner_id: ownerId },
      order: [['createdAt', 'DESC']]
    });
    res.json({ payouts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch payouts' });
  }
};
