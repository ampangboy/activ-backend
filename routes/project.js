const express = require('express');
const authorization = require('../middleware/authorization');
const addProject = require('../controller/project/addProject');

const router = express.Router();

router.post('/', authorization('createProject'), addProject);

module.exports = router;
