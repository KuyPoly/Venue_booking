const { Activity } = require('../model/Association');

exports.getActivitiesByOwner = async (req, res) => {
  try {
    const ownerId = req.user.user_id; // Get from authenticated user
    const activities = await Activity.findAll({
      where: { owner_id: ownerId },
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    res.json({ activities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch activities' });
  }
};
