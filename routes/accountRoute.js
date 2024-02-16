// External Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route when My Account is clicked 
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route build Register is clicked 
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route build Management is clicked 
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

//Route when Log Out is clicked 
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// Route when Update Account is clicked 
router.get("/update/:accountId", utilities.handleErrors(accountController.updateAccountView))

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login request
router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process the update request for account
router.post(
  "/",
  regValidate.accountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process the update request for password
router.post(
  "/update/updatepassword",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)
module.exports = router