// ================================
// HuCard Dashboard
// Module 1
// ================================

// Pagination
let currentPage = 1;
const pageSize = 10;

// Data
let profiles = [];
let companies = [];
let themes = [];

// Editing
let editingProfile = null;

// ================================
// Initialize Dashboard
// ================================

document.addEventListener("DOMContentLoaded", async () => {

    await checkLogin();

    await initializeDashboard();

});

// ================================

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

// ================================
// Logout
// ================================

document
.getElementById("logoutBtn")
.addEventListener("click", logout);

// ================================
// Refresh
// ================================

document
.getElementById("refreshDashboard")
.addEventListener("click", initializeDashboard);
// ================================
// Search & Filters
// ================================

document
.getElementById("searchProfile")
.addEventListener("input", filterProfiles);

document
.getElementById("filterCompany")
.addEventListener("change", filterProfiles);

document
.getElementById("filterStatus")
.addEventListener("change", filterProfiles);
// ================================
// Modal
// ================================

document
.getElementById("closeProfileModal")
.onclick = closeProfileModal;

document
.getElementById("cancelProfile")
.onclick = closeProfileModal;

// ================================

function openAddProfile(){

    editingProfile = null;

    document.getElementById("modalTitle").innerText="Add Profile";

    document.getElementById("profileModal").style.display="flex";

    clearProfileForm();

}

// ================================

function closeProfileModal(){

    document.getElementById("profileModal").style.display="none";

}

// ================================

function clearProfileForm(){

    document.getElementById("profileId").value="";

    document.getElementById("fullName").value="";

    document.getElementById("jobTitle").value="";

    document.getElementById("profession").value="";

    document.getElementById("bio").value="";

    document.getElementById("phone").value="";

    document.getElementById("whatsapp").value="";

    document.getElementById("email").value="";

    document.getElementById("website").value="";

    document.getElementById("address").value="";

    document.getElementById("company").value="";

    document.getElementById("theme").value="";

    document.getElementById("status").value="active";

    document.getElementById("facebook").value="";

    document.getElementById("instagram").value="";

    document.getElementById("linkedin").value="";

    document.getElementById("telegram").value="";

    document.getElementById("tiktok").value="";

    document.getElementById("youtube").value="";

}

// ================================
// Loading
// ================================

function showLoading(){

    document.getElementById("loadingOverlay").style.display="flex";

}

function hideLoading(){

    document.getElementById("loadingOverlay").style.display="none";

}
// =====================================
// MODULE 2 - Profiles CRUD
// =====================================

// Load Profiles
async function loadProfiles() {

    const { data, error } = await db
        .from("profiles")
        .select(`
            *,
            companies(name),
            themes(name)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        showToast("Error", error.message);
        return;
    }

    profiles = data || [];

    renderProfiles();

}

// =====================================
// Render Table
// =====================================

function renderProfiles(data = profiles) {

    const tbody = document.getElementById("profilesTableBody");

    tbody.innerHTML = "";

    if (profiles.length === 0) {

        document.getElementById("emptyState").style.display = "block";

        return;

    }

    document.getElementById("emptyState").style.display = "none";

    data.forEach(profile => {

        tbody.innerHTML += `

<tr>

<td>

<img
src="${profile.avatar || 'https://placehold.co/60x60'}"
class="table-avatar">

</td>

<td>${profile.name}</td>

<td>${profile.companies?.name ?? "-"}</td>

<td>${profile.profession ?? "-"}</td>

<td>${profile.phone ?? "-"}</td>

<td>

<span class="status ${profile.status}">
${profile.status}
</span>

</td>

<td>${profile.views}</td>

<td>

<button onclick="editProfile('${profile.id}')">

<i class="fas fa-pen"></i>

</button>

<button onclick="deleteProfile('${profile.id}')">

<i class="fas fa-trash"></i>

</button>

<a
href="profile.html?slug=${profile.slug}"
target="_blank">

<i class="fas fa-eye"></i>

</a>

</td>

</tr>

`;

    });

}

// =====================================
// Edit Profile
// =====================================

async function editProfile(id) {

    editingProfile = id;

    const profile = profiles.find(p => p.id === id);

    if (!profile) return;

    document.getElementById("modalTitle").innerText = "Edit Profile";

    document.getElementById("profileId").value = profile.id;

    document.getElementById("fullName").value = profile.name ?? "";

    document.getElementById("jobTitle").value = profile.title ?? "";

    document.getElementById("profession").value = profile.profession ?? "";

    document.getElementById("bio").value = profile.bio ?? "";

    document.getElementById("phone").value = profile.phone ?? "";

    document.getElementById("whatsapp").value = profile.whatsapp ?? "";

    document.getElementById("email").value = profile.email ?? "";

    document.getElementById("website").value = profile.website ?? "";

    document.getElementById("address").value = profile.address ?? "";

    document.getElementById("company").value = profile.company_id ?? "";

    document.getElementById("theme").value = profile.theme_id ?? "";

    document.getElementById("status").value = profile.status ?? "active";

    document.getElementById("profileModal").style.display = "flex";

}

// =====================================
// Save Profile
// =====================================

async function saveProfile() {

    const profile = {

        name: document.getElementById("fullName").value,

        title: document.getElementById("jobTitle").value,

        profession: document.getElementById("profession").value,

        bio: document.getElementById("bio").value,

        phone: document.getElementById("phone").value,

        whatsapp: document.getElementById("whatsapp").value,

        email: document.getElementById("email").value,

        website: document.getElementById("website").value,

        address: document.getElementById("address").value,

        company_id: document.getElementById("company").value || null,

        theme_id: document.getElementById("theme").value || null,

        status: document.getElementById("status").value

    };

    let error;

    if (editingProfile) {

        ({ error } = await db

            .from("profiles")

            .update(profile)

            .eq("id", editingProfile));

    } else {

        profile.slug = crypto.randomUUID();

        ({ error } = await db

            .from("profiles")

            .insert(profile));

    }

    if (error) {

        showToast("Error", error.message);

        return;

    }

    showToast("Success", "Profile saved successfully.");

    closeProfileModal();

    loadProfiles();

}

// =====================================
// Delete
// =====================================

async function deleteProfile(id) {

    if (!confirm("Delete this profile?")) return;

    const { error } = await db

        .from("profiles")

        .delete()

        .eq("id", id);

    if (error) {

        showToast("Error", error.message);

        return;

    }

    showToast("Success", "Profile deleted.");

    loadProfiles();

}
// =====================================
// Companies
// =====================================

async function loadCompanies() {

    const { data, error } = await db

        .from("companies")

        .select("*")

        .order("name");

    if (error) {

        console.error(error);

        return;

    }

    companies = data || [];

    const companySelect =
        document.getElementById("company");

    const filterCompany =
        document.getElementById("filterCompany");

    companySelect.innerHTML =
        '<option value="">Select Company</option>';

    filterCompany.innerHTML =
        '<option value="">All Companies</option>';

    companies.forEach(company => {

        companySelect.innerHTML += `

<option value="${company.id}">
${company.name}
</option>

`;

        filterCompany.innerHTML += `

<option value="${company.id}">
${company.name}
</option>

`;

    });

}
// =====================================
// Themes
// =====================================

async function loadThemes() {

    const { data, error } = await db

        .from("themes")

        .select("*")

        .order("name");

    if (error) {

        console.error(error);

        return;

    }

    themes = data || [];

    const select =
        document.getElementById("theme");

    select.innerHTML =
        '<option value="">Select Theme</option>';

    themes.forEach(theme => {

        select.innerHTML += `

<option value="${theme.id}">
${theme.name}
</option>

`;

    });

}
// =====================================
// Filter Profiles
// =====================================

function filterProfiles(){

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

    const filtered = profiles.filter(profile => {

        const matchesKeyword =

            (profile.name || "")
            .toLowerCase()
            .includes(keyword);

        const matchesCompany =

            company === "" ||

            profile.company_id === company;

        const matchesStatus =

            status === "" ||

            profile.status === status;

        return (

            matchesKeyword &&

            matchesCompany &&

            matchesStatus

        );

    });

    renderProfiles(filtered);

}
// =====================================
// Dashboard Statistics
// =====================================

async function loadStatistics(){

    try{

        const [

            profilesResult,

            companiesResult,

            analyticsResult,

            qrResult

        ] = await Promise.all([

            db.from("profiles")
            .select("*",{count:"exact",head:true}),

            db.from("companies")
            .select("*",{count:"exact",head:true}),

            db.from("analytics")
            .select("*",{count:"exact",head:true}),

            db.from("qr_codes")
            .select("*",{count:"exact",head:true})

        ]);


        document.getElementById("totalProfiles").innerText =
            profilesResult.count || 0;


        document.getElementById("totalCompanies").innerText =
            companiesResult.count || 0;


        document.getElementById("totalViews").innerText =
            analyticsResult.count || 0;


        document.getElementById("totalQrCodes").innerText =
            qrResult.count || 0;

    }

    catch(err){

        console.error(err);

    }

}
// =====================================
// Load Social Links
// =====================================

async function loadSocialLinks(profileId){

    const {data,error} = await db

    .from("social_links")

    .select("*")

    .eq("profile_id",profileId);


    if(error){

        console.error(error);

        return;

    }

    document.getElementById("facebook").value="";

    document.getElementById("instagram").value="";

    document.getElementById("linkedin").value="";

    document.getElementById("telegram").value="";

    document.getElementById("tiktok").value="";

    document.getElementById("youtube").value="";


    data.forEach(link=>{

        switch(link.platform){

            case "facebook":

                facebook.value=link.url;

            break;

            case "instagram":

                instagram.value=link.url;

            break;

            case "linkedin":

                linkedin.value=link.url;

            break;

            case "telegram":

                telegram.value=link.url;

            break;

            case "tiktok":

                tiktok.value=link.url;

            break;

            case "youtube":

                youtube.value=link.url;

            break;

        }

    });

}

// =====================================
// Save Social Links
// =====================================

async function saveSocialLinks(profileId){

    await db

    .from("social_links")

    .delete()

    .eq("profile_id",profileId);


    const links=[];

    const add=(platform,id)=>{

        const value=document.getElementById(id).value.trim();

        if(value){

            links.push({

                profile_id:profileId,

                platform,

                url:value

            });

        }

    };


    add("facebook","facebook");

    add("instagram","instagram");

    add("linkedin","linkedin");

    add("telegram","telegram");

    add("tiktok","tiktok");

    add("youtube","youtube");


    if(links.length){

        await db

        .from("social_links")

        .insert(links);

    }

}
