const jwt = require("jsonwebtoken");
const secret = "fujail@@";

// function to generete jwt token
function genereteToken(user) {
  const token = jwt.sign(user, secret);
  return token;
}

//  function to verify jsonwebtoken
function validateToken(token) {
  return jwt.verify(token, secret);
}

module.exports = {
  genereteToken,
  validateToken,
};
