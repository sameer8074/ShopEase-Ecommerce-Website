/* =========================================================
   ShopEase - Complete JavaScript
   Cart + Wishlist + Product Modal + Related Products
   Search + Checkout + Order Confirmation
   ========================================================= */


/* =========================================================
   CART DATA
   ========================================================= */

let cart = JSON.parse(localStorage.getItem("shopEaseCart")) || [];


/* =========================================================
   WISHLIST DATA
   ========================================================= */

let wishlist =
    JSON.parse(localStorage.getItem("shopEaseWishlist")) || [];


/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart() {
    localStorage.setItem(
        "shopEaseCart",
        JSON.stringify(cart)
    );
}


/* =========================================================
   ADD PRODUCT TO CART
   ========================================================= */

function addToCart(
    productName,
    productPrice,
    productImage = "",
    quantity = 1
) {

    if (!productImage) {

        const productCard =
            Array.from(
                document.querySelectorAll(".product-card")
            ).find(
                card => card.dataset.name === productName
            );

        if (productCard) {

            const image =
                productCard.querySelector("img");

            if (image) {
                productImage = image.src;
            }
        }
    }


    quantity = Number(quantity) || 1;

    if (quantity < 1) {
        quantity = 1;
    }


    const existingProduct =
        cart.find(
            product => product.name === productName
        );


    if (existingProduct) {

        existingProduct.quantity += quantity;

        if (
            !existingProduct.image &&
            productImage
        ) {
            existingProduct.image = productImage;
        }

    } else {

        cart.push({
            name: productName,
            price: Number(productPrice) || 0,
            image: productImage,
            quantity: quantity
        });
    }


    saveCart();

    updateCartUI();


    alert(
        productName +
        " added to your cart!"
    );
}


/* =========================================================
   UPDATE CART UI
   ========================================================= */

function updateCartUI() {

    const cartCount =
        document.getElementById("cartCount");

    const cartItemCount =
        document.getElementById("cartItemCount");

    const cartItems =
        document.getElementById("cartItems");

    const cartSubtotal =
        document.getElementById("cartSubtotal");

    const cartShipping =
        document.getElementById("cartShipping");

    const cartTotal =
        document.getElementById("cartTotal");


    /*
       Calculate total quantity.
    */

    const totalQuantity =
        cart.reduce(
            (total, product) =>
                total +
                (Number(product.quantity) || 0),
            0
        );


    /*
       Calculate subtotal.
    */

    const subtotal =
        cart.reduce(
            (total, product) =>
                total +
                (
                    (Number(product.price) || 0) *
                    (Number(product.quantity) || 0)
                ),
            0
        );


    /*
       Shipping.
       ₹50 when cart contains products.
    */

    const shipping =
        cart.length > 0 ? 50 : 0;


    const total =
        subtotal + shipping;


    /*
       Header count.
    */

    if (cartCount) {

        cartCount.textContent =
            totalQuantity;
    }


    /*
       Cart item count.
    */

    if (cartItemCount) {

        cartItemCount.textContent =
            totalQuantity +
            (
                totalQuantity === 1
                    ? " item"
                    : " items"
            );
    }


    /*
       Subtotal.
    */

    if (cartSubtotal) {

        cartSubtotal.textContent =
            "₹" +
            subtotal.toLocaleString("en-IN");
    }


    /*
       Shipping.
    */

    if (cartShipping) {

        cartShipping.textContent =
            "₹" +
            shipping.toLocaleString("en-IN");
    }


    /*
       Total.
    */

    if (cartTotal) {

        cartTotal.textContent =
            "₹" +
            total.toLocaleString("en-IN");
    }


    if (!cartItems) {
        return;
    }


    /*
       Empty cart.
    */

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add some products to get started.
                </p>

                <button
                    id="startShopping"
                    class="start-shopping-btn"
                    type="button"
                >
                    Start Shopping
                </button>

            </div>
        `;


        const startShopping =
            document.getElementById(
                "startShopping"
            );


        if (startShopping) {

            startShopping.addEventListener(
                "click",
                function () {

                    closeCart();

                    document
                        .getElementById("products")
                        ?.scrollIntoView({
                            behavior: "smooth"
                        });
                }
            );
        }


        return;
    }


    /*
       Display cart products.
    */

    cartItems.innerHTML =
        cart.map(
            (product, index) => {

                const price =
                    Number(product.price) || 0;

                const quantity =
                    Number(product.quantity) || 1;

                const itemTotal =
                    price * quantity;

                return `

                    <div class="cart-item">

                        <img
                            src="${escapeHTML(product.image || "")}"
                            alt="${escapeHTML(product.name)}"
                            class="cart-item-image"
                        >

                        <div class="cart-item-details">

                            <h3>
                                ${escapeHTML(product.name)}
                            </h3>

                            <p class="cart-item-price">
                                ₹${price.toLocaleString("en-IN")}
                            </p>

                            <div class="cart-item-actions">

                                <div class="cart-quantity">

                                    <button
                                        type="button"
                                        onclick="decreaseCartQuantity(${index})"
                                        aria-label="Decrease quantity"
                                    >
                                        −
                                    </button>

                                    <span>
                                        ${quantity}
                                    </span>

                                    <button
                                        type="button"
                                        onclick="increaseCartQuantity(${index})"
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>

                                </div>

                                <button
                                    type="button"
                                    class="remove-cart-item"
                                    onclick="removeCartItem(${index})"
                                >
                                    Remove
                                </button>

                            </div>

                        </div>

                        <strong class="cart-item-total">
                            ₹${itemTotal.toLocaleString("en-IN")}
                        </strong>

                    </div>
                `;
            }
        ).join("");


    /*
       Reconnect clear cart button.
    */

    const clearCartButton =
        document.getElementById(
            "clearCartButton"
        );


    if (clearCartButton) {

        clearCartButton.onclick =
            clearCart;
    }
}


/* =========================================================
   INCREASE CART QUANTITY
   ========================================================= */

function increaseCartQuantity(index) {

    if (!cart[index]) {
        return;
    }


    cart[index].quantity =
        (Number(cart[index].quantity) || 0) + 1;


    saveCart();

    updateCartUI();
}


/* =========================================================
   DECREASE CART QUANTITY
   ========================================================= */

function decreaseCartQuantity(index) {

    if (!cart[index]) {
        return;
    }


    const quantity =
        Number(cart[index].quantity) || 1;


    if (quantity > 1) {

        cart[index].quantity =
            quantity - 1;

    } else {

        const productName =
            cart[index].name || "this product";

        const confirmRemove =
            confirm(
                `Remove "${productName}" from your cart?`
            );

        if (!confirmRemove) {
            return;
        }

        cart.splice(index, 1);
    }


    saveCart();

    updateCartUI();
}


/* =========================================================
   REMOVE CART ITEM
   ========================================================= */

function removeCartItem(index) {

    if (!cart[index]) {
        return;
    }


    const productName =
        cart[index].name || "this product";


    const confirmRemove =
        confirm(
            `Remove "${productName}" from your cart?`
        );


    if (!confirmRemove) {
        return;
    }


    cart.splice(index, 1);


    saveCart();

    updateCartUI();
}


/* =========================================================
   CLEAR CART
   ========================================================= */

function clearCart() {

    if (cart.length === 0) {
        return;
    }


    const confirmClear =
        confirm(
            "Are you sure you want to clear your cart?"
        );


    if (!confirmClear) {
        return;
    }


    cart = [];


    saveCart();

    updateCartUI();
}


/* =========================================================
   OPEN CART
   ========================================================= */

function openCart() {

    const cartPanel =
        document.getElementById(
            "cartPanel"
        );

    const cartOverlay =
        document.getElementById(
            "cartOverlay"
        );


    updateCartUI();


    if (cartPanel) {

        cartPanel.classList.add(
            "active"
        );
    }


    if (cartOverlay) {

        cartOverlay.classList.add(
            "active"
        );
    }


    document.body.style.overflow =
        "hidden";
}


/* =========================================================
   SHOW CART
   ========================================================= */

function showCart() {
    openCart();
}


/* =========================================================
   CLOSE CART
   ========================================================= */

function closeCart() {

    const cartPanel =
        document.getElementById(
            "cartPanel"
        );

    const cartOverlay =
        document.getElementById(
            "cartOverlay"
        );


    if (cartPanel) {

        cartPanel.classList.remove(
            "active"
        );
    }


    if (cartOverlay) {

        cartOverlay.classList.remove(
            "active"
        );
    }


    /*
       Do not restore scrolling if
       checkout is open.
    */

    const checkoutModal =
        document.getElementById(
            "checkoutModal"
        );


    if (
        !checkoutModal ||
        !checkoutModal.classList.contains(
            "active"
        )
    ) {

        document.body.style.overflow =
            "";
    }
}


/* =========================================================
   WISHLIST
   ========================================================= */


/* =========================================================
   SAVE WISHLIST
   ========================================================= */

function saveWishlist() {

    localStorage.setItem(
        "shopEaseWishlist",
        JSON.stringify(wishlist)
    );
}


/* =========================================================
   CHECK WISHLIST
   ========================================================= */

function isInWishlist(productName) {

    return wishlist.some(
        product =>
            product.name === productName
    );
}


/* =========================================================
   TOGGLE PRODUCT WISHLIST
   ========================================================= */

function toggleWishlist(productCard) {

    if (!productCard) {
        return;
    }


    const productName =
        productCard.dataset.name || "";


    const productPrice =
        Number(
            productCard.dataset.price
        ) || 0;


    const productCategory =
        productCard.dataset.category || "";


    const productImageElement =
        productCard.querySelector("img");


    const productImage =
        productImageElement
            ? productImageElement.src
            : "";


    const existingIndex =
        wishlist.findIndex(
            product =>
                product.name === productName
        );


    if (existingIndex !== -1) {

        wishlist.splice(
            existingIndex,
            1
        );

    } else {

        wishlist.push({

            name: productName,

            price: productPrice,

            category: productCategory,

            image: productImage
        });
    }


    saveWishlist();

    updateWishlistUI();

    updateWishlistButtons();

    updateProductModalWishlistButton();
}


/* =========================================================
   UPDATE WISHLIST COUNT
   ========================================================= */

function updateWishlistCount() {

    const wishlistCount =
        document.getElementById(
            "wishlistCount"
        );


    if (wishlistCount) {

        wishlistCount.textContent =
            wishlist.length;
    }
}


/* =========================================================
   UPDATE PRODUCT CARD WISHLIST BUTTONS
   ========================================================= */

function updateWishlistButtons() {

    const wishlistButtons =
        document.querySelectorAll(
            ".wishlist-button"
        );


    wishlistButtons.forEach(
        function (button) {

            const productCard =
                button.closest(
                    ".product-card"
                );


            if (!productCard) {
                return;
            }


            const productName =
                productCard.dataset.name || "";


            if (
                isInWishlist(
                    productName
                )
            ) {

                button.classList.add(
                    "active"
                );

                button.textContent =
                    "♥";

                button.setAttribute(
                    "aria-label",
                    "Remove from wishlist"
                );

            } else {

                button.classList.remove(
                    "active"
                );

                button.textContent =
                    "♡";

                button.setAttribute(
                    "aria-label",
                    "Add to wishlist"
                );
            }
        }
    );
}


/* =========================================================
   UPDATE WISHLIST UI
   ========================================================= */

function updateWishlistUI() {

    const wishlistItems =
        document.getElementById(
            "wishlistItems"
        );


    updateWishlistCount();


    if (!wishlistItems) {
        return;
    }


    if (wishlist.length === 0) {

        wishlistItems.innerHTML = `

            <div class="empty-wishlist">

                <div class="empty-wishlist-icon">
                    ♡
                </div>

                <h3>
                    Your wishlist is empty
                </h3>

                <p>
                    Save your favourite products here
                    for later.
                </p>

                <button
                    type="button"
                    class="start-wishlist-shopping-btn"
                    id="startWishlistShopping"
                >
                    Start Shopping
                </button>

            </div>

        `;


        const startShopping =
            document.getElementById(
                "startWishlistShopping"
            );


        if (startShopping) {

            startShopping.addEventListener(
                "click",
                function () {

                    closeWishlist();

                    document
                        .getElementById("products")
                        ?.scrollIntoView({
                            behavior: "smooth"
                        });
                }
            );
        }


        return;
    }


    wishlistItems.innerHTML =
        wishlist.map(
            function (product, index) {

                const price =
                    Number(product.price) || 0;

                return `

                    <div class="wishlist-item">

                        <div class="wishlist-item-image">

                            <img
                                src="${escapeHTML(product.image || "")}"
                                alt="${escapeHTML(product.name)}"
                            >

                        </div>


                        <div class="wishlist-item-info">

                            <h4>
                                ${escapeHTML(product.name)}
                            </h4>

                            <p class="wishlist-item-price">
                                ₹${price.toLocaleString("en-IN")}
                            </p>

                        </div>


                        <div class="wishlist-item-actions">

                            <button
                                type="button"
                                class="wishlist-add-cart"
                                onclick="addWishlistItemToCart(${index})"
                            >
                                Add to Cart
                            </button>

                            <button
                                type="button"
                                class="remove-wishlist-item"
                                onclick="removeFromWishlist(${index})"
                                aria-label="Remove from wishlist"
                            >
                                ×
                            </button>

                        </div>

                    </div>

                `;
            }
        ).join("");
}


/* =========================================================
   OPEN WISHLIST
   ========================================================= */

function openWishlist() {

    const wishlistPanel =
        document.getElementById(
            "wishlistPanel"
        );

    const wishlistOverlay =
        document.getElementById(
            "wishlistOverlay"
        );


    updateWishlistUI();

    updateWishlistButtons();


    if (wishlistPanel) {

        wishlistPanel.classList.add(
            "active"
        );
    }


    if (wishlistOverlay) {

        wishlistOverlay.classList.add(
            "active"
        );
    }


    document.body.style.overflow =
        "hidden";
}


/* =========================================================
   SHOW WISHLIST
   ========================================================= */

function showWishlist() {
    openWishlist();
}


/* =========================================================
   CLOSE WISHLIST
   ========================================================= */

function closeWishlist() {

    const wishlistPanel =
        document.getElementById(
            "wishlistPanel"
        );

    const wishlistOverlay =
        document.getElementById(
            "wishlistOverlay"
        );


    if (wishlistPanel) {

        wishlistPanel.classList.remove(
            "active"
        );
    }


    if (wishlistOverlay) {

        wishlistOverlay.classList.remove(
            "active"
        );
    }


    document.body.style.overflow =
        "";
}


/* =========================================================
   REMOVE FROM WISHLIST
   ========================================================= */

function removeFromWishlist(index) {

    if (!wishlist[index]) {
        return;
    }


    wishlist.splice(
        index,
        1
    );


    saveWishlist();

    updateWishlistUI();

    updateWishlistButtons();

    updateProductModalWishlistButton();
}


/* =========================================================
   ADD WISHLIST PRODUCT TO CART
   ========================================================= */

function addWishlistItemToCart(index) {

    const product =
        wishlist[index];


    if (!product) {
        return;
    }


    addToCart(
        product.name,
        product.price,
        product.image
    );
}


/* =========================================================
   INITIALIZE WISHLIST
   ========================================================= */

function initializeWishlist() {

    updateWishlistUI();

    updateWishlistButtons();
}


/* =========================================================
   SEARCH
   ========================================================= */

function showSearch() {

    const searchInput =
        document.getElementById(
            "productSearch"
        );


    if (!searchInput) {
        return;
    }


    document
        .getElementById("products")
        ?.scrollIntoView({
            behavior: "smooth"
        });


    setTimeout(
        function () {

            searchInput.focus();

        },
        500
    );
}


/* =========================================================
   FILTER PRODUCTS
   ========================================================= */

function filterProducts() {

    const searchInput =
        document.getElementById(
            "productSearch"
        );

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    if (
        !searchInput ||
        !categoryFilter
    ) {
        return;
    }


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedCategory =
        categoryFilter.value;


    const products =
        document.querySelectorAll(
            ".product-card"
        );


    products.forEach(
        function (product) {

            const name =
                (
                    product.dataset.name ||
                    ""
                ).toLowerCase();


            const category =
                (
                    product.dataset.category ||
                    ""
                ).toLowerCase();


            const matchesSearch =
                name.includes(
                    searchText
                );


            const matchesCategory =
                selectedCategory === "all" ||
                category ===
                selectedCategory;


            if (
                matchesSearch &&
                matchesCategory
            ) {

                product.style.display =
                    "";

            } else {

                product.style.display =
                    "none";
            }
        }
    );
}

/* =========================================================
   CATEGORY CARD SELECTION
========================================================= */

function selectCategory(category) {

    const categoryFilter =
        document.getElementById("categoryFilter");

    const productsSection =
        document.getElementById("products");

    if (!categoryFilter) {
        return;
    }

    /* Set selected category */
    categoryFilter.value = category;

    /* Apply existing product filter */
    filterProducts();

    /* Scroll to products */
    if (productsSection) {

        productsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
}

/* =========================================================
   PRODUCT DETAILS MODAL
   ========================================================= */

let currentProduct = null;

let currentProductQuantity = 1;


/* =========================================================
   OPEN PRODUCT DETAILS
   ========================================================= */

function openProductModal(productCard) {

    if (!productCard) {
        return;
    }


    const modal =
        document.getElementById(
            "productModal"
        );


    if (!modal) {
        return;
    }


    currentProduct = {

        name:
            productCard.dataset.name || "",

        price:
            Number(
                productCard.dataset.price || 0
            ),

        oldPrice:
            Number(
                productCard.dataset.oldPrice || 0
            ),

        category:
            productCard.dataset.category || "",

        rating:
            Number(
                productCard.dataset.rating || 0
            ),

        reviews:
            Number(
                productCard.dataset.reviews || 0
            ),

        description:
            productCard.dataset.description || "",

        image:
            productCard.querySelector("img")?.src || ""
    };


    currentProductQuantity = 1;


    const modalImage =
        document.getElementById(
            "modalProductImage"
        );


    const modalCategory =
        document.getElementById(
            "modalProductCategory"
        );


    const modalName =
        document.getElementById(
            "modalProductName"
        );


    const modalRating =
        document.getElementById(
            "modalProductRating"
        );


    const modalPrice =
        document.getElementById(
            "modalProductPrice"
        );


    const modalOldPrice =
        document.getElementById(
            "modalProductOldPrice"
        );


    const modalDescription =
        document.getElementById(
            "modalProductDescription"
        );


    const productQuantity =
        document.getElementById(
            "productQuantity"
        );


    if (modalImage) {

        modalImage.src =
            currentProduct.image;

        modalImage.alt =
            currentProduct.name;
    }


    if (modalCategory) {

        modalCategory.textContent =
            currentProduct.category
                .toUpperCase();
    }


    if (modalName) {

        modalName.textContent =
            currentProduct.name;
    }


    if (modalRating) {

        const rating =
            Math.max(
                0,
                Math.min(
                    5,
                    Math.round(
                        currentProduct.rating
                    )
                )
            );

        modalRating.innerHTML =
            "★".repeat(rating) +
            "☆".repeat(5 - rating) +
            ` <span>(${currentProduct.reviews})</span>`;
    }


    if (modalPrice) {

        modalPrice.textContent =
            "₹" +
            currentProduct.price
                .toLocaleString("en-IN");
    }


    if (modalOldPrice) {

        if (
            currentProduct.oldPrice > 0
        ) {

            modalOldPrice.textContent =
                "₹" +
                currentProduct.oldPrice
                    .toLocaleString("en-IN");

            modalOldPrice.style.display =
                "inline";

        } else {

            modalOldPrice.style.display =
                "none";
        }
    }


    if (modalDescription) {

        modalDescription.textContent =
            currentProduct.description;
    }


    if (productQuantity) {

        productQuantity.textContent =
            currentProductQuantity;
    }


    /*
       Automatically create the Product Details
       wishlist button and related products section.
    */

    ensureProductModalExtras();

    updateProductModalExtras();


    modal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";
}


/* =========================================================
   PRODUCT DETAILS - CREATE EXTRA UI
   ========================================================= */

function ensureProductModalExtras() {

    const modal =
        document.getElementById(
            "productModal"
        );


    if (!modal) {
        return;
    }


    const modalContent =
        modal.querySelector(
            ".product-modal-content"
        );


    const modalInfo =
        modal.querySelector(
            ".modal-product-info"
        );


    if (
        !modalContent ||
        !modalInfo
    ) {
        return;
    }



    /* ---------------------------------------------------------
       Related Products section
       --------------------------------------------------------- */

    if (
        !document.getElementById(
            "relatedProducts"
        )
    ) {

        const section =
            document.createElement(
                "section"
            );


        section.className =
            "related-products-section";


        section.innerHTML = `

            <div class="related-products-heading">

                <span>
                    YOU MAY ALSO LIKE
                </span>

                <h3>
                    Related Products
                </h3>

            </div>


            <div
                id="relatedProducts"
                class="related-products-grid"
            ></div>

        `;


        modalContent.appendChild(
            section
        );
    }


    /* ---------------------------------------------------------
       Inject required CSS.
       --------------------------------------------------------- */

    if (
        !document.getElementById(
            "shopEaseProductDetailsStyles"
        )
    ) {

        const style =
            document.createElement(
                "style"
            );


        style.id =
            "shopEaseProductDetailsStyles";


        style.textContent = `

            .modal-wishlist-button {

                width: 100%;

                margin-top: 12px;

                padding: 14px 18px;

                border: 1px solid #e5e7eb;

                border-radius: 8px;

                background: #ffffff;

                color: #222222;

                font-size: 14px;

                font-weight: 700;

                cursor: pointer;

                transition:
                    background 0.25s ease,
                    color 0.25s ease,
                    border-color 0.25s ease,
                    transform 0.25s ease;
            }


            .modal-wishlist-button:hover {

                border-color: #e85d04;

                color: #e85d04;

                transform:
                    translateY(-1px);
            }


            .modal-wishlist-button.active {

                background: #fff7ed;

                border-color: #e85d04;

                color: #e85d04;
            }


            .related-products-section {

                margin-top: 35px;

                padding-top: 30px;

                border-top:
                    1px solid #eeeeee;
            }


            .related-products-heading {

                margin-bottom: 18px;
            }


            .related-products-heading span {

                display: block;

                margin-bottom: 5px;

                color: #e85d04;

                font-size: 11px;

                font-weight: 800;

                letter-spacing: 1.8px;
            }


            .related-products-heading h3 {

                margin: 0;

                color: #222222;

                font-size: 22px;

                font-weight: 700;
            }


            .related-products-grid {

                display: grid;

                grid-template-columns:
                    repeat(
                        3,
                        minmax(0, 1fr)
                    );

                gap: 14px;
            }


            .related-product-card {

                overflow: hidden;

                border:
                    1px solid #eeeeee;

                border-radius: 12px;

                background: #ffffff;

                cursor: pointer;

                transition:
                    transform 0.25s ease,
                    box-shadow 0.25s ease,
                    border-color 0.25s ease;
            }


            .related-product-card:hover {

                transform:
                    translateY(-4px);

                border-color:
                    #e5e7eb;

                box-shadow:
                    0 12px 30px
                    rgba(
                        0,
                        0,
                        0,
                        0.08
                    );
            }


            .related-product-card:focus {

                outline:
                    2px solid #e85d04;

                outline-offset:
                    2px;
            }


            .related-product-image {

                width: 100%;

                height: 150px;

                overflow: hidden;

                background: #f7f7f7;
            }


            .related-product-image img {

                width: 100%;

                height: 100%;

                object-fit: cover;

                display: block;

                transition:
                    transform 0.35s ease;
            }


            .related-product-card:hover
            .related-product-image img {

                transform:
                    scale(1.05);
            }


            .related-product-info {

                padding: 14px;
            }


            .related-product-category {

                display: block;

                margin-bottom: 5px;

                color: #999999;

                font-size: 10px;

                font-weight: 700;

                text-transform:
                    uppercase;

                letter-spacing: 0.8px;
            }


            .related-product-info h4 {

                margin:
                    0 0 7px;

                color: #222222;

                font-size: 14px;

                line-height: 1.35;

                display:
                    -webkit-box;

                -webkit-line-clamp: 2;

                -webkit-box-orient:
                    vertical;

                overflow: hidden;
            }


            .related-product-rating {

                margin-bottom: 7px;

                color: #f59e0b;

                font-size: 12px;
            }


            .related-product-rating span {

                color: #999999;

                margin-left: 3px;
            }


            .related-product-price {

                color: #e85d04;

                font-size: 16px;

                font-weight: 800;
            }


            @media (max-width: 700px) {

                .related-products-grid {

                    grid-template-columns:
                        1fr;
                }


                .related-product-card {

                    display: grid;

                    grid-template-columns:
                        100px
                        minmax(
                            0,
                            1fr
                        );
                }


                .related-product-image {

                    height: 130px;
                }


                .related-product-info {

                    padding: 13px;
                }

            }

        `;


        document.head.appendChild(
            style
        );
    }
}


/* =========================================================
   TOGGLE MODAL WISHLIST
   ========================================================= */

function toggleCurrentProductWishlist() {

    if (!currentProduct) {
        console.error("No current product found.");
        return;
    }

    // Make sure wishlist is an array
    if (!Array.isArray(wishlist)) {
        wishlist = [];
    }

    const productName = currentProduct.name;

    if (!productName) {
        console.error("Product name is missing.");
        return;
    }

    const existingIndex = wishlist.findIndex(
        item => item.name === productName
    );

    if (existingIndex !== -1) {

        // Remove from wishlist
        wishlist.splice(existingIndex, 1);

    } else {

        // Add to wishlist
        wishlist.push({
            name: currentProduct.name,
            price: Number(currentProduct.price) || 0,
            category: currentProduct.category || "",
            image: currentProduct.image || ""
        });
    }

    // Save
    localStorage.setItem(
        "shopEaseWishlist",
        JSON.stringify(wishlist)
    );

    // Update everything
    updateWishlistUI();
    updateWishlistButtons();
    updateProductModalWishlistButton();

    console.log(
        "Wishlist updated:",
        wishlist
    );
}


/* =========================================================
   UPDATE MODAL WISHLIST BUTTON
   ========================================================= */

function updateProductModalWishlistButton() {

    const button = document.getElementById(
        "modalWishlistButton"
    );

    if (!button) {
        console.error(
            "modalWishlistButton not found."
        );
        return;
    }

    if (!currentProduct) {
        return;
    }

    const isWishlisted = wishlist.some(
        item =>
            item.name === currentProduct.name
    );

    if (isWishlisted) {

        button.innerHTML =
            "♥ Remove from Wishlist";

        button.classList.add("active");

        button.setAttribute(
            "aria-label",
            "Remove from wishlist"
        );

    } else {

        button.innerHTML =
            "♡ Add to Wishlist";

        button.classList.remove("active");

        button.setAttribute(
            "aria-label",
            "Add to wishlist"
        );
    }
}


/* =========================================================
   GET PRODUCT DATA FROM CARD
   ========================================================= */

function getProductDataFromCard(card) {

    if (!card) {
        return null;
    }


    const imageElement =
        card.querySelector("img");


    return {

        name:
            card.dataset.name || "",

        price:
            Number(
                card.dataset.price || 0
            ),

        oldPrice:
            Number(
                card.dataset.oldPrice || 0
            ),

        category:
            card.dataset.category || "",

        rating:
            Number(
                card.dataset.rating || 0
            ),

        reviews:
            Number(
                card.dataset.reviews || 0
            ),

        description:
            card.dataset.description || "",

        image:
            imageElement
                ? imageElement.src
                : ""
    };
}


/* =========================================================
   RENDER RELATED PRODUCTS
   ========================================================= */

function renderRelatedProducts() {

    const container =
        document.getElementById(
            "relatedProducts"
        );


    if (
        !container ||
        !currentProduct
    ) {
        return;
    }


    const productCards =
        Array.from(
            document.querySelectorAll(
                ".product-card"
            )
        );


    const allProducts =
        productCards
            .map(
                getProductDataFromCard
            )
            .filter(
                product =>
                    product &&
                    product.name &&
                    product.name !==
                        currentProduct.name
            );


    /*
       Same-category products first.
    */

    const sameCategory =
        allProducts.filter(
            product =>
                product.category
                    .toLowerCase() ===
                currentProduct.category
                    .toLowerCase()
        );


    /*
       Other products as fallback.
    */

    const otherProducts =
        allProducts.filter(
            product =>
                product.category
                    .toLowerCase() !==
                currentProduct.category
                    .toLowerCase()
        );


    const relatedProducts = [

        ...sameCategory,

        ...otherProducts

    ].slice(
        0,
        3
    );


    if (
        relatedProducts.length === 0
    ) {

        container.innerHTML =
            "";

        return;
    }


    container.innerHTML =
        relatedProducts.map(
            product => {

                const rating =
                    Math.max(
                        0,
                        Math.min(
                            5,
                            Math.round(
                                product.rating
                            )
                        )
                    );


                const stars =
                    "★".repeat(
                        rating
                    ) +
                    "☆".repeat(
                        5 - rating
                    );


                return `

                    <article
                        class="related-product-card"
                        data-related-name="${escapeHTML(product.name)}"
                        tabindex="0"
                        role="button"
                        aria-label="View ${escapeHTML(product.name)}"
                    >

                        <div class="related-product-image">

                            <img
                                src="${escapeHTML(product.image)}"
                                alt="${escapeHTML(product.name)}"
                                loading="lazy"
                            >

                        </div>


                        <div class="related-product-info">

                            <span class="related-product-category">

                                ${escapeHTML(
                                    product.category
                                )}

                            </span>


                            <h4>

                                ${escapeHTML(
                                    product.name
                                )}

                            </h4>


                            <div class="related-product-rating">

                                ${stars}

                                <span>
                                    (${product.reviews})
                                </span>

                            </div>


                            <div class="related-product-price">

                                ₹${product.price.toLocaleString(
                                    "en-IN"
                                )}

                            </div>

                        </div>

                    </article>

                `;
            }
        ).join("");


    /*
       Add click/keyboard events.
    */

    container
        .querySelectorAll(
            ".related-product-card"
        )
        .forEach(
            card => {

                const openRelated =
                    function () {

                        const productName =
                            card.dataset
                                .relatedName;


                        const matchingCard =
                            productCards.find(
                                productCard =>
                                    productCard.dataset
                                        .name ===
                                    productName
                            );


                        if (matchingCard) {

                            openProductModal(
                                matchingCard
                            );
                        }
                    };


                card.addEventListener(
                    "click",
                    openRelated
                );


                card.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key ===
                                "Enter" ||
                            event.key ===
                                " "
                        ) {

                            event.preventDefault();

                            openRelated();
                        }
                    }
                );
            }
        );
}


/* =========================================================
   UPDATE PRODUCT MODAL EXTRAS
   ========================================================= */

function updateProductModalExtras() {

    updateProductModalWishlistButton();

    renderRelatedProducts();
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================================================
   CLOSE PRODUCT MODAL
   ========================================================= */

function closeProductModal() {

    const modal =
        document.getElementById(
            "productModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );
    }


    const cartPanel =
        document.getElementById(
            "cartPanel"
        );


    if (
        !cartPanel ||
        !cartPanel.classList.contains(
            "active"
        )
    ) {

        document.body.style.overflow =
            "";
    }
}


/* =========================================================
   INCREASE PRODUCT QUANTITY
   ========================================================= */

function increaseQuantity() {

    currentProductQuantity++;


    const quantityElement =
        document.getElementById(
            "productQuantity"
        );


    if (quantityElement) {

        quantityElement.textContent =
            currentProductQuantity;
    }
}


/* =========================================================
   DECREASE PRODUCT QUANTITY
   ========================================================= */

function decreaseQuantity() {

    if (
        currentProductQuantity >
        1
    ) {

        currentProductQuantity--;
    }


    const quantityElement =
        document.getElementById(
            "productQuantity"
        );


    if (quantityElement) {

        quantityElement.textContent =
            currentProductQuantity;
    }
}


/* =========================================================
   MODAL ADD TO CART
   ========================================================= */

function addCurrentProductToCart() {

    if (!currentProduct) {
        return;
    }


    addToCart(

        currentProduct.name,

        currentProduct.price,

        currentProduct.image,

        currentProductQuantity

    );


    closeProductModal();
}


/* =========================================================
   BUY NOW
   ========================================================= */

function buyCurrentProduct() {

    if (!currentProduct) {
        return;
    }


    addToCart(

        currentProduct.name,

        currentProduct.price,

        currentProduct.image,

        currentProductQuantity

    );


    closeProductModal();


    setTimeout(
        function () {

            openCheckout();

        },
        300
    );
}


/* =========================================================
   CHECKOUT
   ========================================================= */

function openCheckout() {

    if (
        cart.length === 0
    ) {

        alert(
            "Your cart is empty. Please add a product first."
        );

        return;
    }


    const checkoutModal =
        document.getElementById(
            "checkoutModal"
        );


    if (!checkoutModal) {
        return;
    }


    updateCheckoutUI();


    closeCart();


    checkoutModal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";
}


/* =========================================================
   CLOSE CHECKOUT
   ========================================================= */

function closeCheckout() {

    const checkoutModal =
        document.getElementById(
            "checkoutModal"
        );


    if (checkoutModal) {

        checkoutModal.classList.remove(
            "active"
        );
    }


    document.body.style.overflow =
        "";
}


/* =========================================================
   UPDATE CHECKOUT UI
   ========================================================= */

function updateCheckoutUI() {

    const checkoutItems =
        document.getElementById(
            "checkoutItems"
        );


    const checkoutSubtotal =
        document.getElementById(
            "checkoutSubtotal"
        );


    const checkoutShipping =
        document.getElementById(
            "checkoutShipping"
        );


    const checkoutTotal =
        document.getElementById(
            "checkoutTotal"
        );


    if (!checkoutItems) {
        return;
    }


    const subtotal =
        cart.reduce(
            (total, product) =>
                total +
                (
                    (Number(product.price) || 0) *
                    (Number(product.quantity) || 0)
                ),
            0
        );


    const shipping =
        cart.length > 0 ? 50 : 0;


    const total =
        subtotal + shipping;


    checkoutItems.innerHTML =
        cart.map(
            product => {

                const price =
                    Number(product.price) || 0;

                const quantity =
                    Number(product.quantity) || 1;

                return `

                    <div class="checkout-item">

                        <img
                            src="${escapeHTML(product.image || "")}"
                            alt="${escapeHTML(product.name)}"
                            class="checkout-item-image"
                        >


                        <div class="checkout-item-info">

                            <p class="checkout-item-name">

                                ${escapeHTML(
                                    product.name
                                )}

                            </p>


                            <p class="checkout-item-quantity">

                                Quantity:
                                ${quantity}

                            </p>

                        </div>


                        <span class="checkout-item-price">

                            ₹${(
                                price *
                                quantity
                            ).toLocaleString(
                                "en-IN"
                            )}

                        </span>

                    </div>

                `;
            }
        ).join("");


    if (checkoutSubtotal) {

        checkoutSubtotal.textContent =
            "₹" +
            subtotal.toLocaleString(
                "en-IN"
            );
    }


    if (checkoutShipping) {

        checkoutShipping.textContent =
            "₹" +
            shipping.toLocaleString(
                "en-IN"
            );
    }


    if (checkoutTotal) {

        checkoutTotal.textContent =
            "₹" +
            total.toLocaleString(
                "en-IN"
            );
    }
}


/* =========================================================
   CHECKOUT FORM VALIDATION
   ========================================================= */

function validateCheckoutForm() {

    const name =
        document.getElementById(
            "checkoutName"
        );


    const email =
        document.getElementById(
            "checkoutEmail"
        );


    const phone =
        document.getElementById(
            "checkoutPhone"
        );


    const address =
        document.getElementById(
            "checkoutAddress"
        );


    const city =
        document.getElementById(
            "checkoutCity"
        );


    const state =
        document.getElementById(
            "checkoutState"
        );


    const pincode =
        document.getElementById(
            "checkoutPincode"
        );


    if (
        !name ||
        !email ||
        !phone ||
        !address ||
        !city ||
        !state ||
        !pincode
    ) {

        alert(
            "Checkout form could not be loaded."
        );

        return false;
    }


    name.value =
        name.value.trim();


    email.value =
        email.value.trim();


    phone.value =
        phone.value.trim();


    address.value =
        address.value.trim();


    city.value =
        city.value.trim();


    state.value =
        state.value.trim();


    pincode.value =
        pincode.value.trim();


    if (!name.value) {

        alert(
            "Please enter your full name."
        );

        name.focus();

        return false;
    }


    if (!email.value) {

        alert(
            "Please enter your email address."
        );

        email.focus();

        return false;
    }


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
        !emailPattern.test(
            email.value
        )
    ) {

        alert(
            "Please enter a valid email address."
        );

        email.focus();

        return false;
    }


    if (!phone.value) {

        alert(
            "Please enter your phone number."
        );

        phone.focus();

        return false;
    }


    const phoneDigits =
        phone.value.replace(
            /\D/g,
            ""
        );


    if (
        phoneDigits.length !== 10
    ) {

        alert(
            "Please enter a valid 10-digit phone number."
        );

        phone.focus();

        return false;
    }


    if (!address.value) {

        alert(
            "Please enter your delivery address."
        );

        address.focus();

        return false;
    }


    if (!city.value) {

        alert(
            "Please enter your city."
        );

        city.focus();

        return false;
    }


    if (!state.value) {

        alert(
            "Please enter your state."
        );

        state.focus();

        return false;
    }


    if (!pincode.value) {

        alert(
            "Please enter your PIN code."
        );

        pincode.focus();

        return false;
    }


    if (
        !/^\d{6}$/.test(
            pincode.value
        )
    ) {

        alert(
            "Please enter a valid 6-digit PIN code."
        );

        pincode.focus();

        return false;
    }


    return true;
}


/* =========================================================
   GENERATE ORDER NUMBER
   ========================================================= */

function generateOrderNumber() {

    const randomNumber =
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    return "#SE" +
        randomNumber;
}


/* =========================================================
   PLACE ORDER
   ========================================================= */

function placeOrder() {

    if (
        cart.length === 0
    ) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    if (
        !validateCheckoutForm()
    ) {

        return;
    }


    const selectedPayment =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );


    let paymentMethod =
        "Cash on Delivery";


    if (selectedPayment) {

        if (
            selectedPayment.value ===
            "upi"
        ) {

            paymentMethod =
                "UPI";

        } else if (
            selectedPayment.value ===
            "card"
        ) {

            paymentMethod =
                "Credit / Debit Card";
        }
    }


    const orderNumber =
        generateOrderNumber();


    const orderNumberElement =
        document.getElementById(
            "orderNumber"
        );


    if (orderNumberElement) {

        orderNumberElement.textContent =
            orderNumber;
    }


    closeCheckout();


    const successModal =
        document.getElementById(
            "orderSuccessModal"
        );


    if (successModal) {

        successModal.classList.add(
            "active"
        );
    }


    document.body.style.overflow =
        "hidden";


    /*
       Clear cart after successful order.
    */

    cart = [];


    saveCart();

    updateCartUI();


    console.log(
        "ShopEase Order:",
        {
            orderNumber:
                orderNumber,

            paymentMethod:
                paymentMethod
        }
    );
}


/* =========================================================
   CLOSE ORDER SUCCESS
   ========================================================= */

function closeOrderSuccess() {

    const successModal =
        document.getElementById(
            "orderSuccessModal"
        );


    if (successModal) {

        successModal.classList.remove(
            "active"
        );
    }


    document.body.style.overflow =
        "";
}


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const modalWishlistButton =
            document.getElementById(
                "modalWishlistButton"
            );

        if (modalWishlistButton) {

            modalWishlistButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    toggleCurrentProductWishlist();
                }
            );
        }


        /* -------------------------------------------------
           INITIAL CART
           ------------------------------------------------- */

        updateCartUI();


        /* -------------------------------------------------
           INITIAL WISHLIST
           ------------------------------------------------- */

        initializeWishlist();


        /* -------------------------------------------------
           WISHLIST BUTTONS
           ------------------------------------------------- */

        const wishlistButtons =
            document.querySelectorAll(
                ".wishlist-button"
            );


        wishlistButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();


                        const productCard =
                            button.closest(
                                ".product-card"
                            );


                        toggleWishlist(
                            productCard
                        );
                    }
                );
            }
        );


        /* -------------------------------------------------
           WISHLIST CLOSE BUTTON
           ------------------------------------------------- */

        const wishlistCloseButton =
            document.querySelector(
                ".wishlist-close"
            );


        if (wishlistCloseButton) {

            wishlistCloseButton.addEventListener(
                "click",
                closeWishlist
            );
        }


        /* -------------------------------------------------
           WISHLIST OVERLAY
           ------------------------------------------------- */

        const wishlistOverlay =
            document.getElementById(
                "wishlistOverlay"
            );


        if (wishlistOverlay) {

            wishlistOverlay.addEventListener(
                "click",
                closeWishlist
            );
        }


        /* -------------------------------------------------
           CART ICON
           ------------------------------------------------- */

        const cartIcon =
            document.getElementById(
                "cartIcon"
            );


        if (cartIcon) {

            cartIcon.addEventListener(
                "click",
                openCart
            );
        }


        /* -------------------------------------------------
           CLOSE CART BUTTON
           ------------------------------------------------- */

        const closeCartButton =
            document.getElementById(
                "closeCart"
            );


        if (closeCartButton) {

            closeCartButton.addEventListener(
                "click",
                closeCart
            );
        }


        /* -------------------------------------------------
           CART OVERLAY
           ------------------------------------------------- */

        const cartOverlay =
            document.getElementById(
                "cartOverlay"
            );


        if (cartOverlay) {

            cartOverlay.addEventListener(
                "click",
                closeCart
            );
        }


        /* -------------------------------------------------
           CLEAR CART
           ------------------------------------------------- */

        const clearCartButton =
            document.getElementById(
                "clearCartButton"
            );


        if (clearCartButton) {

            clearCartButton.addEventListener(
                "click",
                clearCart
            );
        }


        /* -------------------------------------------------
           CHECKOUT BUTTON
           ------------------------------------------------- */

        const checkoutButton =
            document.getElementById(
                "checkoutButton"
            );


        if (checkoutButton) {

            checkoutButton.addEventListener(
                "click",
                openCheckout
            );
        }


        /* -------------------------------------------------
           CLOSE CHECKOUT
           ------------------------------------------------- */

        const closeCheckoutButton =
            document.getElementById(
                "closeCheckout"
            );


        if (closeCheckoutButton) {

            closeCheckoutButton.addEventListener(
                "click",
                closeCheckout
            );
        }


        /* -------------------------------------------------
           PLACE ORDER
           ------------------------------------------------- */

        const placeOrderButton =
            document.getElementById(
                "placeOrderButton"
            );


        if (placeOrderButton) {

            placeOrderButton.addEventListener(
                "click",
                placeOrder
            );
        }


        /* -------------------------------------------------
           CONTINUE SHOPPING
           ------------------------------------------------- */

        const continueShoppingButton =
            document.getElementById(
                "continueShoppingButton"
            );


        if (continueShoppingButton) {

            continueShoppingButton.addEventListener(
                "click",
                closeOrderSuccess
            );
        }


        /* -------------------------------------------------
           SEARCH
           ------------------------------------------------- */

        const searchInput =
            document.getElementById(
                "productSearch"
            );


        const categoryFilter =
            document.getElementById(
                "categoryFilter"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                filterProducts
            );
        }


        if (categoryFilter) {

            categoryFilter.addEventListener(
                "change",
                filterProducts
            );
        }


        /* -------------------------------------------------
           PRODUCT CARDS
           ------------------------------------------------- */

        const productCards =
            document.querySelectorAll(
                ".product-card"
            );


        productCards.forEach(
            function (card) {

                card.addEventListener(
                    "click",
                    function (event) {

                        /*
                           Do not open Product Details
                           when clicking a button.
                        */

                        if (
                            event.target.closest(
                                "button"
                            )
                        ) {
                            return;
                        }


                        openProductModal(
                            card
                        );
                    }
                );
            }
        );


        /* -------------------------------------------------
           MODAL ADD TO CART
           ------------------------------------------------- */

        const modalAddToCart =
            document.getElementById(
                "modalAddToCart"
            );


        if (modalAddToCart) {

            modalAddToCart.addEventListener(
                "click",
                addCurrentProductToCart
            );
        }


        /* -------------------------------------------------
           MODAL BUY NOW
           ------------------------------------------------- */

        const modalBuyNow =
            document.getElementById(
                "modalBuyNow"
            );


        if (modalBuyNow) {

            modalBuyNow.addEventListener(
                "click",
                buyCurrentProduct
            );
        }


        /* -------------------------------------------------
           PRODUCT MODAL
           ------------------------------------------------- */

        const productModal =
            document.getElementById(
                "productModal"
            );


        if (productModal) {

            productModal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        productModal
                    ) {

                        closeProductModal();
                    }
                }
            );
        }


        /* -------------------------------------------------
           CHECKOUT MODAL OUTSIDE CLICK
           ------------------------------------------------- */

        const checkoutModal =
            document.getElementById(
                "checkoutModal"
            );


        if (checkoutModal) {

            checkoutModal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        checkoutModal
                    ) {

                        closeCheckout();
                    }
                }
            );
        }


        /* -------------------------------------------------
           SUCCESS MODAL OUTSIDE CLICK
           ------------------------------------------------- */

        const successModal =
            document.getElementById(
                "orderSuccessModal"
            );


        if (successModal) {

            successModal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        successModal
                    ) {

                        closeOrderSuccess();
                    }
                }
            );
        }


        /* -------------------------------------------------
           ESCAPE KEY
           ------------------------------------------------- */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key !==
                    "Escape"
                ) {
                    return;
                }


                const checkout =
                    document.getElementById(
                        "checkoutModal"
                    );


                const success =
                    document.getElementById(
                        "orderSuccessModal"
                    );


                const productModal =
                    document.getElementById(
                        "productModal"
                    );


                const cartPanel =
                    document.getElementById(
                        "cartPanel"
                    );


                const wishlistPanel =
                    document.getElementById(
                        "wishlistPanel"
                    );


                if (
                    success &&
                    success.classList.contains(
                        "active"
                    )
                ) {

                    closeOrderSuccess();

                    return;
                }


                if (
                    checkout &&
                    checkout.classList.contains(
                        "active"
                    )
                ) {

                    closeCheckout();

                    return;
                }


                if (
                    productModal &&
                    productModal.classList.contains(
                        "active"
                    )
                ) {

                    closeProductModal();

                    return;
                }


                if (
                    wishlistPanel &&
                    wishlistPanel.classList.contains(
                        "active"
                    )
                ) {

                    closeWishlist();

                    return;
                }


                if (
                    cartPanel &&
                    cartPanel.classList.contains(
                        "active"
                    )
                ) {

                    closeCart();
                }

            }
        );

    }
);