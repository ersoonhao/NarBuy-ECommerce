window.onload = (event) => {
    reloadCart()
    loadProducts()
  }
  var products = {}
  function loadProducts(){
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let json = JSON.parse(this.responseText);
                if(json != null){
                  for(let i in json){
                    let p = json[i]
                    products[p['productId']] = p
                  }
                  reloadProducts()
                }
            } else if (this.response == null && this.status === 0) {
                console.log("OFFLINE");
            } else {
                console.log("ERROR")
            }
        }
    };
    request.open("GET", SERVER_PATH + "/product/all", true);
    request.send(null);
  }
  function reloadProducts(){
    document.getElementById('cartItems').innerHTML = "";
    let cart = getCart()
    let subtotal = 0;
    for(let productId in cart){
      let qty = cart[productId]
      let p = products[productId]
      if(p != null){
        addProduct(p['productCategory'], p['productId'], p['productImageUrl'], p['name'], p['price'], qty)
        subtotal += (p['price'] * qty)
      }
    }
    let tax = subtotal * 0.07
      let total = subtotal + tax
      document.getElementById("subtotalAmount").textContent = subtotal.toFixed(2);
      document.getElementById("taxAmount").textContent = tax.toFixed(2);
      document.getElementById("totalAmount").textContent = total.toFixed(2);
    registerQuantitySelectors()
  }
  function addProduct(productCategory, productId, productImageUrl, name, price, quantity){
    let url = `detail.html?cat=${productCategory}&pid=${productId}`;
    let totalPrice = (price * quantity).toFixed(2);
    document.getElementById('cartItems').innerHTML += `
      <tr>
        <th class="ps-0 py-3 border-light" scope="row">
          <div class="d-flex align-items-center"><a class="reset-anchor d-block animsition-link" href="${url}"><img src="${productImageUrl}" alt="..." width="70"/></a>
            <div class="ms-3"><strong class="h6"><a class="reset-anchor animsition-link" href="${url}">${name}</a></strong></div>
          </div>
        </th>
        <td class="p-3 align-middle border-light">
          <p class="mb-0 small">$${price}</p>
        </td>
        <td class="p-3 align-middle border-light">
          <div class="border d-flex align-items-center justify-content-between px-3"><span class="small text-uppercase text-gray headings-font-family">Quantity</span>
            <div class="quantity">
              <button class="dec-btn p-0"><i class="fas fa-caret-left"></i></button>
              <input class="form-control form-control-sm border-0 shadow-0 p-0" type="number" value="${quantity}" data-id='${productId}' onchange="updateProductQuantity('${productId}', this)"/>
              <button class="inc-btn p-0"><i class="fas fa-caret-right"></i></button>
            </div>
          </div>
        </td>
        <td class="p-3 align-middle border-light">
          <p class="mb-0 small">$${totalPrice}</p>
        </td>
        <td class="p-3 align-middle border-light"><a class="reset-anchor" href="javascript: removeProductCartItem('${productId}')"><i class="fas fa-trash-alt small text-muted"></i></a></td>
      </tr>
    `;
  }
  function updateProductQuantity(productId, e){
    setCartItemQuantity(productId, e.value);
    reloadProducts();
  }
  function removeProductCartItem(productId){
    removeCartItem(productId);
    reloadProducts();
  }
  function registerQuantitySelectors(){
    document.querySelectorAll('.dec-btn').forEach((el) => {
      el.addEventListener('click', () => {
        var siblings = el.parentElement.querySelector('input');
        if (parseInt(siblings.value, 10) >= 1) {
          siblings.value = parseInt(siblings.value, 10) - 1;
          updateProductQuantity(siblings.dataset.id, siblings);
        }
      });
    });
    document.querySelectorAll('.inc-btn').forEach((el) => {
      el.addEventListener('click', () => {
        var siblings = el.parentElement.querySelector('input');
        siblings.value = parseInt(siblings.value, 10) + 1;
        updateProductQuantity(siblings.dataset.id, siblings);
      });
    });
  }