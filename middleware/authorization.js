const { checkJwtValidity, decodeJwt } = require('../utils/jwt');

const authorization = (capabilities) => {
  const authorizationMiddleware = async (req, res, next) => {
    if (!req.header.authorization) {
      res.status(403);
      return res.json({ errorMessage: 'Token is not present' });
    }

    const token = req.header.authorization.substring(8, req.header.authorization.length);
    const isJwtValide = await checkJwtValidity(token);

    if (!isJwtValide) {
      res.status(403);
      return res.json({ erroMessage: 'Invalid token' });
    }

    const decode = await decodeJwt(token);

    // test this

    // @ts-ignore
    if (decode.capabilities !== capabilities) {
      res.status(403);
      return res.json({
        erroMessage: 'You are not allowed to perform this operation, please contact the administration',
      });
    }

    return next();
  };

  return authorizationMiddleware;
};

module.exports = authorization;
