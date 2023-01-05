const loginForm=document.getElementById("loginForm");
if(loginForm){
    loginForm.addEventListener("submit",userloginValidation)
}
function userloginValidation(e){
    e.preventDefault()

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const email=document.getElementById("useremail").value
    const password=document.getElementById("userpassword").value
    const emailErr=document.getElementById("useremailError")
    const passworderr=document.getElementById("userpasswordError")

    useremailError.innerText=""
    userpasswordError.innerText=""

    //Email vaildation
if(!email){
    if(emailErr){
        emailErr.innerText="* Email address required"
    }
    return
}
if (/\s/.test(email)) {
    emailErr.innerText="* No white spaces"
return
}
if(!emailRegex.test(email)){
    emailErr.innerText="* Enter the vailed Email address "
    return
}

//password Vaildation

if(!password){
    if(passworderr){
        passworderr.innerText="* Password is required"
    }
    return
}
if(/\s/.test(password)){
    passworderr.innerText="* No space"
    return
}
if(password.length<6){
    passworderr.innerText="* Enter minimum 6 to maximum 16 characters"
    return
}
loginForm.submit()
}