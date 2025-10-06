// utilities/index.js
const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ***************************************
 * Build the navigation HTML
 **************************************** */
Util.getNav = async function () {
  try {
    const data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
      list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`
    })
    list += "</ul>"
    return list
  } catch (error) {
    console.error("Error building nav:", error)
    return "<ul><li>Error loading navigation</li></ul>"
  }
}

/* ***************************************
 * Build classification grid HTML
 **************************************** */
Util.buildClassificationGrid = async function (data) {
  let grid = ""
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach((vehicle) => {
      grid += '<li>'
      grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details"><img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" /></a>`
      grid += '<div class="namePrice"><hr />'
      grid += `<h2><a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">${vehicle.inv_make} ${vehicle.inv_model}</a></h2>`
      grid += `<span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span></div>`
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ***************************************
 * Build vehicle detail HTML
 **************************************** */
Util.buildVehicleDetail = function (vehicle) {
  let detail = `<div class="vehicle-detail">`
  detail += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">`
  detail += `<div class="vehicle-info">`
  detail += `<h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>`
  detail += `<p><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</p>`
  detail += `<p><strong>Mileage:</strong> ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles</p>`
  detail += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`
  detail += `<p><strong>Description:</strong> ${vehicle.inv_description}</p>`
  detail += `</div></div>`
  return detail
}

/* ***************************************
 * Build classification select list
 **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  try {
    const data = await invModel.getClassifications()
    let list = '<select name="classification_id" id="classificationList" required>'
    list += '<option value="">Choose a Classification</option>'
    data.rows.forEach((row) => {
      list += `<option value="${row.classification_id}"${classification_id == row.classification_id ? " selected" : ""}>${row.classification_name}</option>`
    })
    list += "</select>"
    return list
  } catch (error) {
    console.error("Error building classification list:", error)
    return '<select><option>Error loading classifications</option></select>'
  }
}

/* ***************************************
 * Middleware: Handle async errors
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

/* ***************************************
 * Middleware: Check JWT token
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
      if (err) {
        req.flash("notice", "Please log in")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
      }
      res.locals.accountData = accountData
      res.locals.loggedin = 1
      next()
    })
  } else {
    next()
  }
}

/* ***************************************
 * Middleware: Check login
 **************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = Util
