/* Got it! Below is a standalone implementation of Microsoft Entra SSO using MSAL.js (Microsoft Authentication Library). This code will:

✅ Redirect users to Microsoft login
✅ Retrieve user info (name, email)
✅ Ensure users are from a specific company domain
✅ Handle login/logout

🔹 Setup Prerequisites
Before using this, you need to:
1️⃣ Register Your App in Microsoft Entra ID

Go to Azure Portal → Microsoft Entra ID → App Registrations
Click "New Registration"
Set Redirect URI: http://localhost:5500 (for local testing)
Copy Client ID and Tenant ID
2️⃣ Enable API Permissions

In API Permissions, add User.Read (Microsoft Graph)
Grant Admin Consent


📝 auth.html (Standalone Login Page)
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microsoft Entra SSO</title>
    <script src="https://alcdn.msauth.net/browser/2.32.1/js/msal-browser.min.js"></script>
    <script defer src="auth.js"></script>
</head>
<body>
    <h2>Login with Microsoft</h2>
    <button id="loginBtn">Login</button>
    <button id="logoutBtn" style="display:none;">Logout</button>

    <h3>User Info:</h3>
    <p><strong>Name:</strong> <span id="userName">Not logged in</span></p>
    <p><strong>Email:</strong> <span id="userEmail">-</span></p>
</body>
</html>


📝 auth.js (Handles Microsoft SSO)
const msalConfig = {
    auth: {
        clientId: "YOUR_CLIENT_ID", // Replace with your Entra App Client ID
        authority: "https://login.microsoftonline.com/YOUR_TENANT_ID", // Replace with Tenant ID
        redirectUri: "http://localhost:5500" // Change if deployed
    }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

const loginRequest = {
    scopes: ["User.Read"] // Read basic user info
};

// Select UI elements
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userNameSpan = document.getElementById("userName");
const userEmailSpan = document.getElementById("userEmail");

// Handle login
async function login() {
    try {
        const loginResponse = await msalInstance.loginPopup(loginRequest);
        console.log("Login Success:", loginResponse);

        const account = msalInstance.getAllAccounts()[0]; 
        if (account) {
            userNameSpan.textContent = account.name;
            userEmailSpan.textContent = account.username;

            // Check if user is from allowed company domain
            if (!account.username.endsWith("@yourcompany.com")) {
                alert("Access Denied: Only @yourcompany.com users allowed.");
                logout();
                return;
            }

            loginBtn.style.display = "none";
            logoutBtn.style.display = "inline";
        }
    } catch (error) {
        console.error("Login Error:", error);
    }
}

// Handle logout
function logout() {
    msalInstance.logoutPopup();
    userNameSpan.textContent = "Not logged in";
    userEmailSpan.textContent = "-";
    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";
}

// Attach event listeners
loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);
🔹 How It Works
✅ Clicking "Login" opens a Microsoft login popup
✅ Users sign in with company credentials (@yourcompany.com)
✅ If they are not from yourcompany.com, access is denied
✅ If logged in, name & email display on the page
✅ Clicking "Logout" clears the session

🔹 How to Run Locally
1️⃣ Replace YOUR_CLIENT_ID and YOUR_TENANT_ID in auth.js
2️⃣ Start a local server (e.g., with VS Code Live Server or python -m http.server 5500)
3️⃣ Open http://localhost:5500/auth.html in a browser
4️⃣ Test Login & Logout

🔹 Can This Be Added to Your Web App?
Yes! You can:
🔹 Add this code to your existing web app & redirect users before voting
🔹 Store user data for tracking who voted
🔹 Secure voting to only allow company employees

Would you like help merging this into your current app later? 🚀
/*