
document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'https://fakestoreapi.com/products/';
    const homeSection = document.getElementById('Home');
    const productsSection = document.getElementById('Products');
    const detailsSection = document.getElementById('Specific-Details');
    const cartSection=document.getElementById('GoToCart');
    const homeProductContainer = document.getElementById('Home-Product-Container');
    const productsContainer = document.getElementById('Products-Container');
    const slideshow = document.getElementById('slideshow');
    const specificProductDetailsContainer = document.getElementById('Specific-Product-Details');
    let allProducts = [];
    const cart=JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount=document.getElementById('Cart');
    const cartContainer=document.getElementById('Cart-Container');
    const emptyCart=document.getElementById('EmptyCart');
    const nonEmptyCart=document.getElementById('NonEmptyCart');
    const totalQuantityElement = document.getElementById('Quantity');
    const totalPriceElement = document.getElementById('TotalPrice');


    updateCartCount();
    displayCartProducts();

    //fetching API for products
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            displayProducts(allProducts, homeProductContainer); // Display on Home page
            displayProducts(allProducts, productsContainer); // Display on Products page

            // Set up event listeners for category buttons
            document.querySelectorAll('.Category-Buttons').forEach(button => {
                button.addEventListener('click', (e) => {
                    filterProducts(e.target.dataset.category);
                });
            });

            // Set up event listeners for navigation buttons
            document.querySelectorAll('.pagebuttons').forEach(button => {
                button.addEventListener('click', (e) => {
                    showSection(e.target.dataset.target);
                });
            });

            // Event delegation for homepage product containers
            homeProductContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('details-btn')) {
                    handleDetailsButtonClick(e.target);
                }else if(e.target.classList.contains('add-to-cart-btn')){
                    handleAddToCart(e.target);
                }
            });
            
            // Event delegation for productspage product containers
            productsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('details-btn')) {
                    handleDetailsButtonClick(e.target);
                }else if(e.target.classList.contains('add-to-cart-btn')){
                    handleAddToCart(e.target);
                }
            });

            slideshow.addEventListener('click', (e) => {
                if (e.target.classList.contains('details-btn')) {
                    handleDetailsButtonClick(e.target);
                }else if(e.target.classList.contains('add-to-cart-btn')){
                    handleAddToCart(e.target);
                }
            });
            
            specificProductDetailsContainer.addEventListener('click', (e) => {
                if(e.target.classList.contains('add-to-cart-btn')){
                    handleAddToCart(e.target);
                }else if(e.target.classList.contains('go-to-cart-btn')){
                    showSection('GoToCart');
                }
            });

            cartContainer.addEventListener('click',(e)=>{
                if(e.target.classList.contains('Increment')){
                    quantityhandler(e.target,'Increment');
                }else if(e.target.classList.contains('Decrement')){
                    console.log("ok")
                    quantityhandler(e.target,'Decrement');
                };
            });
            // Initialize default view
            showSection('Home');
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
        });


    function quantityhandler(button,operation){
        const productid=button.dataset.id;
        const object=cart.find(product=> product.id==productid);
        const Index=cart.findIndex(product=> product.id==productid);
        if(operation=='Increment'){
            object.quantity++;
        }else if(operation=='Decrement'){
            if(object.quantity>1){
                object.quantity-=1;
            }else{
                cart.splice(Index, 1);
            };
        };
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartProducts();
        updateCartDetails();
    }

    function updateCartDetails() {
        // Update cart quantity
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        totalQuantityElement.textContent = `Products(${totalQuantity})`;

        // Update cart total price
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
        totalPriceElement.textContent = `Total: $${totalPrice}`;
    }
    

    function createProductCard(product) {
        const card = document.createElement('div');
        card.classList.add('product-card'); // Different class for product cards
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="product-details">
                <h2>${product.title}</h2>
                <p class="description">${product.description}</p>
                <hr>
                <p class="price">$${product.price}</p>
                <hr>
                <button class="details-btn" data-id="${product.id}" data-category="${product.category}">Details</button>
                <button class="add-to-cart-btn" data-id="${product.id}" >Add to cart</button>
            </div>
        `;
        return card;
    }

    function createSliderCard(product) {
        const card = document.createElement('div');
        card.classList.add('slider-card'); // Different class for slider cards
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" width="300px">
            <div class="slider-details">
                <h2>${product.title}</h2>
                <button class="add-to-cart-btn" data-id="${product.id}" > Add to cart</button>
                <button class="details-btn" data-id="${product.id}" data-category="${product.category}">Details</button>
            </div>
        `;
        return card;
    }
    function createCartCard(product){
        const cartItem=document.createElement('div');
        cartItem.classList.add('Cart-Card');
        cartItem.innerHTML=`
        <img src="${product.image}" alt="${product.title}" width="100px" height="100px">
        <h3>${product.title}</h3>
        <div id="quantitychanger">
            <i class="fa-solid fa-plus Increment" data-id="${product.id}"></i>
            <span>${product.quantity}</span>
            <i class="fa-solid fa-minus Decrement" data-id="${product.id}"></i>
            <p>${product.quantity} x <b>$${product.price}</b></p>
        </div>
        `;
        return cartItem
    }

    function displayProducts(products, container) {
        container.innerHTML = '';
        products.forEach(product => {
            const productCard = createProductCard(product);
            container.appendChild(productCard);
        });
    }

    function displayCategoryProducts(products) {
        slideshow.innerHTML = '';
        products.forEach(product => {
            const sliderCard = createSliderCard(product);
            slideshow.appendChild(sliderCard);
            
        });
        products.forEach(product => {
            const sliderCard = createSliderCard(product);
            slideshow.appendChild(sliderCard);
            
        });
        products.forEach(product => {
            const sliderCard = createSliderCard(product);
            slideshow.appendChild(sliderCard);
            
        });
        
    }
    function displayCartProducts(){
        cartContainer.innerHTML= '';
        if (cart.length === 0){
            emptyCart.style.display='block';
            nonEmptyCart.style.display='none';
        }else{
            emptyCart.style.display='none';
            nonEmptyCart.style.display='flex';
            cart.forEach(product=>{
                const cartCard=createCartCard(product);
                cartContainer.appendChild(cartCard);
            });
        }updateCartDetails();
        updateCartCount();
        
    }
    
    function displayProductDetails(product) {
        specificProductDetailsContainer.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="product-description">
                <h3 class="category">${product.category.toUpperCase()}</h3>
                <p class="title" > ${product.title}</p>
                <p class="rating" >${product.rating.rate} <i class="fa-solid fa-star"></i></p>
                <p class="price">$${product.price}</p>
                <p class="description">${product.description}</p>
                <div class="cart-buttons">
                    <button class="add-to-cart-btn" data-id="${product.id}">Add to cart</button>
                    <button class="go-to-cart-btn" data-id="${product.id}">Go to cart</button>
                </div>
            </div>
        `;
    }

    function handleDetailsButtonClick(button) {
        const productID = button.dataset.id;
        const category = button.dataset.category;

        // Find the selected product from allProducts
        const selectedProduct = allProducts.find(product => product.id == productID);
        
        if (selectedProduct) {
            displayProductDetails(selectedProduct);
            displayCategoryProducts(allProducts.filter(product => product.category === category));
            showSection('Specific-Details');
        }
    }
    
    function handleAddToCart(button){
        const ProductID=button.dataset.id;
        const Product=allProducts.find(product=> product.id==ProductID);

        if(Product){
            const Existing =cart.find(product=>product.id==ProductID);

            if(Existing){
                Existing.quantity++;
            }else{
                Product.quantity=1;
                cart.push(Product);
            }
        }localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCartProducts();
        
    }
    function updateCartCount(){
        cartCount.innerHTML=`<i class="fa-solid fa-cart-shopping"></i> Cart (${cart.length})`;

    }

    function filterProducts(category) {
        if (category === "All") {
            // Show all products
            displayProducts(allProducts, homeProductContainer);
            displayProducts(allProducts, productsContainer);
        } else {
            // Filter products by category
            const filteredProducts = allProducts.filter(product => product.category === category);
            displayProducts(filteredProducts, homeProductContainer);
            displayProducts(filteredProducts, productsContainer);
        }
    }
     
    function showSection(target) {
        homeSection.style.display = 'none';
        productsSection.style.display = 'none';
        detailsSection.style.display = 'none';
        cartSection.style.display='none';

        if (target === 'Home') {
            homeSection.style.display = 'block';
        } else if (target === 'Products') {
            productsSection.style.display = 'block';
            window.scrollTo(0, 0);
        } else if (target === 'Specific-Details') {
            detailsSection.style.display = 'block';
            window.scrollTo(0, 0);
           
        }else if (target === 'GoToCart') {
            cartSection.style.display = 'block';
        }
    }

});
