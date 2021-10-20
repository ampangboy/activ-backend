const express = require('express');
const authorization = require('../middleware/authorization');
const addActivity = require('../controller/activty/addActivity');
const getActivityByUserId = require('../controller/activty/getActivityByUserId');

const router = express.Router();

router.post('/', authorization('createActivity'), addActivity);
router.get('/', authorization('getActivity'), getActivityByUserId);

module.exports = router;
