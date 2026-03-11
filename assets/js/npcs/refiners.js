const refiners_path = npc_town_path+"Refiners/"
const refiners_bonus = npc_town_path+"Refiners/Bonus/"
var refinerBuffs = [
    {idx:0 ,description: "+15% dungeon mats, +20% random mats"},
    {idx:1 ,description: "+25% dungeon mats after run"},
    {idx:2 ,description: "+20% dungeon mats, +15% random mats"},
    {idx:3 ,description: "+12% enemy spawn rate", bonus: 0.12},
    {idx:4 ,description: "+30% random mats"},
    {idx:5 ,description: "+20% dungeon mats, 25% random"},
    {idx:6 ,description: "+20% chance for mob to drop 2 mats"},
    {idx:7 ,description: "15% chance to double mats after run"},
    {idx:8 ,description: "+20% enemy spawn rate", bonus: 0.2},
];
var refinerBonus = [
    {idx:0, path:refiners_bonus+"1.webm"},
    {idx:1, path:refiners_bonus+"2.webm"},
    {idx:2, path:refiners_bonus+"3.webm"},
    {idx:3, path:refiners_bonus+"4.webm"},
    {idx:4, path:refiners_bonus+"5.webm"},
    {idx:5, path:refiners_bonus+"6-1.webm"},
    {idx:6, path:refiners_bonus+"7.webm"},
    {idx:7, path:refiners_bonus+"8.webm"},
    {idx:8, path:refiners_bonus+"9.webm"},
]
var refiners = [
    {name: "Lira", salary: 500, portrait:refiners_path+"p1.webp", img:refiners_path+"1.webp", bonus:refinerBonus[0] , buff: refinerBuffs[0]},
    {name: "Aria", salary: 550, portrait:refiners_path+"p2.webp", img:refiners_path+"2.webp", bonus:refinerBonus[1] , buff: refinerBuffs[1]},
    {name: "Kaela", salary: 575, portrait:refiners_path+"p3.webp", img:refiners_path+"3.webp", bonus:refinerBonus[2] , buff: refinerBuffs[2]},
    {name: "Mira", salary: 850, portrait:refiners_path+"p4.webp", img:refiners_path+"4.webp", bonus:refinerBonus[3] , buff: refinerBuffs[3]},
    {name: "Selene", salary: 900, portrait:refiners_path+"p5.webp", img:refiners_path+"5.webp", bonus:refinerBonus[4] , buff: refinerBuffs[4]},
    {name: "Talia", salary: 950, portrait:refiners_path+"p6.webp", img:refiners_path+"6.webp", bonus:refinerBonus[5] , buff: refinerBuffs[5]},
    {name: "Lilia", salary: 1200, portrait:refiners_path+"p7.webp", img:refiners_path+"7.webp", bonus:refinerBonus[6] , buff: refinerBuffs[6]},
    {name: "Guin", salary: 1700, portrait:refiners_path+"p8.webp", img:refiners_path+"8.webp", bonus:refinerBonus[7] , buff: refinerBuffs[7]},
    {name: "Luna", salary: 2700, portrait:refiners_path+"p9.webp", img:refiners_path+"9.webp", bonus:refinerBonus[8] , buff: refinerBuffs[8]},
];

var activeRefinerIndex;
var activeRefiner;
var refinerHireRun;
var refinerPaidRun = 0;
var nextPayableRun = 0;
function isRefinerPayable(){
    if(activeRefiner)
        return soul.gold >= activeRefiner.salary;
}
function resetRefiner(){
    if(activeRefiner){
        nextPayableRun = refinerHireRun;
        if(currentRun == refinerHireRun){nextPayableRun+= 5;}
        if ((currentRun - refinerHireRun) % 5 == 0){//pay every 5 runs, this should be equiv to refinerPaidRun
            if(!isRefinerPayable()){
                //end contract
                activeRefiner = null;
                refinerHireRun = 0;
                refinerPaidRun = 0;
                nextPayableRun = 0;
                $("#refinerBuffIcon").addClass('d-none');
                $('#refinerPaymentInfo').text('')
                // $('#background.storage').css({"background-image": 'url("../img/Backgrounds/storage.webp")'});
                // $('#background.storage').removeAttr("refinerImage");

            }else{
                refinerPaidRun = currentRun;
                nextPayableRun = currentRun + 5;
                soul.gold -= activeRefiner.salary;
                soul.updateGold(soul.gold);
            }
        }
        $('#refinerPaymentInfo').text(`Pay refiner ${activeRefiner.salary} on run ${nextPayableRun}`)
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
function refinerMobSpawnBuff(){
    if(activeRefiner){
        let buffIdx = activeRefiner.buff.idx; 
        if(buffIdx == 3 || buffIdx == 8){
            return activeRefiner.buff.bonus;
        }
    }
    return 0;
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
                    refinerHireRun,
                    refinerPaidRun,
                    nextPayableRun
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
                    refinerHireRun,
                    refinerPaidRun,
                    nextPayableRun
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
function applyRefinerBonus(){
    let dungeonSpecies = currentDungeon.species;
    if (["slimes","goblins","kobolds","zombies","skeletons","ghosts"].includes(dungeonSpecies)) {
        dungeonSpecies = "generic";
    }
    let matAmt = collectedMats.length;
    let bonusDmats = 0;
    let bonusRmats = 0;
    if(matAmt > 0){
        switch(activeRefiner.buff.idx){
            // "+15% dungeon mats, +20% random mats"
            case 0:
                bonusDmats = Math.round(matAmt * 0.15);
                bonusRmats = Math.round(matAmt * 0.2);
                addRefinerMats(bonusDmats,"dungeon");
                addRefinerMats(bonusRmats);
                break;
            // "+25% dungeon mats after run"
            case 1:
                bonusDmats = Math.round(matAmt * 0.15);
                addRefinerMats(bonusDmats,"dungeon");
                break;
            // "+20% dungeon mats, +15% random mats"
            case 2:
                bonusDmats = Math.round(matAmt * 0.2);
                bonusRmats = Math.round(matAmt * 0.15);
                addRefinerMats(bonusDmats,"dungeon");
                addRefinerMats(bonusRmats);
                break;
            // "+15% enemy spawn rate", bonus: 0.07
            // "+30% random mats"
            case 4:
                bonusRmats = Math.round(matAmt * 0.3);
                addRefinerMats(bonusRmats);
                break;
            // "+20% dungeon mats, 25% random"
            case 5:
                bonusDmats = Math.round(matAmt * 0.2);
                bonusRmats = Math.round(matAmt * 0.25);
                addRefinerMats(bonusDmats,"dungeon");
                addRefinerMats(bonusRmats);
                break;
            // "+20% chance for mob to drop 2 mats"
            // "15% chance to double mats after run"
            case 7:
                if(Math.random() <= 0.15){
                    addRefinerMats(matAmt,"dungeon");
                }                
                break;
            // "+20% enemy spawn rate", bonus: 0.1
        }
    }
}
function addRefinerMats(amt,src){
    let matsrc = materialList;
    if(src == "dungeon"){
        matsrc = materialList.filter(m => m.mob === dungeonSpecies);
    }
    if(amt > 0){
        for(let i = 0; i < amt; i++){
            let mat = matsrc[Math.floor(Math.random() * matsrc.length)];
            bag.push(mat.id);
        }
    }
}


