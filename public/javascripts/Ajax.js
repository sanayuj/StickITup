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
          url: "/removecartitem",
          data: {
            cart: cartId,
            product: proId,
          },
          method: "post",
          success: (response) => {
            if (response.removeProduct) {
              location.reload();
            }
          },
        });
      } else {
        swal("Cancelled!");
      }
    })
    .then(() => {});
}

//quantitychange

function changeQuantity(cartId, proId, count) {
  const quantity = parseInt(document.getElementById(proId).value);
  $.ajax({
    url: "/change-product-quantity",
    method: "post",
    data: {
      cart: cartId,
      product: proId,
      count: count,
      quantity: quantity,
    },
    success: (response) => {
      if (response.removeProduct) {
        swal("Product remove from the cart").then(() => {
          location.reload();
        });
      } else {
        document.getElementById(proId).value = quantity + parseInt(count);
        const amount = parseInt(
          document.getElementById(proId + "total").innerHTML
        );
        document.getElementById(proId + "count").innerHTML =
          amount * (quantity + count);
        document.getElementById("subtotal").innerHTML =
          parseInt(document.getElementById("subtotal").innerHTML) +
          amount * count;
      }
    },
  });
}

// order

$("#checkout-form").submit((e) => {
  e.preventDefault();
  $.ajax({
    url: "/place-order",
    method: "post",
    data: $("#checkout-form").serialize(),
    success: (response) => {
      if (response.success) {
        location.href = "/ordersuccess";
      } else {
        console.log(response);
        razorpayPayment(response);
      }
    },
  });
});

function razorpayPayment(order) {
  var options = {
    key: "rzp_test_WxzmjFPnyAdbjd", // Enter the Key ID generated from the Dashboard
    amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "Stickitup",
    description: "Test Transaction",
    image: "http://localhost:3000/images/logo.png",
    order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      verifyPayment(response, order);
    },
    prefill: {
      name: "user",
      email: "user@gmail.com",
      contact: "1234567898",
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#193D56",
    },
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
}

function verifyPayment(payment, order) {
  console.log(order);
  console.log(payment);
  $.ajax({
    url: "/verify-payment",
    method: "post",
    data: {
      payment,
      order,
    },

    success: (response) => {
      if (response.paymentsuccess) {
        location.href = "/ordersuccess";
      }
    },
  });
}

$('#otp-form').submit((e)=>{
  const otp=document.getElementById("otp").value
  e.preventDefault()
  $.ajax({
      url:'/otpverification',
      method:"post",
      data:{otp:otp},
       success:(response)=>{
          if(response.status){
              location.href="/user_login"
          }else{
              document.getElementById("otp_wrong").innerHTML="Oopz wrong OTP"
          }
      }
  })
})


