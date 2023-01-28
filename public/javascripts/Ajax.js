
//add product to cart


function addToCart(proId) {
  $.ajax({
    url: "/addtocart/" + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        let count = parseInt(document.getElementById("cart-count").innerHTML);

        document.getElementById("cart-count").innerHTML = count + 1;
        swal("product added to cart!", "success!", "success");
      }
    },
  });
}

//remove item in cart

function removeitem(cartId, proId) {
  swal({
    title: "Are you sure?",
    text: "The Product will be deleted from the cart!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
    .then((willDelete) => {
      if (willDelete) {
        $.ajax({
          url: '/removecartitem',
          data: {
            cart: cartId,
            product: proId
          },
          method: 'post',
          success: (response) => {
            if (response.removeProduct) {
      location.reload()
            }
          }
        })
      } else {
        swal("Cancelled!");
      }
    }).then(() => {
    })
}

//quantitychange

function changeQuantity(cartId,proId,count){
  const quantity=parseInt(document.getElementById(proId).value)
  $.ajax({
    url:'/change-product-quantity',
    method:'post',
    data:{
      cart:cartId,
      product:proId,
      count:count,
      quantity:quantity
    },
    success:(response)=>{
      if(response.removeProduct){
        swal("Product remove from the cart").then(()=>{
          location.reload()
        })
      }else{
        document.getElementById(proId).value = quantity + parseInt(count)
        const amount=parseInt(document.getElementById(proId+'total').innerHTML)
          document.getElementById(proId+'count').innerHTML=amount*(quantity+count)
          document.getElementById("subtotal").innerHTML=parseInt(document.getElementById("subtotal").innerHTML)+(amount*count)
      }
    }
  })
}

// order 

$("#checkout-form").submit((e)=>{
  alert("gj")
  e.preventDefault()
  $.ajax({
    url:'/place-order',
    method:'post',
    data:$("#checkout-form").serialize(),
    success:(response)=>{
      console.log(response,"4444444444555");
      if(response.status){
        location.href="/ordersuccess"
      }
    }
  })
})