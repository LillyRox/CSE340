const { body, validationResult } = require("express-validator");
const utilities = require(".");
const accountModel = require("../models/account-model");

/* ****************************************
 * Registration Data Validation Rules
 * **************************************** */
const registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
    body("account_lastname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."),
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email already exists. Please log in or use a different one.")
        }
      }),
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
      .withMessage("Password must be at least 12 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.")
  ]
}

/* ****************************************
 * Login Data Validation Rules
 * **************************************** */
const loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email."),
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password cannot be empty.")
  ]
}

/* ****************************************
 * Account Update Validation Rules
 * **************************************** */
const accountValidationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("First name is required."),
    body("account_lastname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Last name is required."),
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists && emailExists.account_id != req.body.account_id) {
          throw new Error("Email already in use by another account.")
        }
      })
  ]
}

/* ****************************************
 * Password Update Validation Rules
 * **************************************** */
const passwordValidationRules = () => {
  return [
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
      .withMessage("Password must be at least 12 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.")
  ]
}

/* ****************************************
 * Check Data and Return Errors
 * **************************************** */
const checkRegData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Register",
      nav,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email
    })
    return
  }
  next()
}

const checkLoginData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email: req.body.account_email
    })
    return
  }
  next()
}

/* ****************************************
 * Check Account Update Data
 * **************************************** */
const checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update", {
      errors,
      title: "Update Account",
      nav,
      account_id: req.body.account_id,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email
    })
    return
  }
  next()
}

/* ****************************************
 * Check Password Update Data
 * **************************************** */
const checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update", {
      errors,
      title: "Change Password",
      nav,
      account_id: req.body.account_id
    })
    return
  }
  next()
}

module.exports = {
  registrationRules,
  loginRules,
  accountValidationRules,
  passwordValidationRules,
  checkRegData,
  checkLoginData,
  checkUpdateData,
  checkPasswordData
}
