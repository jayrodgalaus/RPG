var inventory = []; // equipment
var weapons = [];
var armor = [];
var loadOuttotalAtk = 0;
var loadOuttotalSpd = 0;
var loadOuttotalDef = 0;
var loadOuttotalHP = 0;
var forgeCosts = {"G":100,"F":150,"E":250,"D":550,"C":1200,"B":2500,"A":5750,"S":11500,"SR":20000};
var enchantCosts = {"G":100,"F":500,"E":1500,"D":3000,"C":6000,"B":9000,"A":12000,"S":18000,"SR":25000};

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
    store.clear();
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
        displayName: eqp.displayName,
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
        enchantment: eqp.enchantment,
        affix: eqp.affix,
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
    loadOut = [];
    // Loop through all equipment in the global inventory
    inventory.forEach(equipment => {
        if (equipment.isEquipped) {
            //Equipment UI
            loadOut.push(equipment);
            let slot = equipment.slot;
            let idx = inventory.findIndex(eqp => eqp.id === equipment.id);
            $('#inventorySlot' + slot).attr('isEmpty', false).attr('eqpId',equipment.id);
            $('#inventorySlot' + slot).attr('inventoryIndex', idx);
            $('#inventorySlot' + slot).css('background-image', `url(${equipment.img})`);
            $('#inventorySlot' + slot).attr("style",`background-image: url('${equipment.img}')`);
            $('#inventorySlot' + slot + " .eqp-tier").text(equipment.tier);
            $('#inventorySlot' + slot + " .eqp-enhancements").text("+"+equipment.enhancement);
            
        }
    });
    ({loadOuttotalAtk, loadOuttotalSpd, loadOuttotalDef, loadOuttotalHP} = calcLoadOutStats());
    calcTotalStats();
}

function previewEqp(equipment, eqplist = false){
    let equipAction = equipment.isEquipped ? "unequip" : "equip";
    if(!eqplist){
        $("#eqpPreviewPanel").css('background-image', `url('${equipment.img}')`);
        $('#eqpPreviewName').text(equipment.displayName);
        $('#previewEqpEnhancements').text(equipment.enhancement);
        $('#previewEqpTier').text(equipment.tier);
        $("#eqpPreviewATK").text(equipment.final_atk)
        $("#eqpPreviewSPD").text(equipment.final_spd)
        $("#eqpPreviewDEF").text(equipment.final_def)
        $("#eqpPreviewHP").text(equipment.final_hp)
        $("#eqpPreviewEnhancements").text(equipment.enhancement)
        $("#eqpPreviewEnchantments").text(equipment.enchantment)
        $("#eqpPreviewTier").text(equipment.tier)
        $("#eqpPreviewATKBuff").text(equipment.atk_buff)
        $("#eqpPreviewSPDBuff").text(equipment.spd_buff)
        $("#eqpPreviewDEFBuff").text(equipment.def_buff)
        $("#eqpPreviewHPBuff").text(equipment.hp_buff)
        $("#eqpPreviewMaxTier").text(equipment.max_tier)
        $("#eqpPreviewValue").text(equipment.value)
        $("#eqpPreviewEffects").text(equipment.special_effect ? equipment.special_effect : "None")
        
        $("#toggleEquip").text(equipAction.charAt(0).toUpperCase()+ equipAction.slice(1)).attr('action', equipAction).show();
    }else{
        $("#eqpListPreview").css('background-image', `url('${equipment.img}')`);
        $('#eqpName').text(equipment.displayName);
        $('#preEnhancements').text(equipment.enhancement);
        $('#preTier').text(equipment.tier);
        $("#eqpATK").text(equipment.final_atk)
        $("#eqpSPD").text(equipment.final_spd)
        $("#eqpDEF").text(equipment.final_def)
        $("#eqpHP").text(equipment.final_hp)
        $("#eqpEnhancements").text(equipment.enhancement)
        $("#eqpEnchantments").text(equipment.enchantment)
        $("#eqpTier").text(equipment.tier)
        $("#eqpATKBuff").text(equipment.atk_buff)
        $("#eqpSPDBuff").text(equipment.spd_buff)
        $("#eqpDEFBuff").text(equipment.def_buff)
        $("#eqpHPBuff").text(equipment.hp_buff)
        $("#eqpMaxTier").text(equipment.max_tier)
        $("#eqpValue").text(equipment.value)
        $("#eqpEffects").text(equipment.special_effect ? equipment.special_effect : "None")
        $("#eqpListInfo, #eqpListPreview").removeClass('d-none')
        $("#eqpToggleEquip").text(equipAction.charAt(0).toUpperCase()+ equipAction.slice(1)).attr('action', equipAction).show();
    }
    
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

function initStars(stars = 0, maxstars = 0){
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
    $('#enchantStars').html(html);
}
function organizeInventory(){
    weapons = [];
    armor = [];
    inventory.forEach(item => {
        item.affix = item.setAffix();
        // item.displayName = item.affix+" "+item.eqp.mob+" "+item.eqp.type.type;
        if(item.eqp.category == "weapon"){weapons.push(item)}
        else{armor.push(item)}
    });
}
function populateEqpList(screen){
    let loadOutHTML = '', weaponsHTML = '', armorHTML = '';
    organizeInventory();
    let modifierText = '';
    
    // weapons = inventory.filter(w => w.eqp.category == "weapon");
    // armor = inventory.filter(a => a.eqp.category == "armor");
    loadOut.forEach((item, idx) => {
        if(screen == 'forge') modifierText = `<span class="forge-item-enhancements">${item.enhancement}</span>`;
        else if(screen == 'tower') modifierText = `<span class="tower-item-enchantments">${item.enchantment}<i class="fa-solid fa-star"></i></span>`;
        loadOutHTML += `<button type="button" class="list-group-item list-group-item-action list-group-item-light ${screen}-eqp-btn" idx=${idx} array="loadout">
            ${item.displayName}(<span class="equipped-item-tier">${item.tier}</span>+${modifierText})
            </button>`
    });
    weapons.forEach((item, idx) => {
        if(screen == 'forge') modifierText = `<span class="forge-item-enhancements">${item.enhancement}</span>`;
        else if(screen == 'tower') modifierText = `<span class="tower-item-enchantments">${item.enchantment}<i class="fa-solid fa-star"></i></span>`;
        weaponsHTML += `<button type="button" class="list-group-item list-group-item-action list-group-item-light ${screen}-eqp-btn" idx=${idx} array="weapons">${item.displayName}(${item.tier}+${modifierText})</button>`
    });
    armor.forEach((item, idx) => {
        if(screen == 'forge') modifierText = `<span class="forge-item-enhancements">${item.enhancement}</span>`;
        else if(screen == 'tower') modifierText = `<span class="tower-item-enchantments">${item.enchantment}<i class="fa-solid fa-star"></i></span>`;
        armorHTML += `<button type="button" class="list-group-item list-group-item-action list-group-item-light ${screen}-eqp-btn" idx=${idx} array="armor">${item.displayName}(${item.tier}+${modifierText})</button>`
    });
    if(screen == "forge"){
        $('#f-equipped-tab-pane>.list-group').html(loadOutHTML);
        $('#f-weapons-tab-pane>.list-group').html(weaponsHTML);
        $('#f-armor-tab-pane>.list-group').html(armorHTML);
        //reset forge menu
        resetForge();
    }else if(screen == "tower"){
        $('#e-equipped-tab-pane>.list-group').html(loadOutHTML);
        $('#e-weapons-tab-pane>.list-group').html(weaponsHTML);
        $('#e-armor-tab-pane>.list-group').html(armorHTML);
        //reset forge menu
        resetTower();
    }
}
function populateInvEqpList(array){
    
    organizeInventory();
    let src = array == 'weapons' ? weapons : armor;
    let weaponsHTML = '';
    let modifierText = '';
    src.forEach((item, idx) => {
        let color = item.tier;
        modifierText = `<span>${item.enhancement}</span>`;
        weaponsHTML += `<button type="button" class="list-group-item list-group-item-action list-group-item-light text-${color} eqp-list-btn" eqpId=${item.id} idx=${idx} array="${array}">
            <div class="w-100 d-flex align-items-center">
                ${item.displayName}(${item.tier}+${modifierText})
                <div class="ms-auto e-indicator ${item.isEquipped ? '':'invisible'}"></div>
            </div>
        </button>`
    });
    $('#eqpList').html(weaponsHTML);
}
function resetForge(){
    $('#forgeEqpPreview').removeAttr('style');
    $('#forgeCurrentEnhance').text(0);
    $('#enhanceBtn').attr('index',"-1").removeAttr("array").removeAttr('disabled');
    $('#forgeCost').text(0);
    $('#forgeCost').removeClass('text-danger')
    initStars()
}
function resetTower(){
    $('#enchantEqpPreview').removeAttr('style');
    $('#enchantCurrentEnhance').text(0);
    $('#enchantBtn').attr('index',"-1").removeAttr("array").removeAttr('disabled');
    $('#enchantCost').text(0);
    $('#enchantCost').removeClass('text-danger')
    initStars()

}
async function rollEqpDrop(){
    // base 40% chance; 50% for boss, 60% for apex
    let drop_chance = enemyMob.isApex ? 0.3 : (enemyMob.isBoss ? 0.2 : 0.15);
    let src;
    let eqp_type;
    let eqp;
    let max_tier = "F";
    let F_chance;
    let E_chance;
    let D_chance;
    let C_chance;
    let B_chance;
    let A_chance;
    let S_chance;
    function getMaxTier(roll){
        if(roll <= F_chance) return "F";
        else if(roll <= E_chance) return "E";
        else if(roll <= D_chance) return "D";
        else if(roll <= C_chance) return "C";
        else if(roll <= B_chance) return "B";
        else if(roll <= A_chance) return "A";
        else if(roll <= S_chance) return "S";
        else return "SR"
    }
    if (Math.random() <= (drop_chance)) {

        //weapon or armor
        if(Math.random() >= 0.5){ // weapon
            src = weaponList;
            eqp_type = "weapon";
        }else{ //armor
            src = armorList;
            eqp_type = "armor";
        }
        let filtered = src.filter(w => w.mob == enemyMob.species)
        if(filtered.length > 0){
            let selectedidx = Math.round(Math.random() * (filtered.length - 1));
            let selected = filtered[selectedidx];
            
            let idx = src.indexOf(selected);//need to find index of selected from src
            if(easyDungeons.includes(enemyMob.species)){
                F_chance = 0.5;
                E_chance = F_chance + 0.3;
                D_chance = E_chance + 0.09;
                C_chance = D_chance + 0.05;
                B_chance = C_chance + 0.03;
                A_chance = B_chance + 0.02;
                S_chance = A_chance + 0.01;
                let roll = Math.random();
                max_tier = getMaxTier(roll);
                if(max_tier == "SR") max_tier = "S";

            }else if(midDungeons.includes(enemyMob.species)){
                F_chance = 0.3;
                E_chance = F_chance + 0.44;
                D_chance = E_chance + 0.11;
                C_chance = D_chance + 0.06;
                B_chance = C_chance + 0.04;
                A_chance = B_chance + 0.025;
                S_chance = A_chance + 0.015;
                let roll = Math.random();
                max_tier = getMaxTier(roll);
            }else if(lateDungeons.includes(enemyMob.species)){
                F_chance = 0.1;
                E_chance = F_chance + 0.24;
                D_chance = E_chance + 0.17;
                C_chance = D_chance + 0.12;
                B_chance = C_chance + 0.11;
                A_chance = B_chance + 0.09;
                S_chance = A_chance + 0.075;
                let roll = Math.random();
                max_tier = getMaxTier(roll);
            }else if(lastDungeon.includes(enemyMob.species)){
                F_chance = 0;
                E_chance = 0;
                D_chance = E_chance + 0.26;
                C_chance = D_chance + 0.20;
                B_chance = C_chance + 0.17;
                A_chance = B_chance + 0.15;
                S_chance = A_chance + 0.12;
                let roll = Math.random();
                max_tier = getMaxTier(roll);
            }else{
                console.log("no droppable item: neutral species");
                return null;
            }
            eqp = await createEquipment(db, { eqp_type: eqp_type, eqp_id: idx, tier: "F", max_tier: max_tier });
            console.log("Dropped: ",eqp);
            updateInventory();
            return eqp;
        }else{
            console.log("no droppable item: no equipment for this species:",enemyMob.species);
            return null;
        }
        
        
    }
    return null; // no drop
}