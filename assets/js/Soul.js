class Soul {
    constructor({ atk = 5, spd = 0, def = 0, hp = 5, availableStats = 15, gold = 1500} = {}, classAbilityIdx) {
        this.classAbilityIdx = classAbilityIdx;
        let classIndex = classList.findIndex(clss => clss.name == classAbilities[classAbilityIdx].class);
        let clss = classList[classIndex];
        this.id = 1;
        this.atk = clss ? clss.atk : atk;
        this.dmg = (clss ? clss.atk : atk)*3;
        this.spd = clss ? clss.spd : spd;
        this.atkspd = this.spd >= 430 ? 0.14 : 1 - (this.spd * 0.002); //Base
        this.def = clss ? clss.def : def;
        this.hp = clss ? clss.hp : hp;
        this.hpPoints = this.hp * 5;
        this.availableStats = clss ? 0 : availableStats;
        this.gold = gold;
        this.minDmg = 0.1;
        this.title1Unlocked = false;
        this.title2Unlocked = false;
        this.titles = [];
        this.classAbilities = classAbilities[classAbilityIdx];
        this.atkChance = weaponTypes[classIndex].atk_chance;
        this.defChance = weaponTypes[classIndex].def_chance;
        this.spdChance = weaponTypes[classIndex].spd_chance;
        this.hpChance = weaponTypes[classIndex].hp_chance;
        this.img = `${soul_path}${clss.name}_${this.classAbilities.gender}.webp`;
    }
    update(){
        // Persist to IndexedDB using the already-open db
        const tx = db.transaction("Soul", "readwrite");
        const store = tx.objectStore("Soul");
        store.put(soul);
        tx.oncomplete = () => console.log("Soul updated in IndexedDB");
        tx.onerror = () => console.error("Failed to update Soul in IndexedDB");
    }
    setStats(atk, spd, def, hp, availableStats = this.availableStats) {
        // Update in-memory values
        this.atk = atk;
        this.dmg = atk * 3;
        this.spd = spd;
        this.atkspd = spd >= 430 ? 0.14 : 1 - (spd * 0.002);
        this.def = def;
        this.hp = hp;
        this.hpPoints = hp * 5;
        this.availableStats = availableStats;

        // Persist to IndexedDB using the already-open db
        const tx = db.transaction("Soul", "readwrite");
        const store = tx.objectStore("Soul");
        store.put(soul);
        tx.oncomplete = () => console.log("Soul updated in IndexedDB");
        tx.onerror = () => console.error("Failed to update Soul in IndexedDB");
    }
    updateGold(gold){
        this.gold = gold;
        $('.gold-display').text(this.gold);
        const tx = db.transaction("Soul", "readwrite");
        const store = tx.objectStore("Soul");
        store.put(soul);

        tx.oncomplete = () => console.log("Gold updated");
        tx.onerror = () => console.error("Failed to update Soul in IndexedDB");
    }
    getClassName(){
        return this.classAbilities.class;
    }
}

function setGold(){
    $('.gold-display').text(soul.gold);
}
