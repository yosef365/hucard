// =========================================
// HuCard Utility Functions
// =========================================

// Show Success Message
function showSuccess(message) {
    alert("✅ " + message);
}

// Show Error Message
function showError(message) {
    alert("❌ " + message);
}

// Confirm Action
function confirmAction(message = "Are you sure?") {
    return confirm(message);
}

// Generate Random ID
function randomID(length = 8) {

    const chars =
        "abcdefghijklmnopqrstuvwxyz0123456789";

    let id = "";

    for (let i = 0; i < length; i++) {

        id += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );

    }

    return id;
}

// Format Date
function formatDate(date) {

    return new Date(date).toLocaleDateString();

}

// Capitalize
function capitalize(text) {

    if (!text) return "";

    return text.charAt(0).toUpperCase() +
        text.slice(1);

}

// Open URL
function openURL(url) {

    window.open(url, "_blank");

}

// Loading

function showLoading() {

    const loader = document.getElementById("loading");

    if (loader) loader.style.display = "flex";

}

function hideLoading() {

    const loader = document.getElementById("loading");

    if (loader) loader.style.display = "none";

}

// Copy Text

async function copyText(text) {

    await navigator.clipboard.writeText(text);

    showSuccess("Copied successfully.");

}
