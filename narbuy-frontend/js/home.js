function loadCategories(){
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let json = JSON.parse(this.responseText);
                console.log(json)
                if(json != null){
                  var itemCounter = 0;
                  for(let i in json){
                    let c = json[i]
                    if(c['parentCategory'] == 'nil'){
                      console.log(c)
                      addCategory(itemCounter, c['parentCategory'], c['productCategory'], c['productCategoryImageUrl'])
                      itemCounter += 1
                    }
                  }
                }
            } else if (this.response == null && this.status === 0) {
                console.log("OFFLINE");
            } else {
                console.log("ERROR")
            }
        }
    };
    request.open("GET", SERVER_PATH + "/productCategory/all", true);
    request.send(null);
  }
  function addCategory(i, parentCategory, productCategory, productCategoryImageUrl){
    console.log(`cat_${i}_link`);
    document.getElementById(`cat_${i}_link`).setAttribute("href", `shop.html?pcat=${parentCategory}&cat=${productCategory}`)
    document.getElementById(`cat_${i}_img`).setAttribute("src", productCategoryImageUrl)
    document.getElementById(`cat_${i}_title`).textContent = productCategory
  }
  function loadProducts(){
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let json = JSON.parse(this.responseText);
                if(json != null){
                  for(let i in json){
                    let p = json[i]
                    addProduct(p['productCategory'], p['productId'], p['productImageUrl'], p['name'], p['price'])
                  }
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
  function addProduct(productCategory, productId, productImageUrl, name, price){
    let url = `detail.html?cat=${productCategory}&pid=${productId}`
    document.getElementById('products').innerHTML += `
      <div class="col-xl-3 col-lg-4 col-sm-6">
        <div class="product text-center">
          <div class="position-relative mb-3">
            <div class="badge text-white bg-"></div><a class="d-block" href="${url}"><img class="img-fluid w-100" src="${productImageUrl}" alt="..."></a>
            <div class="product-overlay">
              <ul class="mb-0 list-inline">
                <li class="list-inline-item m-0 p-0"><button class="btn btn-sm btn-dark" onclick="addToCart('${productId}', 1)">Add to cart</button></li>
              </ul>
            </div>
          </div>
          <h6> <a class="reset-anchor" href="${url}">${name}</a></h6>
          <p class="small text-muted">$${price}</p>
        </div>
      </div>
    `;
  }
  function getContainer(){
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                console.log("Log: " + this.responseText)
                document.getElementById("serverId").innerText = this.responseText;
                print
            } else if (this.response == null && this.status === 0) {
                console.log("OFFLINE");
            } else {
                console.log("ERROR")
            }
        }
    };
    request.open("GET", SERVER_PATH + "/container", true);
    request.send(null);
  }
  window.onload = (event) => {
    reloadCart()
    loadCategories()
    loadProducts()
    getContainer()
  }