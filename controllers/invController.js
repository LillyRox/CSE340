const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
};

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildDetail = async function (req, res, next) {
  try {
    const invId = req.params.inv_id;
    const data = await invModel.getVehicleById(invId);

    if (!data) {
      throw new Error("Vehicle not found");
    }

    const html = utilities.buildVehicleDetail(data);
    const nav = await utilities.getNav();

    res.render("./inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      detail: html,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Error trigger test (for 500 error)
 * ************************** */
invCont.triggerError = (req, res, next) => {
  try {
    throw new Error("Intentional 500 error");
  } catch (err) {
    next(err);
  }
};

module.exports = invCont;