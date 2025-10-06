// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const inventoryValidation = require("../utilities/inventory-validation")
const utilities = require("../utilities") // tus utilidades generales

// Management View (Task 1)
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)

// Add Classification View (Task 2)
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Add Inventory View (Task 3)
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Route to build vehicle detail view
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildDetail)
)

// Route to intentionally trigger a 500 error
router.get(
  "/error-trigger",
  utilities.handleErrors(invController.triggerError)
)

// Process Add Inventory
router.post(
  "/add-inventory",
  inventoryValidation.newInventoryRules(),
  inventoryValidation.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Add Classification - process the form
router.post(
  "/add-classification",
  utilities.handleErrors(invController.addClassification)
)

// JSON route for inventory
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

// Route to build edit inventory view
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
)

// Update Inventory
router.post(
  "/update",
  inventoryValidation.newInventoryRules(),
  inventoryValidation.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

module.exports = router
