const express = require('express');
const authorization = require('../middleware/authorization');
const addActivity = require('../controller/activty/addActivity');
const getActivityByUserId = require('../controller/activty/getActivityByUserId');
const getActivityByProjectId = require('../controller/activty/getActivityByProjectId');

const router = express.Router();

router.post('/', authorization('createActivity'), addActivity);
router.get('/', authorization('getActivity'), getActivityByUserId);
router.get('/project/:projectId', authorization('getActivity'), getActivityByProjectId);

module.exports = router;
