window.onload = (event) => {
    let url = new URL(location.href);
    let cat = url.searchParams.get("cat");
    let pid = url.searchParams.get("pid");
    loadProduct(cat, pid)
    loadRelatedProducts(cat, pid)
    reloadCart()
}
function loadProduct(cat, pid){
let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let json = JSON.parse(this.responseText);
                console.log(json)
                if(json != null){
                setProduct(json)
                }
            } else if (this.response == null && this.status === 0) {
                console.log("OFFLINE");
            } else {
                console.log("ERROR")
            }
        }
    };
    request.open("GET", SERVER_PATH + "/product/"+cat+"/"+pid, true);
    request.send(null);
}
function loadRelatedProducts(cat, pid){
let request = new XMLHttpRequest();
request.onreadystatechange = function () {
    if (this.readyState === 4) {
        if (this.status === 200) {
            let json = JSON.parse(this.responseText);
            if(json != null){
                document.getElementById('products').innerHTML = ""
                for(let i in json){
                let p = json[i]
                if(p["productId"] != pid){
                    addProduct(p['productCategory'], p['productId'], p['productImageUrl'], p['name'], p['price'])
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
request.open("GET", SERVER_PATH + "/product/"+cat, true);
request.send(null);
}
function addProduct(productCategory, productId, productImageUrl, name, price){
let url = `detail.html?cat=${productCategory}&pid=${productId}`
document.getElementById('products').innerHTML += `
    <div class="col-lg-3 col-sm-6">
    <div class="product text-center skel-loader">
        <div class="d-block mb-3 position-relative"><a class="d-block" href="${url}"><img class="img-fluid w-100" src="${productImageUrl}" alt="..."></a>
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
function setProduct(p){
document.getElementById("pImgMini").setAttribute("src", p["productImageUrl"])
document.getElementById("pImgLink").setAttribute("href", p["productImageUrl"])
document.getElementById("pImg").setAttribute("src", p["productImageUrl"])
document.getElementById("pName").textContent = p["name"]
document.getElementById("pPrice").textContent = "$"+p["price"]
document.getElementById("pDesc").textContent = p["description"]
loadParentCategory(p["productCategory"])
document.getElementById("btnAddToCart").onclick = (e) => {
    let quantity = document.getElementById("addCartQuantity").value
    addToCart(p["productId"], parseInt(quantity))
}
}
function preview(){
let g = GLightbox({
    selector: '.glightbox',
});
g.open()
}
function loadParentCategory(productCategory){
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
                if(c['productCategory'] == productCategory){ 
                    document.getElementById("pCat").setAttribute("href", `shop.html?pcat=${c['parentCategory']}&cat=${c['productCategory']}`)
                    document.getElementById("pCat").textContent = c["productCategory"]
                    document.getElementById("pParentCat").setAttribute("href", `shop.html?pcat=nil&cat=${c['parentCategory']}`)
                    document.getElementById("pParentCat").textContent = c["parentCategory"]
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