const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

exports.logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('teams');
    if (!user) { 
      return next(createError(422));
    }

    if (!await bcrypt.compare(password, user.password)) {
      return next(createError(401));
    }
    
    const token = jwt.sign({ email }, process.env.JWT_KEY, { 
      expiresIn: '3d',
    });

    res.json({ 
      result: 'ok', 
      user,
      token,
    });
  } catch (error) {
    next(createError(500));
  }
};

exports.signUp = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    let user = await User.findOne({ email });
    if (user) return next(createError(401));
    const password = await bcrypt.hash(req.body.password, 10);
    user = await new User({ email, name, password }).save();
    res.json({ result: 'ok', user });
  } catch(e) {
    next(createError(500));
  }
};
