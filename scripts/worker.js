const { parentPort, workerData } = require('worker_threads');
const mongoose = require('mongoose');
const Impression = require('../models/Impression');
const Click = require('../models/Click');

mongoose.connect(process.env.MONGODB_URI);

async function generateData(workerId, numWorkers, totalImpressions, clickRate) {
  const bannerSizes = ['300x250', '728x90', '160x600', '468x60'];
  const categories = ['Technology', 'Health', 'Finance', 'Education', 'Entertainment'];
  const users = Array.from({ length: 1000 }, (_, i) => `user${i}`);

  const impressions = [];
  const clicks = [];
  let totalClicks = 0;

  for (let i = workerId; i < totalImpressions; i += numWorkers) {
    const impression = {
      impression_id: i.toString(),
      timestamp: new Date(),
      banner_size: bannerSizes[Math.floor(Math.random() * bannerSizes.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      user_id: users[Math.floor(Math.random() * users.length)],
      bid: (Math.random() * 9.9 + 0.1).toFixed(2),
    };

    impressions.push(impression);

    if (Math.random() < clickRate / 100) {
      const click = {
        click_id: i.toString(),
        timestamp: new Date(),
        impression_id: impression.impression_id,
        user_id: impression.user_id,
      };

      clicks.push(click);
      totalClicks++;
    }

    if (impressions.length >= 2000) {
      try {
        await Impression.insertMany(impressions);
        impressions.length = 0;
        parentPort.postMessage({ workerId, message: `created ${i + 1} impressions and ${totalClicks} clicks` });
      } catch (error) {
        console.error(`Worker ${workerId} error inserting impressions:`, error);
      }
    }

    if (clicks.length >= 2000) { 
      try {
        await Click.insertMany(clicks);
        clicks.length = 0;
        parentPort.postMessage({ workerId, message: `created ${i + 1} impressions and ${totalClicks} clicks` });
      } catch (error) {
        console.error(`Worker ${workerId} error inserting clicks:`, error);
      }
    }
  }

  if (impressions.length > 0) {
    try {
      await Impression.insertMany(impressions);
    } catch (error) {
      console.error(`Worker ${workerId} error inserting remaining impressions:`, error);
    }
  }

  if (clicks.length > 0) {
    try {
      await Click.insertMany(clicks);
    } catch (error) {
      console.error(`Worker ${workerId} error inserting remaining clicks:`, error);
    }
  }

  parentPort.postMessage({ workerId, message: `Data generation complete with ${totalImpressions} impressions and ${totalClicks} clicks` });

  mongoose.connection.close().then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error(`Worker ${workerId} error closing MongoDB connection:`, err);
    process.exit(1);
  });
}

generateData(workerData.workerId, workerData.numWorkers, workerData.impressions, workerData.clickRate).catch((err) => {
  console.error(`Worker ${workerData.workerId} error:`, err);
  mongoose.connection.close().then(() => {
    process.exit(1);
  });
});
