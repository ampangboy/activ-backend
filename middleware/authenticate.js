const PasswordEncryptor = require('../helper/PasswordEncryptor');
const { asyncGetPasswordByEmailAddress } = require('../dbSubcriber');

const authenticate = async (req, res, next) => {
  let hashPassword;

  try {
    hashPassword = await asyncGetPasswordByEmailAddress(req.body.emailAddress);
  } catch (err) {
    return res.status(505).end();
  }

  if (hashPassword === null) {
    res.body = { error: 'invalid username/password' };
    return res.status(401).end();
  }

  const passwordEncrptor = new PasswordEncryptor(req.body.password, hashPassword);
  const isPasswordCorrect = await passwordEncrptor.comparePassword();

  if (!isPasswordCorrect) {
    res.body = { error: 'invalid username/password' };
    return res.status(401).end();
  }

  return next();
};

module.exports = authenticate;
