const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0]?.classification_name || "Unknown"
    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildDetail = async function (req, res, next) {
  try {
    const invId = req.params.inv_id
    const data = await invModel.getVehicleById(invId)

    if (!data) {
      throw new Error("Vehicle not found")
    }

    const html = utilities.buildVehicleDetail(data)
    const nav = await utilities.getNav()

    res.render("./inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      detail: html,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Error trigger test (for 500 error)
 * ************************** */
invCont.triggerError = (req, res, next) => {
  try {
    throw new Error("Intentional 500 error")
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Build Management View
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build Add Classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name: ""
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Process Add Classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)

    if (result) {
      req.flash("notice", "Classification added successfully.")
      res.redirect("/inv/")
    } else {
      req.flash("notice", "Failed to add classification.")
      res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        classification_name
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build Add Inventory View
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()

    // Desestructuramos req.body para asegurar que cada variable exista
    const {
      inv_make = "",
      inv_model = "",
      inv_year = "",
      inv_description = "",
      inv_image = "/images/vehicles/no-image.png",
      inv_thumbnail = "/images/vehicles/no-image-tn.png",
      inv_price = "",
      inv_miles = "",
      inv_color = "",
      classification_id = ""
    } = req.body || {}

    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Process Add Inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image = "/images/vehicles/no-image.png",
      inv_thumbnail = "/images/vehicles/no-image-tn.png",
      inv_price,
      inv_miles,
      inv_color
    } = req.body

    const result = await invModel.addInventory(
      classification_id, inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    )

    if (result) {
      req.flash("notice", "Vehicle added successfully!")
      res.redirect("/inv/")
    } else {
      let nav = await utilities.getNav()
      let classificationList = await utilities.buildClassificationList(classification_id)
      req.flash("notice", "Failed to add vehicle.")
      res.status(400).render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: null,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = invCont
