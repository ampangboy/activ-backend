const User = require('../model/user');

const signUp = async (req, res) => {
  let user;

  try {
    user = new User(req.body.emailAddress, req.body.password, req.body.firstName, req.body.lastName, req.body.jobTitle);
  } catch {
    res.status(400);
    return res.json({ errorMessage: 'Invalid request, probably due to data type error or invalid email address' });
  }

  await user.encyptPassword();

  try {
    await user.saveUserInfo();
  } catch {
    res.status(400);
    return res.json({ errorMessage: 'Server unable to process the request. Please try again later.' });
  }

  return res.sendStatus(201);
};

module.exports = { signUp };
