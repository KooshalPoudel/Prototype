/* 
    Group Name: NextGenDevelopers
    Project Chosen: Online Marketplace
    Author: Kushal Poudel, Alok Poudel, Rojal Shrestha, Pawan Rijal
    Date: 11/22/2025
    Filename: cart.js
    Purpose: This handles all the logic for showing the cart,
             updating quantities, deleting items, and checkout form.
*/

// Renders everything inside the cart page
function renderCartPage() {

    // Get the cart container and total price element
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");

    // Clear old content
    container.innerHTML = "";
    let total = 0;

    // If cart is empty, show message and stop
    if (!state.cart.length) {
        container.textContent = "Your cart is empty.";
        totalEl.textContent = "$0";
        return;
    }

    // Loop through all cart items
    state.cart.forEach(item => {

        // Find full product details using productId
        const p = state.products.find(prod => prod.id === item.productId);
        if (!p) return;

        // Calculate total for this item
        const line = p.price * item.qty;
        total += line;

        // Create a visual row for the cart item
        const row = document.createElement("div");
        row.className = "cart-item";

        // Add product image, name, qty controls, and delete button
        row.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <div>
                <div class="cart-name">${p.name}</div>

                <!-- Buttons for increasing or decreasing quantity -->
                <div class="cart-controls">
                    <button type="button" data-action="dec" data-id="${p.id}">-</button>
                    <span>${item.qty}</span>
                    <button type="button" data-action="inc" data-id="${p.id}">+</button>
                </div>

                <!-- Delete item button -->
                <button type="button" class="nav-btn" data-action="del" data-id="${p.id}" 
                    style="margin-top:0.4rem;padding:0.2rem 0.8rem;">
                    Delete
                </button>
            </div>

            <!-- Shows total price for this item -->
            <div class="cart-price">$${line}</div>
        `;

        container.appendChild(row);
    });

    // Update total price at bottom
    totalEl.textContent = `$${total}`;
}


// Runs when page loads
document.addEventListener("DOMContentLoaded", () => {

    // Show cart items when page opens
    renderCartPage();

    // Listen for +, -, or delete button clicks
    document.getElementById("cart-items").addEventListener("click", e => {
        const btn = e.target.closest("button[data-action]");
        if (!btn) return;

        const id = Number(btn.dataset.id);
        const action = btn.dataset.action;

        // Increase qty
        if (action === "inc") updateCartQty(id, +1);

        // Decrease qty
        if (action === "dec") updateCartQty(id, -1);

        // Delete item from cart
        if (action === "del") removeFromCart(id);

        // Reload state and rerender cart
        state = loadState();
        renderCartPage();
    });

    // Checkout form validation
    const form = document.getElementById("checkout-form");

    form.addEventListener("submit", e => {
        e.preventDefault();

        let ok = true;

        // Clear previous errors
        ["chkNameErr","chkEmailErr","chkAddrErr"].forEach(id => 
            document.getElementById(id).textContent = ""
        );

        // Get cleaned input values
        const name = clean(document.getElementById("chk-name").value);
        const email = clean(document.getElementById("chk-email").value);
        const addr = clean(document.getElementById("chk-address").value);

        // Validate name
        if (!name || name.length < 2) {
            ok = false;
            document.getElementById("chkNameErr").textContent = "Enter at least 2 characters.";
        }

        // Validate email format
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            ok = false;
            document.getElementById("chkEmailErr").textContent = "Enter a valid email.";
        }

        // Validate address length
        if (!addr || addr.length < 10) {
            ok = false;
            document.getElementById("chkAddrErr").textContent = "Address must be at least 10 characters.";
        }

        // Stop if anything is invalid
        if (!ok) return;

        // Simulated success message
        alert("Order placed successfully (prototype). Payment gateway will be added with PHP + Stripe.");

        // Clear cart after order
        state.cart = [];
        saveState(state);
        renderCartPage();

        // Reset the form
        form.reset();
    });
});
