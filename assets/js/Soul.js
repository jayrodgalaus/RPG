class Soul {
    constructor({ atk = 0, spd = 0, def = 0, hp = 0, availableStats = 15 } = {}) {
        this.atk = atk;
        this.dmg = atk*3;
        this.spd = spd;
        this.atkspd = spd >= 430 ? 0.14 : 1 - (spd * 0.002); //Base
        this.def = def;
        this.hp = hp;
        this.hpPoints = hp * 5;
        this.availableStats = availableStats;
        this.gold = 100;
        this.minDmg = 0.1;
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

        store.put({
            id: 1,
            atk: this.atk,
            dmg: this.dmg,
            spd: this.spd,
            atkspd: this.atkspd,
            def: this.def,
            hp: this.hp,
            hpPoints: this.hpPoints,
            availableStats: this.availableStats
        });

        tx.oncomplete = () => console.log("Soul updated in IndexedDB");
        tx.onerror = () => console.error("Failed to update Soul in IndexedDB");
    }

    
    
}
