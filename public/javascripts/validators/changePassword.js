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
