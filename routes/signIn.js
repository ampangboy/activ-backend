const express = require('express');
const { signIn } = require('../controller/signIn');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, signIn);

module.exports = router;
