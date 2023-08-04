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
            console.log(input.value);
            if (isNaN(input.value) || input.value <= 0) {
                input.value = 1
            }

            count += 1;


            updateTotal();

        }



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

            displayQuantity = document.querySelector('.show-quantity');
            displayQuantity.innerHTML = count;
        }

        updateTotal();

        // GET THE CURRENCY THAT WAS CHOOSEN
        let toCurrency = document.querySelector('.toCurrency');
        let resultFrom = ''
        toCurrency.addEventListener('change', (event) => {
            resultFrom = `${event.target.value}`;

            // CHANGE TO JPY
            if (resultFrom == 'jpy') {
                let currencies = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/cad/${resultFrom}.json`;
                fetch(currencies)
                    .then(response => response.json())
                    .then(data => console.log(data.jpy));
            }
            // CHANGE TO USD
            else if (resultFrom == 'usd') {
                let currencies = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/cad/${resultFrom}.json`;
                fetch(currencies)
                    .then(response => response.json())
                    .then(data => console.log(data.usd));
            }
            else {
                let currencies = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/cad/cad.json`;
                fetch(currencies)
                    .then(response => response.json())
                    .then(data => console.log(data.cad));
            }




        });


        function checkCard(input) {
            // let cardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
            let cardRegex = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/;
            let errorCard = document.querySelector('#errorCard');

            // CHCEK THE CREDIT CART
            if (!cardRegex.test(input)) {
                errorCard.innerHTML = `<span style='color:red'> Invalid Card </span>`;
                return false;
            } else {
                errorCard.innerHTML = `<span style='color:green'> Valid Card </span>`;
                return cardRegex.test(input);
            }

        }

        function checkMonth(month, year, cvs) {

            let displayMonth = document.querySelector('#errorMonth');
            let monthValid = true;

            if (month > 0 && month <= 12) {
                displayMonth.innerHTML = `<span style='color:green'>Valid</span>`;
                return monthValid;
            } else {
                displayMonth.innerHTML = `<span style='color:red'>Invalid</span>`;
                return monthValid = false;
            }


        }

        function checkYear(year) {
            let displayYear = document.querySelector('#errorYear');
            let yearValid = true;

            if (year.length == 4 && parseInt(year) >= 2023) {
                displayYear.innerHTML = `<span style='color:green'>Valid</span>`;
                return yearValid;
            } else {
                displayYear.innerHTML = `<span style='color:red'>Invalid</span>`;
                return yearValid = false;
            }
        }

        function checkCVS(cvs) {
            let displayCVS = document.querySelector('#errorCVS');
            let cvsValid = true

            if (cvs.length == 3) {
                displayCVS.innerHTML = `<span style='color:green'>Valid</span>`;
                return cvsValid;
            } else {
                displayCVS.innerHTML = `<span style='color:red'>Invalid</span>`;
                return cvsValid = false;
            }
        }



        $('#cardInfo').click(function () {

            let cardValue = document.querySelector('#creditNumber').value;
            let cardResult = checkCard(cardValue);

            let cardMonth = parseInt($('#month').val());
            let monthResult = checkMonth(cardMonth);

            let cardYear = $('#year').val();
            let yearResult = checkYear(cardYear)

            let cardCVS = $('#cvs').val();
            let cvsResult = checkCVS(cardCVS);

            if (cardResult && monthResult && yearResult && cvsResult) {
                $("#pills-profile-tab").click();
            }

        });


        class Billing {
            constructor(firstName, lastName, address, city, state, country, postal, phone, email) {
                this.firstName = firstName;
                this.lastName = lastName;
                this.address = address;
                this.city = city;
                this.state = state;
                this.country = country;
                this.postal = postal;
                this.phone = phone;
                this.email = email;
            }
        }



        $('#billingInfo').click(function () {
            let firstName = document.getElementById('first-name').value;
            let lastName = document.getElementById('last-name').value;
            let address = document.getElementById('address').value;
            let city = document.getElementById('city').value;
            let state = selectState.value;
            let country = countrySelected.value;
            let postal = document.getElementById('postal').value;
            let phone = document.getElementById('phone-number').value;
            let email = document.getElementById('email').value;


            let personInfo = new Billing(firstName, lastName, address, city, state, country, postal, phone, email);

            console.log(personInfo);
            // $('#pills-contact-tab').click();
        });

        // ALL OF THE STATES & PROVICES
        const canadianProvinces = [
            "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
            "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"
        ];

        const usStates = [
            "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
            "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
            "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
            "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
            "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
            "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
            "West Virginia", "Wisconsin", "Wyoming"
        ];

        const emptyState = [];


        // UPDATE THE STATES THAT THE COUNTRY WAS SELECTED
        let countrySelected = document.getElementById('country');
        let selectState = document.getElementById('state');

        countrySelected.addEventListener('change', updateStates);

        function updateStates(){
            let selectCountry = countrySelected.value;

            selectState.innerHTML = `<option value="none" selected>Select state / province</option>`;


            if(selectCountry === 'canada'){

                for( const province of canadianProvinces){
                    const option = document.createElement("option");
                    option.value = province;
                    option.textContent = province;
                    selectState.appendChild(option);
                }

            } else if (selectCountry == 'usa') {
                for (const state of usStates) {
                    const option = document.createElement("option");
                    option.value = state;
                    option.textContent = state;
                    selectState.appendChild(option);
                  }
            }
        }





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








