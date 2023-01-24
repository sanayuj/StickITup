


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

//cart product delection

// function deleteCartProduct(Id) {
//   swal({
//       title: "Are you sure?",
//       text: "Delete this item from Your Cart",
//       icon: "warning",
//       buttons: true,
//       dangerMode: true,
//   })
//       .then((willDelete) => {
//           if (willDelete) {
//               $.ajax({
//                   url: '/delete-cart-item/' + Id,
//                   method: "post",
//                   success: (response) => {
//                       location.reload()
//                   }
//               })
//           }
//       });
// }

function removeitem(cartId, proId) {
  // console.log(cartId,"ooooooooopppo");
  // console.log(proId,"pppppppppp");
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
  //console.log(cartId,"newone");
 // console.log(proId,"ffffffffnewone");

  const quantity=parseInt(document.getElementById(proId).value)
  //console.log(quantity,"popopopopopopopjhjhjhjjhj");
  // alert("popopop")
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
        const amount=parseInt(document.getElementById(proId+"total").innerHTML)
        console.log(amount*(quantity+count),"amount")
          document.getElementById(proId+"count").innerHTML=amount*(quantity+count)
      }

    }

  })
}