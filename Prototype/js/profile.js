/* 
    Group Name: NextGenDevelopers
    Project Chosen: Online Marketplace
    Author: Kushal Poudel, Alok Poudel, Rojal Shrestha, Pawan Rijal
    Date: 11/22/2025
    Last Modified: 11/22/2025
    Filename: profile.js
    Purpose: This file shows a user's profile, their listings,
             and handles login/logout visibility depending
             on who is viewing the profile.
*/

document.addEventListener("DOMContentLoaded", () => {

    // Main content section where profile info is displayed
    const container = document.getElementById("profile-content");

    // Area where Login or Logout buttons will appear
    const actions = document.getElementById("profile-actions");

    // Read sellerId from URL (e.g., profile.html?sellerId=1)
    const params = new URLSearchParams(window.location.search);
    const sellerIdParam = params.get("sellerId");
    const sellerId = sellerIdParam ? Number(sellerIdParam) : null;

    // Find currently logged-in user
    const currentUser = getCurrentUser();

    let user;

    // If a sellerId exists, show THAT user's profile
    if (sellerId) {
        user = state.users.find(u => u.id === sellerId);
    } 
    // Otherwise, show your own profile
    else {
        user = currentUser;
    }

    // If user does not exist or you're not logged in properly
    if (!user) {
        container.innerHTML = `
            <p>User not found or you are not logged in.</p>
        `;

        // If no one is logged in → show Login button
        if (!currentUser) {
            actions.innerHTML = `
                <a href="login.html" class="btn-primary">Login</a>
            `;
        } else {
            actions.innerHTML = "";
        }
        return;
    }

    // Build list of products posted by this user
    const listings = state.products.filter(p => p.sellerId === user.id);

    let listingsHtml = "<p>No active listings.</p>";
    if (listings.length) {
        listingsHtml = "<ul>";
        listings.forEach(p => {
            listingsHtml += `<li>${p.name} – $${p.price} (${p.category})</li>`;
        });
        listingsHtml += "</ul>";
    }

    // Display profile information
    container.innerHTML = `
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Role:</strong> ${user.role}</p>
        <p><strong>Average Rating:</strong> ${avgRating(user.ratings)}</p>

        <h3>Listings by this user</h3>
        ${listingsHtml}
    `;

    // Decide whether to show Logout button or nothing

    // Case A: Viewing your own profile AND you are logged in
    if (currentUser && currentUser.id === user.id) {

        // Show Logout button
        actions.innerHTML = `
            <button class="btn-primary" id="logout-btn">Logout</button>
        `;

        document
            .getElementById("logout-btn")
            .addEventListener("click", () => logoutUser());
    }

    // Case B: Looking at someone else's profile → hide actions
    else {
        actions.innerHTML = "";
    }
});
