// ======================================
// HuCard Dashboard
// Main Controller
// ======================================

let profiles = [];
let companies = [];
let themes = [];

let editingProfile = null;

let currentPage = 1;
const pageSize = 10;

// ======================================
// Start Dashboard
// ======================================

document.addEventListener("DOMContentLoaded", async () => {

    await checkLogin();

    initializeEvents();

    await initializeDashboard();

});

// ======================================

async function initializeDashboard() {

    showLoading();

    await Promise.all([

        loadCompanies(),

        loadThemes(),

        loadProfiles(),

        loadStatistics()

    ]);

    hideLoading();

}

// ======================================
// Events
// ======================================

function initializeEvents(){

    document
        .getElementById("logoutBtn")
        .addEventListener("click", logout);

    document
        .getElementById("refreshDashboard")
        .addEventListener("click", initializeDashboard);

    document
        .getElementById("searchProfile")
        .addEventListener("input", filterProfiles);

    document
        .getElementById("filterCompany")
        .addEventListener("change", filterProfiles);

    document
        .getElementById("filterStatus")
        .addEventListener("change", filterProfiles);

    document
        .getElementById("closeProfileModal")
        .addEventListener("click", closeProfileModal);

    document
        .getElementById("cancelProfile")
        .addEventListener("click", closeProfileModal);

}

// ======================================
// Open Add Profile
// ======================================

function openAddProfile(){

    editingProfile = null;

    clearProfileForm();

    document.getElementById("modalTitle").textContent =
        "Add Profile";

    document.getElementById("profileModal").style.display =
        "flex";

}

// ======================================
// Close Modal
// ======================================

function closeProfileModal(){

    document.getElementById("profileModal").style.display =
        "none";

}

// ======================================
// Clear Form
// ======================================

function clearProfileForm(){

    editingProfile = null;

    document.getElementById("profileId").value = "";

    document.getElementById("fullName").value = "";

    document.getElementById("jobTitle").value = "";

    document.getElementById("profession").value = "";

    document.getElementById("bio").value = "";

    document.getElementById("phone").value = "";

    document.getElementById("whatsapp").value = "";

    document.getElementById("email").value = "";

    document.getElementById("website").value = "";

    document.getElementById("address").value = "";

    document.getElementById("company").value = "";

    document.getElementById("theme").value = "";

    document.getElementById("status").value = "active";

    document.getElementById("avatar").value = "";

    document.getElementById("cover_image").value = "";

    document.getElementById("avatarPreview").src =
        "https://placehold.co/150";

    document.getElementById("coverPreview").src =
        "https://placehold.co/900x250";

    document.getElementById("facebook").value = "";

    document.getElementById("instagram").value = "";

    document.getElementById("linkedin").value = "";

    document.getElementById("telegram").value = "";

    document.getElementById("tiktok").value = "";

    document.getElementById("youtube").value = "";

}

// ======================================
// Search
// ======================================

function filterProfiles(){

    const keyword = document
        .getElementById("searchProfile")
        .value
        .toLowerCase();

    const company =
        document.getElementById("filterCompany").value;

    const status =
        document.getElementById("filterStatus").value;

    const filtered = profiles.filter(profile=>{

        const matchKeyword =

            (profile.name || "")

            .toLowerCase()

            .includes(keyword);

        const matchCompany =

            company==="" ||

            profile.company_id===company;

        const matchStatus =

            status==="" ||

            profile.status===status;

        return (

            matchKeyword &&

            matchCompany &&

            matchStatus

        );

    });

    renderProfiles(filtered);

}
