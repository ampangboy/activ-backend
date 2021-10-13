const User = require('../model/user');
const { signJwt } = require('../utils/jwt');

const signIn = async (req, res) => {
  let user;

  try {
    user = await User.findUserInfo(req.body.emailAddress);
  } catch {
    res.status(400);
    return res.json({ errorMessage: 'Invalid request, probably due to data type error or invalid email address' });
  }

  const token = await signJwt({ userId: user.userId, capability: 'createProject' });

  return res.json({ token });
};

module.exports = { signIn };
