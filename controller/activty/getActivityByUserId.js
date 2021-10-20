const { decodeJwt } = require('../../utils/jwt');
const { asyncGetActivityByUserId } = require('../../dbSubcriber');

const getActivityByUserId = async (req, res) => {
  const authorizationHeader = req.header('Authorization');
  const token = authorizationHeader.substring(7);
  const decode = await decodeJwt(token);
  let activities;

  try {
    // @ts-ignore
    activities = await asyncGetActivityByUserId(decode.userId);
  } catch {
    res.status(500);
    return res.json({
      errorMessage: 'There is some problem with server, please try again later',
    });
  }

  return res.json({ activities });
};

module.exports = getActivityByUserId;
