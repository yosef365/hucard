// ======================================
// Authentication
// ======================================

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

    loginBtn.addEventListener("click", login);

}

async function login() {

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    const message = document.getElementById("message");

    message.textContent = "";

    const { error } = await db.auth.signInWithPassword({

        email,
        password

    });

    if (error) {

        message.textContent = error.message;

        return;

    }

    location.href = "dashboard.html";

}

async function checkLogin() {

    const { data, error } = await db.auth.getSession();

    console.log("Session:", data.session);

    if (!data.session) {
        alert("No session found");
        return null;
    }

    return data.session.user;
}
async function getCurrentUser() {

    const {

        data: {

            user

        }

    } = await db.auth.getUser();

    return user;

}
