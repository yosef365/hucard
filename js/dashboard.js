// =========================================
// HuCard Dashboard
// dashboard.js
// =========================================

let profiles = [];
let filteredProfiles = [];

let currentPage = 1;
const pageSize = 10;

let selectedProfile = null;

// =========================================
// Start Dashboard
// =========================================

document.addEventListener("DOMContentLoaded", async () => {

    showLoading();

    await checkLogin();

    await initializeDashboard();

    hideLoading();

});

// =========================================
// Initialize
// =========================================

async function initializeDashboard() {

    await loadStatistics();

    await loadProfiles();

    initializeEvents();

}

// =========================================
// Event Listeners
// =========================================

function initializeEvents() {

    document
        .getElementById("refreshBtn")
        ?.addEventListener("click", loadProfiles);

    document
        .getElementById("searchProfile")
        ?.addEventListener("input", searchProfiles);

    document
        .getElementById("filterStatus")
        ?.addEventListener("change", searchProfiles);

    document
        .getElementById("filterCompany")
        ?.addEventListener("change", searchProfiles);

    document
        .getElementById("sortProfiles")
        ?.addEventListener("change", searchProfiles);

    document
        .getElementById("addProfileBtn")
        ?.addEventListener("click", openAddProfile);

    document
        .getElementById("floatingAddProfile")
        ?.addEventListener("click", openAddProfile);

    document
        .getElementById("saveProfile")
        ?.addEventListener("click", saveProfile);

}

// =========================================
// Dashboard Statistics
// =========================================

async function loadStatistics() {

    try {

        const { count } = await db
            .from("profiles")
            .select("*", { count: "exact", head: true });

        document.getElementById("totalProfiles").textContent =
            count || 0;

        document.getElementById("totalViews").textContent = "-";

        document.getElementById("totalCompanies").textContent = "-";

        document.getElementById("storageUsed").textContent = "-";

    }

    catch (err) {

        console.error(err);

    }

}

// =========================================
// Load Profiles
// =========================================

async function loadProfiles() {

    showLoading();

    const { data, error } = await db

        .from("profiles")

        .select("*")

        .order("created_at", { ascending: false });

    hideLoading();

    if (error) {

        showError(error.message);

        return;

    }

    profiles = data;

    filteredProfiles = [...profiles];

    populateCompanyFilter();

    renderTable();

}// =========================================
// Populate Company Filter
// =========================================

function populateCompanyFilter() {

    const companySelect =
        document.getElementById("filterCompany");

    if (!companySelect) return;

    companySelect.innerHTML =
        '<option value="">All Companies</option>';

    const companies =
        [...new Set(
            profiles
                .map(p => p.company)
                .filter(c => c && c.trim() !== "")
        )].sort();

    companies.forEach(company => {

        const option = document.createElement("option");

        option.value = company;

        option.textContent = company;

        companySelect.appendChild(option);

    });

}

// =========================================
// Search & Filter
// =========================================

function searchProfiles() {

    const keyword =
        document.getElementById("searchProfile")
        .value
        .toLowerCase();

    const company =
        document.getElementById("filterCompany")
        .value;

    const status =
        document.getElementById("filterStatus")
        .value;

    const sort =
        document.getElementById("sortProfiles")
        .value;

    filteredProfiles = profiles.filter(profile => {

        const matchKeyword =

            (profile.name || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (profile.email || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (profile.phone || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (profile.company || "")
                .toLowerCase()
                .includes(keyword);

        const matchCompany =

            !company ||

            profile.company === company;

        const matchStatus =

            !status ||

            profile.status === status;

        return matchKeyword &&
               matchCompany &&
               matchStatus;

    });

    switch (sort) {

        case "name":

            filteredProfiles.sort((a, b) =>
                (a.name || "")
                .localeCompare(b.name || "")
            );

            break;

        case "created_at":

            filteredProfiles.sort((a, b) =>
                new Date(b.created_at) -
                new Date(a.created_at)
            );

            break;

        case "views":

            filteredProfiles.sort((a, b) =>
                (b.views || 0) -
                (a.views || 0)
            );

            break;

    }

    currentPage = 1;

    renderTable();

}

// =========================================
// Render Table
// =========================================

function renderTable() {

    const tbody =
        document.getElementById("profilesTableBody");

    if (!tbody) return;

    if (filteredProfiles.length === 0) {

        tbody.innerHTML = "";

        document
            .getElementById("emptyState")
            .style.display = "block";

        updatePagination();

        return;

    }

    document
        .getElementById("emptyState")
        .style.display = "none";

    const start =
        (currentPage - 1) * pageSize;

    const end =
        start + pageSize;

    const pageData =
        filteredProfiles.slice(start, end);

    tbody.innerHTML = "";

    pageData.forEach(profile => {

        tbody.innerHTML += `

<tr>

<td>

<img
src="${profile.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.name)}"
class="table-avatar">

</td>

<td>${profile.name || ""}</td>

<td>${profile.company || "-"}</td>

<td>${profile.profession || "-"}</td>

<td>${profile.phone || "-"}</td>

<td>

<span class="status ${profile.status || "active"}">

${profile.status || "active"}

</span>

</td>

<td>${profile.views || 0}</td>

<td>

<div
class="theme-preview"

style="background:${profile.theme_color || '#1a73e8'}">

</div>

</td>

<td>

<button
onclick="previewProfile('${profile.id}')">

<i class="fa fa-eye"></i>

</button>

<button
onclick="editProfile('${profile.id}')">

<i class="fa fa-pen"></i>

</button>

<button
onclick="deleteProfile('${profile.id}')">

<i class="fa fa-trash"></i>

</button>

</td>

</tr>

`;

    });

    updatePagination();

}

// =========================================
// Pagination
// =========================================

function updatePagination() {

    const total =
        filteredProfiles.length;

    const start =
        total === 0
            ? 0
            : (currentPage - 1) * pageSize + 1;

    const end =
        Math.min(
            currentPage * pageSize,
            total
        );

    document.getElementById("pageStart").textContent = start;

    document.getElementById("pageEnd").textContent = end;

    document.getElementById("totalRecords").textContent = total;

    document.getElementById("currentPage").textContent = currentPage;

}

// =========================================
// Pagination Buttons
// =========================================

document
.getElementById("nextPage")
?.addEventListener("click", () => {

    if (currentPage * pageSize < filteredProfiles.length) {

        currentPage++;

        renderTable();

    }

});

document
.getElementById("previousPage")
?.addEventListener("click", () => {

    if (currentPage > 1) {

        currentPage--;

        renderTable();

    }

});

document
.getElementById("firstPage")
?.addEventListener("click", () => {

    currentPage = 1;

    renderTable();

});

document
.getElementById("lastPage")
?.addEventListener("click", () => {

    currentPage =
        Math.ceil(filteredProfiles.length / pageSize);

    renderTable();

});// =========================================
// Open Add Profile Modal
// =========================================

function openAddProfile() {

    selectedProfile = null;

    document.getElementById("modalTitle").textContent =
        "Add New Profile";

    clearProfileForm();

    document.getElementById("profileModal").style.display = "flex";

}

// =========================================
// Close Modal
// =========================================

function closeProfileModal() {

    document.getElementById("profileModal").style.display = "none";

}

document
.getElementById("closeProfileModal")
?.addEventListener("click", closeProfileModal);

document
.getElementById("cancelProfile")
?.addEventListener("click", closeProfileModal);

// =========================================
// Clear Form
// =========================================
function clearProfileForm() {

    document.getElementById("profileId").disabled = false;

    document.getElementById("profileId").value = "";
    document.getElementById("fullName").value = "";
    document.getElementById("profession").value = "";
    document.getElementById("jobTitle").value = "";
    document.getElementById("company").value = "";
    document.getElementById("department").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("website").value = "";
    document.getElementById("address").value = "";
    document.getElementById("bio").value = "";

    document.getElementById("facebook").value = "";
    document.getElementById("instagram").value = "";
    document.getElementById("linkedin").value = "";
    document.getElementById("telegram").value = "";
    document.getElementById("tiktok").value = "";
    document.getElementById("youtube").value = "";

    document.getElementById("themeColor").value = "#1a73e8";
    document.getElementById("status").value = "active";

}

// =========================================
// Save Profile
// =========================================

async function saveProfile() {

    showLoading();

    const profile = {

        id:
            document.getElementById("profileId").value.trim(),

        name:
            document.getElementById("fullName").value,

        profession:
            document.getElementById("profession").value,

        title:
            document.getElementById("jobTitle").value,

        company:
            document.getElementById("company").value,

        department:
            document.getElementById("department").value,

        phone:
            document.getElementById("phone").value,

        email:
            document.getElementById("email").value,

        website:
            document.getElementById("website").value,

        address:
            document.getElementById("address").value,

        bio:
            document.getElementById("bio").value,

        facebook:
            document.getElementById("facebook").value,

        instagram:
            document.getElementById("instagram").value,

        linkedin:
            document.getElementById("linkedin").value,

        telegram:
            document.getElementById("telegram").value,

        tiktok:
            document.getElementById("tiktok").value,

        youtube:
            document.getElementById("youtube").value,

        theme_color:
            document.getElementById("themeColor").value,

        status:
            document.getElementById("status").value

    };

    let response;

    if (selectedProfile) {

        response = await db

            .from("profiles")

            .update(profile)

            .eq("id", selectedProfile);

    }

    else {

        response = await db

            .from("profiles")

            .insert([profile]);

    }

    hideLoading();

    if (response.error) {

        showError(response.error.message);

        return;

    }

    showSuccess("Profile saved successfully.");

    closeProfileModal();

    await loadProfiles();

}

// =========================================
// Edit Profile
// =========================================

function editProfile(id) {

    selectedProfile = id;

    const p = profiles.find(x => x.id === id);

    if (!p) return;

    document.getElementById("modalTitle").textContent =
        "Edit Profile";

    document.getElementById("profileId").value = p.id || "";
    document.getElementById("profileId").disabled = true;

    document.getElementById("fullName").value = p.name || "";
    document.getElementById("profession").value = p.profession || "";
    document.getElementById("jobTitle").value = p.title || "";
    document.getElementById("company").value = p.company || "";
    document.getElementById("department").value = p.department || "";
    document.getElementById("phone").value = p.phone || "";
    document.getElementById("email").value = p.email || "";
    document.getElementById("website").value = p.website || "";
    document.getElementById("address").value = p.address || "";
    document.getElementById("bio").value = p.bio || "";

    document.getElementById("facebook").value = p.facebook || "";
    document.getElementById("instagram").value = p.instagram || "";
    document.getElementById("linkedin").value = p.linkedin || "";
    document.getElementById("telegram").value = p.telegram || "";
    document.getElementById("tiktok").value = p.tiktok || "";
    document.getElementById("youtube").value = p.youtube || "";

    document.getElementById("themeColor").value =
        p.theme_color || "#1a73e8";

    document.getElementById("status").value =
        p.status || "active";

    document.getElementById("profileModal").style.display = "flex";

}

// =========================================
// Delete Profile
// =========================================

async function deleteProfile(id) {

    if (!confirmAction("Delete this profile?"))
        return;

    showLoading();

    const { error } = await db

        .from("profiles")

        .delete()

        .eq("id", id);

    hideLoading();

    if (error) {

        showError(error.message);

        return;

    }

    showSuccess("Profile deleted.");

    await loadProfiles();

}

// =========================================
// Preview Profile
// =========================================

function previewProfile(id) {

    window.open(
        `profile.html?id=${id}`,
        "_blank"
    );

      }

// =========================================
// Upload Avatar
// =========================================

async function uploadAvatar(file, profileId) {

    if (!file) return null;

    const fileName =
        `${profileId}_${Date.now()}_${file.name}`;

    const { error } = await db.storage

        .from("avatars")

        .upload(fileName, file, {

            upsert: true

        });

    if (error) {

        showError(error.message);

        return null;

    }

    const { data } = db.storage

        .from("avatars")

        .getPublicUrl(fileName);

    return data.publicUrl;

}

// =========================================
// Upload Cover Image
// =========================================

async function uploadCover(file, profileId) {

    if (!file) return null;

    const fileName =
        `${profileId}_cover_${Date.now()}_${file.name}`;

    const { error } = await db.storage

        .from("avatars")

        .upload(fileName, file, {

            upsert: true

        });

    if (error) {

        showError(error.message);

        return null;

    }

    const { data } = db.storage

        .from("avatars")

        .getPublicUrl(fileName);

    return data.publicUrl;

}

// =========================================
// Theme Picker
// =========================================

function openThemePicker(id) {

    selectedProfile = id;

    document
        .getElementById("themeModal")
        .style.display = "flex";

}

function closeThemePicker() {

    document
        .getElementById("themeModal")
        .style.display = "none";

}

document

.getElementById("themeModal")

?.addEventListener("click", function(e){

    if(e.target===this)

        closeThemePicker();

});

// =========================================
// Toast Notification
// =========================================

function toast(title, message) {

    const box =
        document.getElementById("toast");

    document.getElementById("toastTitle")
        .textContent = title;

    document.getElementById("toastMessage")
        .textContent = message;

    box.classList.add("show");

    setTimeout(() => {

        box.classList.remove("show");

    }, 3000);

}

document

.getElementById("closeToast")

?.addEventListener("click", () => {

    document
        .getElementById("toast")
        .classList.remove("show");

});

// =========================================
// Refresh Dashboard
// =========================================

async function refreshDashboard() {

    await loadStatistics();

    await loadProfiles();

    toast(

        "Dashboard",

        "Dashboard refreshed."

    );

}

// =========================================
// Logout
// =========================================

document

.getElementById("logoutBtn")

?.addEventListener("click", async () => {

    await logout();

});

// =========================================
// Close Modals
// =========================================

window.addEventListener("click", function(e){

    if(e.target===document.getElementById("profileModal"))

        closeProfileModal();

    if(e.target===document.getElementById("deleteModal"))

        document.getElementById("deleteModal").style.display="none";

    if(e.target===document.getElementById("uploadModal"))

        document.getElementById("uploadModal").style.display="none";

});

// =========================================
// Dashboard Ready
// =========================================

console.log("HuCard Dashboard Loaded Successfully");
