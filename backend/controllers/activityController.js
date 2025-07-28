const { Activity } = require('../model');

exports.getActivitiesByOwner = async (req, res) => {
  try {
    const ownerId = req.query.owner_id;
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
