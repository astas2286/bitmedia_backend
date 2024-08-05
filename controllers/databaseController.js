const runWorkers = require('../scripts/generateData');

exports.initializeDB = async (req, res) => {
  const { impressions, clickRate, numWorkers } = req.body;
  console.log('impressions:', impressions, 'clickRate:', clickRate, 'numWorkers:', numWorkers);

  try {
    await runWorkers(numWorkers, impressions, clickRate);
    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ message: 'Error initializing database' });
  }
};
