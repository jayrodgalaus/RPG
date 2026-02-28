//GLOBAL VARIABLES

var db;
var soul;
const eqp_path = "assets/img/Equipment/";
const mob_path = "assets/img/Mobs/";
const npc_town_path = "assets/img/NPCs/Town/";
const npc_maidens_path = "assets/img/NPCs/Maidens/";
const portals_path = "assets/img/Portals/";
var inventory = [];
var loadOut = [];
var currentEqpPreview = {};
var loadOuttotalAtk = 0, loadOuttotalSpd = 0, loadOuttotalDef = 0, loadOuttotalHP = 0;
var calcAtk = 0, calcSpd = 0, calcDef = 0, calcHP = 0, calcDmg = 0, calcAtkspd = 0, calcHppoints = 0;
//mobs
var enemyMob;
var goldGoblinRun = 0; //save the last time goldGoblin was encountered
//dungeon
var currentDungeon = "town";
var currentFloor = 0;
var currentRun = 0;

//functions
function calcTotalStats(){
    console.log("calculating stats:")
    console.log(
        "loadOuttotalAtk", loadOuttotalAtk, "loadOuttotalSpd",loadOuttotalSpd, "loadOuttotalDef",loadOuttotalDef, "loadOuttotalHP", loadOuttotalHP
    )
    calcAtk = loadOuttotalAtk + soul.atk;
    calcSpd = loadOuttotalSpd  + soul.spd;
    calcDef = loadOuttotalDef  + soul.def;
    calcHP = loadOuttotalHP  + soul.hp;
    calcDmg = calcAtk*3;
    calcAtkspd = calcSpd >= 430 ? 0.14 : 1 - (calcSpd * 0.002);
    calcHppoints = calcHP*5;
    console.log("calcAtk", calcAtk, "calcSpd", calcSpd, "calcDef", calcDef, "calcHP", calcHP, "calcDmg", calcDmg, "calcAtkspd", calcAtkspd, "calcHppoints", calcHppoints);
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
