function addToCart(proId) {
  $.ajax({
    url: "/addtocart/" + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        let count = parseInt(document.getElementById("cart-count").innerHTML);

        document.getElementById("cart-count").innerHTML = count + 1;
      }
    },
  });
}

//cart product delection

function deleteCartProduct(Id) {
  swal({
      title: "Are you sure?",
      text: "Delete this item from Your Cart",
      icon: "warning",
      buttons: true,
      dangerMode: true,
  })
      .then((willDelete) => {
          if (willDelete) {
              $.ajax({
                  url: '/delete-cart-item/' + Id,
                  method: "post",
                  success: (response) => {
                      location.reload()
                  }
              })
          }
      });


}