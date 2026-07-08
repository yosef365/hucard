const params = new URLSearchParams(window.location.search);

const profileId = params.get("id") || "john";

async function loadProfile() {

    const { data, error } = await db
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .single();

    if (error) {
        document.body.innerHTML = `
        <h1>Profile not found</h1>
        <p>${error.message}</p>
        `;
        return;
    }

    console.log(data);

    document.body.innerHTML = `
        <h1>${data.name}</h1>

        <h3>${data.title ?? ""}</h3>

        <p>${data.company ?? ""}</p>

        <p>${data.phone ?? ""}</p>

        <p>${data.email ?? ""}</p>
    `;
}

loadProfile();