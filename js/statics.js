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
