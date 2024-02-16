const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
    // valid email is required and cannot already exist in the database
    body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists){
            throw new Error("Email exists. Please log in or use different email")
            }
        }),
      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

/* ********************************************************
 * Check data and return errors or continue to registration
 * ******************************************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
     // valid email is required and should already exist in the database
     body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required."),

     // password is required and must be strong password
     body("account_password")
        .isLength({
           min: 12,
        })
        .withMessage("Enter your password.")
  ]
}

/*  *************************************************
 *  Check data and return errors or continue to login
 * ************************************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email, account_password } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
       let nav = await utilities.getNav()
       res.render("account/login", {
          errors,
          title: "Login",
          nav,
          account_email,
          account_password,
       })
       return
    }
    next()
 }

/*  **********************************
 *  Update Validation Rules
 * ********************************* */
validate.accountRules = () => {
  return [
     // firstname is required and must be string 
     body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.

     // lastname is required and must be string
     body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name. "), // on error this message is sent.

     // if email is being changed, it cannot already exist in the database
     body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required.")
        .custom(async (account_email, { req }) => {
           const getaccount = await accountModel.getAccountById(req.body.account_id)
           if (getaccount.account_email != account_email) {
              const emailExists = await accountModel.checkExistingEmail(account_email)
              if (emailExists) {
                 throw new Error("This email is already used. Please enter another.")
              }
           }
        })


  ]
}

/* **************************************************
 * Check data and return errors or continue to update
 * ************************************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
     let nav = await utilities.getNav()
     res.render("./account/update", {
        errors,
        title: "Edit Account",
        nav,
        account_firstname,
        account_lastname,
        account_email,
        account_id,
     })
     return
  }
  next()
}

/************************
* Update password rules
*************************/
validate.passwordRules = () => {
  return [

     //account id is required and must be an integer
     body("account_id")
        .trim()
        .isInt(),

     //password is required and must be a strong password
     body("account_password")
        .trim()
        .isStrongPassword({
           minLength: 12,
           minLowercase: 1,
           minUppercase: 1,
           minNumbers: 1,
           minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
  ]
}

/* **********************************************************
* Check data and return errors or continue to update password
* *********************************************************** */
validate.checkPasswordData = async (req, res, next) => {
  const { account_id, account_password } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
     let nav = await utilities.getNav()
     res.render("./account/update", {
        errors,
        title: "Edit Account",
        nav,
        account_id,
        account_password,
     })
     return
  }
  next()
}

  module.exports = validate