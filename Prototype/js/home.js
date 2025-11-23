/* 
    Group Name: NextGenDevelopers
    Project Chosen: Online Marketplace
    Author: Kushal Poudel, Alok Poudel, Rojal Shrestha, Pawan Rijal
    Date: 11/22/2025
    Last Modified: 11/22/2025
    Filename: home.js
    Purpose: Handles the homepage hero section by showing one featured
             product from men, women, and kids categories. Also controls
             slider navigation and "Buy Now / Shop More" buttons.
*/

document.addEventListener("DOMContentLoaded", () => {

    // Show current login status in the header
    renderAuthStatus("auth-banner");

    // Get all hero elements
    const heroImage = document.getElementById("hero-image");
    const heroCategory = document.getElementById("hero-category");
    const heroTitle = document.getElementById("hero-title");
    const heroPrice = document.getElementById("hero-price");
    const heroType = document.getElementById("hero-type");
    const heroSellerLink = document.getElementById("hero-seller-link");
    const heroRating = document.getElementById("hero-rating");

    // Get one product from each category (first match)
    const men = state.products.find(p => p.category === "men");
    const women = state.products.find(p => p.category === "women");
    const kids = state.products.find(p => p.category === "kids");

    // Keep only valid products (remove nulls)
    const featuredShoes = [men, women, kids].filter(Boolean);

    // Keep track of which hero item is being shown
    let heroIndex = 0;

    // Shows the selected hero product on the homepage
    function renderHero() {
        const item = featuredShoes[heroIndex];
        if (!item) return;

        // Load product image and text
        heroImage.src = item.image;
        heroImage.alt = item.name;

        heroCategory.textContent = item.category.toUpperCase() + " SHOES";
        heroTitle.textContent = item.name;
        heroPrice.textContent = "$" + item.price;
        heroType.textContent = item.type;

        // Seller link (goes to profile)
        heroSellerLink.textContent = "seller" + item.sellerId;
        heroSellerLink.href = "profile.html?sellerId=" + item.sellerId;

        // Show product rating
        heroRating.textContent = productAvgRating(item);
    }

    // Previous button for slider
    document.getElementById("hero-prev").addEventListener("click", () => {
        heroIndex = (heroIndex - 1 + featuredShoes.length) % featuredShoes.length;
        renderHero();
    });

    // Next button for slider
    document.getElementById("hero-next").addEventListener("click", () => {
        heroIndex = (heroIndex + 1) % featuredShoes.length;
        renderHero();
    });

    // SHOP MORE button → goes to category page (men.html, women.html, kids.html)
    document.getElementById("home-shop-more").addEventListener("click", () => {
        const item = featuredShoes[heroIndex];
        if (!item) return;

        window.location.href = item.category + ".html";
    });

    // BUY NOW button → adds item to cart and takes user to cart page
    document.getElementById("home-buy-now").addEventListener("click", () => {
        const item = featuredShoes[heroIndex];
        addToCart(item.id);
        window.location.href = "cart.html";
    });

    // Show the first hero item when page loads
    renderHero();
});
