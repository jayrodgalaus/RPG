const refiners_path = npc_town_path+"Refiners/"
const refiners_bonus = npc_town_path+"Refiners/Bonus/"
var refinerBuffs = [
    {idx:0 ,description: "+5% dungeon mats, +10% random mats"},
    {idx:1 ,description: "+15% dungeon mats after run"},
    {idx:2 ,description: "+10% dungeon mats, +5% random mats"},
    {idx:3 ,description: "+7% enemy spawn rate"},
    {idx:4 ,description: "+20% random mats"},
    {idx:5 ,description: "+10% dungeon mats, 15% random"},
    {idx:6 ,description: "+10% chance for mob to drop 2 mats"},
    {idx:7 ,description: "10% chance to double mats after run"},
    {idx:8 ,description: "+10% enemy spawn rate"},
];
var refinerBonus = [
    {idx:0,},
    {idx:1,},
    {idx:2,},
    {idx:3, path:refiners_bonus+"4.webm"},
    {idx:4,},
    {idx:5, path:refiners_bonus+"6-1.webm"},
    {idx:6,},
    {idx:7,},
    {idx:8, path:refiners_bonus+"9.webm"},
]
var refiners = [
    {name: "Lira", salary: 150, portrait:refiners_path+"p1.webp", img:refiners_path+"1.webp", bonus:false , buff: refinerBuffs[0]},
    {name: "Aria", salary: 250, portrait:refiners_path+"p2.webp", img:refiners_path+"2.webp", bonus:false , buff: refinerBuffs[1]},
    {name: "Kaela", salary: 375, portrait:refiners_path+"p3.webp", img:refiners_path+"3.webp", bonus:false , buff: refinerBuffs[2]},
    {name: "Mira", salary: 600, portrait:refiners_path+"p4.webp", img:refiners_path+"4.webp", bonus:refinerBonus[3] , buff: refinerBuffs[3]},
    {name: "Selene", salary: 650, portrait:refiners_path+"p5.webp", img:refiners_path+"5.webp", bonus:false , buff: refinerBuffs[4]},
    {name: "Talia", salary: 750, portrait:refiners_path+"p6.webp", img:refiners_path+"6.webp", bonus:refinerBonus[5] , buff: refinerBuffs[5]},
    {name: "Lilia", salary: 1000, portrait:refiners_path+"p7.webp", img:refiners_path+"7.webp", bonus:false , buff: refinerBuffs[6]},
    {name: "Guin", salary: 1500, portrait:refiners_path+"p8.webp", img:refiners_path+"8.webp", bonus:false , buff: refinerBuffs[7]},
    {name: "Luna", salary: 2500, portrait:refiners_path+"p9.webp", img:refiners_path+"9.webp", bonus:refinerBonus[8] , buff: refinerBuffs[8]},
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



