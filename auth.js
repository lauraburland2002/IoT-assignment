

/* 
const backendURL = "http://localhost:5000"; // Replace with your backend URL once deployed

// Mock Response for Registration
const mockRegisterResponse = { message: "Registration successful. Check your email to verify." };

// Mock Response for Login (simulating a verified user)
const mockLoginResponse = {
    message: "Login successful.",
    verified: true,
    user: { email: "user@example.com", name: "John Doe" }
};

// Registration (Mock Response)
document.getElementById("registerBtn")?.addEventListener("click", async () => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Simulating a successful registration API response
    alert(mockRegisterResponse.message)
    // In a real scenario, you would send the data to the backend:
    const response = await fetch(`${backendURL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    alert(data.message);

});

// Login (Mock Response)
document.getElementById("loginBtn")?.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Simulating a successful login API response with email verification
    if (email === "user@example.com" && password === "password123") {
        if (mockLoginResponse.verified) {
            sessionStorage.setItem("user", JSON.stringify(mockLoginResponse.user));
            alert(mockLoginResponse.message);
            window.location.href = "voting.html"; // Redirect to voting page
        } else {
            alert("Please verify your email before logging in.");
        }
    } else {
        alert("Incorrect email or password.");
    }

    // In a real scenario, you would send the data to the backend:
    
    const response = await fetch(`${backendURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.verified) {
        sessionStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "voting.html";
    } else {
        alert("Please verify your email before logging in.");
    }
    
});
*/