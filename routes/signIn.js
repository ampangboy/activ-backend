const express = require('express');
const { signIn } = require('../controller/signIn');

const router = express.Router();

router.post('/', signIn);

module.exports = router;
