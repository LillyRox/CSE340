// CSE340/controllers/favoriteController.js
const favoriteModel = require("../models/favorite-model")
const utilities = require("../utilities/")

/* ****************************************
 *  Add favorite (POST)
 *  Expects req.body.inv_id (or form field inv_id)
 *  Uses res.locals.accountData (set by JWT middleware)
 * **************************************** */
async function addFavorite(req, res, next) {
  try {
    const accountData = res.locals.accountData
    if (!accountData) {
      req.flash("notice", "You need to log in to add favorites.")
      return res.redirect("/account/login")
    }
    const account_id = accountData.account_id
    const inv_id = req.body.inv_id || req.params.inv_id
    if (!inv_id) {
      req.flash("notice", "Missing vehicle ID.")
      return res.redirect("back")
    }

    // Check if already exists
    const exists = await favoriteModel.checkFavoriteExists(account_id, inv_id)
    if (exists) {
      req.flash("notice", "This vehicle is already in your favorites.")
      return res.redirect("back")
    }

    await favoriteModel.addFavorite(account_id, inv_id)
    req.flash("success", "Favorite added!")
    return res.redirect(`/inv/detail/${inv_id}`)
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Remove favorite (POST)
 *  Expects req.body.inv_id
 * **************************************** */
async function removeFavorite(req, res, next) {
  try {
    const accountData = res.locals.accountData
    if (!accountData) {
      req.flash("notice", "You need to log in.")
      return res.redirect("/account/login")
    }
    const account_id = accountData.account_id
    const inv_id = req.body.inv_id || req.params.inv_id
    if (!inv_id) {
      req.flash("notice", "Missing vehicle ID.")
      return res.redirect("back")
    }

    const deleted = await favoriteModel.removeFavorite(account_id, inv_id)
    if (deleted) {
      req.flash("success", "Vehicle removed from your favorites.")
    } else {
      req.flash("notice", "Favorite not found.")
    }
    return res.redirect("back")
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Build "My Favorites" page (GET)
 * **************************************** */
async function buildFavoritesPage(req, res, next) {
  try {
    const accountData = res.locals.accountData
    if (!accountData) {
      req.flash("notice", "You need to log in to view your favorites.")
      return res.redirect("/account/login")
    }
    const account_id = accountData.account_id
    const rows = await favoriteModel.getFavoritesByAccountId(account_id)

    // Build simple HTML grid similar to other utilities
    let html = ""
    if (rows && rows.length > 0) {
      html += "<ul class='favorites-list'>"
      rows.forEach((v) => {
        html += `<li>`
        html += `<a href="/inventory/detail/${v.inv_id}">`
        html += `<img src="${v.inv_thumbnail || v.inv_image || '/images/vehicles/no-image-tn.png'}" alt="${v.inv_make} ${v.inv_model} thumbnail">`
        html += `</a>`
        html += `<div class="fav-info">`
        html += `<h3>${v.inv_year} ${v.inv_make} ${v.inv_model}</h3>`
        html += `<p>Price: $${new Intl.NumberFormat('en-US').format(v.inv_price)}</p>`
        // Remove form
        html += `<form method="POST" action="/favorites/remove" class="fav-remove-form">`
        html += `<input type="hidden" name="inv_id" value="${v.inv_id}">`
        html += `<button type="submit">Remove</button>`
        html += `</form>`
        html += `</div>`
        html += `</li>`
      })
      html += "</ul>"
    } else {
      html = "<p class='notice'>You have no saved favorite vehicles.</p>"
    }

    const nav = await utilities.getNav()
    res.render("favorites/index", {
      title: "My Favorites",
      nav,
      favorites: html,
      messages: req.flash()
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  buildFavoritesPage,
}
