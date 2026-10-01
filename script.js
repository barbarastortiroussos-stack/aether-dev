const products = [

    {
        id: 1,
        title: "Vibe Coding Mastery",
        category: "Vibe Coding",
        price: 27,
        oldPrice: 47,
        description: "Learn how to build software faster with AI-assisted development.",
        short: "VIBE CODING",
        accent: "#d7ff54"
    },

    {
        id: 2,
        title: "The AI Builder's Handbook",
        category: "AI",
        price: 24,
        oldPrice: 42,
        description: "A practical guide to using AI as your development copilot.",
        short: "AI BUILDER",
        accent: "#8affc1"
    },

    {
        id: 3,
        title: "Code Atlas",
        category: "Coding",
        price: 22,
        oldPrice: 35,
        description: "A modern roadmap through programming fundamentals.",
        short: "CODE ATLAS",
        accent: "#8bc7ff"
    },

    {
        id: 4,
        title: "Prompt Engineering Lab",
        category: "AI",
        price: 19,
        oldPrice: 34,
        description: "Build better prompts and create more reliable AI workflows.",
        short: "PROMPT LAB",
        accent: "#d7a7ff"
    },

    {
        id: 5,
        title: "Digital Product Blueprint",
        category: "Business",
        price: 29,
        oldPrice: 49,
        description: "Turn knowledge and ideas into scalable digital products.",
        short: "PRODUCT BLUEPRINT",
        accent: "#ffb56b"
    },

    {
        id: 6,
        title: "Deep Work for Builders",
        category: "Productivity",
        price: 17,
        oldPrice: 27,
        description: "Build a focused workflow designed for modern creators.",
        short: "DEEP WORK",
        accent: "#ff7b9d"
    }

];


let cart = JSON.parse(
    localStorage.getItem("aetherCart")
) || [];


const productsGrid =
    document.getElementById("productsGrid");

const cartCount =
    document.getElementById("cartCount");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const cartDrawer =
    document.getElementById("cartDrawer");

const toast =
    document.getElementById("toast");

const searchOverlay =
    document.getElementById("searchOverlay");

const searchInput =
    document.getElementById("searchInput");

const searchResults =
    document.getElementById("searchResults");


/* MONEY */

function money(value) {

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD"
        }
    ).format(value);

}


/* ESCAPE HTML */

function escapeHTML(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* RENDER PRODUCTS */

function renderProducts(category = "All") {

    const filtered =
        category === "All"
            ? products
            : products.filter(
                product =>
                    product.category === category
            );


    productsGrid.innerHTML =
        filtered.map(product => `

            <article
                class="product-card"
                data-id="${product.id}"
            >

                <div
                    class="product-cover"
                    style="--product-accent:${product.accent}"
                >

                    <span class="product-category">
                        ${escapeHTML(product.category)}
                    </span>

                    <h3>
                        ${escapeHTML(product.short)}
                    </h3>

                    <span class="product-number">
                        PRODUCT / ${String(product.id).padStart(3, "0")}
                    </span>

                </div>


                <div class="product-info">

                    <h3>
                        ${escapeHTML(product.title)}
                    </h3>

                    <p>
                        ${escapeHTML(product.description)}
                    </p>


                    <div class="product-bottom">

                        <div class="price">

                            <strong>
                                ${money(product.price)}
                            </strong>

                            <span class="old-price">
                                ${money(product.oldPrice)}
                            </span>

                        </div>


                        <button
                            class="add-button"
                            data-add="${product.id}"
                        >
                            ADD +
                        </button>

                    </div>

                </div>

            </article>

        `).join("");

}


/* SAVE CART */

function saveCart() {

    localStorage.setItem(
        "aetherCart",
        JSON.stringify(cart)
    );

}


/* ADD TO CART */

function addToCart(id) {

    const product =
        products.find(
            item => item.id === id
        );

    if (!product) return;


    const exists =
        cart.some(
            item => item.id === id
        );


    if (exists) {

        showToast(
            "This product is already in your cart."
        );

        return;

    }


    cart.push(product);

    saveCart();

    updateCart();

    showToast(
        `${product.title} added to cart.`
    );

}


/* REMOVE FROM CART */

function removeFromCart(id) {

    cart =
        cart.filter(
            product => product.id !== id
        );

    saveCart();

    updateCart();

}


/* UPDATE CART */

function updateCart() {

    cartCount.textContent =
        cart.length;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                Your cart is empty.
            </div>
        `;

        cartTotal.textContent =
            money(0);

        return;

    }


    cartItems.innerHTML =
        cart.map(product => `

            <div class="cart-item">

                <div class="cart-item-info">

                    <strong>
                        ${escapeHTML(product.title)}
                    </strong>

                    <span>
                        ${money(product.price)}
                    </span>

                </div>

                <button
                    class="remove-item"
                    data-remove="${product.id}"
                >
                    REMOVE
                </button>

            </div>

        `).join("");


    const total =
        cart.reduce(
            (sum, product) =>
                sum + product.price,
            0
        );


    cartTotal.textContent =
        money(total);

}


/* TOAST */

function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add("show");


    clearTimeout(
        showToast.timeout
    );


    showToast.timeout =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2500);

}


/* OPEN CART */

function openCart() {

    cartDrawer.classList.add(
        "open"
    );

}


/* CLOSE CART */

function closeCart() {

    cartDrawer.classList.remove(
        "open"
    );

}


/* SEARCH */

function openSearch() {

    searchOverlay.classList.add(
        "active"
    );

    searchInput.focus();

}


function closeSearch() {

    searchOverlay.classList.remove(
        "active"
    );

}


/* SEARCH RESULTS */

function renderSearchResults(query) {

    const normalized =
        query
            .trim()
            .toLowerCase();


    if (!normalized) {

        searchResults.innerHTML = "";

        return;

    }


    const results =
        products.filter(product =>

            product.title
                .toLowerCase()
                .includes(normalized)

            ||

            product.category
                .toLowerCase()
                .includes(normalized)

            ||

            product.description
                .toLowerCase()
                .includes(normalized)

        );


    if (results.length === 0) {

        searchResults.innerHTML = `
            <p style="color:#8b908b">
                No products found.
            </p>
        `;

        return;

    }


    searchResults.innerHTML =
        results.map(product => `

            <div class="search-result">

                <div>

                    <strong>
                        ${escapeHTML(product.title)}
                    </strong>

                    <small>
                        ${escapeHTML(product.category)}
                        ·
                        ${money(product.price)}
                    </small>

                </div>


                <button
                    class="add-button"
                    data-search-add="${product.id}"
                >
                    ADD +
                </button>

            </div>

        `).join("");

}


/* FILTER EVENTS */

document
    .querySelectorAll(".filter")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".filter")
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                button.classList.add(
                    "active"
                );


                renderProducts(
                    button.dataset.category
                );

            }
        );

    });


/* PRODUCT ADD */

productsGrid.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-add]"
            );

        if (!button) return;


        addToCart(
            Number(button.dataset.add)
        );

    }
);


/* CART REMOVE */

cartItems.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-remove]"
            );

        if (!button) return;


        removeFromCart(
            Number(button.dataset.remove)
        );

    }
);


/* OPEN CART */

document
    .getElementById("cartButton")
    .addEventListener(
        "click",
        openCart
    );


/* CLOSE CART */

document
    .getElementById("closeCart")
    .addEventListener(
        "click",
        closeCart
    );


/* SEARCH BUTTON */

document
    .getElementById("searchButton")
    .addEventListener(
        "click",
        openSearch
    );


/* CLOSE SEARCH */

document
    .getElementById("closeSearch")
    .addEventListener(
        "click",
        closeSearch
    );


/* SEARCH INPUT */

searchInput.addEventListener(
    "input",
    event => {

        renderSearchResults(
            event.target.value
        );

    }
);


/* SEARCH RESULT ADD */

searchResults.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-search-add]"
            );

        if (!button) return;


        addToCart(
            Number(
                button.dataset.searchAdd
            )
        );

        closeSearch();

        openCart();

    }
);


/* CATEGORY CARDS */

document
    .querySelectorAll(".category-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const category =
                    card.dataset.category;


                document
                    .querySelectorAll(".filter")
                    .forEach(
                        button => {

                            button.classList.toggle(
                                "active",
                                button.dataset.category ===
                                category
                            );

                        }
                    );


                renderProducts(category);


                document
                    .getElementById("products")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    });


/* BUNDLE */

document
    .getElementById("bundleButton")
    .addEventListener(
        "click",
        () => {

            showToast(
                "Bundle checkout ready to connect."
            );

        }
    );


/* CHECKOUT */

document
    .getElementById("checkoutButton")
    .addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                showToast(
                    "Your cart is empty."
                );

                return;

            }


            showToast(
                "Connect Stripe, Lemon Squeezy or another gateway here."
            );

        }
    );


/* ESCAPE */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeSearch();

            closeCart();

        }

    }
);


/* INITIAL */

renderProducts();

updateCart();
