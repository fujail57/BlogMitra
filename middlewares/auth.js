const { validateToken } = require("../services/authentication");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "your_jwt_secret";

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();
    }
    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {
      throw error;
    }
    return next();
  };
}


//  restrictToLoggedInUserOnly

// const restrictToLoggedInUserOnly = (req, res, next) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ error: "Unauthorized: No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, secret);
//     req.user = decoded; // Attach user info to request
//     next(); // Proceed to the next middleware/route handler
//   } catch (err) {
//     return res.status(401).json({ error: "Unauthorized: Invalid token" });
//   }
// };

module.exports = {
  checkForAuthenticationCookie,
//   restrictToLoggedInUserOnly,
};
