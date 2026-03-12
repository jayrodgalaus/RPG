class Equipment {
    constructor({eqp_type, eqp_id,  tier = "G", max_tier="G"  } = {}) {
        this.id; //in inventory
        this.eqp_type = eqp_type; //weapon or armor
        this.eqp_id = eqp_id; //from weapons table or armor table
        this.eqp = eqp_type == "weapon" ? weaponList[eqp_id] : armorList[eqp_id]; //don't need to save this in DB
        this.slot = this.eqp.type.slot;
        this.atk = 2;
        this.atk_buff = 0;
        this.final_atk = this.atk * (1 + this.atk_buff);
        this.dmg = this.final_atk * 3;
        this.spd = 2;
        this.spd_buff = 0;
        this.final_spd = this.spd * (1 + this.spd_buff);
        this.atkspd = this.spd * (1 + this.spd_buff) >= 430 ? 0.14 : 1 - (this.spd * 0.002);
        this.def = 2;
        this.def_buff = 0;
        this.final_def = this.def * (1 + this.def_buff);
        this.hp = 2;
        this.hp_buff = 0;
        this.final_hp = this.hp * (1 + this.hp_buff);
        this.hpPoints = this.final_hp * 5;
        this.tier = tier;
        this.max_tier = max_tier;
        this.form_change_1 = false; this.form_change_2 = false; this.aura_1 = false; this.aura_2 = false;  
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
        if ([this.atk, this.spd, this.def, this.hp].every(v => v === 0)) {
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
        let atk_chance = this.eqp.type.atk_chance;
        let spd_chance = atk_chance + this.eqp.type.spd_chance;
        let def_chance = spd_chance + this.eqp.type.def_chance;
        let hp_chance = def_chance + this.eqp.type.hp_chance;
        
        // Generate random increase from 1–5
        const random_stat_increase = Math.floor(Math.random() * 5) + 1;

        
        if(this.enhancement < 10){
            if((this.tier == "G" && this.enhancement == 5)){
                return;
            }
            // Apply enhancement
            let roll = Math.random();
            if(roll <= atk_chance) this.atk += random_stat_increase;
            else if(roll <= spd_chance) this.spd += random_stat_increase;
            else if(roll <= def_chance) this.def += random_stat_increase;
            else if(roll <= hp_chance) this.hp += random_stat_increase;
            else this.hp += random_stat_increase;
            // Recalculate derived stats
            this.final_atk = this.atk * (1 + this.atk_buff);
            this.dmg = this.final_atk * 3;
            this.final_spd = this.spd * (1 + this.spd_buff);
            this.atkspd = this.spd * (1 + this.spd_buff) >= 430 ? 0.14 : 1 - (this.spd * 0.002);
            this.final_def = this.def * (1 + this.def_buff);
            this.final_hp = this.hp * (1 + this.hp_buff);
            this.hpPoints = this.final_hp * 5;
            this.enhancement += 1;
            this.affix = this.setAffix();
            //compute item value
            $('.forge-eqp-btn.active .forge-item-enhancements').text(this.enhancement)
        }else{
            let idx = tiers.indexOf(this.tier);
            let maxidx = tiers.indexOf(this.max_tier);
            if(idx < maxidx)
                this.raiseTier();
        }
        let prevEqpIndex = inventory.findIndex(eqp => eqp.id === this.id);
        // console.log(inventory[prevEqpIndex])
        // inventory[prevEqpIndex] = this;
        calcLoadOutStats();
        calcTotalStats();
        console.log(inventory[prevEqpIndex]);
        updateInventory();
    }
    damage(){
        if(this.enhancement > 1){
            let atk_chance = this.eqp.type.atk_chance;
            let spd_chance = atk_chance + this.eqp.type.spd_chance;
            let def_chance = spd_chance + this.eqp.type.def_chance;
            let hp_chance = def_chance + this.eqp.type.hp_chance;
            
            // Generate random increase from 1–5
            const random_stat_increase = Math.floor(Math.random() * 5) + 1;

            // Apply damage
            let roll = Math.random();
            if(roll <= atk_chance) this.atk -= random_stat_increase;
            else if(roll <= spd_chance) this.spd -= random_stat_increase;
            else if(roll <= def_chance) this.def -= random_stat_increase;
            else if(roll <= hp_chance) this.hp -= random_stat_increase;
            else this.hp -= random_stat_increase;
            // Recalculate derived stats 
            this.dmg = this.atk * 3;
            this.atkspd = this.spd >= 430 ? 0.14 : 1 - (this.spd * 0.002);
            this.hpPoints = this.hp * 5;
            this.enhancement -= 1;
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
        populateStatMenu()
    }

}

