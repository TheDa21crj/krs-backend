const jwt = require('jsonwebtoken');
const HttpError = require('../models/HttpError')
// const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization; // Authorization: 'Bearer TOKEN'

    if (!token) {
      const error = new HttpError('Authentication failed!',401);
      return next(error)
    }
    const decodedToken = jwt.verify(token,process.env.JWT_SECRATE);
    res.locals.userData = { userEmail: decodedToken.userEmail , userLevel:decodedToken.designation};
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed!', 403);
    console.log(err);
    return next(error);
  }
};
