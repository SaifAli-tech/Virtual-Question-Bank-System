const analyticsService = require("../services/analytics.service");

const getAnalytics = async (req, res) => {
  try {
    const analytics = await analyticsService.getAnalytics(req.query.search);
    res.status(200).json(analytics);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getAnalytics,
};
