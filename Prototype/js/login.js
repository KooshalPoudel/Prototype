/* 
    Group Name: NextGenDevelopers
    Project Chosen: Online Marketplace
    Author: Kushal Poudel, Alok Poudel, Rojal Shrestha, Pawan Rijal
    Date: 11/22/2025
    Last Modified: 11/22/2025
    Filename: login.js
    Purpose: Handles user login, validates input,
             checks correct role, and prevents users 
             from logging in again if already logged in.
*/

document.addEventListener("DOMContentLoaded", () => {

    // Check if someone is already logged in
    const current = getCurrentUser();
    if (current) {
        alert(`You are already logged in as ${current.username}. Please log out to use a different account.`);
        window.location.href = "index.html";
        return; // Stop the login page from continuing
    }

    // Get the login form
    const loginForm = document.getElementById("login-form");

    // Only run logic if the form exists
    if (loginForm) {

        loginForm.addEventListener("submit", async e => {
            e.preventDefault(); // Stop page refresh

            // Get values from form fields
            const logRole = document.getElementById("log-role").value.trim();
            const username = document.getElementById("log-user").value.trim();
            const password = document.getElementById("log-pass").value.trim();

            let valid = true;

            // Validate role
            if (!logRole) {
                document.getElementById("logRoleErr").textContent = "Please choose a role.";
                valid = false;
            } else {
                document.getElementById("logRoleErr").textContent = "";
            }

            // Validate username
            if (!username || username.length < 3) {
                document.getElementById("logUserErr").textContent =
                    "Username must be at least 3 characters.";
                valid = false;
            } else {
                document.getElementById("logUserErr").textContent = "";
            }

            // Validate password
            if (!password || password.length < 6) {
                document.getElementById("logPassErr").textContent =
                    "Password must be at least 6 characters.";
                valid = false;
            } else {
                document.getElementById("logPassErr").textContent = "";
            }

            // Stop here if any input is invalid
            if (!valid) return;

            try {
                // Try logging in the user
                const user = await loginUser({
                    username,
                    password
                });

                // Check if the chosen role matches account role
                if (user.role !== logRole) {
                    alert(`This account is registered as a ${user.role}. Choose the correct role to log in.`);
                    return;
                }

                // Successful login
                alert(`Welcome back, ${user.username}!`);
                window.location.href = "index.html";

            } catch (err) {
                // If login fails (wrong password / username)
                alert(err.message);
            }
        });
    }
});
