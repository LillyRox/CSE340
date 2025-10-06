// utilities/account-utils.js
const jwt = require("jsonwebtoken");

/**
 * Middleware to check if the logged-in user is Employee or Admin
 */
function checkEmployeeOrAdmin(req, res, next) {
  try {
    const token = req.cookies.jwt; 
    if (!token) {
      return res.status(401).render("account/login", {
        title: "Login",
        message: "You must be logged in to access this page.",
        nav: req.app.locals.nav
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
      res.locals.account_firstname = decoded.account_firstname; 
      res.locals.account_type = decoded.account_type;
      next();
    } else {
      return res.status(403).render("account/login", {
        title: "Login",
        message: "You do not have permission to access this page.",
        nav: req.app.locals.nav
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(403).render("account/login", {
      title: "Login",
      message: "Invalid or expired login session.",
      nav: req.app.locals.nav
    });
  }
}

module.exports = { checkEmployeeOrAdmin };
