/* 
    Group Name: NextGenDevelopers
    Project Chosen: Online Marketplace
    Author: Kushal Poudel, Alok Poudel, Rojal Shrestha, Pawan Rijal
    Date: 11/22/2025
    Last Modified: 11/22/2025
    Filename: sell.js
    Purpose: Handles seller login checking and creating new product listings.
*/

document.addEventListener("DOMContentLoaded", () => {

    // Elements for showing seller status
    const status = document.getElementById("sell-status");
    const sellerInfo = document.getElementById("seller-info");

    // Get the current logged-in user
    const user = getCurrentUser();

    // Show different messages depending on login state and role
    if (!user) {
        status.textContent = "Please log in as a seller to create listings.";
        sellerInfo.textContent = "Not logged in.";
    } 
    else if (user.role !== "seller") {
        status.textContent = "Only seller accounts can list shoes.";
        sellerInfo.textContent = `Logged in as ${user.username} (${user.role}).`;
    } 
    else {
        status.textContent = "You are logged in as a seller. Fill the form to add a shoe.";
        sellerInfo.textContent =
            `Seller: ${user.username} – Email: ${user.email} – Avg rating: ${avgRating(user.ratings)}`;
    }

    // Get the form
    const form = document.getElementById("sell-form");

    form.addEventListener("submit", e => {
        e.preventDefault();   // stop page reload

        // Clear previous error messages
        ["sellNameErr","sellPriceErr","sellCatErr","sellLocErr","sellDescErr"]
            .forEach(id => document.getElementById(id).textContent = "");

        try {
            // Attempt to create a new product listing
            const prod = createProduct({
                name: document.getElementById("sell-name").value,
                price: document.getElementById("sell-price").value,
                category: document.getElementById("sell-cat").value,
                image: document.getElementById("sell-img").value,
                location: document.getElementById("sell-location").value,
                description: document.getElementById("sell-desc").value
            });

            alert("Listing created! It will now appear in the marketplace.");
            form.reset();  // clear form

        } catch (err) {

            // Convert message to lowercase so we can check keywords
            const msg = err.message.toLowerCase();

            // Show error in the correct field based on message keyword
            if (msg.includes("name"))
                document.getElementById("sellNameErr").textContent = err.message;

            else if (msg.includes("price"))
                document.getElementById("sellPriceErr").textContent = err.message;

            else if (msg.includes("category"))
                document.getElementById("sellCatErr").textContent = err.message;

            else if (msg.includes("location"))
                document.getElementById("sellLocErr").textContent = err.message;

            else
                document.getElementById("sellDescErr").textContent = err.message;
        }
    });
});
