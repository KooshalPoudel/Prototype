/* 
    Group Name: NextGenDevelopers
    Project Chosen: Online Marketplace
    Author: Kushal Poudel, Alok Poudel, Rojal Shrestha, Pawan Rijal
    Date: 11/22/2025
    Last Modified: 11/22/2025
    Filename: productpage.js
    Purpose: This file shows a single product's details, displays all reviews,
             and allows a logged-in user to add a new review.
*/

document.addEventListener("DOMContentLoaded", () => {

    // Get product ID from URL, e.g., product.html?id=4
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    // Main container where product info will go
    const container = document.getElementById("product-container");

    // Find the product with the matching ID
    const product = state.products.find(p => p.id === id);

    // If product not found (wrong ID or deleted)
    if (!product) {
        container.innerHTML = "<p>Product not found.</p>";
        return;
    }

    // Build review section
    let reviewsHtml = "<p>No reviews yet.</p>";

    if (product.reviews.length) {
        reviewsHtml = "<ul>";

        // Loop through each review and show username + comment + rating
        product.reviews.forEach(r => {
            const user = state.users.find(u => u.id === r.userId);

            reviewsHtml += `
                <li>
                    <strong>${user ? user.username : "User"}:</strong>
                    ${r.comment} – ⭐ ${r.rating}
                </li>
            `;
        });

        reviewsHtml += "</ul>";
    }

    // Build the product details area
    container.innerHTML = `
        <h2>${product.name}</h2>
        <img src="${product.image}" style="max-width:200px;">

        <p><strong>Price:</strong> $${product.price}</p>
        <p><strong>Category:</strong> ${product.category}</p>

        <h3>Reviews</h3>
        ${reviewsHtml}

        <h3>Add Review</h3>
        <form id="review-form">
            <label>Rating (1–5)</label>
            <input type="number" id="review-rating" min="1" max="5">

            <label>Comment</label>
            <textarea id="review-comment"></textarea>

            <button class="btn-primary" type="submit">Submit Review</button>
        </form>
    `;

    // Handle review submission
    document.getElementById("review-form").addEventListener("submit", e => {
        e.preventDefault();

        // Get values from input fields
        const rating = Number(document.getElementById("review-rating").value);
        const comment = document.getElementById("review-comment").value;

        try {
            // Add review to product
            addReview(id, rating, comment);

            alert("Review added!");

            // Reload page to show the updated review list
            location.reload();

        } catch (err) {
            // If review fails (not logged in, too short comment, etc.)
            alert(err.message);
        }
    });
});
