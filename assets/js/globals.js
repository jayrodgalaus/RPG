//GLOBAL VARIABLES

var db;
var soul;
const eqp_path = "assets/img/Equipment/";
const mob_path = "assets/img/Mobs/";
const npc_town_path = "assets/img/NPCs/Town/";
const portals_path = "assets/img/Portals/";
var bag = []; //mats and consumables
var inventory = []; // equipment
var loadOut = [];
var currentEqpPreview = {};
var loadOuttotalAtk = 0, loadOuttotalSpd = 0, loadOuttotalDef = 0, loadOuttotalHP = 0;
var calcAtk = 0, calcSpd = 0, calcDef = 0, calcHP = 0, calcDmg = 0, calcAtkspd = 0, calcHppoints = 0;
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
    calcAtk = loadOuttotalAtk + soul.atk;
    calcSpd = loadOuttotalSpd  + soul.spd;
    calcDef = loadOuttotalDef  + soul.def;
    calcHP = loadOuttotalHP  + soul.hp;
    calcDmg = calcAtk*3;
    calcAtkspd = calcSpd >= 430 ? 0.14 : 1 - (calcSpd * 0.002);
    calcHppoints = calcHP*5;
    
}
function populateStatMenu(){
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


//mob functions
