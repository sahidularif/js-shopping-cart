// variables
const productsDOM = document.querySelector(".products-center");
let subTotal = document.getElementById("subtotal");
let total = document.getElementById("total");
let totalPay = document.getElementById("pay");

// On DOM Loading
document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    // get all products
    products.getProducts().then(products => {
        ui.displayProduct(products);
        displayCart();
    }).then(() => {
        products.getProducts().then(products => {
            let pdCollection = document.querySelectorAll(".product");
            for (let i = 0; i < pdCollection.length; i++) {
                pdCollection[i].addEventListener('click', () => {
                    location.reload();
                    cartNumbers(products[i]);
                    totalCost(products[i])
                })

            }
        })

    })

})
// Getting UI cart total
function getCartPrice() {
    let cartTotal = localStorage.getItem('totalPrice')
    totalPay.innerText = `BDT ${cartTotal}.00`;
    total.innerText = `BDT ${cartTotal}.00`;
    subTotal.innerText = `BDT ${cartTotal}.00`;
}
getCartPrice();

// Getting the products
class Products {
    async getProducts() {
        try {
            let result = await fetch('items.json');
            let data = await result.json();
            let products = data.items;
            products = products.map((item) => {
                return item;

            })
            return products
        } catch (error) {
            console.log(error);
        }

    }
}

// Getting cart quantity
function cartNumbers(product) {
    let pdNo = localStorage.getItem("cartNumbers");
    pdNo = parseInt(pdNo);
    if (pdNo) {
        localStorage.setItem('cartNumbers', pdNo + 1)
    } else {
        localStorage.setItem('cartNumbers', 1)
    }
    setItems(product)

}

function setItems(product) {
    let cartItems = localStorage.getItem("productInCart");
    cartItems = JSON.parse(cartItems);

    if (cartItems != null) {
        // console.log(cartItems[product.tag])
        if (cartItems[product.tag] == undefined) {
            cartItems = {
                ...cartItems,
                [product.tag]: product
            }
        }
        cartItems[product.tag].inCart += 1;
        

    } else {
        product.inCart = 1;
        cartItems = {
            [product.tag]: product
        }

    }

    localStorage.setItem('productInCart', JSON.stringify(cartItems));

}

// Total cart cost

function totalCost(product) {
    let cartTotal = product.price;
    let getPrice = localStorage.getItem("totalPrice");
    console.log(typeof cartTotal);
    if (getPrice != null) {
        getPrice = parseInt(getPrice)
        localStorage.setItem("totalPrice", getPrice + product.price)
    } else {
        localStorage.setItem("totalPrice", cartTotal);

    }
}

// Display cart
function displayCart() {
    let cartItems = localStorage.getItem("productInCart");
    cartItems = JSON.parse(cartItems);
    let cartContainer = document.querySelector(".cart-container")
    if (cartItems && cartContainer) {
        cartContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            cartContainer.innerHTML += `
            <div class="cart">
                <div style="flex-grow: 2" class="border">
                    <img src=${item.image} alt="" class="cart-img" />
                </div>
                <div style="flex-grow: 6" class="tt">
                    ${item.name}
                </div>
                <div style="flex-grow: 2">
                    BDT:  ${item.price}
                </div>
                <div style="flex-grow: 2" class="delete-icons">                   
                    <i class="fas fa-trash-alt"></i>
                </div>
            </div>
            `;
        })
    }
    deleteCart()
}

// Display product
class UI {
    displayProduct(products) {
        let result = '';

        products.forEach(product => {
            result += `
           <article class="product" data-id=${product.id}>
                <div class="img-continer">
                    <img src=${product.image} alt="pd1" class="product-img">       
                </div>
                <h6>${product.name}</h6>
                
            </article>
           `
        });
        productsDOM.innerHTML = result;
    }
}

//Delete from cart
function deleteCart() {
    let deleteIcons = document.querySelectorAll(".delete-icons");
    let productNumbers = localStorage.getItem('cartNumbers');
    let cartCost = localStorage.getItem("totalPrice");
    let cartItems = localStorage.getItem('productInCart');
    cartItems = JSON.parse(cartItems);
    let productName;
    for (let i = 0; i < deleteIcons.length; i++) {
        deleteIcons[i].addEventListener('click', () => {
            productName = deleteIcons[i].parentElement.children[1].textContent.toLocaleLowerCase().replace(/ /g, '').trim();
            console.log(productName);
            localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].inCart);
            localStorage.setItem('totalPrice', cartCost - (cartItems[productName].price * cartItems[productName].inCart));
            delete cartItems[productName];
            localStorage.setItem('productInCart', JSON.stringify(cartItems));

            displayCart()
        })

    }
}
