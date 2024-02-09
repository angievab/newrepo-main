const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
   return [
      // classification is required and must be string
      body("classification_name")
         .isLength({ min: 3 })
         .isAlpha()
         .withMessage("Classification name does not meet requirements.") // on error this message is sent.
         .custom(async (classification_name) => {
            const classExists = await invModel.checkExistingClassification(classification_name)
            if (classExists) {
               throw new Error("Classification name exists. Please try another name.")
            }
         })
   ]
}

/* ******************************
 * Check data and return errors or continue adding classification name
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
   const { classification_name } = req.body
   let errors = []
   errors = validationResult(req)
   if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/addclassification", {
         errors,
         title: "Add Classification",
         nav,
         classification_name,
      })
      return
   }
   next()
}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        body("inv_make")
          .isLength({ min: 3 })
          .withMessage("Please provide a correct brand name."),

        body("inv_model")
          .isLength({ min: 3 })
          .withMessage("Please check the model."),

        body("inv_year")
          .isNumeric({ min: 4, max: 4 })
          .withMessage("Please check if the year is correct."),

        body("inv_description")
          .isLength({ min: 1 })
          .withMessage("Please follow the requirements."),

        body("inv_image")
          .isLength({ min: 10 })
          .withMessage("Please re enter a picture."),

        body("inv_thumbnail")
          .isLength({ min: 10 })
          .withMessage("Please re enter a picture."),

        body("inv_price")
          .isNumeric({ min: 1 })
          .withMessage("Please enter integer numbers."),

        body("inv_miles")
          .isNumeric({ min: 1 })
          .withMessage("Please enter integer numbers."),

        body("inv_color")
          .isLength({ min: 1 })
          .withMessage("Please provide an adecuate color"),
    
        body("classification_id")
          .isNumeric({ min: 1 })
          .withMessage("Please choose a classification.")
    ]
}

/* ******************************
 * Check data and return errors or continue adding inventory
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
   const {  inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body
   let errors = []
   errors = validationResult(req)
   if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let options = await utilities.buildOptions()
      res.render("inventory/addinventory", {
         errors,
         title: "Add Inventory",
         nav,
         options,
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
      return
   }
   next()
}

/* ******************************
 * Errors will be directed back to the edit view
 * ***************************** */
/*validate.checkUpdateData = async (req, res, next) => {
   const {  inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body
   let errors = []
   errors = validationResult(req)
   if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let options = await utilities.buildOptions()
      res.render("inventory/editinventory", {
         errors,
         title: "Edit Inventory",
         nav,
         options,
         inv_id,
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
      return
   }
   next()
}*/

module.exports = validate