const { intValidator } = require('../../helper/validator');
const { asyncDeleteProjectById } = require('../../dbSubcriber');

const deleteProject = async (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);

  try {
    intValidator(projectId);
  } catch {
    res.status(500);
    return res.json({ errorMessage: 'Request contain invalid request body, please check the datatype' });
  }

  try {
    await asyncDeleteProjectById(projectId);
  } catch {
    res.status(500);
    return res.json({
      errorMessage: 'There is some problem with server, please try again later',
    });
  }

  return res.end();
};

module.exports = deleteProject;
