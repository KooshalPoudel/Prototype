/* 
    Group Name: NextGenDevelopers
    Project Chosen: Online Marketplace
    Author: Kushal Poudel, Alok Poudel, Rojal Shrestha, Pawan Rijal
    Date: 11/22/2025
    Last Modified: 11/22/2025
    Filename: register.js
    Purpose: Handles validation for the registration form
             and creates a new user account if inputs are valid.
*/

document.addEventListener("DOMContentLoaded", () => {

    // Get the registration form
    const form = document.getElementById("reg-form");

    form.addEventListener("submit", async e => {
        e.preventDefault();   // prevent page reload

        // Clear all previous error messages
        ["regFirstErr","regLastErr","regPhoneErr","regUserErr","regEmailErr","regPassErr","regRoleErr"]
            .forEach(id => document.getElementById(id).textContent = "");

        // Get form values
        const first = document.getElementById("reg-first").value.trim();
        const last = document.getElementById("reg-last").value.trim();
        const phone = document.getElementById("reg-phone").value.trim();
        const username = document.getElementById("reg-user").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const pass = document.getElementById("reg-pass").value;
        const role = document.getElementById("reg-role").value;

        let ok = true;

        // FIRST NAME must be at least 3 characters
        if (first.length < 3) {
            ok = false;
            document.getElementById("regFirstErr").textContent =
                "First name must be at least 3 characters.";
        }

        // LAST NAME must be at least 3 characters
        if (last.length < 3) {
            ok = false;
            document.getElementById("regLastErr").textContent =
                "Last name must be at least 3 characters.";
        }

        // PHONE NUMBER must be exactly 10 digits
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(phone)) {
            ok = false;
            document.getElementById("regPhoneErr").textContent =
                "Phone number must be exactly 10 digits.";
        }

        // USERNAME must be at least 3 characters
        if (username.length < 3) {
            ok = false;
            document.getElementById("regUserErr").textContent =
                "Username must be at least 3 characters.";
        }

        // EMAIL must match a normal email pattern
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            ok = false;
            document.getElementById("regEmailErr").textContent =
                "Enter a valid email address.";
        }

        // STRONG PASSWORD (12+ chars, 1 uppercase, 1 number, 1 symbol)
        const strongPass = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
        if (!strongPass.test(pass)) {
            ok = false;
            document.getElementById("regPassErr").textContent =
                "Password must be 12+ chars, include 1 uppercase, 1 number, 1 symbol.";
        }

        // ROLE must be selected
        if (!role) {
            ok = false;
            document.getElementById("regRoleErr").textContent =
                "Please choose a role.";
        }

        // Stop if any validation failed
        if (!ok) return;

        try {
            // Create the user using common.js function
            await registerUser({
                username,
                email,
                password: pass,
                role
            });

            alert("Account created successfully!");
            form.reset();  // clear form fields

        } catch (err) {
            // Show error (example: username already taken)
            document.getElementById("regUserErr").textContent = err.message;
        }
    });
});
