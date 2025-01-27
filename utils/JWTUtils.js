const jwt = require('jsonwebtoken');
const secret = process.env.JWTSECRET || 'secret'

const tools = {};

tools.createToken = (_id) => {
  const payload = {
    _id
  };

  return jwt.sign(payload, secret, {
    expiresIn: '1D'
  })
}

tools.verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch(error) {
    return false;
  }
}

module.exports = tools;