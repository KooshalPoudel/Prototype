/* 
    Group Name: NextGenDevelopers
    Project Chosen: Online Marketplace
    Author: Kushal Poudel, Alok Poudel, Rojal Shrestha, Pawan Rijal
    Date: 11/22/2025
    Last Modified: 11/22/2025
    Filename: kids.js
    Purpose: This file loads all kids shoes, filters them by type,
             supports search, and allows adding items to the cart.
*/

document.addEventListener("DOMContentLoaded", () => {

    // Get all page elements we need
    const grid = document.getElementById("kids-grid");
    const search = document.getElementById("kids-search");
    const typeButtons = document.querySelectorAll("#kids-type-filter .side-nav-btn");

    // Stores the selected shoe type (Sneaker, Boot, Sandal)
    let selectedType = "";

    // Shows all kids shoes that match filters/search
    function renderKidsProducts() {

        // Clear the product grid first
        grid.innerHTML = "";

        // Convert search term to lowercase
        const term = (search?.value || "").toLowerCase();

        // Filter all kids products
        const kidsProducts = state.products.filter(p => {

            // Must belong to kids category
            if (p.category !== "kids") return false;

            // Check sidebar filter
            if (selectedType && p.type !== selectedType) return false;

            // Check search filter (name or description)
            if (term) {
                const nameMatch = p.name.toLowerCase().includes(term);
                const descMatch = (p.description || "").toLowerCase().includes(term);
                if (!nameMatch && !descMatch) return false;
            }

            return true;
        });

        // If no shoes match, show message
        if (!kidsProducts.length) {
            grid.textContent = "No kid's shoes found.";
            return;
        }

        // Create a card for each product
        kidsProducts.forEach(p => {

            // Find seller info for the product
            const seller = state.users.find(u => u.id === p.sellerId);

            // Get product rating
            const avg = productAvgRating(p);

            // Create card container
            const card = document.createElement("article");
            card.className = "product-card";

            // HTML structure for each shoe
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

            // Add card to the page
            grid.appendChild(card);
        });
    }

    // When user clicks a sidebar filter button
    typeButtons.forEach(btn => {
        btn.addEventListener("click", () => {

            // Remove active state from all buttons
            typeButtons.forEach(b => b.classList.remove("active"));

            // Highlight the button clicked
            btn.classList.add("active");

            // Save selected type (Sneaker, Boot, etc.)
            selectedType = btn.getAttribute("data-type") || "";

            // Refresh product list
            renderKidsProducts();
        });
    });

    // Search box typing event
    if (search) {
        search.addEventListener("input", () => {
            renderKidsProducts();
        });
    }

    // Add-to-cart buttons inside the product grid
    grid.addEventListener("click", e => {
        if (e.target.matches("button[data-id]")) {
            const id = Number(e.target.dataset.id);
            addToCart(id);
            alert("Added to cart");
        }
    });

    // Load kids shoes when page first opens
    renderKidsProducts();
});
