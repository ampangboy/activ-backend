const User = require('../model/user');
const { signJwt } = require('../utils/jwt');

const signIn = async (req, res) => {
  let user;

  try {
    user = await User.findUserInfo(req.body.emailAddress);
  } catch {
    return res.status(505).end();
  }

  const token = await signJwt({ userId: user.userId });

  return res.json({ token });
};

module.exports = { signIn };
