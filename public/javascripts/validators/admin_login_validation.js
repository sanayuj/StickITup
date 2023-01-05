const adminlogin=document.getElementById('adminlogin');
if(adminlogin){
    adminlogin.addEventListener("submit",adminloginValidate)
}
function adminloginValidate(e){
    e.preventDefault()
    const email=document.getElementById('adminEmail').value
    const password=document.getElementById('adminPassword').value
    const emailErr=document.getElementById('adminemailError')
    const passwordErr=document.getElementById('adminpasswordError')
}