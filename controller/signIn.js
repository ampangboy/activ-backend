const User = require('../model/user');
const PasswordEncryptor = require('../helper/PasswordEncryptor');
const { signJwt } = require('../utils/jwt');

const signIn = async (req, res) => {
  let hashPassword;
  let token;

  try {
    hashPassword = User.asyncgetPasswordByEmailAddress(req.body.emailAddress);
  } catch (err) {
    res.statusMessage = 'invalid username/password';
    res.status(404).end();
  }

  const passwordEncrptor = new PasswordEncryptor(req.body.password, hashPassword);

  if (!passwordEncrptor.comparePassword) {
    res.statusMessage = 'invalid username/password';
    res.status(404).end();
  }

  const user = await User.findUserInfo(req.body.emailAddress);

  if (user !== null) {
    token = await signJwt({ userId: user.userId });
  }

  res.json({ token });
};

module.exports = { signIn };
