const jwt = require('jsonwebtoken');

const JWT_KEY = '[,A3WM[TyHxSL~xxFLBzY,XR)2.4>J<V';
const JWT_EXPIRES_IN = '90 days';

const signJwt = async (payload) => {
  const token = await jwt.sign(payload, JWT_KEY, { expiresIn: JWT_EXPIRES_IN });
  return token;
};

module.exports = { signJwt };
