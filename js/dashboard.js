// =====================================
// HuCard Dashboard Controller
// =====================================

let profiles = [];
let companies = [];
let themes = [];
let editingProfile = null;

document.addEventListener("DOMContentLoaded", async () => {

    const user = await checkLogin();

    if (!user) return;

    bindEvents();

    await initializeDashboard();

});
async function initializeDashboard(){

    showLoading();

    await loadCompanies();

    await loadThemes();

    await loadProfiles();

    await loadStatistics();

    hideLoading();

}
function bindEvents(){

    document
    .getElementById("logoutBtn")
    ?.addEventListener("click", logout);

    document
    .getElementById("refreshDashboard")
    ?.addEventListener("click", initializeDashboard);

    document
    .getElementById("searchProfile")
    ?.addEventListener("input", filterProfiles);

    document
    .getElementById("filterCompany")
    ?.addEventListener("change", filterProfiles);

    document
    .getElementById("filterStatus")
    ?.addEventListener("change", filterProfiles);

}
