const express = require('express');
const authorization = require('../middleware/authorization');
const addActivity = require('../controller/activty/addActivity');

const router = express.Router();

router.post('/', authorization('createActivity'), addActivity);

module.exports = router;
