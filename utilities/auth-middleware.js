const jwt = require("jsonwebtoken")

function checkEmployeeOrAdmin(req, res, next) {
  const token = req.cookies.jwt
  if (!token) return res.render("account/login", { message: "Please log in." })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
      res.locals.accountData = decoded
      next()
    } else {
      res.render("account/login", { message: "Unauthorized access." })
    }
  } catch (err) {
    res.render("account/login", { message: "Invalid token." })
  }
}

module.exports = { checkEmployeeOrAdmin }
