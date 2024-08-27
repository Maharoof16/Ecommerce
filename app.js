document.addEventListener('DOMContentLoaded', () => {
    // Example API URL (Replace with your actual API endpoint)
    const apiURL = 'https://fakestoreapi.com/products/';
    const productContainer = document.getElementById('Product-Container');
    const productDetailsContainer = document.getElementById('Specific-Product-Details');
    let allProducts=[];
    
   
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            allProducts=data;
            displayproducts(allProducts);
            const categorybuttons= document.querySelectorAll('.Category-Buttons');
            categorybuttons.forEach(product=>{
                product.addEventListener('click',(e)=>{
                    filterproducts(e.target.dataset.category)
                })
            })
            const Details=document.querySelectorAll('.details-btn');
            Details.forEach(button=>{
                button.addEventListener('click',(e)=>{
                productDetailsContainer.innerHTML =""
                const productID=(e.target.dataset.id);
                console.log(productID)
                fetchproductdetails(productID);
                });
            });
            const pagebuttons=document.querySelectorAll(".pagebuttons");
            console.log(pagebuttons)
            const sections=document.querySelectorAll(".page");
            pagebuttons.forEach(button=>{
                button.addEventListener('click',(e)=>{
                    const target=e.target.dataset.target;
                    sections.forEach(section=>{
                        section.style.display='none';
                    })
                    document.getElementById(target).style.display = document.getElementById(target).dataset.display || 'block';
                });
                if (sections.length > 0) {
                    sections[0].style.display = 'block';
                }
            })

        })
        .catch(error => {
            console.error('Error fetching product data:', error);
        });


function createProductCard(product) {
    const card = document.createElement('div');
    card.classList.add('Product-Card');

    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}"  width="300px">
        <div class="Product-Details">
            <h2>${product.title}</h2>
            <p class="description">${product.description}</p>
            <h3 class="price">$${product.price}</h3>
            <button class="Addtocart-btn">Add to cart </button>
            <button class="details-btn pagebuttons" data-target="Specific-Product-Details" data-id="${product.id}">Details</button>
        </div>
        
    `;
    return card;
}


function displayproducts(products){
    productContainer.innerHTML='';
    products.forEach(product=>{
        const productCard = createProductCard(product);
        productContainer.appendChild(productCard);
    })
    
}

function fetchproductdetails(productId) {
    
    fetch(`${apiURL}${productId}`)
        .then(response => response.json())
        .then(product => {
            console.log(product)
            displayProductDetails(product);
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
        });
}

function displayProductDetails(product) {
    productDetailsContainer.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <div class="productdescription">
            <h3 class="category">${product.category}</h3>
            <h1>${product.title}</h1>
            <p>${product.rating.rate}</p>
            <h2 class="price">$${product.price}</h2>
            <p class="description">${product.description}</p>
            <div class="cartbuttons">
                <button>Add to cart</button>
                <button>Go to cart</button>
            </div>
        </div>
    `;
}


function filterproducts(category){
    if(category=="All"){
        displayproducts(allProducts); // Show all products
    } else {
            const filteredProducts = allProducts.filter(product => product.category === category);
            console.log(filteredProducts)
            displayproducts(filteredProducts); // Show filtered products
    }
}

});

