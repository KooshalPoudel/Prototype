/* 
    Group Name: NextGenDevelopers
    Project Chosen: Online Marketplace
    Author: Kushal Poudel, Alok Poudel, Rojal Shrestha, Pawan Rijal
    Date: 11/22/2025
    Filename:common.js
    Purpose: This documents  handles backend logic to test prototype. It controls data, user authentication, cart, products, and state management
    */

// ===== Common data =====
const JUTTA_STORAGE_KEY = "jutta_state_v1";

const defaultState = {
    users: [
        {
            id: 1,
            username: "seller1",
            email: "seller1@gmail.com",
            // password = Seller@12345
            passwordHash: "66da0b15d0b6c527e2a3bdd38e5aedef41f9836b518e49c8cca693de537f46d3",
            role: "seller",
            ratings: [5, 4, 5]
        },
        {
            id: 2,
            username: "buyer1",
            email: "buyer1@gmail.com",
            // password = Buyer@12345
            passwordHash: "91c222cf2ab9244e0bc664f53ff821d55c2df26896a475c16902b529a59bc0f3",
            role: "buyer",
            ratings: [4, 4]
        }
    ],
    products: [
        {
            id: 1,
            name: "Classic White Sneaker",
            price: 40,
            category: "men",
            type: "Sneaker",
            image: "images/classicWhiteSneaker.png",
            location: "Lake Charles",
            description: "Clean, minimal sneaker perfect for everyday wear.",
            sellerId: 1,
            reviews: [{ userId: 2, rating: 5, comment: "Super comfy!" }]
        },
        {
            id: 2,
            name: "Mustard Work Boot",
            price: 75,
            category: "men",
            type: "Boot",
            image: "images/mustardWorkBoot.png",
            location: "Houston",
            description: "Rugged work boot with all-day comfort.",
            sellerId: 1,
            reviews: []
        },
        {
            id: 3,
            name: "Gray Running Shoe",
            price: 55,
            category: "men",
            type: "Running Shoe",
            image: "images/grayRunningShoes.png",
            location: "Dallas",
            description: "Lightweight running shoe with breathable mesh.",
            sellerId: 1,
            reviews: []
        },

        // WOMEN'S SHOES
        {
            id: 4,
            name: "Black Chunky Ankle Boot",
            price: 65,
            category: "women",
            type: "Boot",
            image: "images/blackAnkleBoot.png",
            location: "Houston",
            description: "Sleek black ankle boot with a chunky sole, perfect for everyday wear.",
            sellerId: 1,
            reviews: []
        },

        {
            id: 5,
            name: "Blush Mary Jane Flat",
            price: 60,
            category: "women",
            type: "Flat",
            image: "images/maryJaneFlat.png",
            location: "Austin",
            description: "Soft blush pink Mary Jane flat with a buckle strap for a feminine look.",
            sellerId: 1,
            reviews: []
        },

        {
            id: 6,
            name: "Taupe Espadrille Slide",
            price: 55,
            category: "women",
            type: "Sandal",
            image: "images/espadrilleSlideSandal.png",
            location: "Dallas",
            description: "Casual espadrille slide sandal with a woven rope sole and open toe.",
            sellerId: 1,
            reviews: []
        },

        // KID'S SHOES
        {
            id: 7,
            name: "Blue Thunder Kids Sneaker",
            price: 35,
            category: "kids",
            type: "Sneaker",
            image: "images/blueThunderKidsSneaker.png",
            location: "Lake Charles",
            description: "Lightweight blue kids sneaker with a lightning design and comfy cushioning.",
            sellerId: 1,
            reviews: []
        },

        {
            id: 8,
            name: "Sunny Step Kids Sandal",
            price: 30,
            category: "kids",
            type: "Sandal",
            image: "images/desertBreezeSandal.png",
            location: "Houston",
            description: "Soft tan strap sandal with adjustable closures and a cushioned footbed.",
            sellerId: 1,
            reviews: []
        },

        {
            id: 9,
            name: "Mini Explorer Brown Boot",
            price: 40,
            category: "kids",
            type: "Boot",
            image: "images/miniExplorerBrownBoot.png",
            location: "Dallas",
            description: "Sturdy brown kids boot with grippy sole for playground adventures.",
            sellerId: 1,
            reviews: []
        },
    ],
    cart: [],
    currentUserId: null
};


// ===== helpers =====
function loadState() {
    const raw = localStorage.getItem(JUTTA_STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    try {
        return JSON.parse(raw);
    } catch {
        return structuredClone(defaultState);
    }
}
function saveState(state) {
    localStorage.setItem(JUTTA_STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();

// current user helper
function getCurrentUser() {
    return state.users.find(u => u.id === state.currentUserId) || null;
}

// basic sanitization
function clean(str) {
    if (str == null) return "";
    const trimmed = str.trim();
    if (/<\s*script/gi.test(trimmed)) return "";
    return trimmed;
}

// SHA-256 password hashing
async function hashPassword(plain) {
    const enc = new TextEncoder();
    const buf = await crypto.subtle.digest("SHA-256", enc.encode(plain));
    return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// rating utilities
function avgRating(arr) {
    if (!arr || arr.length === 0) return "No ratings";
    const s = arr.reduce((a, b) => a + b, 0);
    return (s / arr.length).toFixed(1);
}

function productAvgRating(product) {
    if (!product.reviews || product.reviews.length === 0) return "No reviews";
    const s = product.reviews.reduce((a, r) => a + r.rating, 0);
    return (s / product.reviews.length).toFixed(1);
}

// cart utilities
function addToCart(productId) {
    const item = state.cart.find(c => c.productId === productId);
    if (item) item.qty += 1;
    else state.cart.push({ productId, qty: 1 });
    saveState(state);
}

function updateCartQty(productId, delta) {
    const item = state.cart.find(c => c.productId === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        state.cart = state.cart.filter(c => c.productId !== productId);
    }
    saveState(state);
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(c => c.productId !== productId);
    saveState(state);
}

// authencation
async function registerUser({ username, email, password, role }) {
    username = clean(username);
    email = clean(email);
    if (!username || username.length < 3) throw new Error("Username too short");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        throw new Error("Invalid email");
    if (!password || password.length < 6) throw new Error("Weak password");
    if (!role) throw new Error("Choose role");

    if (state.users.some(u => u.username === username))
        throw new Error("Username already taken");
    if (state.users.some(u => u.email === email))
        throw new Error("Email already in use");

    const hash = await hashPassword(password);
    const newUser = {
        id: state.users.length + 1,
        username,
        email,
        passwordHash: hash,
        role,
        ratings: []
    };
    state.users.push(newUser);
    saveState(state);
    return newUser;
}

async function loginUser({ username, password }) {
    username = clean(username);
    if (!username || username.length < 3) throw new Error("Invalid username");
    if (!password || password.length < 6) throw new Error("Invalid password");
    const hash = await hashPassword(password);

    const u = state.users.find(
        user => user.username === username && user.passwordHash === hash
    );
    if (!u) throw new Error("Username or password incorrect");

    state.currentUserId = u.id;
    saveState(state);
    return u;
}

//LOGOUT FUNCTION 
function logoutUser() {
    state.currentUserId = null;
    saveState(state);

    alert("Logged out successfully!");
    window.location.href = "login.html";
}

// create product from Sell page
function createProduct({ name, price, category, image, location, description }) {
    const current = getCurrentUser();
    if (!current || current.role !== "seller") {
        throw new Error("Must be logged in as seller.");
    }
    name = clean(name);
    location = clean(location);
    description = clean(description);

    if (!name || name.length < 3) throw new Error("Name too short");
    if (!category) throw new Error("Choose category");
    if (isNaN(price) || price <= 0) throw new Error("Invalid price");
    if (!location || location.length < 2) throw new Error("Location too short");
    if (!description || description.length < 10) throw new Error("Description too short");

    const prod = {
        id: state.products.length + 1,
        name,
        price: Number(price),
        category,
        image: image || "images/placeholder-shoe.png",
        location,
        sellerId: current.id,
        description,
        reviews: []
    };
    state.products.push(prod);
    saveState(state);
    return prod;
}

// review
function addReview(productId, rating, comment) {
    const user = getCurrentUser();
    if (!user) throw new Error("Login required");
    comment = clean(comment);
    rating = Number(rating);

    if (isNaN(rating) || rating < 1 || rating > 5)
        throw new Error("Rating 1–5 only");
    if (!comment || comment.length < 5)
        throw new Error("Comment too short");

    const prod = state.products.find(p => p.id === productId);
    if (!prod) throw new Error("Product not found");

    prod.reviews.push({ userId: user.id, rating, comment });
    user.ratings.push(rating);
    saveState(state);
}

// small helper to show current user in header/footer
function renderAuthStatus(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const u = getCurrentUser();
    el.textContent = u
        ? `Logged in as ${u.username} (${u.role})`
        : "Not logged in";
}
