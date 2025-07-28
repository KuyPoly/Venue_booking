const { Activity } = require('../model/Association');

exports.getActivitiesByOwner = async (req, res) => {
  try {
    const ownerId = req.user.user_id; // Get from authenticated user
    
    // Check if Activity model is available
    if (!Activity) {
      return res.json({ activities: [] });
    }

    const activities = await Activity.findAll({
      where: { owner_id: ownerId },
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    res.json({ activities });
  } catch (err) {
    console.error('Activity controller error:', err);
    // Return empty array if table doesn't exist yet
    if (err.message.includes('table') || err.message.includes('relation')) {
      return res.json({ activities: [] });
    }
    res.status(500).json({ message: 'Failed to fetch activities' });
  }
};
