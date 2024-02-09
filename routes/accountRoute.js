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

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process login 
router.post('/login',
regValidate.loginRules(),
regValidate.checkLoginData,
utilities.handleErrors(accountController.accountLogin)
)

module.exports = router