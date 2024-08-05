const Impression = require('../models/Impression');
const Click = require('../models/Click');
const broadcast = require('../utils/broadcast');

exports.processCampaign = async (req, res) => {
  const { banner_size, category, budget } = req.body;

  try {
    broadcast('Processing started for campaign recommendation');
    
    const impressionsCount = await Impression.countDocuments({ banner_size, category });
    if (impressionsCount === 0) {
      throw new Error('No impressions data available for the given banner size and category');
    }

    const impressionsDataPromise = Impression.find({ banner_size, category });
    const clicksDataPromise = Click.find({ impression_id: { $in: await Impression.distinct('impression_id', { banner_size, category }) } });

    const [impressionsData, clicksData] = await Promise.all([impressionsDataPromise, clicksDataPromise]);
    broadcast('Data fetched successfully.');

    const totalImpressions = impressionsData.length;
    const totalClicks = clicksData.length;
    const avgClicksPerImpression = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
    const uniqueUsers = new Set(impressionsData.map(impression => impression.user_id)).size;

    let totalBids = 0;
    impressionsData.forEach(impression => {
      totalBids += parseFloat(impression.bid);
    });

    const avgBid = totalImpressions > 0 ? totalBids / totalImpressions : 0;
    const predictedImpressions = avgBid > 0 ? budget / avgBid : 0;
    const predictedClicks = predictedImpressions * avgClicksPerImpression;
    const predictedUniqueUsers = uniqueUsers / totalImpressions * predictedImpressions;
    const recommendedBid = predictedImpressions > 0 ? budget / predictedImpressions : 0;

    res.json({
      impressions: Math.round(predictedImpressions),
      clicks: Math.round(predictedClicks),
      uniqueUsers: Math.round(predictedUniqueUsers),
      recommendedBid: recommendedBid.toFixed(2),
    });

    broadcast('Processing completed for campaign recommendation');
  } catch (error) {
    console.error('Error processing campaign prediction:', error);
    broadcast('Error occurred during campaign recommendation processing');
    res.status(500).json({ message: error.message });
  }
};
