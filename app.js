document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'https://fakestoreapi.com/products/';
    const homeSection = document.getElementById('Home');
    const productsSection = document.getElementById('Products');
    const detailsSection = document.getElementById('Specific-Details');
    const homeProductContainer = document.getElementById('Home-Product-Container');
    const productsContainer = document.getElementById('Products-Container');
    const slideshow = document.getElementById('slideshow');
    const specificProductDetailsContainer = document.getElementById('Specific-Product-Details');
    let allProducts = [];
    const cart=[] || JSON.parse(localStorage.getItem('cart'));
    // Fetch data once
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            displayProducts(allProducts, homeProductContainer); // Display on Home page
            displayProducts(allProducts, productsContainer); // Display on Products page

            // Set up event listeners for category buttons
            document.querySelectorAll('.Category-Buttons button').forEach(button => {
                button.addEventListener('click', (e) => {
                    filterProducts(e.target.dataset.category);
                });
            });

            // Set up event listeners for navigation buttons
            document.querySelectorAll('.nav-tags .pagebuttons').forEach(button => {
                button.addEventListener('click', (e) => {
                    showSection(e.target.dataset.target);
                });
            });

            // Event delegation for product containers
            homeProductContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('details-btn')) {
                    handleDetailsButtonClick(e.target);
                }else if(e.target.classList.contains('add-to-cart-btn')){
                    handleAddToCart(e.target);
                }
            });

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

            // Initialize default view
            showSection('Home');
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
        });

    function createProductCard(product) {
        const card = document.createElement('div');
        card.classList.add('product-card'); // Different class for product cards
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" width="300px">
            <div class="product-details">
                <h2>${product.title}</h2>
                <p class="description">${product.description}</p>
                <h3 class="price">$${product.price}</h3>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to cart</button>
                <button class="details-btn" data-id="${product.id}" data-category="${product.category}">Details</button>
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
                <button class="add-to-cart-btn" data-id="${product.id}">Add to cart</button>
                <button class="details-btn" data-id="${product.id}" data-category="${product.category}">Details</button>
            </div>
        `;
        return card;
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
    }

    function displayProductDetails(product) {
        specificProductDetailsContainer.innerHTML = `
            <img src="${product.image}" alt="${product.title}" width="500px">
            <div class="product-description">
                <h3 class="category">${product.category}</h3>
                <h1>${product.title}</h1>
                <p>${product.rating.rate}</p>
                <h2 class="price">$${product.price}</h2>
                <p class="description">${product.description}</p>
                <div class="cart-buttons">
                    <button class="add-to-cart-btn" data-id="${product.id}>Add to cart</button>
                    <button>Go to cart</button>
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
        document.getElementById('Cart').innerHTML=`<i class="fa-solid fa-cart-shopping"></i> Cart (${cart.length})`
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

        if (target === 'Home') {
            homeSection.style.display = 'block';
        } else if (target === 'Products') {
            productsSection.style.display = 'block';
        } else if (target === 'Specific-Details') {
            detailsSection.style.display = 'block';
        }
    }


});
