const adminloginForm = document.getElementById("AdmindetailsEntered");
if (adminloginForm) {
  console.log("isdata");
  adminloginForm.addEventListener("submit", adminloginValidate);
}
function adminloginValidate(e) {
  // alert("fun entered")
  e.preventDefault();
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const adminemailError = document.getElementById("adminemailError");
  const adminpasswordError = document.getElementById("adminpasswordError");

  adminemailError.innerText = "";
  adminpasswordError.innerText = "";

  if (!email) {
    if (adminemailError) {
      adminemailError.innerText = "* Email is required";
    }
    return;
  }
  if (/\s/.test(email)) {
    adminemailError.innerText = "* No white space";
    return;
  }
  if (!emailRegex.test(email)) {
    adminemailError.innerText = "* Enter the vailed Email address";
    return;
  }

  //password validation

  if (!password) {
    if (adminpasswordError) {
      adminpasswordError.innerText = "* Password required ";
    }
    return;
  }
  if (/\s/.test(password)) {
    adminpasswordError.innerText = "* No space";
    return;
  }
  if (password.length < 6) {
    adminpasswordError.innerText = "* Enter minimum 6 to maximum 16 characters";
    return;
  }
  adminloginForm.submit();
}
