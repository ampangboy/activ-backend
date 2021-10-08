const { checkJwtValidity, decodeJwt } = require('../utils/jwt');

const authorization = (capabilities) => {
  const authorizationMiddleware = async (req, res, next) => {
    if (!req.header.authorization) {
      res.body = { error: 'token not present' };
      return res.status(401).end();
    }

    const token = req.header.authorization.substring(8, req.header.authorization.length);
    const isJwtValide = await checkJwtValidity(token);

    if (!isJwtValide) {
      res.body = { error: 'invalid token' };
      return res.status(401).end();
    }

    const decode = await decodeJwt(token);

    // test this

    // @ts-ignore
    if (decode.capabilities !== capabilities) {
      res.body = { error: 'Not allowed' };
      return res.status(401).end();
    }

    return next();
  };

  return authorizationMiddleware;
};

module.exports = authorization;
