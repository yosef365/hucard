// =====================================
// HuCard Authentication
// =====================================

// Login Page
const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

    loginBtn.addEventListener("click", login);

}

async function login() {

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    const message = document.getElementById("message");

    if (message) message.textContent = "";

    if (!email || !password) {

        if (message) {

            message.textContent = "Please enter email and password.";

        }

        return;

    }

    const { error } = await db.auth.signInWithPassword({

        email,

        password

    });

    if (error) {

        if (message) {

            message.textContent = error.message;

        }

        return;

    }

    window.location.href = "dashboard.html";

}

// =====================================
// Check Login
// =====================================

async function checkLogin() {

    const {

        data: { session }

    } = await db.auth.getSession();

    if (!session) {

        window.location.href = "index.html";

        return null;

    }

    return session.user;

}

// =====================================
// Current User
// =====================================

async function getCurrentUser() {

    const {

        data: { user }

    } = await db.auth.getUser();

    return user;

}

// =====================================
// Logout
// =====================================

async function logout() {

    await db.auth.signOut();

    window.location.href = "index.html";

}
