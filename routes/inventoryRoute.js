// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build inventory by vehicle view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildVehicleManagement));

// Route to build management vehicle view
router.get("/", utilities.handleErrors(invController.buildVehicleManagement));

// Route to add classification view
router.get("/addclassification", utilities.checkLogin,
   utilities.handleErrors(invController.buildAddClassification));

// Route to add inventory view
router.get("/addinventory", utilities.checkLogin, 
    utilities.handleErrors(invController.buildAddInventory));

// Route to get inventory view
    router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Update an Item from Inventory Activity
/*router.get("/edit/:inv_id",
    utilities.checkLogin,
    //utilities.checkPermission,
    utilities.handleErrors(invController.buildEditInventory))

// Delete an Item from Inventory Activity
router.get("/delete/:inv_id",
   utilities.checkLogin,
   //utilities.checkPermission,
   utilities.handleErrors(invController.buildDeleteInventory))*/

// Process the add classification 
router.post('/addclassification', 
    utilities.checkLogin,  
    invValidate.classificationRules(), 
    invValidate.checkClassData, 
    utilities.handleErrors(invController.addClassification));

// Process the add inventory 
router.post('/addinventory', 
    utilities.checkLogin, 
    invValidate.inventoryRules(), 
    invValidate.checkInvData,
    utilities.handleErrors(invController.addInventory));

// Processing the update of an Item from Inventory Activity
/*router.post("/update/",
   utilities.checkLogin,
   //utilities.checkPermission,
   classValidate.newInventoryRules(),
   classValidate.checkUpdateData,
   utilities.handleErrors(invController.updateInventory));

// Process the deletion of an Item from Inventory Activity
router.post("/delete/", utilities.handleErrors(invController.deleteInventory));*/

module.exports = router;