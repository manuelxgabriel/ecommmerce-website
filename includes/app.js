$(document).ready(function () {


    // DISPLAY THE PRODUCTS ON THE PAGE
    let product = document.querySelector('.product');
    let url = 'https://fakestoreapi.com/products';

    getProducts();

    async function getProducts() {
        let response = '';
        try {
            response = await fetch(url);
        } catch (e) {
            response = await fetch('https://deepblue.camosun.bc.ca/~c0180354/ics128/final/fakestoreapi.json');
        }

        var data = await response.json();

        // DISPLAY THE IMFORMATION
        for (let i = 0; i < data.length; i++) {
            product.innerHTML += `
                <div class="card" style="width: 15rem; margin: 0.2em;">
                    <img src="${data[i].image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${data[i].title}</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <p class="card-text fw-bold displayCurrency">${data[i].price}</p>
                        <button class="btn btn-success add-cart" id="newButton">Add To Card</button>
                    </div>
                </div>
                `;
        }


        // REMOVE ITEMS
        let removeCartButton = document.querySelectorAll('.cart-remove');
        for (let i = 0; i < removeCartButton.length; i++) {
            let button = removeCartButton[i];
            button.addEventListener('click', removeCartItem);
        }


        // QUANTITY CHANGES 
        let quanitityInputs = document.querySelectorAll('.cart-quantity');
        for (let i = 0; i < quanitityInputs.length; i++) {
            let input = quanitityInputs[i];
            input.addEventListener('change', quanityChange);
        }


        // KEEP TRACK OF THE NUMBER OF ITEMS
        let count = 0;
        $('.show-quantity').hide();

        // ADD TO CART
        let addCart = document.getElementsByClassName('add-cart');
        for (let i = 0; i < addCart.length; i++) {
            let button = addCart[i];
            button.addEventListener('click', () => {
                let title = data[i].title;
                let price = data[i].price;
                let img = data[i].image;

                addProductToCart(title, price, img);
                updateTotal();

            })
        }

        // ADD THE PRODUCTS TO YOUR CART
        function addProductToCart(title, price, img) {
            let cartShopBox = document.createElement('div');
            cartShopBox.classList.add('cart-box');
            var cartItems = document.getElementsByClassName('cart-content')[0];
            let cartItemsName = cartItems.getElementsByClassName('cart-product-title')

            
            let cartBoxContent = `
            <img src="${img}" alt="" class="cart-img">
            <div class="detail-box">
                <div class="cart-product-title">${title}</div>
                <div class="cart-price">$${price}</div>
                <input type="number" value="1" class="cart-quantity">
            </div>
            <!-- REMOVE CART -->
            <i class="bi bi-trash-fill cart-remove"></i>
        `;

            cartShopBox.innerHTML = cartBoxContent;
            cartItems.append(cartShopBox);
            cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItem);
            cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change', quanityChange);

            $('.show-quantity').show();
            count += 1;
            displayQuantity = document.querySelector('.show-quantity');
            displayQuantity.innerHTML = count;

            // console.log(cartItemsName);

            // for(let i = 0; i < cartItemsName.length; i++){
            //     console.log(cartItemsName[i].innerHTML);
            //     console.log("------------------------");
            // }
        

        }



        // REMOVE ITEMS FROM CART
        function removeCartItem(event) {
            let buttonClicked = event.target
            buttonClicked.parentElement.remove();

            count -= 1;
            displayQuantity = document.querySelector('.show-quantity');
            displayQuantity.innerHTML = count;


            updateTotal();

        }

        // QUANTITY CHANGES 
        function quanityChange(event) {
            let input = event.target;
            if (isNaN(input.value) || input.value <= 0) {
                input.value = 1
            }

            count += 1;
            displayQuantity = document.querySelector('.show-quantity');
            displayQuantity.innerHTML = count;

            updateTotal();

        }

        // function addQuantity(title){
        //     let input = document.getElementsByClassName('cart-quantity')[0].value;
            
        //     console.log(title);
        // }


        //UPDATE TOTAL
        function updateTotal() {
            let cartContent = document.querySelectorAll('.cart-content')[0];
            let cartBoxes = cartContent.querySelectorAll('.cart-box');
            let total = 0;
            for (let i = 0; i < cartBoxes.length; i++) {
                let cartBox = cartBoxes[i]
                let priceElement = cartBox.querySelectorAll('.cart-price')[0];
                let quanityElement = cartBox.querySelectorAll('.cart-quantity')[0];
                let price = parseFloat(priceElement.innerHTML.replace('$', ''))
                let quanity = quanityElement.value;
                total = total + (price * quanity);

                total = Math.round(total * 100) / 100;
            }

            document.querySelectorAll('.total-price')[0].innerHTML = `$ ${total}`;
        }

        updateTotal();


        // TODO: need to display the currency to change
         // CURRENCY API
    let currecnyURL = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json`;
    async function getCurrency(){
        let response = await fetch(currecnyURL);
        let currency = await response.json()

        let displayPrices = document.querySelectorAll('.displayCurrency');
        let toCurrency = document.querySelector('.toCurrency');
        toCurrency.addEventListener('change', (event) => {
            resultFrom = `${event.target.value}`;

            // console.log(displayPrices);
        })
        
        
    }

    getCurrency();

    $('.btn-buy').click(function (){
        console.log('button is working');
    });
    }


});


// FETCH DATA USING PROMISE .THEN
// function getData() {
    //     fetch(url)
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log(data)
    //         })
    //         .catch(error => {
    //             console.error('Error fetching data: ', error);
    //         });
    // }
    // getData();








