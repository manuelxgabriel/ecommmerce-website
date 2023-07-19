$(document).ready(function () {


    let product = document.querySelector('.product');
    let url = 'https://fakestoreapi.com/products';

    async function getProducts() {
        let response = '';
        try{
            response = await fetch(url);
        } catch(e) {
            response = await fetch('https://deepblue.camosun.bc.ca/~c0180354/ics128/final/fakestoreapi.json');
        }

        let data = await response.json();

            for (let i = 0; i < data.length; i++) {
                product.innerHTML += `
                <div class="card" style="width: 15rem; margin: 0.2em;">
                    <img src="${data[i].image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${data[i].title}</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <p class="card-text fw-bold">$${data[i].price}</p>
                        <a href="#" class="btn btn-success">Add To Card</a>
                    </div>
                </div>
                `;
            }

        
       

    }

    getProducts();


});
