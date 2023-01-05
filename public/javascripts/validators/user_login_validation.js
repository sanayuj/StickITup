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
}
if(!password){
    if(passworderr){
        
    }
}

}