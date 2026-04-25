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
        this.enchantment = 0;
        this.affix = this.setAffix();
        this.suffix;
        this.isEquipped = false;
        this.value = 0;
        this.displayName = (this.affix+" "+this.eqp.mob.replace(/\b\w/g, c => c.toUpperCase())+" "+this.eqp.name).trim();
        this.img = this.getEqpImg(this.eqp,this.tier);
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
        const key = affixMap[`${top1}+${top2}`] ? `${top1}+${top2}` : `${top2}+${top1}`;

        if (stats[0].value === stats[1].value) {
            return affixMap[key].Tie;
        }
        return affixMap[key][top1];
        

        
    }
    enhance(cost) {
        let atk_chance = this.eqp.type.atk_chance;
        let spd_chance = atk_chance + this.eqp.type.spd_chance;
        let def_chance = spd_chance + this.eqp.type.def_chance;
        let hp_chance = def_chance + this.eqp.type.hp_chance;
        
        // Generate random increase from 1–5
        const random_stat_increase = Math.floor(Math.random() * (5+(tiers.indexOf(this.tier)))) + 1;
        
        
        if(this.enhancement < 10){
            if((this.tier == "G" && this.enhancement == 5)){
                return;
            }
            // Apply enhancement
            $('#forgeStatsCont .text-E').removeClass('text-E');
            $('#forgeAtk').text(`${this.atk}`);
            $('#forgeSpd').text(`${this.spd}`);
            $('#forgeDef').text(`${this.def}`);
            $('#forgeHp').text(`${this.hp}`);
            console.log(random_stat_increase)
            let roll = Math.random();
            if(roll <= atk_chance) {
                this.atk += random_stat_increase;
                $('#forgeAtk').text(`${this.atk}(+${random_stat_increase})`).addClass('text-E');}
            else if(roll <= spd_chance) {
                this.spd += random_stat_increase;
                $('#forgeSpd').text(`${this.spd}(+${random_stat_increase})`).addClass('text-E');}
            else if(roll <= def_chance) {
                this.def += random_stat_increase;
                $('#forgeDef').text(`${this.def}(+${random_stat_increase})`).addClass('text-E');}
            else if(roll <= hp_chance) {
                this.hp += random_stat_increase;
                $('#forgeHp').text(`${this.hp}(+${random_stat_increase})`).addClass('text-E');}
            else {
                $('#forgeHp').text(`${this.hp}(+${random_stat_increase})`).addClass('text-E');
                this.hp += random_stat_increase;}
            //compute item value
            
            $('.forge-eqp-btn.active .forge-item-enhancements').text(this.enhancement)
        }else{
            
            let idx = tiers.indexOf(this.tier);
            let maxidx = tiers.indexOf(this.max_tier);
            if(idx < maxidx)
                this.raiseTier();
        }
        let prevEqpIndex = inventory.findIndex(eqp => eqp.id === this.id);
        // Recalculate derived stats
        this.final_atk = Math.round(this.atk * (1 + this.atk_buff));
        this.dmg = this.final_atk * 3;
        this.final_spd = Math.round(this.spd * (1 + this.spd_buff));
        this.atkspd = this.spd * (1 + this.spd_buff) >= 430 ? 0.14 : 1 - (this.spd * 0.002);
        this.final_def = Math.round(this.def * (1 + this.def_buff));
        this.final_hp = Math.round(this.hp * (1 + this.hp_buff));
        this.hpPoints = Math.round(this.final_hp * 5);
        this.enhancement += 1;
        this.affix = this.setAffix();
        $(".forge-eqp-btn.active").html(`${this.displayName}(${this.tier}+<span class="forge-item-enhancements">${this.enhancement}</span>)`)
        
        //deduct gold
        soul.updateGold(soul.gold - cost);
        setGold();
        this.affix = this.setAffix();
        calcLoadOutStats();
        calcTotalStats();
        updateInventory();
    }
    enchant(tier, idx, cost) {
        let mat = materialList.find(mat => mat.id == idx);
        let bagidx = bag.findIndex(item => item==idx);
        if(bagidx && bagidx != -1){
            let maxStars = 3;
            switch(tier){
                case "G": maxStars = 3; break;
                case "F": maxStars = 4; break;
                case "E": maxStars = 5; break;
                case "D": maxStars = 6; break;
                case "C": maxStars = 7; break;
                case "B": maxStars = 8; break;
                case "A": maxStars = 9; break;
                case "S": maxStars = 10; break;
                case "SR": maxStars = 12; break;
            }
            if(this.enchantment < maxStars){
                const random_stat_increase = Math.floor(Math.random() * mat.max) + mat.min;
                switch(mat.stat){
                    case "ATK": this.atk += random_stat_increase; break;
                    case "SPD": this.spd += random_stat_increase; break;
                    case "DEF": this.def += random_stat_increase; break;
                    case "HP": this.hp += random_stat_increase; break;
                    default: break;
                }
                this.final_atk = this.atk * (1 + this.atk_buff);
                this.dmg = this.final_atk * 3;
                this.final_spd = this.spd * (1 + this.spd_buff);
                this.atkspd = this.spd * (1 + this.spd_buff) >= 430 ? 0.14 : 1 - (this.spd * 0.002);
                this.final_def = this.def * (1 + this.def_buff);
                this.final_hp = this.hp * (1 + this.hp_buff);
                this.hpPoints = this.final_hp * 5;
                this.enchantment += 1;
                this.affix = this.setAffix();
                bag.splice(bagidx,1);
                populateMatsTab();
                populateMatsList();
                $(".tower-eqp-btn.active").html(`${this.displayName}(${this.tier}+<span class="forge-item-enhancements">${this.enhancement}</span>)`)
                calcLoadOutStats();
                calcTotalStats();
                updateInventory();
                soul.updateGold(soul.gold - cost);
                setGold();
                updateBag();
            }
            return;
        }else{

        }
        
        
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
                const random_stat_increase = parseFloat(((Math.floor(Math.random() * 30) + 15)/100).toFixed(2));
                // Apply enhancement
                stats[random_stat_index] += random_stat_increase;
                // Push updated values back into the object
                [this.atk_buff, this.spd_buff, this.def_buff, this.hp_buff] = stats;
                switch(random_stat_index){
                    case 0:
                        this.final_atk = Math.round(this.atk * (1 + this.atk_buff));
                        this.dmg = this.final_atk * 3;
                        break;
                    case 1:
                        this.final_spd = Math.round(this.spd * (1 + this.spd_buff));
                        this.atkspd = this.spd * (1 + this.spd_buff) >= 430 ? 0.14 : 1 - (this.spd * 0.002);
                        break;
                    case 2:
                        this.final_def = Math.round(this.def * (1 + this.def_buff));
                        break;
                    case 3:
                        this.final_hp = Math.round(this.hp * (1 + this.hp_buff));
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
        this.enhancement = 0;
        this.img = this.getEqpImg(this.eqp,this.tier);
        $("#forgeEqpPreview").css({'background-image':`url('${this.img}')`});
        $(".forge-eqp-btn.active .equipped-item-tier").text(this.tier);
        $("#forgeCost").text(forgeCosts[this.tier]);
        calcLoadOutStats();
        calcTotalStats();
        updateInventory();
    }
    toggleEquip() {
        let isEquipped =this.isEquipped;
        let idx = inventory.findIndex(eqp => eqp.id === this.id);
        if(!isEquipped){
            let equippedItem = loadOut.find(eqp => eqp.slot == this.slot);
            if(equippedItem){
                let equippedIdx = inventory.findIndex(item=> item.id == equippedItem.id)
                inventory[equippedIdx].isEquipped = false;
            }
        }
        inventory[idx].isEquipped = !isEquipped;
        initLoadOut();
        let equipAction = this.isEquipped ? "unequip" : "equip";
        $("#toggleEquip").text(equipAction.charAt(0).toUpperCase()+ equipAction.slice(1)).attr('action', equipAction);
        ({loadOuttotalAtk, loadOuttotalSpd, loadOuttotalDef, loadOuttotalHP} = calcLoadOutStats());
        calcTotalStats();
        $("#loadOuttotalAtk").text(loadOuttotalAtk);
        $("#loadOuttotalSpd").text(loadOuttotalSpd);
        $("#loadOuttotalDef").text(loadOuttotalDef);
        $("#loadOuttotalHP").text(loadOuttotalHP);
        populateStatMenu();
        organizeInventory();
        updateInventory();
        
        let str = '';
        loadOut.forEach(item=>{str += item.displayName + ";"})
        console.log(str)
    }
    getEqpImg(eqp,tier){
        let eqpImg = `${eqp.img}${tier}.webp`;
        if(eqp.eqp_type == "weapon"){
            switch(eqp.mob){
                case "arachne":
                    let arachnetext = '';
                    if(Math.random() > 0.5) arachnetext = '-1';
                    eqpImg = `${eqp.img}${tier}${arachnetext}.webp`
                    break;
                default:
                    eqpImg = `${eqp.img}${tier}.webp`
            }
            
        }else{

        }
        return eqpImg;
    }

}

