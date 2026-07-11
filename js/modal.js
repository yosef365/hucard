// ======================================
// HuCard Modal Manager
// ======================================

let editingProfile = null;

// Open Add Profile
function openAddProfile() {

    editingProfile = null;

    clearProfileForm();

    document.getElementById("modalTitle").textContent = "Add Profile";

    document.getElementById("profileModal").style.display = "flex";

}

// Close Modal
function closeProfileModal() {

    document.getElementById("profileModal").style.display = "none";

}

// Open Edit Modal
function openEditModal() {

    document.getElementById("modalTitle").textContent = "Edit Profile";

    document.getElementById("profileModal").style.display = "flex";

}

// Close when clicking outside
window.addEventListener("click", function (e) {

    const modal = document.getElementById("profileModal");

    if (e.target === modal) {

        closeProfileModal();

    }

});

// Register Events
document.addEventListener("DOMContentLoaded", () => {

    const closeBtn = document.getElementById("closeProfileModal");

    const cancelBtn = document.getElementById("cancelProfile");

    if (closeBtn) {

        closeBtn.addEventListener("click", closeProfileModal);

    }

    if (cancelBtn) {

        cancelBtn.addEventListener("click", closeProfileModal);

    }

});
