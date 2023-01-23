const productadd=document.getElementById("productaddForm")
if(productadd){
    console.log("sanay Entered!!!!!!");
    productadd.addEventListener("submit",adminproductVaildate)
}
function adminproductVaildate(e){
    e.preventDefault();
    const name=document.getElementById("productName").value
    const category=document.getElementById("category").value
    const mrprice=document.getElementById("mrprice").value
    const srprice=document.getElementById("srprice").value
    const productSize=document.getElementById("productSize").value
    const productStock=document.getElementById("productStock").value
    const image=document.getElementById("image").value
    const description=document.getElementById("description").value

    const nameErr=document.getElementById("NameErr")
    const categoryErr=document.getElementById("categoryErr")
    const mrpErr=document.getElementById("mrpErr")
    const srpErr=document.getElementById("srpErr")
    const sizeErr=document.getElementById("sizeErr")
    const stockErr=document.getElementById("StockErr")
    const imageErr=document.getElementById('imageErr')
    const descriptionErr=document.getElementById("descriptionErr")

    nameErr.innerText=""
    categoryErr.innerText=""
    mrpErr.innerText=""
    srpErr.innerText=""
    sizeErr.innerText=""
    stockErr.innerText=""
    imageErr.innerText=""
    descriptionErr.innerText=""

    if(!name){
        nameErr.innerHTML="* Name is required"
        return
    }
    else if(name.length < 3){
        categoryErr.innerHTML="* Enter minimium 3 character"
        return
    }

    if(!category){
        categoryErr.innerHTML="* category is required"
        return
    }
    if(!mrprice){
        mrpErr.innerHTML="* MRP price is required"
        return
        
    }
    if(!srprice){
        srpErr.innerHTML="* SRP price is required"
        return
    }
    if(!productSize){
        sizeErr.innerHTML="* Product size is required"
        return
    }
    if(!productStock){
        stockErr.innerHTML="* Product stock is required"
        return
    }
    if(!image){
        imageErr.innerHTML="* Product image is required"
        return
    }
    if(!description){
        descriptionErr.innerHTML="* Product description is required"
        return
    }
    productadd.submit();
}