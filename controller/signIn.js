const User = require('../model/user');
const PasswordEncryptor = require('../helper/PasswordEncryptor');
const { signJwt } = require('../utils/jwt');

const signIn = async (req, res) => {
  let hashPassword;
  let token;

  try {
    hashPassword = await User.asyncgetPasswordByEmailAddress(req.body.emailAddress);
  } catch (err) {
    return res.status(505).end();
  }

  if (hashPassword === null) {
    res.statusMessage = 'invalid username/password';
    return res.status(401).end();
  }

  const passwordEncrptor = new PasswordEncryptor(req.body.password, hashPassword);
  const isPasswordCorrect = await passwordEncrptor.comparePassword();

  if (!isPasswordCorrect) {
    res.statusMessage = 'invalid username/password';
    return res.status(401).end();
  }

  const user = await User.findUserInfo(req.body.emailAddress);

  if (user !== null) {
    token = await signJwt({ userId: user.userId });
  }

  return res.json({ token });
};

module.exports = { signIn };
