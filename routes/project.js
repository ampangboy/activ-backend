const express = require('express');
const authorization = require('../middleware/authorization');
const addProject = require('../controller/project/addProject');
const updateProject = require('../controller/project/updateProject');

const router = express.Router();

router.post('/', authorization('createProject'), addProject);
router.put('/:projectId', authorization('updateProject'), updateProject);

module.exports = router;
