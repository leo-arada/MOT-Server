const createError = require('http-errors');
const jwt = require('jsonwebtoken');

exports.logIn = async (req, res, next) => {
  try {
    const { facebookId, name } = req.body;
    const cats = await Cat.find({});
    let user = await User.findOne({ facebookId });
    user = user || await new User({ facebookId, name }).save();
    const token = jwt.sign({ facebookId, name }, process.env.JWT_KEY, { 
      expiresIn: '3d' 
    });

    res.json({ 
      result: 'ok', 
      user: {
        facebookId,
        name,
      },
      accessToken: token,
    });
  } catch (error) {
    next(createError(500));
  }
};
