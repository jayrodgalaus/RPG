var inventory = []; // equipment
var weapons = [];
var armor = [];
var loadOuttotalAtk = 0;
var loadOuttotalSpd = 0;
var loadOuttotalDef = 0;
var loadOuttotalHP = 0;
var forgeCosts = {"G":50,"F":120,"E":2500,"D":550,"C":1200,"B":2500,"A":5750,"S":11500,"SR":20000};

async function createEquipment(db, stats, isBeginner = false) {
    const tx = db.transaction("Inventory", "readwrite");
    const store = tx.objectStore("Inventory");

    const equipment = new Equipment(stats);
    equipment.isEquipped = isBeginner;
    const id = await new Promise(resolve => {
        const req = store.add(equipment);
        req.onsuccess = e => resolve(e.target.result);
    });

    equipment.id = id;
    inventory.push(equipment)
    return equipment;
}
async function updateInventory() {
    const tx = db.transaction("Inventory", "readwrite");
    const store = tx.objectStore("Inventory");

    const plainInventory = inventory.map(eqp => ({
        id: eqp.id,
        eqp_type: eqp.eqp_type,
        eqp_id: eqp.eqp_id,
        tier: eqp.tier,
        max_tier: eqp.max_tier,
        slot: eqp.slot,
        atk: eqp.atk,
        atk_buff: eqp.atk_buff,
        final_atk: eqp.final_atk,
        dmg: eqp.dmg,
        spd: eqp.spd,
        spd_buff: eqp.spd_buff,
        final_spd: eqp.final_spd,
        atkspd: eqp.atkspd,
        def: eqp.def,
        def_buff: eqp.def_buff,
        final_def: eqp.final_def,
        hp: eqp.hp,
        hp_buff: eqp.hp_buff,
        final_hp: eqp.final_hp,
        hpPoints: eqp.hpPoints,
        form_change_1: eqp.form_change_1,
        form_change_2: eqp.form_change_2,
        aura_1: eqp.aura_1,
        aura_2: eqp.aura_2,
        special_effect: eqp.special_effect,
        enhancement: eqp.enhancement,
        suffix: eqp.suffix,
        isEquipped: eqp.isEquipped,
        value: eqp.value
    }));

    // Save each equipment object individually
    plainInventory.forEach(obj => store.put(obj));

    tx.oncomplete = () => console.log("inventory updated in IndexedDB");
    tx.onerror = () => console.error("Failed to update inventory in IndexedDB");
}

function initLoadOut() {
    // Loop through all equipment in the global inventory
    inventory.forEach(equipment => {
        if (equipment.isEquipped) {
            //Equipment UI
            loadOut.push(equipment);
            let slot = equipment.slot;
            let idx = inventory.findIndex(eqp => eqp.id === equipment.id);
            $('#inventorySlot' + slot).attr('isEmpty', false).attr('eqpId',equipment.id);
            $('#inventorySlot' + slot).attr('inventoryIndex', idx);
            $('#inventorySlot' + slot).css('background-image', `url(${equipment.eqp.img})`);
            $('#inventorySlot' + slot).attr("style",`background-image: url('${equipment.eqp.img}')`);
            $('#here').css('background-image', `url(${equipment.eqp.img})`);
            $('#inventorySlot' + slot + " .eqp-tier").text(equipment.tier);
            $('#inventorySlot' + slot + " .eqp-enhancements").text("+"+equipment.enhancement);
            
        }
    });
    ({loadOuttotalAtk, loadOuttotalSpd, loadOuttotalDef, loadOuttotalHP} = calcLoadOutStats());
    calcTotalStats();
}

function previewEqp(equipment){
    $("#eqpPreviewPanel").css('background-image', `url('${equipment.eqp.img}')`);
    $('#eqpPreviewName').text(equipment.displayName);
    $('#previewEqpEnhancements').text(equipment.enhancement);
    $('#previewEqpTier').text(equipment.tier);
    $("#eqpPreviewATK").text(equipment.final_atk)
    $("#eqpPreviewSPD").text(equipment.final_spd)
    $("#eqpPreviewDEF").text(equipment.final_def)
    $("#eqpPreviewHP").text(equipment.final_hp)
    $("#eqpPreviewEnhancements").text(equipment.enhancement)
    $("#eqpPreviewTier").text(equipment.tier)
    $("#eqpPreviewATKBuff").text(equipment.atk_buff)
    $("#eqpPreviewSPDBuff").text(equipment.spd_buff)
    $("#eqpPreviewDEFBuff").text(equipment.def_buff)
    $("#eqpPreviewHPBuff").text(equipment.hp_buff)
    $("#eqpPreviewMaxTier").text(equipment.max_tier)
    $("#eqpPreviewValue").text(equipment.value)
    $("#eqpPreviewEffects").text(equipment.special_effect ? equipment.special_effect : "None")
    let equipAction = equipment.isEquipped ? "unequip" : "equip";
    $("#toggleEquip").text(equipAction.charAt(0).toUpperCase()+ equipAction.slice(1)).attr('action', equipAction).show();
    
}

function calcLoadOutStats(){
    let loadOutAtk = 0;
    let loadOutSpd = 0;
    let loadOutDef = 0;
    let loadOutHP = 0;

    loadOut.forEach(equipment => {
        loadOutAtk += equipment.final_atk || 0;
        loadOutSpd += equipment.final_spd || 0;
        loadOutDef += equipment.final_def || 0;
        loadOutHP += equipment.final_hp || 0;
        
    });
    loadOuttotalAtk = loadOutAtk;
    loadOuttotalSpd = loadOutSpd;
    loadOuttotalDef = loadOutDef;
    loadOuttotalHP = loadOutHP;
    
    loadOuttotalASpd = loadOuttotalSpd >= 430 ? 0.14 : 1 - (loadOuttotalSpd * 0.002);
    loadOuttotalHPPoints = loadOuttotalHP * 5;
    $("#loadOuttotalAtk").text(loadOuttotalAtk);
    $("#loadOuttotalSpd").text(loadOuttotalSpd);
    $("#loadOuttotalDef").text(loadOuttotalDef);
    $("#loadOuttotalHP").text(loadOuttotalHP);
    return {loadOuttotalAtk, loadOuttotalSpd, loadOuttotalDef, loadOuttotalHP};
}

function initStars(stars = 0, maxstars = 10){
    let html = '';
    let i = 0, j = 0;
    let empty = maxstars - stars;
    while(i < stars){
        html += `<i class="fa-solid fa-star"></i>`;
        i++;
    }
    while(j < empty){
        html += `<i class="fa-regular fa-star"></i>`;
        j++;
    }
    $('#forgeStars').html(html);
}
function populateEqpList(screen){
    let loadOutHTML = '', weaponsHTML = '', armorHTML = '';
    console.log(inventory);
    console.log(inventory[0].eqp.category); //returns weapon
    inventory.forEach(item => {
        if(item.eqp.category == "weapon"){weapons.push(item)}
        else{armor.push(item)}
    });
    // weapons = inventory.filter(w => w.eqp.category == "weapon");
    // armor = inventory.filter(a => a.eqp.category == "armor");
    console.log(weapons, armor);
    loadOut.forEach((item, idx) => {
        loadOutHTML += `<button type="button" class="list-group-item list-group-item-action list-group-item-light ${screen}-eqp-btn" idx=${idx} array="loadout">${item.displayName}(${item.tier}+<span class="forge-item-enhancements">${item.enhancement}</span>)</button>`
    });
    weapons.forEach((item, idx) => {
        weaponsHTML += `<button type="button" class="list-group-item list-group-item-action list-group-item-light ${screen}-eqp-btn" idx=${idx} array="weapons">${item.displayName}(${item.tier}+<span class="forge-item-enhancements">${item.enhancement}</span>)</button>`
    });
    armor.forEach((item, idx) => {
        armorHTML += `<button type="button" class="list-group-item list-group-item-action list-group-item-light ${screen}-eqp-btn" idx=${idx} array="armor">${item.displayName}(${item.tier}+<span class="forge-item-enhancements">${item.enhancement}</span>)</button>`
    });

    $('#f-equipped-tab-pane>.list-group').html(loadOutHTML);
    $('#f-weapons-tab-pane>.list-group').html(weaponsHTML);
    $('#f-armor-tab-pane>.list-group').html(armorHTML);
    //reset forge menu
    resetForge();
}
function resetForge(){
    $('#forgeEqpPreview').removeAttr('css');
    $('#forgeCurrentEnhance').text(0);
    $('#enhanceBtn').attr('index',"-1").removeAttr("array").removeAttr('disabled');
    $('#forgeCost').text(0);
    $('#forgeCost').removeClass('text-danger')
    initStars()
}