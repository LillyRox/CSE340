// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const inventoryValidation = require("../utilities/inventory-validation");
const utilities = require("../utilities");
const { checkEmployeeOrAdmin } = require("../utilities/account-utils"); 

// Management View (Task 1)
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
);

// Add Classification View (Task 2)
router.get(
  "/add-classification",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
);

// Add Inventory View (Task 3)
router.get(
  "/add-inventory",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
);

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build vehicle detail view
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildDetail)
);

// Route to intentionally trigger a 500 error
router.get(
  "/error-trigger",
  utilities.handleErrors(invController.triggerError)
);

// Process Add Inventory
router.post(
  "/add-inventory",
  checkEmployeeOrAdmin,
  inventoryValidation.newInventoryRules(),
  inventoryValidation.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Add Classification - process the form
router.post(
  "/add-classification",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.addClassification)
);

// JSON route for inventory
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to build edit inventory view
router.get(
  "/edit/:inv_id",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.editInventoryView)
);

// Update Inventory
router.post(
  "/update",
  checkEmployeeOrAdmin,
  inventoryValidation.newInventoryRules(),
  inventoryValidation.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// GET route to show delete confirmation
router.get(
  "/delete/:inv_id",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.confirmDeleteInventory)
);

// POST route to actually delete the inventory item
router.post(
  "/delete",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventory)
);

// Management view route protected
router.get(
  "/inv/manage",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagement)
);

module.exports = router;
