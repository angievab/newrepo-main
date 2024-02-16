const formOne = document.querySelector("#updateAccount")
formOne.addEventListener("change", function () {
   const updateBtn = document.querySelector("button")
   updateBtn.removeAttribute("disabled")
})