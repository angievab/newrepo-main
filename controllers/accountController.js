const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    return res.redirect("/account/")
    }
  } catch (error) {
      return new Error('Access Forbidden')
    }
 }
  
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
*  Deliver management view
* *************************************** */
/*async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Management",
    nav,
    errors: null,
  })
}*/

/* ****************************************
*  Deliver management view
* *************************************** */
const buildManagement = async (req, res, next) => {
  let nav = await utilities.getNav()
  let account_id = res.locals.accountData.account_id
  res.render("account/management", {
     title: "Account Management",
     nav,
     errors: null,
  })
}

/* ****************************************
 *  Deliver Update view
 * ************************************ */
const updateAccountView = async (req, res, next) => {
  const account_id = parseInt(req.params.accountId)
  let nav = await utilities.getNav()
  const itemData = await accountModel.getAccountById(account_id)
  res.render("account/update", {
     title: "Edit Account",
     nav,
     errors: null,
     account_firstname: itemData.account_firstname,
     account_lastname: itemData.account_lastname,
     account_email: itemData.account_email,
     account_id: itemData.account_id,
  })
}

/* ****************************************
*  Process Update Account
* *************************************** */
const updateAccount = async (req, res) => {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const upAccount = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)
  const accountData = await accountModel.getAccountById(account_id)
  if (upAccount) {
     req.flash(
        "notice",
        `Congratulations, your information has been updated.`
     )
     delete accountData.account_password
     res.clearCookie("jwt");
     const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     return res.redirect("/account/")
  } else {
     req.flash("notice", "Sorry, the update failed.")
     res.status(501).render("account/", {
        title: "Account Management",
        nav,
        errors: null,
     })
  }
}

/* ****************************************
*  Process Update Password
* *************************************** */
const updatePassword = async (req, res, next) => {

  const { account_id, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
     // regular password and cost (salt is generated automatically)
     hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
     req.flash("notice", 'Sorry, there was an error processing the update.')
     res.status(500).redirect("/account")
  }

  const upPassword = await accountModel.updatePassword(hashedPassword, account_id)

  if (upPassword) {
     req.flash(
        "notice",
        `Congratulations, your password was updated.`
     )
     res.status(201).redirect("/account")

  } else {

     req.flash("notice", "Sorry, the update failed.")
     res.status(501).redirect("/account/update/" + account_id)

  }

}

/* ****************************************
*  Process Log out 
* *************************************** */
async function accountLogout(req, res, next) {
  res.clearCookie("jwt");
  return res.redirect("/");
}

module.exports = { 
  buildLogin, 
  accountLogin, 
  buildRegister, 
  registerAccount,
  buildManagement, 
  updateAccountView, 
  updateAccount, 
  updatePassword, 
  accountLogout 
}