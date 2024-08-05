const Impression = require('../models/Impression');
const Click = require('../models/Click');

exports.getRecordCounts = async (req, res) => {
  try {
    const impressionsCount = await Impression.countDocuments();
    const clicksCount = await Click.countDocuments();

    res.json({
      impressions: impressionsCount,
      clicks: clicksCount,
    });
  } catch (error) {
    console.error('Error fetching record counts:', error);
    res.status(500).json({ message: 'Error fetching record counts' });
  }
};
