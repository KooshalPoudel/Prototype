/* 
    Group Name: NextGenDevelopers
    Project Chosen: Online Marketplace
    Author: Kushal Poudel, Alok Poudel, Rojal Shrestha, Pawan Rijal
    Date: 11/22/2025
    Last Modified: 11/22/2025
    Filename: products.js
    Purpose: This file displays all products in a list, supports search,
             and lets users add any product to the cart.
*/

function renderProductsList(products) {

    // Get the grid where products will appear
    const grid = document.getElementById("products-grid");

    // Clear anything already on the page
    grid.innerHTML = "";

    // If no products match the filter/search, show message
    if (!products.length) {
        grid.textContent = "No shoes found.";
        return;
    }

    // Loop through each product and create a card
    products.forEach(p => {

        const card = document.createElement("article");
        card.className = "product-card";

        // Build card layout
        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <div class="product-name">${p.name}</div>
            <div class="product-price">$${p.price}</div>
            <div class="rating">${productAvgRating(p)}</div>
            <button class="btn-primary" data-id="${p.id}">Add to Cart</button>
        `;

        grid.appendChild(card);
    });

    // One-time event listener (prevents duplicate listeners)
    grid.addEventListener("click", e => {

        // Check if the clicked element is an Add to Cart button
        if (e.target.matches("button[data-id]")) {
            const id = Number(e.target.getAttribute("data-id"));
            addToCart(id);
            alert("Added to cart");
        }
    }, { once: true });
}

document.addEventListener("DOMContentLoaded", () => {

    // Show all products at first
    renderProductsList(state.products);

    // Search input for filtering products
    const searchInput = document.getElementById("product-search");

    searchInput.addEventListener("input", () => {

        // Convert search text to lowercase
        const term = searchInput.value.toLowerCase();

        // Match product name OR description
        const filtered = state.products.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term)
        );

        // Rerender filtered products
        renderProductsList(filtered);
    });
});
