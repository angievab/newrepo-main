// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build inventory by vehicle view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildVehicleManagement));

module.exports = router;