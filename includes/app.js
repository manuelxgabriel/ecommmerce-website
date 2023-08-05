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



        let total = 0;
        //UPDATE TOTAL
        function updateTotal() {
            let cartContent = document.querySelectorAll('.cart-content')[0];
            let cartBoxes = cartContent.querySelectorAll('.cart-box');
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



        // CARD INFORMATION
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



        // BILLING INFORMATION
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

            let firstResult = checkFirst(firstName);
            let lastResult = checklast(lastName);
            let cityResult = checkCity(city);
            let postalResult = checkPostal(postal);
            let countryResult = countrySelected.value; // NEED TO DISPLAY THE ERROR TO THE HTML
            let stateResult = selectState.value;
            let phoneResult = checkPhone(phone);
            let emailResult = checkEmail(email);

            let personInfo = new Billing(firstName, lastName, address, city, state, country, postal, phone, email);

            // $('#pills-contact-tab').click();
        });

        function checkFirst(value){
            firstRegex = /^[A-Za-z'-]+$/;

            if(!firstRegex.test(value)){
                $('#firstError')
                    .css('color','red')
                    .html(`Invalid`);
                    return firstRegex.test(value);
            } else {
                $('#firstError')
                    .css('color','green')
                    .html(`Valid`);
                return firstRegex.test(value);
            }
        }

        function checklast(value){
            lastRegex = /^[A-Za-z'-]+$/;

            if(!lastRegex.test(value)){
                $('#lastError')
                    .css('color','red')
                    .html(`Invalid`);
                    return lastRegex.test(value);
            } else {
                $('#lastError')
                    .css('color','green')
                    .html(`Valid`);
                return lastRegex.test(value);
            }
        }

        function checkCity(value){
            cityRegex = /^[A-Za-z'-]+$/;

            if(!cityRegex.test(value)){
                $('#cityError')
                    .css('color','red')
                    .html(`Invalid`);
                    return cityRegex.test(value);
            } else {
                $('#cityError')
                    .css('color','green')
                    .html(`Valid`);
                return cityRegex.test(value);
            }
        }

        function checkPostal(value){
            postalRegex = /^[ABCEGHJKLMNPRSTVXY]\d[A-Z] \d[A-Z]\d$/;

            if(!postalRegex.test(value)){
                $('#postalError')
                    .css('color','red')
                    .html(`Invalid`);
                    return postalRegex.test(value);
            } else {
                $('#postalError')
                    .css('color','green')
                    .html(`Valid`);
                return postalRegex.test(value);
            }
        }

        function checkPhone(value){
            phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/

            if(!phoneRegex.test(value)){
                $('#phoneError')
                    .css('color','red')
                    .html(`Invalid`);
                    return phoneRegex.test(value);
            } else {
                $('#phoneError')
                    .css('color','green')
                    .html(`Valid`);
                return phoneRegex.test(value);
            }
        }

        function checkEmail(value){
            emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

            if(!emailRegex.test(value)){
                $('#emailError')
                    .css('color','red')
                    .html(`Invalid`);
                    return emailRegex.test(value);
            } else {
                $('#emailError')
                    .css('color','green')
                    .html(`Valid`);
                return emailRegex.test(value);
            }
        }


        // ALL OF THE STATES & PROVICES
        const canadianProvinces = [
            "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories",
            "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"
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



        // SHIPPING INFORMATION
        $('#shippingInfo').click(function (){
            displayTaxInfo(); // DISPLAY THE TAXES WHEN THE PROVINCE

            $('#pills-disabled-tab').click();
        });

        let shipping = document.getElementById('shipping');
        shipping.addEventListener('change', updateShipping);
        $('.packageInfo').hide();

        function updateShipping(){
            if(shipping.checked == false){
                $('.packageInfo').show();
            } else {
                $('.packageInfo').hide();
            }
        }


        
        const taxRates = {
            "canada": {
                "Alberta": 5,
                "British Columbia": 12,
                "Manitoba":  12,
                "New Brunswick": 15,
                "Newfoundland and Labrador": 15,
                "Northwest Territories": 5,
                "Nunavut": 5,
                "Nova Scotia": 15,
                "Ontario": 13,
                "Prince Edward Island": 15,
                "Quebec": 14.975,
                "Saskatchewan": 11,
                "Yukon": 5,
            },
            "usa": {
                "Alabama": 4,
                "Alaska": 0,
                "Arizona": 5.6,
                "Arkansas": 6.5,
                "California": 7.25,
                "Colorado": 2.9,
                "Connecticut": 6.35,
                "Delaware": 0,
                "Florida": 6,
                "Georgia": 4,
                "Hawaii": 4.5,
                "Idaho": 6,
                "Illinois": 6.25,
                "Indiana": 7,
                "Iowa": 6,
                "Kansas": 6.5,
                "Kentucky": 6,
                "Louisiana": 4.45,
                "Maine": 5.5,
                "Maryland": 6,
                "Massachusetts": 6.25,
                "Michigan": 6,
                "Minnesota": 6.875,
                "Mississippi": 7,
                "Missouri": 4.225,
                "Montana": 0,
                "Nebraska": 5.5,
                "Nevada": 6.85,
                "New Hampshire": 0,
                "New Jersey": 6.625,
                "New Mexico": 5.125,
                "New York": 4,
                "North Carolina": 4.75,
                "North Dakota": 5,
                "Ohio": 5.75,
                "Oklahoma": 4.5,
                "Oregon": 0,
                "Pennsylvania": 6,
                "Rhode Island": 7,
                "South Carolina": 6,
                "South Dakota": 4.5,
                "Tennessee": 7,
                "Texas": 6.25,
                "Utah": 4.85,
                "Vermont": 6,
                "Virginia": 5.3,
                "Washington": 6.5,
                "West Virginia": 6,
                "Wisconsin": 5,
                "Wyoming": 4,
            }
              
        }


        
        let subtotal = document.getElementById('subtotal');
        let taxElementInfo = document.getElementById('tax-info');
        let locationTax = document.getElementById('location-tax');
        let orderTotal = document.getElementById('order-total');
        

        function displayTaxInfo(){
            const selectedCountry = countrySelected.value;
            const selectedState = selectState.value;

            let shippingCost = 5;

            if(selectedCountry in taxRates && selectedState in taxRates[selectedCountry]){
                const taxRate = taxRates[selectedCountry][selectedState];
                let totalTax = (total*(taxRate/100)).toFixed(2)
                taxElementInfo.innerHTML = `$${totalTax}`;
                locationTax.textContent = `${selectedState}`;

                 // DISPLAY THE SUBTOTAL
                subtotal.innerHTML = `$${total}`;
                let orderPrice = parseFloat(totalTax) + parseFloat(total) + shippingCost;
                orderTotal.innerHTML = `$${orderPrice.toFixed(2)}`;

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








