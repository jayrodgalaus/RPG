class Equipment {
    constructor({eqp_type, eqp_id,  tier = "G", max_tier="G"  } = {}) {
        this.id; //in inventory
        this.eqp_type = eqp_type; //weapon or armor
        this.eqp_id = eqp_id; //from weapons table or armor table
        this.eqp = eqp_type == "weapon" ? weaponList[eqp_id] : armorList[eqp_id]; //don't need to save this in DB
        this.slot = this.eqp.type.slot;
        this.atk = 1;
        this.atk_buff = 0;
        this.final_atk = this.atk * (1 + this.atk_buff);
        this.dmg = this.final_atk * 3;
        this.spd = 2;
        this.spd_buff = 0;
        this.final_spd = this.spd * (1 + this.spd_buff);
        this.atkspd = this.spd * (1 + this.spd_buff) >= 430 ? 0.14 : 1 - (this.spd * 0.002);
        this.def = 3;
        this.def_buff = 0;
        this.final_def = this.def * (1 + this.def_buff);
        this.hp = 4;
        this.hp_buff = 0;
        this.final_hp = this.hp * (1 + this.hp_buff);
        this.hpPoints = this.final_hp * 5;
        this.tier = tier;
        this.max_tier = max_tier;
        this.form_change_1 = this.form_change_2 = this.aura_1 = this.aura_2 = false;  
        this.special_effect;
        this.enhancement = 0;
        this.affix = this.setAffix();
        this.suffix;
        this.isEquipped = false;
        this.value = 0;
        this.displayName = this.affix+" "+this.eqp.mob+" "+this.eqp.type.type;
    }
    setAffix() {
        if (this.tier === 'F' || this.tier === 'G') {
            return '';
        }

        // All stats equal
        if ([this.atk, this.spd, this.def, this.hp].every(v => v === this.atk)) {
            return 'Harmonic';
        }

        const stats = [
            { name: "Atk", value: this.atk },
            { name: "Spd", value: this.spd },
            { name: "Def", value: this.def },
            { name: "HP",  value: this.hp }
        ];

        stats.sort((a, b) => b.value - a.value);

        const top1 = stats[0].name;
        const top2 = stats[1].name;

        // Affix mapping with tie cases
        const affixMap = {
            "Atk+Spd": { 
                Atk: "Slayer", 
                Spd: "Duelist", 
                Tie: "Blademaster" 
            },
            "Atk+Def": { 
                Atk: "Crusher", 
                Def: "Warlord", 
                Tie: "Juggernaut" 
            },
            "Atk+HP":  { 
                Atk: "Berserker", 
                HP: "Titan", 
                Tie: "Champion" 
            },
            "Spd+Def": { 
                Spd: "Striker", 
                Def: "Sentinel", 
                Tie: "Guardian" 
            },
            "Spd+HP":  { 
                Spd: "Phantom", 
                HP: "Survivor", 
                Tie: "Shade" 
            },
            "Def+HP":  { 
                Def: "Tank", 
                HP: "Colossus", 
                Tie: "Bulwark" 
            }
        };

        const key = [top1, top2].sort().join("+");

        if (stats[0].value === stats[1].value) {
            return affixMap[key].Tie;
        }

        return affixMap[key][top1];
    }
    enhance() {
        // Collect stats into an array for easier indexing
        let stats = [this.atk, this.spd, this.def, this.hp];
        let atk_chance = this.eqp.type.atk_chance;
        let spd_chance = this.eqp.type.spd_chance;
        let def_chance = this.eqp.type.def_chance;
        let hp_chance = this.eqp.type.hp_chance;
        // Generate random index from 0–3
        const random_stat_index = Math.floor(Math.random() * 4);

        // Generate random increase from 1–5
        const random_stat_increase = Math.floor(Math.random() * 5) + 1;

        
        if(!(this.tier == "G" && this.enhancement == 5) && this.enhancement < 10){
            // Apply enhancement
            stats[random_stat_index] += random_stat_increase;
            // Push updated values back into the object
            [this.atk, this.spd, this.def, this.hp] = stats;
            // Recalculate derived stats 
            this.dmg = this.atk * 3;
            this.atkspd = this.spd >= 430 ? 0.14 : 1 - (this.spd * 0.002);
            this.hpPoints = this.hp * 5;
            this.enhancement += 1;
            //compute item value
        }        
    }
    raiseTier() {
        let stats = [this.atk_buff, this.spd_buff, this.def_buff, this.hp_buff];
        // no stat bonus when tier rises to C and S, no tier raise past max_tier
        if(this.enhancement == 10 && this.tier != this.max_tier){
            if(this.tier != "D" && this.tier != "A"){
                const random_stat_index = Math.floor(Math.random() * 4);
                const random_stat_increase = (Math.floor(Math.random() * 30) + 15)/100;
                // Apply enhancement
                stats[random_stat_index] += random_stat_increase;
                // Push updated values back into the object
                [this.atk_buff, this.spd_buff, this.def_buff, this.hp_buff] = stats;
                switch(random_stat_index){
                    case 0:
                        this.final_atk = this.atk * (1 + this.atk_buff);
                        this.dmg = this.final_atk * 3;
                        break;
                    case 1:
                        this.final_spd = this.spd * (1 + this.spd_buff);
                        this.atkspd = this.spd * (1 + this.spd_buff) >= 430 ? 0.14 : 1 - (this.spd * 0.002);
                        break;
                    case 2:
                        this.final_def = this.def * (1 + this.def_buff);
                        break;
                    case 3:
                        this.final_hp = this.hp * (1 + this.hp_buff);
                        this.hpPoints = this.final_hp * 5;
                        break;
                }
            }
            let tiers = ["F","E","D","C","B","A","S","SR"];
            //update this.tier to next tier in line
            let currentIndex = tiers.indexOf(this.tier);
            if (currentIndex >= 0 && currentIndex < tiers.length - 1) {
                this.tier = tiers[currentIndex + 1];
            }
            if(this.tier == "E") this.form_change_1 = true;
            else if(this.tier == "A") this.form_change_2 = true;
            else if(this.tier == "D") this.aura_1 = true;
            else if(this.tier == "B") this.aura_2 = true;
        }
    }
    toggleEquip() {
        let isEquipped =this.isEquipped;
        if(isEquipped){
            // remove loadOut.findIndex(eqp => eqp.id === id);
            let idx = loadOut.findIndex(eqp => eqp.id === this.id);
            if (idx !== -1) {
                loadOut.splice(idx, 1);
            }
            $('#inventorySlot' + this.slot).attr('isEmpty', true).attr('eqpId',"").attr('inventoryIndex', "");
            $('#inventorySlot' + this.slot).css('background-image', '');
            $('#inventorySlot' + this.slot + " .eqp-tier").text('');
            $('#inventorySlot' + this.slot + " .eqp-enhancements").text('');
        }else{
            let idx = inventory.findIndex(eqp => eqp.id === this.id);
            $('#inventorySlot' + this.slot).attr('isEmpty', false).attr('eqpId', this.id);
            $('#inventorySlot' + this.slot).attr('inventoryIndex', idx);
            $('#inventorySlot' + this.slot).css('background-image', `url(${this.eqp.img})`);
            $('#inventorySlot' + this.slot + " .eqp-tier").text(this.tier);
            $('#inventorySlot' + this.slot + " .eqp-enhancements").text("+"+this.enhancement);
            
            loadOut.push(this);
        }
        this.isEquipped = !this.isEquipped;
        let equipAction = this.isEquipped ? "unequip" : "equip";
        $("#toggleEquip").text(equipAction.charAt(0).toUpperCase()+ equipAction.slice(1)).attr('action', equipAction);
        ({loadOuttotalAtk, loadOuttotalSpd, loadOuttotalDef, loadOuttotalHP} = calcLoadOutStats());
        calcTotalStats();
        $("#loadOuttotalAtk").text(loadOuttotalAtk);
        $("#loadOuttotalSpd").text(loadOuttotalSpd);
        $("#loadOuttotalDef").text(loadOuttotalDef);
        $("#loadOuttotalHP").text(loadOuttotalHP);
    }

}

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
    $("#loadOuttotalAtk").text(loadOuttotalAtk);
    $("#loadOuttotalSpd").text(loadOuttotalSpd);
    $("#loadOuttotalDef").text(loadOuttotalDef);
    $("#loadOuttotalHP").text(loadOuttotalHP);
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
    let loadOuttotalAtk = 0;
    let loadOuttotalSpd = 0;
    let loadOuttotalDef = 0;
    let loadOuttotalHP = 0;
    
    loadOut.forEach(equipment => {
        loadOuttotalAtk += equipment.final_atk || 0;
        loadOuttotalSpd += equipment.final_spd || 0;
        loadOuttotalDef += equipment.final_def || 0;
        loadOuttotalHP += equipment.final_hp || 0;
    });
    return {loadOuttotalAtk, loadOuttotalSpd, loadOuttotalDef, loadOuttotalHP};
}