/* 
    minimum damage : dungeonMobs - 30%, bossMobs - 40%, apexMobs - 50%
*/
var statDistr = {
    atk:{ atk: 0.3, spd: 0.15, def: 0.15, hp: 0.4},
    spd:{ atk: 0.15, spd: 0.3, def: 0.15, hp: 0.4},
    def:{ atk: 0.15, spd: 0.15, def: 0.3, hp: 0.4},
    hp:{ atk: 0.15, spd: 0.15, def: 0.15, hp: 0.55},
    goldgoblin:{atk: 0, spd: 0, def: 0.30, hp: 0.70},
    balanced:{ atk: 0.25, spd: 0.25, def: 0.25, hp: 0.25},
    xatk:{ atk: 0.45, spd: 0.10, def: 0.10, hp: 0.35},
    xspd:{ atk: 0.10, spd: 0.45, def: 0.10, hp: 0.35},
    xdef:{ atk: 0.10, spd: 0.10, def: 0.45, hp: 0.35},
    xhp:{ atk: 0.10, spd: 0.10, def: 0.10, hp: 0.70},
    xxatk:{ atk: 0.65, spd: 0.0, def: 0.0, hp: 0.35},
    xxspd:{ atk: 0.10, spd: 0.65, def: 0.0, hp: 0.25},
    xxdef:{ atk: 0.10, spd: 0.0, def: 0.65, hp: 0.25},
    xxhp:{ atk: 0.10, spd: 0.0, def: 0.0, hp: 0.90},
}
var dungeonMobs = [
    //angels: [
        {name: "Corrupt Angel", species:"angels", img: mob_path+"Angels/1.webp", category:"angels", baseStats: 50, increment: 12, baseGold:100, distr:statDistr.atk},
        {name: "Corrupt Cherub", species:"angels", img: mob_path+"Angels/2.webp", category:"angels", baseStats: 50, increment: 12, baseGold:100, distr:statDistr.spd},
        {name: "Corrupt Priestess", species:"angels", img: mob_path+"Angels/3.webp", category:"angels", baseStats: 50, increment: 12, baseGold:85, distr:statDistr.hp},
    //arachne: [
        {name: "Arachne (F)", species:"arachne", img: mob_path+"Arachne/1.webp", category:"arachne", baseStats: 40, increment: 8, baseGold:85, distr:statDistr.spd},
        {name: "Arachne (M)", species:"arachne", img: mob_path+"Arachne/2.webp", category:"arachne", baseStats: 40, increment: 8, baseGold:85, distr:statDistr.atk},
        {name: "Giant Spider",  species:"arachne",img: mob_path+"Arachne/3.webp", category:"arachne", baseStats: 40, increment: 8, baseGold:50, distr:statDistr.xdef},
    
    //cultists: [
        {name: "Cultist", species:"cultists", img: mob_path+"Cultists/1.webp", category:"cultists", baseStats: 40, increment: 8, baseGold:85, distr:statDistr.xspd},
        {name: "Sacrifice", species:"cultists", img: mob_path+"Cultists/2.webp", category:"cultists", baseStats: 40, increment: 8, baseGold:85, distr:statDistr.hp},
        {name: "Fanatic", species:"cultists", img: mob_path+"Cultists/3.webp", category:"cultists", baseStats: 40, increment: 8, baseGold:50, distr:statDistr.atk},
    
    //demons: [
        {name: "Red demon", species:"demons", img: mob_path+"Demons/1.webp", category:"demons", baseStats: 50, increment: 12, baseGold:100, distr:statDistr.atk},
        {name: "Succubus", species:"demons", img: mob_path+"Demons/2.webp", category:"demons", baseStats: 50, increment: 12, baseGold:100, distr:statDistr.hp},
        {name: "Gargoyle", species:"demons", img: mob_path+"Demons/3.webp", category:"demons", baseStats: 50, increment: 12, baseGold:85, distr:statDistr.xdef},
    //dragons
        {name: "Wyrm", species:"dragons", img: mob_path+"Dragons/1.webp", category:"dragons", baseStats: 50, increment: 12, baseGold:85, distr:statDistr.def},
        {name: "Dragonkin", species:"dragons", img: mob_path+"Dragons/2.webp", category:"dragons", baseStats: 50, increment: 12, baseGold:50, distr:statDistr.atk},
        {name: "Dragonkin", species:"dragons", img: mob_path+"Dragons/3.webp", category:"dragons", baseStats: 50, increment: 12, baseGold:50, distr:statDistr.spd},
        {name: "Dragon Warrior", species:"dragons", img: mob_path+"Dragons/4.webp", category:"dragons", baseStats: 60, increment: 13, baseGold:85, distr:statDistr.xspd},
    //fallen
        {name: "Corrupt Knight", species:"fallen", img: mob_path+"Fallen/1.webp", category:"fallen", baseStats: 40, increment: 10, baseGold:50, distr:statDistr.balanced},
        {name: "Corrupt Knight", species:"fallen", img: mob_path+"Fallen/2.webp", category:"fallen", baseStats: 40, increment: 10, baseGold:50, distr:statDistr.atk},
        {name: "Corrupt Knight", species:"fallen", img: mob_path+"Fallen/3.webp", category:"fallen", baseStats: 40, increment: 10, baseGold:50, distr:statDistr.spd},
        {name: "Corrupt Paladin", species:"fallen", img: mob_path+"Fallen/4.webp", category:"fallen", baseStats: 40, increment: 10, baseGold:85, distr:statDistr.def},
        {name: "Madwoman", species:"fallen", img: mob_path+"Fallen/5.webp", category:"fallen", baseStats: 40, increment: 9, baseGold:45, distr:statDistr.xspd},
        {name: "Madwoman", species:"fallen", img: mob_path+"Fallen/6.webp", category:"fallen", baseStats: 40, increment: 9, baseGold:45, distr:statDistr.xdef},
        {name: "Madwoman", species:"fallen", img: mob_path+"Fallen/7.webp", category:"fallen", baseStats: 40, increment: 9, baseGold:45, distr:statDistr.xatk},
    //ghosts
        {name: "Sacrifice", species:"ghosts", img: mob_path+"Ghosts/1.webp", category:"generic", baseStats: 30, increment: 6, baseGold:50, distr:statDistr.atk},
        {name: "Sacrifice", species:"ghosts", img: mob_path+"Ghosts/2.webp", category:"generic", baseStats: 30, increment: 6, baseGold:50, distr:statDistr.spd},
        {name: "Noble Sacrifice", species:"ghosts", img: mob_path+"Ghosts/4.webp", category:"generic", baseStats: 30, increment: 6, baseGold:50, distr:statDistr.spd},
        {name: "Haunted Doll", species:"ghosts", img: mob_path+"Ghosts/3.webp", category:"generic", baseStats: 30, increment: 6, baseGold:35, distr:statDistr.xatk},
    //goblins
        {name: "Goblin", species:"goblins", img: mob_path+"Goblins/1.webp", category:"generic", baseStats: 30, increment: 6, baseGold:50, distr:statDistr.spd},
        {name: "Goblin", species:"goblins", img: mob_path+"Goblins/2.webp", category:"generic", baseStats: 30, increment: 6, baseGold:50, distr:statDistr.atk},
        {name: "Goblin", species:"goblins", img: mob_path+"Goblins/3.webp", category:"generic", baseStats: 30, increment: 6, baseGold:35, distr:statDistr.balanced},
        {name: "Goblin", species:"goblins", img: mob_path+"Goblins/4.webp", category:"generic", baseStats: 30, increment: 6, baseGold:35, distr:statDistr.def},
    //kobolds
        {name: "Kobold", species:"kobolds", img: mob_path+"Kobolds/1.webp", category:"generic", baseStats: 30, increment: 6, baseGold:50, distr:statDistr.hp},
        {name: "Kobold", species:"kobolds", img: mob_path+"Kobolds/2.webp", category:"generic", baseStats: 30, increment: 6, baseGold:50, distr:statDistr.hp},
        {name: "Kobold kid", species:"kobolds", img: mob_path+"Kobolds/3.webp", category:"generic", baseStats: 30, increment: 6, baseGold:35, distr:statDistr.hp},
        {name: "Kobold", species:"kobolds", img: mob_path+"Kobolds/4.webp", category:"generic", baseStats: 30, increment: 6, baseGold:50, distr:statDistr.hp},
    //neutrals
        {name: "Chest Mimic", species:"neutral", img: mob_path+"Neutrals/chest.webp", category:"generic", baseStats: 30, increment: 5, baseGold:100, distr:statDistr.hp},
        {name: "Door Mimic", species:"neutral", img: mob_path+"Neutrals/door.webp", category:"generic", baseStats: 30, increment: 5, baseGold:50, distr:statDistr.hp},
        {name: "Beholder", species:"neutral", img: mob_path+"Neutrals/eye1.webp", category:"generic", baseStats: 30, increment: 5, baseGold:35, distr:statDistr.hp},
        {name: "Beholder", species:"neutral", img: mob_path+"Neutrals/eye2.webp", category:"generic", baseStats: 30, increment: 5, baseGold:35, distr:statDistr.hp},
        {name: "Stone Golem", species:"neutral", img: mob_path+"Neutrals/stoneGolem.webp", category:"generic", baseStats: 40, increment: 6, baseGold:40, distr:statDistr.def},
        {name: "Magma Golem", species:"neutral", img: mob_path+"Neutrals/magmaGolem.webp", category:"generic", baseStats: 40, increment: 6, baseGold:40, distr:statDistr.atk},
        {name: "Wind Golem", species:"neutral", img: mob_path+"Neutrals/windGolem.webp", category:"generic", baseStats: 40, increment: 6, baseGold:40, distr:statDistr.spd},
        {name: "Stacy", species:"neutral", img: mob_path+"Neutrals/nurse2.webp", category:"special", baseStats: 35, increment: 6, baseGold:35, distr:statDistr.balanced},
        {name: "Mandy", species:"neutral", img: mob_path+"Neutrals/nurse3.webp", category:"special", baseStats: 35, increment: 6, baseGold:35, distr:statDistr.balanced},
        {name: "Sasha", species:"neutral", img: mob_path+"Neutrals/nurse1.webp", category:"special", baseStats: 35, increment: 6, baseGold:35, distr:statDistr.balanced},
        {name: "Death", species:"neutral", img: mob_path+"Neutrals/death.webp", category:"special", baseStats: 70, increment: 6, baseGold:0, distr:statDistr.xxatk},
        {name: "Gold Goblin", species:"neutral", img: mob_path+"Neutrals/goldgoblin.webp", category:"special", baseStats: 50, increment: 10, baseGold:100, distr:statDistr.goldgoblin},
    //skeletons
        {name: "Skeleton Fighter", species:"skeletons", img: mob_path+"Skeletons/1.webp", category:"generic", baseStats: 30, increment: 6, baseGold:30, distr:statDistr.atk},
        {name: "Skeleton Duelist", species:"skeletons", img: mob_path+"Skeletons/2.webp", category:"generic", baseStats: 30, increment: 6, baseGold:30, distr:statDistr.balanced},
        {name: "Skeleton Marauder", species:"skeletons", img: mob_path+"Skeletons/3.webp", category:"generic", baseStats: 30, increment: 6, baseGold:30, distr:statDistr.spd},
    //slimes
        {name: "Purple Slime", species:"slimes", img: mob_path+"Slimes/1.webp", category:"generic", baseStats: 30, increment: 5, baseGold:25, distr:statDistr.def},
        {name: "Yellow Slime", species:"slimes", img: mob_path+"Slimes/2.webp", category:"generic", baseStats: 30, increment: 5, baseGold:25, distr:statDistr.atk},
        {name: "Blue Slime", species:"slimes", img: mob_path+"Slimes/3.webp", category:"generic", baseStats: 30, increment: 5, baseGold:25, distr:statDistr.spd},
    //zombies
        {name: "Zombie (M)", species:"zombies", img: mob_path+"Zombies/1.webp", category:"generic", baseStats: 30, increment: 6, baseGold:30, distr:statDistr.atk},
        {name: "Zombie (F)", species:"zombies", img: mob_path+"Zombies/2.webp", category:"generic", baseStats: 30, increment: 6, baseGold:30, distr:statDistr.spd},
        {name: "Fresh Zombie", species:"zombies", img: mob_path+"Zombies/3.webp", category:"generic", baseStats: 30, increment: 6, baseGold:30, distr:statDistr.hp},

];
var bossMobs = [
    {name: "Elyndra", species:"angels", img: mob_path+"Angels/boss.webp", category:"angels", isBoss:true},
    {name: "Thessra", species:"arachne", img: mob_path+"Arachne/boss.webp", category:"arachne", isBoss:true},
    {name: "Zerath", species:"cultists", img: mob_path+"Cultists/boss.webp", category:"cultists", isBoss:true},
    {name: "Morvak", species:"demons", img: mob_path+"Demons/boss.webp", category:"demons", isBoss:true},
    {name: "Kaelthys", species:"dragons", img: mob_path+"Dragons/boss.webp", category:"dragons", isBoss:true},
    {name: "Ilyra", species:"ghosts", img: mob_path+"Ghosts/boss.webp", category:"ghosts", isBoss:true, baseStats: 50, increment: 9, baseGold:100, distr:statDistr.hp},
    {name: "Graknir", species:"goblins", img: mob_path+"Goblins/boss.webp", category:"goblins", isBoss:true, baseStats: 50, increment: 9, baseGold:100, distr:statDistr.atk},
    {name: "Skirrek", species:"kobolds", img: mob_path+"Kobolds/boss.webp", category:"kobolds", isBoss:true, isBoss:true, baseStats: 50, increment: 9, baseGold:100, distr:statDistr.hp},
    {name: "Dravok", species:"skeletons", img: mob_path+"Skeletons/boss.webp", category:"skeletons", isBoss:true, baseStats: 50, increment: 9, baseGold:100, distr:statDistr.atk},
    {name: "Gloxx", species:"slimes", img: mob_path+"Slimes/boss.webp", category:"slimes", isBoss:true, baseStats: 45, increment: 8, baseGold:75, distr:statDistr.spd},
    {name: "Veynar", species:"zombies", img: mob_path+"Zombies/boss.webp", category:"zombies", isBoss:true, isBoss:true, baseStats: 50, increment: 9, baseGold:100, distr:statDistr.hp},
];
var apexMobs = [
    {name: "Seraphis the Dawnbringer", species:"angels", img: mob_path+"Angels/apex.webp", category:"angels", isApex:true},
    {name: "Webmother Nethis", species:"arachne", img: mob_path+"Arachne/apex.webp", category:"arachne", isApex:true},
    {name: "Voidchanter Orveth", species:"cultists", img: mob_path+"Cultists/apex.webp", category:"cultists", isApex:true},
    {name: "Hellbrand Malrik", species:"demons", img: mob_path+"Demons/apex.webp", category:"demons", isApex:true},
    {name: "Ashwing Draveth", species:"dragons", img: mob_path+"Dragons/apex.webp", category:"dragons", isApex:true},
    {name: "Wraithbound Olyth", species:"ghosts", img: mob_path+"Ghosts/apex.webp", category:"ghosts", isApex:true},
    {name: "Bloodfang Kraggit", species:"goblins", img: mob_path+"Goblins/apex.webp", category:"goblins", isApex:true},
    {name: "Warrenscale Zerrek", species:"kobolds", img: mob_path+"Kobolds/apex.webp", category:"kobolds", isApex:true},
    {name: "Bone Sovereign Tharok", species:"skeletons", img: mob_path+"Skeletons/apex.webp", category:"skeletons", isApex:true},
    {name: "Morbolg the Ebon Ooze", species:"slimes", img: mob_path+"Slimes/apex.webp", category:"slimes", isApex:true},
    {name: "Rotlord Grawl", species:"zombies", img: mob_path+"Zombies/apex.webp", category:"zombies", isApex:true},
];
var enemyMob;
var goldGoblinRun = 0; //save the last time goldGoblin was encountered
function distributeMobStats(baseGold,baseStats, increment, distr, floor, dungeon, isElite){
    let totalStats = (baseStats + (increment * floor)) * (1 + (dungeon.difficulty * floor));
    console.log('total stats:',totalStats)
    let gold = Math.floor((baseGold + (increment * floor)) * (1 + (dungeon.difficulty * floor)));
    if(isElite) totalStats *= 1.3;
    let atk = Math.floor(totalStats * distr.atk);
    let def = Math.floor(totalStats * distr.def);
    let spd = Math.floor(totalStats * distr.spd);
    let hp = Math.ceil(totalStats * distr.hp);
    return {gold, atk, spd, def, hp};
}
function spawnMob(isBoss = false, isApex = false){
    //spawn chance is 60% dungeon specific mob, 40% neutrals
    let mob;
    let mobSource;
    let dungeonMobChance = isBoss || isApex ? 1 : 0.6;
    
    if (Math.random() <= dungeonMobChance) { //0.6
        console.log("spawning dungeon mob...")
        // spawn mob by dungeon species
        let source = isBoss ? bossMobs: (isApex ? apexMobs : dungeonMobs);
        // console.log("source:",source)
        console.log("currentDungeon.species:",currentDungeon.species)
        mobSource = source.filter(m => m.species === currentDungeon.species)
        mob = structuredClone(mobSource[Math.floor(Math.random() * mobSource.length)]);
        mob.isBoss = isBoss;
        mob.isApex = isApex;
        console.log("selected mob:",mob)
        
    }else{
        console.log("spawning neutral mob...")
        //spawn neutrals
        mobSource = dungeonMobs.filter(m => m.species === "neutral") 
        if (mobSource.length > 0) {
            let baseGoblin = 0.1; //spawn chance of gold goblin
            let bonusGoblin = (currentRun - goldGoblinRun) / 100;
            let goblinChance = Math.min(0.7, bonusGoblin+baseGoblin); //cap at 70% 
            if (Math.random() <= (goblinChance)) {
                //spawn goblin
                mob = structuredClone(dungeonMobs[dungeonMobs.findIndex(mob => mob.name === "Gold Goblin")]);
                goldGoblinRun = currentRun;
            }else{
                // spawn neutral mob
                mob = structuredClone(mobSource[Math.floor(Math.random() * mobSource.length)]);
            }
        }
    }
    if (mobSource.length > 0 && !isBoss && !isApex) {
        let baseElite = 0.1;//chance to spawn elite
        let bonusElite = (currentFloor * 0.6) / 100;
        let eliteChance = Math.min(0.4, baseElite + bonusElite); //cap at 40%
        
        if (Math.random() <= (eliteChance)) {
            //spawn elite
            mob.isElite = true;
            mob.img = mob.img.replace(/(\.webp)$/, "-elite$1");
        }
    }
    enemyMob = new Mob(mob, currentFloor, currentDungeon);
    
    console.log("enemy mob:", enemyMob)
    console.log("gold:",enemyMob.gold)  
}