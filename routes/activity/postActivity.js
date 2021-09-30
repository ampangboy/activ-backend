const express = require('express');
const authorization = require('../../middleware/authorization');

const router = express.Router();

router.post('/', authorization('createActivity'));

module.exports = router;
