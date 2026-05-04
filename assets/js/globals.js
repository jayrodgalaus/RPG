//GLOBAL VARIABLES

var db;
var soul;
const soul_path = "assets/img/Souls/"; 
const eqp_path = "assets/img/Equipment/";
const mob_path = "assets/img/Mobs/";
const npc_town_path = "assets/img/NPCs/Town/";
const portals_path = "assets/img/Portals/";
const story_path = "assets/img/Story/";
var nsfw = false;
var bag = []; //mats and consumables

var loadOut = [];
var currentEqpPreview = {};
var loadOuttotalAtk = 0, loadOuttotalSpd = 0, loadOuttotalDef = 0, loadOuttotalHP = 0;
var calcAtk = 0, calcSpd = 0, calcDef = 0, calcHP = 0, calcDmg = 0, calcAtkspd = 0, calcHppoints = 0;
var classList = [
  { name: 'Warden', atk: 8, spd: 8, def: 5, hp: 4, availableStats: 0 },
  { name: 'Ravager', atk: 10, spd: 5, def: 6, hp: 4, availableStats: 0 },
  { name: 'Sentinel', atk: 9, spd: 3, def: 8, hp: 5, availableStats: 0 },
  { name: 'Severant', atk: 6, spd: 9, def: 4, hp: 6, availableStats: 0 },
  { name: 'Bladewind', atk: 5, spd: 11, def: 4, hp: 5, availableStats: 0 },
  { name: 'Overlord', atk: 13, spd: 3, def: 6, hp: 3, availableStats: 0 },
  { name: 'Shade', atk: 4, spd: 15, def: 3, hp: 3, availableStats: 0 },
  { name: 'Vanguard', atk: 9, spd: 9, def: 4, hp: 3, availableStats: 0 },
//   { name: 'Nullborn', atk: 5, spd: 0, def: 0, hp: 5, availableStats: 15 }
];
var classAbilities = [
    {class: 'Warden', name: "Veteran", desc: "ATK and SPD +20% per hit.", gender:"M"}, //male
    {class: 'Warden', name: "Grace", desc: "20% chance to parry, reducing incoming DMG to 75%. On activation, ATK +50%, parry chance +10%.", gender:"F"}, //female
    {class: 'Ravager', name: "Bloodthirsty", desc: "Every 5% enemy HP lost is converted to 5% ATK and SPD.", gender:"M"}, //male
    {class: 'Ravager', name: "Berserk", desc: "Every 5% HP lost is converted to 5% ATK and SPD.", gender:"F"}, //female
    {class: 'Sentinel', name: "Crumple", desc: "Enemy DEF -15%, own DEF + 5% per hit.", gender:"M"},//male
    {class: 'Sentinel', name: "Thorns", desc: "DMG + 15% of DEF. DEF + 15% per hit (max 100%). 20% chance to block incoming DMG.", gender:"F"},//female
    {class: 'Severant', name: "Reaper", desc: "Regen 15% of DMG dealt on hit. Every 20% enemy HP lost, Regen +10%", gender:"M"}, //male
    {class: 'Severant', name: "Executioner", desc: "Every 5% lost enemy HP adds 1% chance to insta-kill. Regen 20% HP on insta-kill.", gender:"F"}, //female
    {class: 'Bladewind', name: "Sadist", desc: "Half ATK Interval. DMG - 20%. DMG + 8% of enemy's current HP. Regen 5% DMG.", gender:"M"},//male
    {class: 'Bladewind', name: "BladeDancer", desc: "Half ATK Interval. DMG - 20%. DMG +10% per hit. Regen 5% DMG.", gender:"F"},//female
    {class: 'Overlord', name: "Pride", desc: "SPD -25%. 15% chance to triple damage on hit. +5% chance per hit.", gender:"M"},//male
    {class: 'Overlord', name: "Domination", desc: "SPD -20%. ATK +50%. 25% chance to stun enemy.", gender:"F"},//female
    {class: 'Shade', name: "Deathblow", desc: "Increase ATK per SPD difference. Steal 5% SPD from enemy per attack.", gender:"M"}, //male
    {class: 'Shade', name: "Shadowspeed", desc: "ATK -30%. +4 ATK, 1% dodge chance (max 50%) for every 10 SPD. Dodge +5% per hit. (Reset on activation).", gender:"F"}, //female
    {class: 'Vanguard', name: "Piercing", desc: "Ignore 50% enemy DEF. Increase ATK by ignored DEF.", gender:"M"},//male
    {class: 'Vanguard', name: "Kiting", desc: "On hit, enemy ATK and DEF -5%, own Dodge +15%; on Dodge, ATK +10%, reset dodge chance.; ", gender:"F"}//female

]


//eqp
const tiers = ["G","F","E","D","C","B","A","S","SR"];
// var inventory = []; // equipment
// var weapons = [];
// var armor = [];
//mobs
// var enemyMob;
// var goldGoblinRun = 0; //save the last time goldGoblin was encountered
//dungeon
// var currentDungeon = "town";
// var currentFloor = 0;
// var currentRun = 0;
// var currentRoom, 
//maidens
// var maidens, var currentMaiden

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

//functions
function calcTotalStats(){
    calcAtk = parseInt(loadOuttotalAtk) + soul.atk;
    calcSpd = parseInt(loadOuttotalSpd)  + soul.spd;
    calcDef = parseInt(loadOuttotalDef)  + soul.def;
    calcHP = parseInt(loadOuttotalHP)  + soul.hp;
    calcDmg = calcAtk*3;
    calcAtkspd = calcSpd >= 430 ? 0.14 : 1 - (calcSpd * 0.002);
    calcHppoints = calcHP*5;
    
}
function populateStatMenu(){
    console.log(soul)
    $('#baseAtk').text(soul.atk);
    $('#baseSpd').text(soul.spd);
    $('#baseDef').text(soul.def);
    $('#baseHP').text(soul.hp);
    $('#availableStats').text(soul.availableStats);
    $('#totalAtk').text(calcAtk);
    $('#totalSpd').text(calcSpd);
    $('#totalDef').text(calcDef);
    $('#totalHP').text(calcHP);
    $('#totalAPS').text((1/calcAtkspd).toFixed(2));
    $('#totalHPP').text(calcHppoints);
}
function initTown(){
    checkMaidenQuests()
    
}


//mob functions
