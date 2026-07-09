// =========================================
// HuCard Profile.js
// Part 1
// =========================================

// Get profile ID from URL
const params = new URLSearchParams(window.location.search);
const profileId = params.get("id");

const container = document.getElementById("cardContainer");

if (!profileId) {
    container.innerHTML = `
        <div class="card">
            <div class="content">
                <h2>Profile ID Missing</h2>
                <p>Use profile.html?id=your-id</p>
            </div>
        </div>
    `;
} else {
    loadProfile();
}

// =========================================

async function loadProfile() {

    container.innerHTML = `
        <div class="loading">
            <div class="loader"></div>
            <p>Loading HuCard...</p>
        </div>
    `;

    const { data, error } = await db
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .single();

    if (error || !data) {

        container.innerHTML = `
            <div class="card">
                <div class="content">
                    <h2>Profile Not Found</h2>
                    <p>${error ? error.message : ""}</p>
                </div>
            </div>
        `;

        return;
    }

    renderProfile(data);

}

// =========================================

function renderProfile(user) {

    document.documentElement.style.setProperty(
        "--primary",
        user.theme_color || "#2563eb"
    );

    const avatar =
        user.avatar && user.avatar !== ""
            ? user.avatar
            : "images/default-avatar.png";

    const cover =
        user.cover_image && user.cover_image !== ""
            ? user.cover_image
            : "";

    const phoneButton = user.phone
        ? `
<a class="contact-item" href="tel:${user.phone}">
<i class="fa-solid fa-phone"></i>
<span>${user.phone}</span>
</a>`
        : "";

    const emailButton = user.email
        ? `
<a class="contact-item" href="mailto:${user.email}">
<i class="fa-solid fa-envelope"></i>
<span>${user.email}</span>
</a>`
        : "";

    const websiteButton = user.website
        ? `
<a class="contact-item"
target="_blank"
href="${user.website}">
<i class="fa-solid fa-globe"></i>
<span>Website</span>
</a>`
        : "";

    const whatsappButton = user.whatsapp
        ? `
<a class="contact-item"
target="_blank"
href="https://wa.me/${user.whatsapp.replace(/\D/g,'')}">
<i class="fa-brands fa-whatsapp"></i>
<span>WhatsApp</span>
</a>`
        : "";

    const addressButton = user.address
        ? `
<div class="contact-item">
<i class="fa-solid fa-location-dot"></i>
<span>${user.address}</span>
</div>`
        : "";

    let socials = "";

    if (user.facebook)
        socials += `
<a target="_blank"
href="${user.facebook}">
<i class="fab fa-facebook-f"></i>
</a>`;

    if (user.linkedin)
        socials += `
<a target="_blank"
href="${user.linkedin}">
<i class="fab fa-linkedin-in"></i>
</a>`;

    if (user.instagram)
        socials += `
<a target="_blank"
href="${user.instagram}">
<i class="fab fa-instagram"></i>
</a>`;

    if (user.telegram)
        socials += `
<a target="_blank"
href="${user.telegram}">
<i class="fab fa-telegram"></i>
</a>`;

    if (user.github)
        socials += `
<a target="_blank"
href="${user.github}">
<i class="fab fa-github"></i>
</a>`;

    const qr =
`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(window.location.href)}`;

    container.innerHTML = `

<div class="card">

<div class="cover">

${cover
? `<img src="${cover}">`
: ""}

<img
class="avatar"
src="${avatar}"
onerror="this.src='images/default-avatar.png'">

</div>

<div class="content">

<h1 class="name">
${user.name || ""}
</h1>

<p class="title">
${user.title || ""}
</p>

<p class="company">
${user.company || ""}
</p>

<p class="bio">
${user.bio || ""}
</p>

<div class="contact-list">

${phoneButton}

${emailButton}

${websiteButton}

${whatsappButton}

${addressButton}

</div>

<div class="buttons">

<button
class="btn"
onclick="downloadVCard()">

<i class="fa-solid fa-address-card"></i>

Save Contact

</button>

<button
class="btn secondary"
onclick="shareCard()">

<i class="fa-solid fa-share-nodes"></i>

Share

</button>

</div>

${socials
?
`<div class="socials">

${socials}

</div>`
:
""}

<div class="qr">

<img src="${qr}">

</div>

</div>

</div>

`;

    // Save globally for Part 2
    window.currentProfile = user;

          }

// =========================================
// HuCard Profile.js
// Part 2
// =========================================

// Download vCard (.vcf)
function downloadVCard() {

    if (!window.currentProfile) return;

    const p = window.currentProfile;

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${p.name || ""}
ORG:${p.company || ""}
TITLE:${p.title || ""}
TEL;TYPE=CELL:${p.phone || ""}
EMAIL:${p.email || ""}
URL:${p.website || ""}
ADR:;;${p.address || ""};;;;
NOTE:${p.bio || ""}
END:VCARD`;

    const blob = new Blob([vcard], {
        type: "text/vcard;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download =
        (p.id || "contact") + ".vcf";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

}

// =========================================

// Share Card

async function shareCard() {

    if (!window.currentProfile) return;

    const p = window.currentProfile;

    if (navigator.share) {

        try {

            await navigator.share({

                title: p.name,

                text:
                    `${p.name}
${p.title || ""}
${p.company || ""}`,

                url: window.location.href

            });

        }

        catch (e) {

            console.log(e);

        }

    }

    else {

        copyLink();

    }

}

// =========================================

// Copy URL

function copyLink() {

    navigator.clipboard.writeText(

        window.location.href

    ).then(() => {

        alert("Profile link copied.");

    });

}

// =========================================

// Open Website

function openWebsite() {

    if (

        window.currentProfile &&

        window.currentProfile.website

    ) {

        window.open(

            window.currentProfile.website,

            "_blank"

        );

    }

}

// =========================================

// Call

function callPhone() {

    if (

        window.currentProfile &&

        window.currentProfile.phone

    ) {

        location.href =

            "tel:" +

            window.currentProfile.phone;

    }

}

// =========================================

// Email

function sendEmail() {

    if (

        window.currentProfile &&

        window.currentProfile.email

    ) {

        location.href =

            "mailto:" +

            window.currentProfile.email;

    }

}

// =========================================

// WhatsApp

function openWhatsApp() {

    if (

        window.currentProfile &&

        window.currentProfile.whatsapp

    ) {

        const phone =

            window.currentProfile.whatsapp.replace(

                /\D/g,

                ""

            );

        window.open(

            "https://wa.me/" + phone,

            "_blank"

        );

    }

}

// =========================================

// Image fallback

document.addEventListener(

    "error",

    function (e) {

        if (

            e.target.tagName === "IMG"

        ) {

            e.target.src =

                "images/default-avatar.png";

        }

    },

    true

);

// =========================================

// Smooth Scroll

window.scrollTo({

    top: 0,

    behavior: "smooth"

});

// =========================================

// Console

console.log(

    "%cHuCard",

    "color:#2563eb;font-size:22px;font-weight:bold"

);

console.log(

    "HuCard loaded successfully."

);

// =========================================
