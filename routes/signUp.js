const express = require('express');
const { signUp } = require('../controller/signUp');

const router = express.Router();

router.post('/sign-up', signUp);

module.exports = router;
