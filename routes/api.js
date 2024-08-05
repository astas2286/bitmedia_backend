const express = require('express');
const router = express.Router();
const { initializeDB } = require('../controllers/databaseController');
const { processCampaign } = require('../controllers/campaignController');
const { getRecordCounts } = require('../controllers/recordController');
const { validateInitializeDBRequest, validateCampaignRequest } = require('../middlewares/validateRequest');

router.post('/initialize-db', validateInitializeDBRequest, initializeDB);
router.post('/campaign', validateCampaignRequest, processCampaign);
router.get('/record-counts', getRecordCounts);

module.exports = router;

