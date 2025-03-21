
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase(); 
        const password = document.getElementById("password").value.trim();

        
        const users = JSON.parse(localStorage.getItem("users")) || [];
        console.log("Stored Users:", users); 

        
        const user = users.find(user => user.email === email);

        if (!user) {
            alert("User not found! Please register.");
            return;
        }

        console.log("Found User:", user); 

        if (user.password !== password) {
            alert("Incorrect password. Try again!");
            return;
        }

        localStorage.setItem("loggedInUser", JSON.stringify(user));


        alert(`Welcome, ${user.fullName}`);
        window.location.href = "index.html"; 
    });
});
