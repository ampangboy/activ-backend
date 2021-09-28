const User = require('../model/user');

const signUp = async (req, res) => {
  let user;

  try {
    user = new User(req.body.emailAddress, req.body.password, req.body.firstName, req.body.lastName, req.body.jobTitle);
  } catch (err) {
    res.statusMessage = 'request does not contain valid values';
    return res.status(501).end();
  }

  await user.encyptPassword();

  try {
    await user.saveUserInfo();
    return res.sendStatus(200);
  } catch {
    res.statusMessage = 'we having trouble completing the request, please try again';
    return res.status(501).end();
  }
};

module.exports = { signUp };
