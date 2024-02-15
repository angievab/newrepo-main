const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" ></a>'
      grid += '<div class="vehicleSection">'
      grid += '<hr >'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle view HTML
* ************************************ */
Util.buildDetailView = async (data) => {
   let detail
   if (data.length > 0) {
      detail = '<div class="vehicleContainer">'
      data.forEach(vehicle => {
         detail += `
                   <div>
                     <img src="${vehicle.inv_image}" alt="${vehicle.inv_model}" >
                   </div>
                   <div>
                     <p> ${vehicle.inv_make} ${vehicle.inv_model} Details </p>
                     <p>Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)} </p>
                     <p>Description:  <span> ${vehicle.inv_description} </span> </p>
                     <p>Color: <span> ${vehicle.inv_color} </span> </p>
                     <p>Miles: <span> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} </span> </p>
                   </div>
                   `
      })
      detail += '</div>'
   } else {
      detail += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
   }
   return detail
}

/* **************************************
* Build drop-down select list for add inventory form.
* ************************************ */
Util.buildClassificationList = async (optionSelected) => {
  let data = await invModel.getClassifications()
  let options = `
                 <select name="classification_id" id="classificationList" required>
                    <option selected disabled hidden>
                       Choose a classification
                    </option>`
  data.rows.forEach(row => {
     options += `<option value="${row.classification_id}" ${row.classification_id === Number(optionSelected) ? 'selected' : ''}> ${row.classification_name} </option>`
  })
  options += `</select>`
  return options
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }
 
 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

module.exports = Util