const express = require('express');
const authorization = require('../middleware/authorization');
const addProject = require('../controller/project/addProject');
const updateProject = require('../controller/project/updateProject');
const deleteProject = require('../controller/project/deleteProject');
const getProject = require('../controller/project/getProject');

const router = express.Router();

router.post('/', authorization('createProject'), addProject);
router.put('/:projectId', authorization('updateProject'), updateProject);
router.delete('/:projectId', authorization('deleteProject'), deleteProject);
router.get('/:projectId', authorization('getProject'), getProject);
module.exports = router;
