// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountsController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation');


// Route to build login view
router.get(
  "/login",
  utilities.handleErrors(accountsController.buildLogin)
)

// Route to build registration view
router.get(
    "/register", 
    utilities.handleErrors(accountsController.buildRegister)
)

// Route to process registration form
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountsController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process');
  }
)

module.exports = router

