$(document).ready(function () {


    // DISPLAY THE PRODUCTS ON THE PAGE
    let product = document.querySelector('.product');
    let url = 'https://fakestoreapi.com/products';
    getProducts();

    async function getProducts() {
        let response = '';
        try{
            response = await fetch(url);
        } catch(e) {
            response = await fetch('https://deepblue.camosun.bc.ca/~c0180354/ics128/final/fakestoreapi.json');
        }

        var data = await response.json();

            for (let i = 0; i < data.length; i++) {
                product.innerHTML += `
                <div class="card" style="width: 15rem; margin: 0.2em;">
                    <img src="${data[i].image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${data[i].title}</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <p class="card-text fw-bold">$${data[i].price}</p>
                        <button class="btn btn-success add-cart" id="newButton">Add To Card</button>
                    </div>
                </div>
                `;
            }


    }

    // REMOVE ITEMS
    let removeCartButton = document.querySelectorAll('.cart-remove');
    for(let i = 0; i < removeCartButton.length; i++){
        let button = removeCartButton[i];
        button.addEventListener('click', removeCartItem);
    }


    // QUANTITY CHANGES 
    let quanitityInputs  = document.querySelectorAll('.cart-quantity');
    for (let i = 0; i < quanitityInputs.length; i++){
        let input = quanitityInputs[i];
        input.addEventListener('change', quanityChange);
    }

    // ADD TO CART
    // let addCart = document.getElementsByClassName('add-cart');
    // console.log(addCart.length);
    // for(let i = 0; i < addCart.length; i++){
    //     let button = addCart[i];
    //     button.addEventListener('click', addCartClicked);
    // }

    let addCart = document.querySelectorAll('button');
    console.log(addCart);


    // REMOVE ITEMS FROM CART
    function removeCartItem(event){
        let buttonClicked = event.target
        buttonClicked.parentElement.remove();
        updateTotal();
        
    }

    // QUANTITY CHANGES 
    function quanityChange(event){
        let input = event.target;
        if(isNaN(input.value) || input.value <= 0){
            input.value = 1
        }
        updateTotal();

    }

    // ADD TO CART
    function addCartClicked(event) {
        let button = event.target;
        let shopProducts = button.parentElement;
        let title = shopProducts.querySelectorAll('.cart-product-title')[0].innerText;
        console.log(title);
    }

    //UPDATE TOTAL
    function updateTotal(){
        let cartContent = document.querySelectorAll('.cart-content')[0];
        let cartBoxes = cartContent.querySelectorAll('.cart-box');
        let total = 0;
        for(let i = 0; i < cartBoxes.length; i++){
            let cartBox = cartBoxes[i]
            let priceElement = cartBox.querySelectorAll('.cart-price')[0];
            let quanityElement = cartBox.querySelectorAll('.cart-quantity')[0];
            let price = parseFloat(priceElement.innerHTML.replace('$', ''))
            let quanity = quanityElement.value;
            total = total + (price * quanity);

            total = Math.round(total* 100) / 100;
        }

        document.querySelectorAll('.total-price')[0].innerHTML = `$ ${total}`;
    }
    
    updateTotal();

});


let addCart = document.querySelectorAll('button');
    console.log(addCart);




