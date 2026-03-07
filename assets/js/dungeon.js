var dungeons = {
    slimes: { species: "slimes", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.04 },
    goblins: { species: "goblins", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.05 },
    kobolds: { species: "kobolds", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.05 },
    zombies: { species: "zombies", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.05 },
    skeletons: { species: "skeletons", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.05 },
    ghosts: { species: "ghosts", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.05 },
    arachne: { species: "arachne", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.06 },
    cultist: { species: "cultists", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.06 },
    fallen: { species: "fallen", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.06 },
    demons: { species: "demons", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.07 },
    angels: { species: "angels", apexClear: false, apexClearCount: 0, maxFloor: 1, difficulty: 0.07 },
}
var baseMobSpawnRate = 0.6;
var currentMobRate = baseMobSpawnRate;
var currentDungeon = "town";
var currentFloor = 0;
var currentRun = 0;
var currentRoom = 0;
var currentMaiden;
var collectedGold = 0;
var collectedMats = [];
var currentATK = 0;
var currentDmg = 0;
var currentSPD = 1;
var currentDEF = 0;
var currentHP = 0;
var atkInterval;
var hitInterval;
function populateDungeonFloors(){
    let floorHTML = '';
    let floor = 1;
    while(floor <= 50 ){
        floorHTML += `<button type="button" class="list-group-item list-group-item-action list-group-item-light map-menu-btn" floor=${floor}>Level ${floor}</button>`
        floor ++;
    }
    $('#mapMenuFloorList').html(floorHTML)
}
function drawHealthBars(canvas,ctx, playerHP, enemyHP, enemyName) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = 'rgba(128,128,128,0.7)';
    // ctx.fillRect(0, 0, canvas.width, 70);
    // Enemy health bar (top)
    ctx.beginPath();
    ctx.roundRect(49, 19, canvas.width - 98, 22, 5); // full container
    ctx.fillStyle = '#ff9696'; // background color
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(50, 20, (enemyHP / enemyMob.hpPoints) * (canvas.width - 100), 20, 5); // current HP
    ctx.fillStyle = 'red';
    ctx.fill();

    // Enemy name placeholder
    ctx.fillStyle = 'White';
    ctx.font = '18px MedievalSharp';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'black'; ctx.shadowBlur = 4; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 2;
    ctx.fillText(enemyName, canvas.width / 2, 57);
    ctx.font = '12px Anaheim';
    ctx.fillText(`Floor ${currentFloor} Room ${currentRoom}`, canvas.width / 2, 70);
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
    
    // Player health bar (bottom)
    ctx.beginPath();
    ctx.roundRect(49, canvas.height - 41, canvas.width - 98, 23, 5); // full container
    ctx.fillStyle = '#5fff7f';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.stroke();


    ctx.beginPath();
    ctx.roundRect(50, canvas.height - 40, (playerHP / soul.hpPoints) * (canvas.width - 100), 20, 5); // current HP
    ctx.fillStyle = 'green';
    ctx.fill();
}
function initDungeonCanvas(){
 
    const canvas = document.getElementById('dungeonCanvas');
    const ctx = canvas.getContext('2d');

    // Match internal resolution to CSS size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Initial draw
    drawHealthBars(canvas,ctx, soul.hpPoints, enemyMob.hpPoints,enemyMob.name);
}
function initFightMenu(){
    $('#EName').text(enemyMob.name);
    $('#currentFloor').text(currentFloor);
    let roomText = currentFloor % 10 == 0 ? (currentFloor == 50 ? "Apex room" : "Boss room") : `Room ${currentRoom}`;
    $('#currentRoom').text(roomText);
    $('#currentHP').text(calcHppoints);
    $('#maxHP').text(calcHppoints);
    $('#currentEHP').text(enemyMob.hpPoints);
    $('#maxEHP').text(enemyMob.hpPoints);
    $('#fightMenu').removeClass('d-none');
    $('#PActB').css({'animation':`actionLoading ${calcAtkspd}s infinite`})
    atkInterval = setInterval(function(){attack()},calcAtkspd*1000);
    

}
async function updateDungeonState(){
    return new Promise((resolve, reject) => {
        const tx = db.transaction("Dungeon", "readwrite");
        const store = tx.objectStore("Dungeon");

        const getRequest = store.get(1);

        getRequest.onsuccess = async () => {
            let dungeonState = getRequest.result;

            if (!dungeonState) {
                console.log("No dungeonState found, creating new refiner state...");
                dungeonState = {
                    id: 1,
                    currentMobRate : currentMobRate,
                    currentDungeon: currentDungeon,
                    currentFloor: currentFloor,
                    currentRun: currentRun,
                    currentRoom: currentRoom,
                    currentMaiden: currentMaiden,
                };
                await new Promise(resolve => {
                    const req = store.add(dungeonState);
                    req.onsuccess = e => resolve(e.target.result);
                });
                resolve("dungeonState created");
            } else {
                store.put({
                    id: 1,
                    currentMobRate : currentMobRate,
                    currentDungeon: currentDungeon,
                    currentFloor: currentFloor,
                    currentRun: currentRun,
                    currentRoom: currentRoom,
                    currentMaiden: currentMaiden,
                });
                resolve("dungeonState state updated");
            }
        };

        getRequest.onerror = () => reject(getRequest.error);
    });
}
async function startRun(){
    clearDungeonMenus();
    currentATK = calcAtk;
    currentSPD = calcSpd;
    currentASPD = calcAtkspd;
    currentDEF = calcDef;
    currentHP = calcHppoints;
    currentRoom = 0; 
    currentMobRate +=  refinerMobSpawnBuff();
    //hide encounter menus
    nextRoom();
}
async function nextRoom() {
    triggerTransition();
    currentRoom += 1;
    clearDungeonMenus();
    $('#dungeonCanvas').hide();
    if(currentFloor % 10 == 0){
        if(currentFloor != 50){
            $('#bossMenu').removeClass('d-none');
            changeDungeonPanelBG('bossPortal')
            // $('#dungeonPanel').addClass('bossPortal').removeClass('next maiden thief statue chest apexPortal').removeAttr('style')
        }else{
            $('#apexMenu').removeClass('d-none');
            changeDungeonPanelBG('apexPortal')
            // $('#dungeonPanel').addClass('apexPortal').removeClass('maiden thief statue chest next bossPortal').removeAttr('style')
        }
        
    }else{
        if(currentRoom == 6){
            currentRoom = 0;
            currentFloor+=1;
            //next floor logic
            $('#nextFloorMenu').removeClass('d-none');
            // $('#dungeonPanel').addClass('next').removeClass('maiden thief statue chest bossPortal apexPortal').removeAttr('style')
            changeDungeonPanelBG('next')
            if(currentFloor % 10 == 0){
                if(currentFloor != 50){
                    clearDungeonMenus();
                    $('#bossMenu').removeClass('d-none');
                    // $('#dungeonPanel').addClass('bossPortal').removeClass('maiden thief statue chest apexPortal').removeAttr('style')
                    changeDungeonPanelBG('bossPortal')
                }else{
                    clearDungeonMenus();
                    $('#apexMenu').removeClass('d-none');
                    // $('#dungeonPanel').addClass('apexPortal').removeClass('maiden thief statue chest next bossPortal').removeAttr('style')
                    changeDungeonPanelBG('apexPortal')
                }
            }else{
                
            }
        }else{
            // await updateDungeonState();
            /* 
                Add computation of maiden bonus
            */
            //Add computation of refiner buff if applicable
            let enemyEncounter = currentMobRate;
            if(currentFloor == 1 && currentRoom == 1){
                enemyEncounter = 1; //no special encounters in first floor first room
            }        
            let otherEncounters = (1 - enemyEncounter)/5;
            let maidenEncounter = currentMaiden ? enemyEncounter : enemyEncounter + otherEncounters; //no encounters if there is a maiden
            enemyEncounter += currentMaiden ? otherEncounters : 0;
            let thiefEncounter = maidenEncounter + otherEncounters;
            let statueEncounter = thiefEncounter + otherEncounters;
            let chestEncounter = statueEncounter + otherEncounters;
            let portalEncounter = chestEncounter + otherEncounters;
            let encounterRoll = Math.random();
            if(encounterRoll <= enemyEncounter){
                spawnMob();
                let bg = enemyMob.img;
                $('#dungeonCanvas').show();
                $('#dungeonPanel').css({'background-image':`url('${bg}')`})
                initFightMenu();
                // initDungeonCanvas();
                // testing
                // collectedGold += enemyMob.gold;
            }else if(encounterRoll > enemyEncounter && encounterRoll <= maidenEncounter){
                setActiveMaiden();
                $('#maidenMenu').removeClass('d-none');
                $('#maidenBuffText').text(currentMaiden.buff.description);
                $('#dungeonPanel').css({'background-image':`url('${currentMaiden.img}')`});
            }else if(encounterRoll > maidenEncounter && encounterRoll <= thiefEncounter){
                let stolenGold = Math.floor(Math.min(collectedGold * 0.05, currentFloor*5));
                collectedGold -= stolenGold;
                // soul.updateGold(gold);
                $('#thiefMenu').removeClass('d-none');
                $("#stolenGold").text(stolenGold);
                // $('#dungeonPanel').addClass('thief').removeClass('maiden statue chest next bossPortal apexPortal').removeAttr('style')
                changeDungeonPanelBG('thief')
            }else if(encounterRoll > thiefEncounter && encounterRoll <= statueEncounter){
                // $('#dungeonPanel').addClass('statue').removeClass('maiden thief chest next bossPortal apexPortal').removeAttr('style');
                changeDungeonPanelBG('statue')
                $('#statueMenu').removeClass('d-none');
                let heal = Math.floor((soul.hpPoints - currentHP)*0.2);
                currentHP = Math.min(currentHP + heal, soul.hpPoints);
                console.log(`healed ${heal} HP`);
            }else if(encounterRoll > statueEncounter && encounterRoll <= chestEncounter){
                let foundGold = Math.floor(Math.min(collectedGold * 0.05, currentFloor*5));
                collectedGold +=  foundGold;
                // soul.updateGold(gold);
                $('#chestMenu').removeClass('d-none');
                $("#foundGold").text(foundGold);
                // $('#dungeonPanel').addClass('chest').removeClass('maiden thief statue next bossPortal apexPortal').removeAttr('style')
                changeDungeonPanelBG('chest')
            }else if(encounterRoll <= portalEncounter){
                spawnPortal();
            }

        }
    }
    console.log(" floor ",currentFloor,"room ",currentRoom)
    
}
function bossFight(){
    console.log("boss fight")
    clearDungeonMenus()
    let isApex = currentFloor == 50;
    let isBoss = currentFloor % 10 == 0 && currentFloor != 50;
    spawnMob(isBoss,isApex);
    let bg = enemyMob.img;
    // $('#dungeonCanvas').show();
    $('#dungeonPanel').css({'background-image':`url('${bg}')`})
    // initDungeonCanvas();
    initFightMenu();
}
function triggerTransition(){
    $('#transitionOverlay').addClass('transitioning');
    setTimeout(function(){$('#transitionOverlay').removeClass('transitioning');}, 1100)
}
function triggerHitTaken(){
    $('#hitOverlay').addClass('transitioning');
    setTimeout(function(){$('#hitOverlay').removeClass('transitioning');}, 500)
}
function triggerReward(){
    $('#rewardOverlayCont').css({'left': 0});
}
function clearDungeonMenus(){
    console.log('dungeon menu cleared')
    $('#fightMenu, #nextFloorMenu,#maidenMenu, #thiefMenu, #chestMenu, #statueMenu, #bossMenu, #apexMenu, .portal-menu').addClass('d-none');
}
function changeDungeonPanelBG(bg){
    console.log('dungeon bg changed to ',bg)
    $('#dungeonPanel').removeClass('next maiden thief statue chest bossPortal apexPortal').addClass(bg).removeAttr('style')
}
function attack(){
    if(enemyMob.hpPoints > 0){
        $('#dungeonPanel').addClass('shake');
        setTimeout(function(){$('#dungeonPanel').removeClass('shake');},120);
        
        console.log("enemyMob.hpPoints",enemyMob.hpPoints)
        let baseDmg = Math.max(calcAtk - enemyMob.def, calcAtk * soul.minDmg);
        let randomMultiplier = 0.9 + Math.random() * 0.2;  // 0.9 ~ 1.1
        let finalDmg = Math.floor(baseDmg * randomMultiplier);
        let reducedMobHp = Math.max(0, enemyMob.hpPoints - finalDmg);
        console.log("baseDmg:",baseDmg)
        console.log("randomMultiplier:",randomMultiplier)
        console.log("finalDmg:",finalDmg)
        console.log("reducedMobHp:",reducedMobHp)
        // bar width = current HP / max HP * 100
        let barWidth = (reducedMobHp / enemyMob.hpPoints) * 100;
        // reduce HP but not below 0
        enemyMob.hpPoints = reducedMobHp
        $('#currentEHP').text(enemyMob.hpPoints);
        $('#EHB').css({'width': `${barWidth}%`});
    }else{
        clearInterval(atkInterval);
        $('#PActB').removeAttr('style');
        collectedGold += enemyMob.gold;
        triggerReward()
    }
    
    // clearInterval(hitInterval);
}