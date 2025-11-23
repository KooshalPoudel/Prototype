/* 
    Group Name: NextGenDevelopers
    Project Chosen: Online Marketplace
    Author: Kushal Poudel, Alok Poudel, Rojal Shrestha, Pawan Rijal
    Date: 11/22/2025
    Last Modified: 11/22/2025
    Filename: men.js
    Purpose: This file loads all men's shoes, filters them by type,
             supports search, and allows adding items to the cart.
*/

document.addEventListener("DOMContentLoaded", () => {

    // Get needed page elements
    const grid = document.getElementById("men-grid");
    const search = document.getElementById("men-search");
    const typeButtons = document.querySelectorAll("#men-type-filter .side-nav-btn");

    // Stores the selected type (Boot, Sneaker, Running Shoe, etc.)
    let selectedType = "";

    // Main function: shows all men's products that match filters/search
    function renderMenProducts() {

        // Clear the grid before adding new items
        grid.innerHTML = "";

        // Get the user's search text in lowercase
        const term = (search?.value || "").toLowerCase();

        // Filter for men's products only
        const menProducts = state.products.filter(p => {

            // Must be in men category
            if (p.category !== "men") return false;

            // Match sidebar type filter
            if (selectedType && p.type !== selectedType) return false;

            // Search in name or description
            if (term) {
                const nameMatch = p.name.toLowerCase().includes(term);
                const descMatch = (p.description || "").toLowerCase().includes(term);
                if (!nameMatch && !descMatch) return false;
            }

            return true;
        });

        // If no shoes match filters
        if (!menProducts.length) {
            grid.textContent = "No men's shoes found.";
            return;
        }

        // Build a card for each product
        menProducts.forEach(p => {

            // Find seller for this product
            const seller = state.users.find(u => u.id === p.sellerId);

            // Get rating info
            const avg = productAvgRating(p);

            // Create product card
            const card = document.createElement("article");
            card.className = "product-card";

            // Card layout
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

    // Sidebar filter buttons (Boot, Sneaker, etc.)
    typeButtons.forEach(btn => {
        btn.addEventListener("click", () => {

            // Remove highlight from all buttons
            typeButtons.forEach(b => b.classList.remove("active"));

            // Highlight the clicked button
            btn.classList.add("active");

            // Save selected type and refresh products
            selectedType = btn.getAttribute("data-type") || "";
            renderMenProducts();
        });
    });

    // Search box listener
    if (search) {
        search.addEventListener("input", () => {
            renderMenProducts();
        });
    }

    // Add-to-cart button inside the grid
    grid.addEventListener("click", e => {
        if (e.target.matches("button[data-id]")) {
            const id = Number(e.target.dataset.id);
            addToCart(id);
            alert("Added to cart");
        }
    });

    // Show items when page loads
    renderMenProducts();
});
