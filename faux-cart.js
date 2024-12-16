const
    // set the name of your shop here
    shopID = 'testShop',
    // match the following attributes to the classes on your products
    productClass = 'product',
    imageClass = 'prodImage',
    nameClass = 'prodName',
    descClass = 'prodDesc',
    priceClass = 'prodPrice',
    // match the following attributes to your cart total elements
    cartTotalID = 'cartTotal',
    cartItemCountID = 'cartItemCount';


// check if shop exists in local storage, create it if not
if (localStorage.getItem(shopID) === null) {
    localStorage.setItem(shopID, JSON.stringify({ cart: [] }));
}

//initialize the shop object
let shop = JSON.parse(localStorage.getItem(shopID));

// Define the Product class
class Product {
    constructor(name, desc, price, imgSrc, qty = 1) {
        this.name = name;
        this.desc = desc;
        this.price = price;
        this.imgSrc = imgSrc;
        this.qty = qty;
    }
}

function addToCart(e) {
    // prevent default link behavior
    e.preventDefault();
    // get the product attributes from DOM
    let product = e.target.parentElement.children;
    // create an array to hold product attributes
    let attributes = ['name', 'desc', 'price', 'imgSrc'];
    // loop through the product attributes and assign them to the array
    for (let node of product) {
        if (node.className === nameClass) attributes[0] = node.innerText;
        if (node.className === descClass) attributes[1] = node.innerText;
        if (node.className === priceClass) attributes[2] = parseFloat(node.innerText);
        if (node.className === imageClass) attributes[3] = node.currentSrc;
    }
    // check if any attributes are undefined
    if (attributes.includes(undefined)) {
        console.log("Error: One or more attributes are undefined, check your class names");
        return; // exit function
    }
    // check if the item is already in the cart
    for (let item of shop.cart) {
        if (item.name === attributes[0]) {
            // increase quantity by 1
            item.qty++;
            // update local storage
            localStorage.setItem(shopID, JSON.stringify(shop));
            console.log("Item already in cart, increased quantity by 1");
            updateCartTotals()
            return; // exit function
        }
    }
    // add item to cart
    shop.cart.push(new Product(...attributes));
    // update local storage
    localStorage.setItem(shopID, JSON.stringify(shop));
    // update cart totals
    updateCartTotals()
}

function cartTotal() {
    let total = 0;
    let itemCount = 0
    // check if cart is empty
    if (shop.cart.length === 0) return [total, itemCount];
    // loop through cart and add up total
    for (let item of shop.cart) {
        total += item.price * item.qty;
        itemCount += item.qty;
    }
    // return total and item count
    return [total, itemCount]
}

function updateCartTotals() {
    let total = cartTotal();
    // check if cartTotal element exists and update if applicable
    if(document.getElementById(cartTotalID) !== null) {
        document.getElementById(cartTotalID).innerHTML = `${total[0].toFixed(2)}`;
    }
    // check if cartItemCount element exists and update if applicable
    if(document.getElementById(cartItemCountID) !== null) {
        document.getElementById(cartItemCountID).innerHTML = `${total[1]}`;
    }
}

function updateCart() {
    let cart = document.getElementById('cart');
    let total = 0;
    // check if cart is empty
    if (shop.cart.length === 0) {
        cart.innerHTML = '<h3>Your cart is empty</h3>';
        return;
    }
    // loop through cart and add items to cart element
    for (let [index, item] of shop.cart.entries()) {
        total += item.price * item.qty;
        cart.innerHTML += `
        <div class="cartItem">
            <img src="${item.imgSrc}" alt="${item.name}">
            <div class="cartItemInfo" >
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <div class="cartItemPricing">
                    <p>Price: $${item.price.toFixed(2)}</p>
                    <p>Quantity: ${item.qty}</p>
                    <p>Subtotal: $${(item.price * item.qty).toFixed(2)}</p>
                    <a id="${index}" href="#" class="removeBtn">Remove</a>
                </div>
            </div>
            
        </div>
        `;
    }
    // add total to cart element
    cart.innerHTML += `
    <div class="cartTotal">
        <h3>Total: $${total.toFixed(2)}</h3>
        <a href="#" id="emptyCart">Empty Cart</a>
    </div>
    `;
    // add event listeners to buttons
    document.querySelectorAll('.removeBtn').forEach(button => button.addEventListener('click', removeItem));
    document.getElementById('emptyCart').addEventListener('click', emptyCart);
}

function removeItem(e) {
    e.preventDefault();
    let index = e.target.id;
    // remove item from cart
    shop.cart.splice(index, 1);
    // update local storage
    localStorage.setItem(shopID, JSON.stringify(shop));
    // reload page to update cart
    location.reload();
}

function emptyCart() {
    // empty cart
    shop.cart = [];
    // update local storage
    localStorage.setItem(shopID, JSON.stringify(shop));
    // reload page to update cart
    location.reload();
}

// Add Event listners when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    // check if addToCart buttons exist
    if (document.querySelectorAll('.addToCart') !== null) {
        let cartButtons = document.querySelectorAll('.addToCart');
        cartButtons.forEach(button => button.addEventListener('click', addToCart))
    }
    // check if cart element exists
    if (document.getElementById('cart') !== null) {
        updateCart();
    }
    // check if cart has items and update totals
    if (shop.cart.length >= 0) {
        updateCartTotals();
    }

    // Log shop object to console
    console.log("Ready", shop.cart);
});