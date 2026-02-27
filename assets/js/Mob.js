class Mob {
    constructor({name, species, img, category, baseStats, increment, baseGold, distr, isElite= false},floor, dungeon, isBoss = false, isApex = false) {
        this.isElite = isElite;
        this.isBoss = isBoss;
        this.isApex = isApex;
        this.name = this.isElite ? "Elite " + name : name;
        this.species = species;
        this.img = img;
        this.category = category;
        this.baseStats = baseStats;
        this.increment = increment;
        this.baseGold = baseGold;
        this.distr = distr;
        let {atk, spd, def, hp} = distributeMobStats(this.baseStats, this.increment, this.distr, floor, dungeon, isElite);
        this.atk = atk;
        this.dmg = atk*3;
        this.spd = spd;
        this.atkspd = spd >= 430 ? 0.14 : 1 - (spd * 0.002); //Base
        this.def = def;
        this.hp = hp;
        this.hpPoints = hp * 5;
    }
    
    getTotalStats(){
        return this.atk + this.def + this.spd + this.hp;
    }
}