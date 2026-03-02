const refiners_path = npc_town_path+"Refiners/"
var refiners = [
    {name: "Lira", salary: 150, portrait:refiners_path+"p1.webp" , img:refiners_path+"1.webp" , description: "+5% dungeon mats, +10% random mats"},
    {name: "Aria", salary: 250, portrait:refiners_path+"p2.webp" , img:refiners_path+"2.webp" , description: "+15% dungeon mats after run"},
    {name: "Kaela", salary: 375, portrait:refiners_path+"p3.webp" , img:refiners_path+"3.webp" , description: "+10% dungeon mats, +5% random mats"},
    {name: "Mira", salary: 450, portrait:refiners_path+"p4.webp" , img:refiners_path+"4.webp" , description: "15% chance to double mats after run"},
    {name: "Selene", salary: 600, portrait:refiners_path+"p5.webp" , img:refiners_path+"5.webp" , description: "+20% random mats "},
    {name: "Talia", salary: 2500, portrait:refiners_path+"p6.webp" , img:refiners_path+"6.webp" , description: "+10% enemy spawn rate"},
];
var activeRefinerIndex;
var activeRefiner;
var refinerHireRun;
function isRefinerPayable(){
    if(activeRefiner)
        return soul.gold >= activeRefiner.salary;
}
function resetRefiner(){
    if(activeRefiner){
        if ((currentRun - refinerHireRun) % 5 == 0){//pay every 5 runs
            if(!isRefinerPayable()){
                //end contract
                activeRefiner = null;
                refinerHireRun = 0;
                $("#refinerBuffIcon").addClass('d-none');
                // $('#background.storage').css({"background-image": 'url("../img/Backgrounds/storage.webp")'});
                // $('#background.storage').removeAttr("refinerImage");

            }else{
                soul.gold -= activeRefiner.salary;
                soul.updateGold(soul.gold);
            }
        }
    }
}
function hireRefiner(index){
    activeRefinerIndex = index;
    activeRefiner = refiners[index];
    refinerHireRun = currentRun;
    // $('#background.storage').attr("refinerImage",activeRefiner.img);
    resetRefiner();
    updateRefinerState();
}

async function updateRefinerState() {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("RefinerState", "readwrite");
        const store = tx.objectStore("RefinerState");

        const getRequest = store.get(1);

        getRequest.onsuccess = async () => {
            let refinerState = getRequest.result;

            if (!refinerState) {
                console.log("No refiner found, creating new refiner state...");
                refinerState = {
                    id: 1,
                    activeRefinerIndex,
                    activeRefiner,
                    refinerHireRun
                };
                await new Promise(resolve => {
                    const req = store.add(refinerState);
                    req.onsuccess = e => resolve(e.target.result);
                });
                resolve("Refiner state created");
            } else {
                store.put({
                    id: 1,
                    activeRefinerIndex,
                    activeRefiner,
                    refinerHireRun
                });
                resolve("Refiner state updated");
            }
        };

        getRequest.onerror = () => reject(getRequest.error);
    });
}

function populateRefinerMenu() {
    let menuHTML = '';
    let active = activeRefinerIndex;
    for (let i = 0; i < refiners.length; i += 3) {
        menuHTML += `<div class="d-flex align-items-center justify-content-center mt-${i === 0 ? 2 : 3}">`;
        
        // group of 3 refiners
        for (let j = i; j < i + 3 && j < refiners.length; j++) {
            const refiner = refiners[j];
            isActive = activeRefinerIndex == j;
            menuHTML += `
                <div class="d-flex flex-column align-items-center justify-content-center mx-auto refiner-container" id="refiner${j}" refinerIndex=${j}>
                    <div class="npc-portrait refiner-portrait pos-rel" data-bs-toggle="offcanvas" data-bs-target="#refinerPreviewPanel" aria-controls="refinerPreviewPanel"
                         style="background-image: url('${refiner.portrait}'); 
                                background-size: cover; 
                                background-position: center;">
                        <div class="npc-portrait-name">${refiner.name}</div>
                    </div>
                    <button class="btn btn-${isActive ? "warning" : "light"} btn-sm mt-1 mx-auto hire-refiner-btn ${isActive ? "hired" : ''}" ${soul.gold < refiner.salary ? 'disabled="disabled"' : ''} salary=${refiner.salary}>
                        <strong>${isActive ? "Active" : (refiner.salary +"g")}</strong>
                    </button>
                </div>
            `;
        }

        menuHTML += `</div>`;
    }
    if(active){
        $('#refinerHireRun').text(refinerHireRun)
        $('#buffEffectDisplay').text(activeRefiner.description);
        $("#refinerBuffIcon").removeClass('d-none');
    }
    $('#refinerList').html(menuHTML);
}
function checkHireBtnStatus(){
    $('.hire-refiner-btn').each(function(index,btn){
        if(!$(btn).hasClass('hired')){
            let salary = $(btn).attr('salary')
            if(soul.gold < salary){
                $(btn).attr('disabled','disabled');
            }else{
                $(btn).removeAttr('disabled')
            }
        }
    })
}



