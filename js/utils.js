// ==========================================
// HuCard Utilities
// ==========================================

// Loading
function showLoading() {

    const loader = document.getElementById("loadingOverlay");

    if (loader) {

        loader.style.display = "flex";

    }

}

function hideLoading() {

    const loader = document.getElementById("loadingOverlay");

    if (loader) {

        loader.style.display = "none";

    }

}

// ==========================================
// Toast
// ==========================================

function showToast(title, message) {

    const toast = document.getElementById("toast");

    if (!toast) {

        alert(title + "\n" + message);

        return;

    }

    document.getElementById("toastTitle").textContent = title;

    document.getElementById("toastMessage").textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3500);

}

document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("closeToast");

    if (btn) {

        btn.onclick = () => {

            document
                .getElementById("toast")
                .classList
                .remove("show");

        };

    }

});

// ==========================================
// Confirm
// ==========================================

function confirmDelete(message = "Delete this profile?") {

    return confirm(message);

}

// ==========================================
// Date
// ==========================================

function formatDate(date) {

    if (!date) return "";

    return new Date(date).toLocaleDateString();

}

// ==========================================
// UUID
// ==========================================

function generateSlug() {

    return crypto.randomUUID();

}

// ==========================================
// Safe Value
// ==========================================

function value(v) {

    return v ?? "";

}

// ==========================================
// Avatar
// ==========================================

function avatar(url) {

    if (!url || url === "") {

        return "https://placehold.co/150";

    }

    return url;

}

// ==========================================
// Cover
// ==========================================

function cover(url) {

    if (!url || url === "") {

        return "https://placehold.co/900x250";

    }

    return url;

}

// ==========================================
// Profile URL
// ==========================================

function getProfileUrl(slug) {

    return `${window.location.origin}${window.location.pathname.replace("dashboard.html","")}profile.html?slug=${slug}`;

}

// ==========================================
// Reset Form
// ==========================================

function clearProfileForm() {

    editingProfile = null;

    [
        "profileId",
        "fullName",
        "jobTitle",
        "profession",
        "bio",
        "phone",
        "whatsapp",
        "email",
        "website",
        "address",
        "company",
        "theme",
        "status",
        "avatar",
        "cover_image",
        "facebook",
        "instagram",
        "linkedin",
        "telegram",
        "tiktok",
        "youtube"
    ].forEach(id => {

        const el = document.getElementById(id);

        if (!el) {

            console.error("Missing element:", id);

            return;

        }

        if (el.tagName === "SELECT") {

            el.selectedIndex = 0;

        } else {

            el.value = "";

        }

    });

    const avatar = document.getElementById("avatarPreview");

    if (avatar) {

        avatar.src = "https://placehold.co/150";

    }

    const cover = document.getElementById("coverPreview");

    if (cover) {

        cover.src = "https://placehold.co/900x250";

    }

}
