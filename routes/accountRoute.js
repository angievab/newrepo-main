// External Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// Route when My Account is clicked 
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route build Register is clicked 
router.get("/register", utilities.handleErrors(accountController.buildRegister))

module.exports = router