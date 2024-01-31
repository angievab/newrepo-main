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
}

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildByInventoryId = async (req, res, next) => {
  const inv_id = req.params.inventoryId;
  const data = await invModel.getVehicleByInventoryId(inv_id);
  const detail = await utilities.buildDetailView(data);
  let nav = await utilities.getNav();
  const vehicleYear = data[0].inv_year
  const vehicleMake = data[0].inv_make;
  const vehicleModel = data[0].inv_model;
  res.render("inventory/detail", {
     title: vehicleYear + " " + vehicleMake + " " + vehicleModel,
     nav,
     detail,
  });
}

/* ***************************
*  Build vehicle inventory view
* ************************** */
/*invCont.buildVehicleManagement = async (req, res, next) => {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildOptions()
  res.render("inventory/management", {
     title: "Vehicle Management",
     nav,
     errors: null,
     classificationSelect,
  });
}*/

/***************************
*  Return Inventory by Classification As JSON
* ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
     return res.json(invData)
  } else {
     next(new Error("No data returned"))
  }
}

module.exports = invCont