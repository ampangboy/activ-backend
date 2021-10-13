const PasswordEncryptor = require('../helper/PasswordEncryptor');
const { asyncGetPasswordByEmailAddress } = require('../dbSubcriber');

const authenticate = async (req, res, next) => {
  let hashPassword;

  try {
    hashPassword = await asyncGetPasswordByEmailAddress(req.body.emailAddress);
  } catch {
    res.status(500);
    return res.json({ errorMessage: 'There is problem with server, please try again later' });
  }

  if (hashPassword === null) {
    res.status(403);
    return res.json({ errorMessage: 'Incorrect username/password' });
  }

  const passwordEncrptor = new PasswordEncryptor(req.body.password, hashPassword);
  const isPasswordCorrect = await passwordEncrptor.comparePassword();

  if (!isPasswordCorrect) {
    res.status(403);
    return res.json({ errorMessage: 'Incorrect username/password' });
  }

  return next();
};

module.exports = authenticate;
