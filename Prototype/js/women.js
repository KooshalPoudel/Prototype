/* 
    Group Name: NextGenDevelopers
    Project Chosen: Online Marketplace
    Author: Kushal Poudel, Alok Poudel, Rojal Shrestha, Pawan Rijal
    Date: 11/22/2025
    Last Modified: 11/22/2025
    Filename: women.js
    Purpose: Handles filtering, searching, and displaying women's shoe products.
*/

document.addEventListener("DOMContentLoaded", () => {

    // Main page elements
    const grid = document.getElementById("women-grid");
    const search = document.getElementById("women-search");
    const typeButtons = document.querySelectorAll("#women-type-filter .side-nav-btn");

    // Current selected shoe type (Boot, Flat, Sandal, etc.)
    let selectedType = "";

    // Function to load and display women's shoes
    function renderWomenProducts() {

        grid.innerHTML = ""; // clear old items

        const term = (search?.value || "").toLowerCase();

        // Filter products by category "women"
        const womenProducts = state.products.filter(p => {
            if (p.category !== "women") return false;

            // filter by sidebar category
            if (selectedType && p.type !== selectedType) return false;

            // search filter
            if (term) {
                const nameMatch = p.name.toLowerCase().includes(term);
                const descMatch = (p.description || "").toLowerCase().includes(term);
                if (!nameMatch && !descMatch) return false;
            }

            return true;
        });

        // If no results found
        if (!womenProducts.length) {
            grid.textContent = "No women’s shoes found.";
            return;
        }

        // Build each product card
        womenProducts.forEach(p => {
            const seller = state.users.find(u => u.id === p.sellerId);
            const avg = productAvgRating(p);

            const card = document.createElement("article");
            card.className = "product-card";

            card.innerHTML = `
                <a href="product.html?id=${p.id}">
                    <img src="${p.image}" alt="${p.name}">
                </a>

                <div class="product-name">${p.name}</div>
                <div class="product-price">$${p.price}</div>
                <div class="product-type">Type: ${p.type || "N/A"}</div>

                <div class="seller-line">
                    Seller:
                    <a href="profile.html?sellerId=${seller ? seller.id : ""}" class="seller-link">
                        ${seller ? seller.username : "Unknown"}
                    </a>
                </div>

                <div class="rating">${avg}</div>
                <button class="btn-primary" data-id="${p.id}">Add to Cart</button>
            `;

            grid.appendChild(card);
        });
    }

    // Sidebar buttons (Boot, Flat, Sandal)
    typeButtons.forEach(btn => {
        btn.addEventListener("click", () => {

            // remove highlight from all buttons
            typeButtons.forEach(b => b.classList.remove("active"));

            // highlight selected button
            btn.classList.add("active");

            // set selected shoe type
            selectedType = btn.getAttribute("data-type") || "";

            // reload items
            renderWomenProducts();
        });
    });

    // Search bar filter
    if (search) {
        search.addEventListener("input", () => {
            renderWomenProducts();
        });
    }

    // Add to Cart
    grid.addEventListener("click", e => {
        if (e.target.matches("button[data-id]")) {
            const id = Number(e.target.dataset.id);
            addToCart(id);
            alert("Added to cart");
        }
    });

    // Initial render when page loads
    renderWomenProducts();
});
