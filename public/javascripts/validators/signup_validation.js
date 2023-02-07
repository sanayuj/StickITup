const signupvalidate = document.getElementById("signupvalidate");
if (signupvalidate) {
  signupvalidate.addEventListener("submit", validateSignup);
}
function validateSignup(e) {
  e.preventDefault();
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById(
    "signupConfirmPassword"
  ).value;
  const nameErr = document.getElementById("signupNameErr");
  const emailErr = document.getElementById("signupemailErr");
  const passwordErr = document.getElementById("signuppasswordErr");
  const confirmpasswordErr = document.getElementById(
    "signupconfirmPassworderr"
  );

  console.log(nameErr);
  nameErr.innerText = "";
  emailErr.innerText = "";
  passwordErr.innerText = "";
  confirmpasswordErr.innerText = "";

  //namevalidation

  if (!name) {
    nameErr.innerHTML = " * Name required ";
    return;
  }
  if (/\s/.test(name)) {
    nameErr.innerHTML = " No  spaces ";
    return;
  }
  if (name.length < 3) {
    nameErr.innerHTML = "Enter minimum 3 characters ";
    return;
  }

  //email validation

  if (!email) {
    emailErr.innerHTML = " * Email address required";
    return;
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!emailRegex.test(email)) {
    emailErr.innerHTML = " Enter a valid email address";
    return;
  }

  //password validation

  if (!password) {
    passwordErr.innerHTML = " * Password field required";
    return;
  }

  if (/\s/.test(password)) {
    passwordErr.innerHTML = " No  spaces ";
    return;
  }

  const passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  if (!passwordRegex.test(password)) {
    passwordErr.innerHTML =
      "Password must contain between 6 and 16 characters long and contain at least one special character and a number ";
    return;
  }
  if (password !== confirmPassword) {
    confirmpasswordErr.innerHTML = "Passwords doesnt match";
    return;
  }

  signupvalidate.submit();
}
