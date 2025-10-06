// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Route to build login view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

// Route to build registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

// Route to process registration form
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Default route for Account Management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

// =======================
// Account Update / Password
// =======================

// Route to build account update view
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateView)
)

// Route to process account info update
router.post(
  "/update-info",
  regValidate.accountValidationRules(),  // validate first name, last name, email
  utilities.handleErrors(accountController.updateAccount)
)

// Route to process password change
router.post(
  "/update-password",
  regValidate.passwordValidationRules(), // validate password
  utilities.handleErrors(accountController.updatePassword)
)

// =======================
// Logout
// =======================
router.get("/logout", (req, res) => {
  res.clearCookie("jwt") 
  res.redirect("/")      
})


module.exports = router
