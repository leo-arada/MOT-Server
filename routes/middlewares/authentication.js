const jwt = require('jsonwebtoken');
const createError = require('http-errors');

exports.verifyToken = async (req, res, next) => {
  try {
    let token = req.headers['authorization'];
    token = token.startsWith('Bearer') ? token.slice(7, token.length) : null;
    jwt.verify(token, process.env.JWT_KEY);
    next();
  } catch (error) {
    next(createError(401));
  }
};

exports.verifyInvitationToken = async (req, res, next) => {
  try{
    let token = req.headers['authorization'];
    token = token.startsWith('Bearer') ? token.slice(7, token.length) : null;
    const { email } = jwt.verify(token, process.env.JWT_KEY);
    res.locals.email = email;
    next();
  } catch (error) {
    next(createError(401));
  }
};