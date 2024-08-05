const { Worker } = require('worker_threads');
const mongoose = require('mongoose');
const broadcast = require('../utils/broadcast');
const Impression = require('../models/Impression');
const Click = require('../models/Click');

let totalImpressions = 0;
let totalClicks = 0;

async function clearData() {
  broadcast("DB - start deleting...");
  await Impression.deleteMany({});
  await Click.deleteMany({});
  broadcast("DB - data deleted");

  await Impression.collection.dropIndexes();
  await Click.collection.dropIndexes();
  
  broadcast("DB indexes deleted");
  broadcast("DB cleared");
  console.log('Existing data deleted');
}

function runWorker(workerId, numWorkers, impressions, clickRate) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__dirname + '/worker.js', {
      workerData: { workerId, numWorkers, impressions, clickRate },
    });

    worker.on('message', (msg) => {
      if (msg.message.includes('impressions and')) {
        const match = msg.message.match(/created (\d+) impressions and (\d+) clicks/);
        if (match) {
          totalImpressions += parseInt(match[1], 10);
          totalClicks += parseInt(match[2], 10);
          if (totalImpressions % 100000 === 0) { 
            broadcast(`Total created: ${totalImpressions} impressions, ${totalClicks} clicks`);
          }
        }
      }
    });

    worker.on('error', reject);

    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

async function runWorkers(numWorkers, impressions, clickRate) {
  const startTime = Date.now();

  await clearData();

  broadcast("starting creating new data...");

  const workerPromises = [];
  for (let i = 0; i < numWorkers; i++) {
    workerPromises.push(runWorker(i, numWorkers, impressions, clickRate));
  }

  await Promise.all(workerPromises);

  const actualImpressionsCount = await Impression.countDocuments();
  const actualClicksCount = await Click.countDocuments();

  const dbStats = await mongoose.connection.db.stats();

  const endTime = Date.now();
  const totalTimeSeconds = (endTime - startTime) / 1000;
  const formattedTime = formatTime(totalTimeSeconds);

  const dbSizeMB = (dbStats.dataSize / (1024 * 1024)).toFixed(2);

  console.log(`All workers completed. Total time: ${formattedTime}`);
  broadcast(`DB updated successfully.| Actual in DB: ${actualImpressionsCount} impressions, ${actualClicksCount} clicks.| DB size: ${dbSizeMB} MB. Total time: ${formattedTime}`);
}

module.exports = runWorkers;
