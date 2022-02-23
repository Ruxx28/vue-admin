const jwt = require('jsonwebtoken');
const Users = require("../models/user");

const verifyToken = async (req, res, next) => {
  if(!req.hasOwnProperty('headers') || !req.headers.hasOwnProperty('authorization')) {
    return res.status(401).send('Protected resource, use Authorization header to get access')
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    const data = jwt.verify(token, process.env.API_SECRET);
    const user = await Users.findOne({ _id: data._id });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next()
  } catch (err) {
    if (res.name === 'TokenExpiredError'){
      return res.status(401).send('Protected resource, token expired')
    }
    console.error(err)
    return res.status(500).send('Protected resource, token error')
  }
};
module.exports = verifyToken