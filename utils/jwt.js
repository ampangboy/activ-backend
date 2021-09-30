const jwt = require('jsonwebtoken');

const JWT_KEY = '[,A3WM[TyHxSL~xxFLBzY,XR)2.4>J<V';
const JWT_EXPIRES_IN = '90 days';

const signJwt = async (payload) => {
  const token = await jwt.sign(payload, JWT_KEY, { expiresIn: JWT_EXPIRES_IN });
  return token;
};

const checkJwtValidity = async (token) => {
  try {
    await jwt.verify(token, JWT_KEY);
  } catch (err) {
    return false;
  }

  return true;
};

const decodeJwt = async (token) => {
  const decode = await jwt.verify(token, JWT_KEY);

  return decode;
};

module.exports = { signJwt, checkJwtValidity, decodeJwt };
