


// IndexedDB setup
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("RPGSlop", 13);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("Soul")) {
                db.createObjectStore("Soul", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("Inventory")) {
                db.createObjectStore("Inventory", { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains("Bag")) {
                db.createObjectStore("Bag", { keyPath: "id" }); 
            }
            if (!db.objectStoreNames.contains("RefinerState")) {
                db.createObjectStore("RefinerState", { keyPath: "id" }); 
            }
            if (!db.objectStoreNames.contains("Maidens")) {
                db.createObjectStore("Maidens", { keyPath: "id" }); 
            }
            if (!db.objectStoreNames.contains("Dungeon")) {
                db.createObjectStore("Dungeon", { keyPath: "id" });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}


async function initSoul() {

    return new Promise((resolve, reject) => {
        const tx = db.transaction("Soul", "readwrite");
        const store = tx.objectStore("Soul");
        const getRequest = store.get(1); // single Soul record with id=1

        getRequest.onsuccess = () => {
            let soulData = getRequest.result;

            if (soulData) {
                console.log("Soul found in DB:", soulData);
                $('#classSelection').remove();
                const existingSoul = new Soul(soulData, soulData.classAbilityIdx);
                resolve(existingSoul);
            }else{
                $('#classSelection').removeClass('d-none');
                resolve(null)
            }
            
        };
        getRequest.onerror = () => reject(getRequest.error);
    });
}
async function createSoul(classIdx){
    return new Promise((resolve, reject) => {
        const tx = db.transaction("Soul", "readwrite");
        const store = tx.objectStore("Soul");
        const getRequest = store.get(1); // single Soul record with id=1

        getRequest.onsuccess = () => {
            let soulData = getRequest.result;

            if (!soulData) {
                console.log("No Soul found, creating new one...");
                
                const newSoul = new Soul({ atk: 5, spd: 0, def: 0, hp: 5, availableStats: 15 },classIdx);
                const putRequest = store.put({ id: 1, ...newSoul });

                putRequest.onsuccess = () => {
                    console.log("New Soul saved to IndexedDB");
                    $('#classSelection').removeClass('d-none');
                    resolve(newSoul);
                };
                putRequest.onerror = () => reject(putRequest.error);
            } else {
                console.log("Soul found in DB:", soulData);
                const existingSoul = new Soul(soulData);
                resolve(existingSoul);
            }
            $('#male').addClass('active');
            $('#prevClass').attr('idx',classList.length - 1)
        };
        getRequest.onerror = () => reject(getRequest.error);
    });
}
async function initInventory() {

    return new Promise((resolve, reject) => {
        const tx = db.transaction("Inventory", "readwrite");
        const store = tx.objectStore("Inventory");

        const getAllRequest = store.getAll(); // get all records

        getAllRequest.onsuccess = async () => {
            let inventoryData = getAllRequest.result;

            if (!inventoryData || inventoryData.length === 0) {
                console.log("No equipment found, creating new starter set...");

                // create beginner weapon
                let weaponId = 0;
                switch(soul.getClassName()){
                    case "Warden": weaponId = 0; break;
                    case "Ravager": weaponId = 1; break;
                    case "Sentinel": weaponId = 2; break;
                    case "Severant": weaponId = 3; break;
                    case "Bladewind": weaponId = 4; break;
                    case "Overlord": weaponId = 5; break;
                    case "Shade": weaponId = 6; break;
                    case "Vanguard": weaponId = 7; break;
                }
                await createEquipment(db, { eqp_type: "weapon", eqp_id: weaponId, tier: "F", max_tier: "F" },true);
                // create beginner armor (helmet, breastplate, gloves, greaves)
                await createEquipment(db, { eqp_type: "armor", eqp_id: 0, tier: "G", max_tier: "G" }, true);
                await createEquipment(db, { eqp_type: "armor", eqp_id: 1, tier: "G", max_tier: "G" }, true);
                await createEquipment(db, { eqp_type: "armor", eqp_id: 2, tier: "G", max_tier: "G" }, true);
                await createEquipment(db, { eqp_type: "armor", eqp_id: 3, tier: "G", max_tier: "G" }, true);
                /* //create fallen equipment
                await createEquipment(db, { eqp_type: "armor", eqp_id: 4, tier: "F", max_tier: "SR" }, false);
                await createEquipment(db, { eqp_type: "armor", eqp_id: 5, tier: "F", max_tier: "SR" }, false);
                await createEquipment(db, { eqp_type: "armor", eqp_id: 6, tier: "F", max_tier: "SR" }, false);
                await createEquipment(db, { eqp_type: "armor", eqp_id: 7, tier: "F", max_tier: "SR" }, false);
                await createEquipment(db, { eqp_type: "armor", eqp_id: 8, tier: "F", max_tier: "SR" }, false); */
                
                resolve("Starter equipment created");
            } else {
                console.log("Equipment found in DB");
                // assign to your global inventory variable
                
                // inventory = inventoryData.map(obj => Object.assign(new Equipment(obj), obj));
                inventoryData.forEach(eqp => {
                    let newEqp = new Equipment({eqp_type:eqp.eqp_type, eqp_id:eqp.eqp_id, tier:eqp.tier, max_tier:eqp.max_tier})
                    newEqp.id = eqp.id;
                    newEqp.eqp_type = eqp.eqp_type;
                    newEqp.eqp_id = eqp.eqp_id;
                    newEqp.tier = eqp.tier;
                    newEqp.max_tier = eqp.max_tier;
                    newEqp.slot = eqp.slot;
                    newEqp.atk = eqp.atk;
                    newEqp.atk_buff = eqp.atk_buff;
                    newEqp.final_atk = eqp.final_atk;
                    newEqp.dmg = eqp.dmg;
                    newEqp.spd = eqp.spd;
                    newEqp.spd_buff = eqp.spd_buff;
                    newEqp.final_spd = eqp.final_spd;
                    newEqp.atkspd = eqp.atkspd;
                    newEqp.def = eqp.def;
                    newEqp.def_buff = eqp.def_buff;
                    newEqp.final_def = eqp.final_def;
                    newEqp.hp = eqp.hp;
                    newEqp.hp_buff = eqp.hp_buff;
                    newEqp.final_hp = eqp.final_hp;
                    newEqp.hpPoints = eqp.hpPoints;
                    newEqp.form_change_1 = eqp.form_change_1;
                    newEqp.form_change_2 = eqp.form_change_2;
                    newEqp.aura_1 = eqp.aura_1;
                    newEqp.aura_2 = eqp.aura_2;
                    newEqp.special_effect = eqp.special_effect;
                    newEqp.enhancement = eqp.enhancement;
                    newEqp.enchantment = eqp.enchantment;
                    newEqp.affix = eqp.affix,
                    newEqp.suffix = eqp.suffix;
                    newEqp.isEquipped = eqp.isEquipped;
                    newEqp.value = eqp.value;
                    inventory.push(newEqp);
                });
                resolve(inventoryData);
            }
            initLoadOut();
        };

        getAllRequest.onerror = () => reject(getAllRequest.error);
    });
}
async function initDungeon(){
    return new Promise((resolve, reject) => {
        const tx = db.transaction("Dungeon", "readwrite");
        const store = tx.objectStore("Dungeon");

        const getRequest = store.get(1);

        getRequest.onsuccess = async () => {
            let dungeonState = getRequest.result;

            if (!dungeonState) {
                dungeonState = {
                    id: 1,
                    dungeons: {
                        slimes: { species: "slimes", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.04 },
                        goblins: { species: "goblins", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.05 },
                        kobolds: { species: "kobolds", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.05 },
                        zombies: { species: "zombies", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.05 },
                        skeletons: { species: "skeletons", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.05 },
                        ghosts: { species: "ghosts", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.05 },
                        arachne: { species: "arachne", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.06 },
                        cultists: { species: "cultists", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.06 },
                        fallen: { species: "fallen", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.06 },
                        demons: { species: "demons", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.07 },
                        angels: { species: "angels", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.07 },
                        abyss: { species: "abyss", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.08 },
                    },
                    currentRun: 0,
                };
                dungeons = dungeonState.dungeons;
                currentRun = 0;
                await new Promise(resolve => {
                    const req = store.add(dungeonState);
                    req.onsuccess = e => resolve(e.target.result);
                });
                resolve("Dungeon State created");
            } else {
                dungeons = dungeonState.dungeons;
                currentRun = dungeonState.currentRun;
                $('#runCount').text(`Run ${currentRun}`)
                resolve("Dungeon State fetched");
            }
            let midDungeonsUnlocked = null;
            let lateDungeonsUnlocked = null;
            let lastDungeonsUnlocked = null;
            easyDungeons.forEach(item =>{
                let current = dungeons[item.toLowerCase()];
                if(current.maxFloor >= 10){
                    if(midDungeonsUnlocked === null){
                        midDungeonsUnlocked = true;
                    }else{
                        midDungeonsUnlocked &= true;
                    }
                }
            });
            midDungeons.forEach(item =>{
                let current = dungeons[item.toLowerCase()];
                if(current && current.maxFloor >= 10){
                    if(lateDungeonsUnlocked === null){
                        lateDungeonsUnlocked = true;
                    }else{
                        lateDungeonsUnlocked &= true;
                    }
                }
            });
            lateDungeons.forEach(item =>{
                let current = dungeons[item.toLowerCase()];
                if(current.maxFloor >= 10){
                    if(lateDungeonsUnlocked === null){
                        lastDungeonsUnlocked = true;
                    }else{
                        lateDungeonsUnlocked &= true;
                    }
                }
            });
            if(lateDungeonsUnlocked){
                $('.map-menu-btn[scope="late"]').removeAttr('disabled');
            }
            if(lastDungeonsUnlocked){
                $('.map-menu-btn[scope="last"]').removeAttr('disabled');
            }
            
            
        };

        getRequest.onerror = () => reject(getRequest.error);
    });
}
async function initRefiner() {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("RefinerState", "readwrite");
        const store = tx.objectStore("RefinerState");

        const getRequest = store.get(1); // always look for id=1

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
                console.log("Refiner found in DB");
                activeRefinerIndex = refinerState.activeRefinerIndex;
                activeRefiner = refinerState.activeRefiner;
                refinerHireRun = refinerState.refinerHireRun;
                refinerPaidRun = refinerState.refinerPaidRun,
                nextPayableRun = refinerState.nextPayableRun;
                if(!activeRefiner){
                    $("#refinerBuffIcon").addClass('d-none');
                    $('#refinerPaymentInfo').text('');
                    $('#refinerHireRun').text('');
                    $('#buffEffectDisplay').text('');
                }else{
                    $("#refinerBuffIcon").removeClass('d-none');
                    $('#refinerPaymentInfo').text(`Pay refiner ${activeRefiner.salary} on run ${nextPayableRun}`);
                    $('#refinerHireRun').text(refinerHireRun);
                    $('#buffEffectDisplay').text(activeRefiner.buff.description);
                }
                resolve(refinerState);
            }
        };

        getRequest.onerror = () => reject(getRequest.error);
    });
}
async function initBag() {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("Bag", "readwrite");
        const store = tx.objectStore("Bag");

        const getRequest = store.get(1); // always look for id=1

        getRequest.onsuccess = async () => {
            let db_bag = getRequest.result;

            if (!db_bag) {
                console.log("No bag found, creating empty bag...");
                db_bag = {
                    id: 1,
                    items: []
                };
                await new Promise(resolve => {
                    const req = store.add(db_bag);
                    req.onsuccess = e => resolve(e.target.result);
                });
                resolve("Bag created");
            } else {
                console.log("Bag found in DB");
                bag = db_bag.items
                resolve(db_bag);
            }
        };

        getRequest.onerror = () => reject(getRequest.error);
    });
}
async function initMaidens() {

    return new Promise((resolve, reject) => {
        const tx = db.transaction("Maidens", "readwrite");
        const store = tx.objectStore("Maidens");
        const getRequest = store.get(1); // single Soul record with id=1
        getRequest.onsuccess = () => {
            let maidendata = getRequest.result;

            if (!maidendata) {
                console.log("No maidens found, creating new one...");
                const putRequest = store.put({ id: 1, 
                    unlockedMaidens:unlockedMaidens, 
                    maidenQ1Complete:false,
                    maidenQ2Complete:false,
                });

                putRequest.onsuccess = () => {
                    console.log("New maidens saved to IndexedDB");
                    resolve(unlockedMaidens);
                };
                putRequest.onerror = () => reject(putRequest.error);
            } else {
                console.log("Maidens found in DB:");
                unlockedMaidens = maidendata.unlockedMaidens;
                maidenQ1Complete = maidendata.maidenQ1Complete;
                maidenQ2Complete = maidendata.maidenQ2Complete;
                resolve(unlockedMaidens);
            }
        };
        getRequest.onerror = () => reject(getRequest.error);
    });
}
async function initScreens(){
    let vids = ["Reaper","Dravenna","Bladewind"];
    let bgindex = Math.round(Math.random() * (vids.length-1));
    let loadbg = `assets/vid/${vids[bgindex]}_idle.webm`;
    let splashvideo = $('#splashVid')[0];
    $(splashvideo).find('source').remove(); // clear old sources
    $(splashvideo).append(`<source src="${loadbg}" type="video/webm">`);
    splashvideo.load();
    // $('#fakeLoad').removeClass('d-none');
    let $loadbar = $('#fakeBarProgress');
    $loadbar.on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', () => {$('#startGameBtn').removeClass('invisible').addClass('pulse')});
    $('#male').addClass('active');
    $('#prevClass').attr('idx',classList.length - 1);
}
async function initSoulDependent(){
    setGold();
    populateStatMenu();
    await initRefiner();
    populateRefinerMenu();
    await initInventory();
}

$(document).ready(async function(){
    //db
    db = await openDB();
    
    initScreens();
    await initBag();
    await initMaidens();
    await initDungeon();
    initTown();
    
    initStars();
    generateMaidens();
    soul = await initSoul();
    if(soul){
        initSoulDependent();
    }
    
    //UI
    
    
    
})


