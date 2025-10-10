// CSE340/routes/favoriteRoute.js
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const favController = require("../controllers/favoriteController")

// Build favorites page (protected)
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.handleErrors(favController.buildFavoritesPage)
)

// Add favorite (POST)
router.post(
  "/add",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.handleErrors(favController.addFavorite)
)

// Remove favorite (POST)
router.post(
  "/remove",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.handleErrors(favController.removeFavorite)
)

module.exports = router
