const stripe = Stripe("your_pk_test_stipe_key_placeholder");
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
    document.getElementById('cartItems').innerHTML += `
    <li class="d-flex align-items-center justify-content-between"><span class="small">Tax</span><span class="text-muted small">${tax.toFixed(2)}</span></li>
    <li class="border-bottom my-2"></li>
    <li class="d-flex align-items-center justify-content-between"><strong class="text-uppercase small fw-bold">Total</strong><span>$${total.toFixed(2)}</span></li>
    `;
}
function addProduct(productCategory, productId, productImageUrl, name, price, quantity){
    let totalPrice = (price * quantity).toFixed(2);
    document.getElementById('cartItems').innerHTML += `
    <li class="d-flex align-items-center justify-content-between"><span class="small">x${quantity}<b> ${name}</b></span><span class="text-muted small">${totalPrice}</span></li>
    <li class="border-bottom my-2"></li>
    `;
}
function getCheckoutDetails(){
    let email = document.getElementById("email").value;
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let phoneNumber = document.getElementById("phoneNumber").value;
    let addressLineOne = document.getElementById("addressLineOne").value;
    let addressLineTwo = document.getElementById("addressLineTwo").value;
    let city = document.getElementById("city").value;
    let country = document.getElementById("country").value;
    
    if(email == "" || firstName == "" || lastName == "" || phoneNumber == "" || addressLineOne == "" || city == "" || country == ""){
    alert("Please fill your delivery details");
    return
    }
    let cart = getCart()
    let items = []
    let subtotal = 0;
    for(let productId in cart){
    let qty = cart[productId]
    let p = products[productId]
    items.push({
        "productId": productId,
        "productCategory": p["productCategory"],
        "quantity": qty
    })
    subtotal += (p['price'] * qty)
    }
    let tax = subtotal * 0.07
    let total = subtotal + tax
    let checkoutDetails = {
        "email": email,
        "firstName": firstName,
        "lastName": lastName,
        "phoneNumber": phoneNumber,
        "addressLineOne": addressLineOne,
        "addressLineTwo": addressLineTwo,
        "city": city,
        "country": country,
        "items": items
    }
    console.log(checkoutDetails)
    console.log("Total: " + total)
    
    //Checkout
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200 || this.status === 201) {
                let json = JSON.parse(this.responseText);
                let clientSecret = json['stripeClientSecret']
                console.log(clientSecret)
                const appearance = {
                theme: 'stripe',
                };
                elements = stripe.elements({ appearance, clientSecret });
                    
                const paymentElement = elements.create("payment");
                paymentElement.mount("#payment-element");
                $('#payment').modal('show')
            } else if (this.response == null && this.status === 0) {
                console.log("OFFLINE");
            } else {
                console.log("ERROR")
            }
        }
    };
    request.open("POST", SERVER_PATH + "/transaction/payment-intent", true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(checkoutDetails));
    //request.send(checkoutDetails);
}
function pay() {
    resetCart()
    setLoading(true);
    const { error } = stripe.confirmPayment({
    elements,
    confirmParams: {
        return_url: THIS_SITE_PATH + "/index.html", //YET TO SET SUCCESS PAGE
    },
    });
    if (error.type === "card_error" || error.type === "validation_error") {
    showMessage(error.message);
    } else {
    showMessage("An unexpected error occured.");
    }
    setLoading(false);
}
function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");

    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;

    setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageText.textContent = "";
    }, 4000);
}
function setLoading(isLoading) {
    if (isLoading) {
        document.querySelector("#submit").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
    } else {
        document.querySelector("#submit").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
    }
}
function cancelPay(){
    $('#payment').modal('hide')
}