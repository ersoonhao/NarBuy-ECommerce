function getCart(){
    let cart = localStorage.getItem('cart');
    return parseCart(cart)
}
function resetCart(){
    localStorage.removeItem('cart');
    reloadCart()
}
function setCartItemQuantity(productId, quantity){
    let cart = getCart()
    cart[productId] = quantity
    localStorage.setItem('cart', JSON.stringify(cart));
    reloadCart()
}
function removeCartItem(productId){
    let cart = getCart()
    delete cart[productId]
    localStorage.setItem('cart', JSON.stringify(cart));
    reloadCart()
}
function addToCart(productId, quantity){
    let cart = getCart()
    cart[productId] = parseCartQuantity(cart[productId], quantity)
    localStorage.setItem('cart', JSON.stringify(cart));
    reloadCart()
  }
  function parseCart(cart){
    if(cart != null){
      try{
        return JSON.parse(cart)
      }catch{
      }
    }
    return {}
  }
  function parseCartQuantity(oQty, qty){
    if(oQty != null){
      try{
        oQty = parseInt(oQty);
        console.log(oQty)
        if(!isNaN(oQty)){
          return oQty + qty;
        }
      }catch{
      }
    }
    return qty
  }
  function reloadCart(){
    let count = 0;
    let cart = localStorage.getItem('cart');
    cart = parseCart(cart)
    console.log(cart)
    for(let i in cart){
      try{
        let qty = parseInt(cart[i])
        count += qty
      }catch{
      }
    }
    document.getElementById("cartCount").textContent = `(${count})`;
  }