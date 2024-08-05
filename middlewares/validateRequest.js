const validateInitializeDBRequest = (req, res, next) => {
    const { impressions, clickRate, numWorkers } = req.body;
  
    if (isNaN(impressions) || isNaN(clickRate) || isNaN(numWorkers) || clickRate < 0 || clickRate > 100 || numWorkers < 1 || numWorkers > 8 || impressions < 1) {
      return res.status(400).json({ message: 'Invalid input' });
    }
  
    next();
  };
  
  const validateCampaignRequest = (req, res, next) => {
    const { banner_size, category, budget } = req.body;
  
    if (!banner_size || !category || isNaN(budget) || budget < 0) {
      return res.status(400).json({ message: 'Invalid input' });
    }
  
    next();
  };
  
  module.exports = { validateInitializeDBRequest, validateCampaignRequest };
  