const { checkJwtValidity, decodeJwt } = require('../utils/jwt');

const authorization = (capability) => {
  const authorizationMiddleware = async (req, res, next) => {
    const authorizationHeader = req.header('Authorization');
    if (!authorizationHeader) {
      res.status(403);
      return res.json({ errorMessage: 'Token is not present' });
    }

    // remove the Bearer part in the authorization to get only token
    const token = authorizationHeader.substring(7);

    const isJwtValide = await checkJwtValidity(token);

    if (!isJwtValide) {
      res.status(403);
      return res.json({ errorMessage: 'Invalid token' });
    }

    const decode = await decodeJwt(token);

    // @ts-ignore
    const filteredCapability = decode.capabilities.filter((c) => c === capability);

    // @ts-ignore
    if (filteredCapability.length === 0) {
      res.status(403);
      return res.json({
        errorMessage: 'You are not allowed to perform this operation, please contact the administration',
      });
    }

    return next();
  };

  return authorizationMiddleware;
};

module.exports = authorization;
