window.onload = (event) => {
    reloadCart()
    let url = new URL(location.href);
    let pcat = url.searchParams.get("pcat");
    let cat = url.searchParams.get("cat");
    if(pcat == null){
      loadAnyCategories()
      return
    }
    loadCategories(pcat, cat);
    if(pcat == "nil"){
      loadMainCategoryProducts(cat)
    }else{
      loadProducts(cat);
    }
  }
  function loadAnyCategories(){
    let request = new XMLHttpRequest();
      request.onreadystatechange = function () {
          if (this.readyState === 4) {
              if (this.status === 200) {
                  let json = JSON.parse(this.responseText);
                  console.log(json)
                  if(json != null){
                    for(let c of json){
                      if(c['parentCategory'] == 'nil'){
                        loadCategories(c['parentCategory'], c["productCategory"]);
                        loadMainCategoryProducts(c["productCategory"])
                        return
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
      console.log(SERVER_PATH + "/productCategory/all");
      request.open("GET", SERVER_PATH + "/productCategory/all", true);
      request.send(null);
  }
  function loadCategories(selectedMainCategory, selectedSubCategory){
    let request = new XMLHttpRequest();
      request.onreadystatechange = function () {
          if (this.readyState === 4) {
              if (this.status === 200) {
                  let json = JSON.parse(this.responseText);
                  console.log(json)
                  if(json != null){
                    var mainCategories = []
                    var subCategories = {}
                    for(let c of json){
                      if(c['parentCategory'] == 'nil'){
                        mainCategories.push(c)
                      }else{
                        if(subCategories[c['parentCategory']] == null){
                          subCategories[c['parentCategory']] = [c]
                        }else{
                          subCategories[c['parentCategory']].push(c)
                        }
                      }
                    }
                    for(let mainCategory of mainCategories){
                      console.log(mainCategory)
                      addCategories(mainCategory, subCategories[mainCategory["productCategory"]], selectedMainCategory, selectedSubCategory)
                    }
                  }
              } else if (this.response == null && this.status === 0) {
                  console.log("OFFLINE");
              } else {
                  console.log("ERROR")
              }
          }
      };
      console.log(SERVER_PATH + "/productCategory/all");
      request.open("GET", SERVER_PATH + "/productCategory/all", true);
      request.send(null);
  }
  function addCategories(mainCategory, subCategories, selectedMainCategory, selectedSubCategory){
    var categories = document.getElementById("categories");
    var catClass = "bg-light";
    if(mainCategory["productCategory"] == selectedMainCategory || mainCategory["productCategory"] == selectedSubCategory){
      catClass = "bg-dark text-white"
    }
    let cURL = `shop.html?pcat=${mainCategory["parentCategory"]}&cat=${mainCategory["productCategory"]}`
    categories.innerHTML += `
      <div class="py-2 px-4 ${catClass} mt-3 mb-3"><a class="reset-anchor" href=${cURL}><strong class="small text-uppercase fw-bold">${mainCategory["productCategory"]}</strong></a></div>
      <ul class="list-unstyled small text-muted ps-lg-4 font-weight-normal">
    `;
    for(let i in subCategories){
      let sc = subCategories[i]
      let scURL = `shop.html?pcat=${sc["parentCategory"]}&cat=${sc["productCategory"]}`
      var subcatStyle = "color: #6c757d !important; "
      if(sc["productCategory"] == selectedSubCategory){
        subcatStyle = "font-weight: bold; "
      }
      categories.innerHTML += `<li style='${subcatStyle} padding-left: 25px; list-style: none; font-size: 0.90em;' class="mb-2">
        <a class="reset-anchor" href="${scURL}">${sc["productCategory"]}</a>
      </li>
      `
    }
    categories.innerHTML += "</ul>"
  }
  function loadMainCategoryProducts(mainCategory){
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let json = JSON.parse(this.responseText);
                if(json != null){
                  for(let i in json){
                    let c = json[i]
                    loadProducts(c['productCategory'])
                  }
                }
            } else if (this.response == null && this.status === 0) {
                console.log("OFFLINE");
            } else {
                console.log("ERROR")
            }
        }
    };
    request.open("GET", SERVER_PATH + "/productCategory/" + mainCategory, true);
    request.send(null);
  }

  var products = []
  function loadProducts(category){
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let json = JSON.parse(this.responseText);
                if(json != null){
                  for(let i in json){
                    let p = json[i]
                    console.log(p)
                    products.push(p)
                  }
                }
                reloadProducts()
            } else if (this.response == null && this.status === 0) {
                console.log("OFFLINE");
            } else {
                console.log("ERROR")
            }
        }
    };
    request.open("GET", SERVER_PATH + "/product/" + category, true);
    request.send(null);
  }
  
  function reloadProducts(){
    let sortType = document.getElementById("sortType").value
    if(sortType == "high-low"){
      products = products.sort((a, b) => {
        return (a['price']<b['price'])?1:-1;
      });
    }else if(sortType == "low-high"){
      products = products.sort((a, b) => {
        return (a['price']>b['price'])?1:-1;
      });
    }else{
      products = products.sort((a, b) => {
        var aName = a['name'].toUpperCase();
        var bName = b['name'].toUpperCase();
        return (aName < bName) ? -1 : (aName > bName) ? 1 : 0;
      });
    }
    console.log(products)
    document.getElementById('rCount').innerText = products.length;
    document.getElementById('products').innerHTML = ""
    for(p of products){
      addProduct(p['productCategory'], p['productId'], p['productImageUrl'], p['name'], p['price'])
    }
  }
  function addProduct(productCategory, productId, productImageUrl, name, price){
    let url = `detail.html?cat=${productCategory}&pid=${productId}`
    document.getElementById('products').innerHTML += `
      <div class="${getProductSizingClass()}">
        <div class="product text-center">
          <div class="mb-3 position-relative">
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
  var productSizing = 1;
  function setProductSizing(sizing){
    productSizing = sizing
    for(let p of document.getElementsByClassName("ctnProduct")){
      p.classList = getProductSizingClass()
    }
  }
  function getProductSizingClass(){
    if(productSizing == 1){
      return `ctnProduct col-lg-4 col-sm-6`
    }else{
      return `ctnProduct col-lg-6 col-sm-12`
    }
  }
  function sortProduct(e){
    reloadProducts()
  }