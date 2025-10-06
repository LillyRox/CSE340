const { body, validationResult } = require("express-validator")
const utilities = require(".") // sigue apuntando a tu módulo general

const validate = {}

// Reglas existentes para classification
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification name is required.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("No spaces or special characters allowed.")
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name: req.body.classification_name
    })
    return
  }
  next()
}

// ----------------------------------------------
// NUEVAS reglas para ADD / UPDATE inventory
// ----------------------------------------------
validate.newInventoryRules = () => {
  return [
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_year").isInt({ min: 1900, max: 2099 }).withMessage("Year must be valid."),
    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Price must be valid."),
    body("inv_miles").isFloat({ min: 0 }).withMessage("Miles must be valid."),
    body("inv_color").trim().notEmpty().withMessage("Color is required."),
    body("classification_id").notEmpty().withMessage("Classification is required.")
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors,
      ...req.body
    })
    return
  }
  next()
}

// ----------------------------------------------
// NUEVO: Middleware para UPDATE
// ----------------------------------------------
validate.checkUpdateData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    res.render("./inventory/edit-inventory", {
      title: `Edit ${req.body.inv_make} ${req.body.inv_model}`,
      nav,
      classificationSelect: classificationList,
      errors,
      ...req.body
    })
    return
  }
  next()
}

module.exports = validate
