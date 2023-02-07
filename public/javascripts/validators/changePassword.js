const changepassword = document.getElementById("signupForm");
if (changepassword) {
  changepassword.addEventListener("submit", changePasswordVaildate);
}

function changePasswordVaildate(e) {
  e.preventDefault();
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword");

  const currentPasswordErr = document.getElementById("CurrentPasswordErr");
  const newPasswordErr = document.getElementById("newPasswordErr");
  const confirmPasswordErr = document.getElementById("conirmPasswordErr");

  currentPasswordErr.innerHTML = " ";
  newPasswordErr.innerHTML = " ";
  confirmPasswordErr.innerHTML = " ";

  if (!currentPassword) {
    currentPasswordErr.innerHTML = "* Password is required";
    return;
  }

  if (!newPassword) {
    newPasswordErr.innerHTML = "* Password is required";
    return;
  }

  if (/\s/.test(newPassword)) {
    newPasswordErr.innerHTML = "* No space";
    return;
  }
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  if (!passwordRegex.test(newPassword)) {
    newPasswordErr.innerHTML =
      "Password must contain between 6 and 16 characters long and contain at least one special character and a number ";
    return;
  }

  if (!confirmPassword) {
    confirmPasswordErr.innerHTML = "* Password is required";
    return;
  }

  

  
  $.ajax({
    url: "/resetpassword",
    method: "post",
    data: $("#signupForm").serialize(),
    success(response) {
      if (response.status) {
        swal("Password Changed ").then(() => {
          location.href = "/userProfile";
        });
      } else {
        location.href = "/changepassword";
      }
    },
  });
}
