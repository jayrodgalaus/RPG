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
var collectedEqp = [];
var currentATK = 0;
var currentDmg = 0;
var currentSPD = 1;
var currentDEF = 0;
var currentHP = 0;
var currentMaxHP = 0;
var atkInterval;
var hitInterval;
var atkCounter = 0;
function populateDungeonFloors(){
    let floorHTML = '';
    let floor = 1;
    while(floor <= 50 ){
        floorHTML += `<button type="button" class="list-group-item list-group-item-action list-group-item-light map-menu-btn" floor=${floor}>Level ${floor}</button>`
        floor ++;
    }
    $('#mapMenuFloorList').html(floorHTML)
}

function initFightMenu(type=""){
    $('#EName').text(enemyMob.name);
    $('#currentFloor').text(currentFloor);
    let roomText = currentFloor % 10 == 0 ? (currentFloor == 50 ? "Apex room" : "Boss room") : `Room ${currentRoom}`;
    $('#currentRoom').text(roomText);
    $('#currentHP').text(currentHP);
    $('#maxHP').text(currentMaxHP);
    $('#currentEHP').text(enemyMob.hpPoints);
    $('#EHB').css({'width':'100%'});
    let maxEHP = enemyMob.hpPoints;
    $('#maxEHP').text(maxEHP);
    $('#fightMenu').removeClass('d-none');
    
    setTimeout(function(){
        
        atkInterval = setInterval(function(){attack(maxEHP)},currentASPD*1000);
        hitInterval = setInterval(function(){enemyAttack()},enemyMob.atkspd*1000);
        $('#PActB').css({'animation':`actionLoading ${currentASPD}s infinite`});
        if(enemyMob.name == "Gold Goblin" || enemyMob.name == "Elite Gold Goblin"){
            setTimeout(function(){
                clearInterval(atkInterval); clearInterval(hitInterval);triggerReward(true);}
                ,10000);
            $('#EName').addClass('gold')
        }else if(enemyMob.name == "Death" || enemyMob.name == "Elite Death"){
            $('#EName').addClass('death')
        }else{
            $('#EName').removeClass('gold death')
        }
    }, 500)
    

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
    resetDungeon();
    currentATK = calcAtk;
    currentDmg = calcDmg;
    currentSPD = calcSpd;
    currentASPD = calcAtkspd;
    currentDEF = calcDef;
    currentHP = calcHppoints;
    currentMaxHP = calcHppoints;
    currentRoom = 0; 
    currentMobRate +=  refinerMobSpawnBuff();
    currentRun ++;

    nextRoom();
}
async function nextRoom() {
    triggerTransition();
    currentRoom += 1;
    clearDungeonMenus();
    $('#dungeonCanvas').hide();
    if(currentFloor % 10 == 0){
        if(currentFloor != 50){
            if(currentRoom > 1){
                currentFloor++;
                currentRoom = 5;
                nextRoom();
            }
            $('#bossMenu').removeClass('d-none');
            changeDungeonPanelBG('bossPortal')
        }else{
            $('#apexMenu').removeClass('d-none');
            changeDungeonPanelBG('apexPortal')
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
                regen(0.2)
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
            }else{
                currentRoom --;
                nextRoom();
            }

        }
    }
    console.log(" floor ",currentFloor,"room ",currentRoom)
    
}
function bossFight(){
    clearDungeonMenus()
    let isApex = currentFloor == 50;
    let isBoss = currentFloor % 10 == 0 && currentFloor != 50;
    spawnMob(isBoss,isApex);
    let bg = enemyMob.img;
    $('#dungeonPanel').css({'background-image':`url('${bg}')`})
    initFightMenu('boss');
}
function triggerTransition(){
    $('#transitionOverlay').addClass('transitioning');
    setTimeout(function(){$('#transitionOverlay').removeClass('transitioning');}, 1100)
}
function triggerHitTaken(){
    $('#hitOverlay').addClass('transitioning');
    setTimeout(function(){$('#hitOverlay').removeClass('transitioning');}, 500)
}
function triggerReward(isGoldGob = false, escape = false){
    let matRewardText = "";
    clearInterval(atkInterval);
    clearInterval(hitInterval);
    $('#PActB').removeAttr('style');
    

    if(escape){
        if(currentMaiden && !currentMaiden.isUnlocked){unlockMaiden();}
        consolidateGold(escape);
        consolidateMats(escape);
    }else{
        let gold = enemyMob.gold;
        if(isGoldGob){
            let maxehp = parseInt($('#maxEHP').text());
            let currentehp = parseInt($('#currentEHP').text());
            gold = Math.round((1+((maxehp - currentehp) / maxehp))*enemyMob.gold);
        }
        if(currentMaiden){
            if(currentMaiden.idx == 16){
                gold = Math.round(Math.random() * 2);
            }else if(currentMaiden.idx == 17){
                gold = Math.round(0.5 + Math.random() * 1.5);
            }
        }
        collectedGold += gold;
        let mat = rollMaterialDrop();
        matRewardText = "";
        if(mat){
            let matName = materialList[mat].name;

            matRewardText = matName;
            if(activeRefiner && activeRefiner.buff.idx == 6){
                let double = Math.random <= 0.2; //10% chance to double drop
                if(double){
                    collectedMats.push(mat);
                    matRewardText+=" x2";
                }
            }else{
                matRewardText+=" x1";
            }
            collectedMats.push(mat);
        }
    }
    
    $('#rewadGold').text("+"+enemyMob.gold+"g")
    $('#rewardMats').text(matRewardText)
    $('#rewardEqpt').text()
    
    
    $('#rewardOverlayCont').css({'left': 0});

}
function triggerDeath(){
    triggerTransition();
    clearDungeonMenus();
    changeDungeonPanelBG('death');
    $('#deathMenu').removeClass('d-none');
    clearInterval(atkInterval);
    clearInterval(hitInterval);
    consolidateGold();
    consolidateMats();
    
    //reset dungeon initial values
    resetDungeon();
}
function clearDungeonMenus(){
    console.log('dungeon menu cleared')
    $('#deathMenu, #fightMenu, #nextFloorMenu,#maidenMenu, #thiefMenu, #chestMenu, #statueMenu, #bossMenu, #apexMenu, .portal-menu').addClass('d-none');
    $('#rewardOverlayCont').css({'left': '100vw'});
    $('#atkDmgTextArea').empty();
}
function changeDungeonPanelBG(bg = ''){
    console.log('dungeon bg changed to ',bg)
    $('#dungeonPanel').removeClass('next maiden thief statue chest bossPortal apexPortal death').addClass(bg).removeAttr('style')
}
function attack(maxEHP){
    if(enemyMob.hpPoints > 0){
        atkCounter++;
        $('#dungeonPanel').addClass('shake');
        setTimeout(function(){$('#dungeonPanel').removeClass('shake');},120);
        let color="light";
        let baseDmg = Math.max(currentDmg - enemyMob.def, Math.floor(currentDmg * soul.minDmg));
        if(currentMaiden && atkCounter % 5 == 0 && atkCounter > 1){
            if(currentMaiden.idx == 2) {baseDmg *= 2; color = "danger"}
            else if(currentMaiden.idx == 5) regen(0.1);
            else if(currentMaiden.idx == 11) {baseDmg *= 1.5; color = "danger";}
        }
        let randomMultiplier = 0.99 + Math.random() * 0.02;  // 0.99 ~ 1.01
        let finalDmg = Math.floor(baseDmg * randomMultiplier);
        let reducedMobHp = Math.max(0, enemyMob.hpPoints - finalDmg);
        
        // bar width = current HP / max HP * 100
        let barWidth = (reducedMobHp / maxEHP) * 100;
        // reduce HP but not below 0
        enemyMob.hpPoints = reducedMobHp;
        $('#currentEHP').text(enemyMob.hpPoints);
        $('#EHB').css({'width': `${barWidth}%`});
        spawnAtkDmg(finalDmg,color);
        
        if(reducedMobHp == 0){
            atkCounter = 0;
            triggerReward();
        }
    }else{
        atkCounter = 0;
        triggerReward()
    }
}
function enemyAttack(){
    if(currentHP > 0){
        $('#PHBCont').addClass('shake');
        setTimeout(function(){$('#PHBCont').removeClass('shake');},120);
        let baseDmg = Math.max(enemyMob.dmg - currentDEF, Math.floor(enemyMob.dmg * enemyMob.minDmg));
        let randomMultiplier = 0.9 + Math.random() * 0.2;  // 0.9 ~ 1.1
        let finalDmg = Math.floor(baseDmg * randomMultiplier);
        let reducedPlayerHp = Math.max(0, currentHP - finalDmg);
        // bar width = current HP / max HP * 100
        let barHeight = (reducedPlayerHp / currentMaxHP) * 100;
        // reduce HP but not below 0
        currentHP = reducedPlayerHp;
        $('#currentHP').text(currentHP);
        $('#PHB').css({'height': `${barHeight}%`});
        if(currentHP == 0){
            triggerDeath();
        }
    }else{
        triggerDeath()
    }
}
function resetDungeon(){
    baseMobSpawnRate = 0.6;
    currentMobRate = baseMobSpawnRate;
    currentDungeon = dungeons[$('#mapMenuDungeonList button.active').text().toLowerCase()];
    currentFloor = parseInt($('#mapMenuFloorList button.active').attr('floor'));
    currentRoom = 0;
    currentMaiden = null;
    collectedGold = 0;
    collectedMats = [];
    collectedEqp = [];
    currentATK = 0;
    currentDmg = 0;
    currentSPD = 1;
    currentDEF = 0;
    currentHP = 0;
    currentMaxHP = 0;
    clearInterval(atkInterval);
    clearInterval(hitInterval);
    atkCounter = 0;
    calcTotalStats()
    $('#PHB').css({'height': `100%`});
    $('#PActB').removeAttr('style');
    $('#atkDmgTextArea').empty();
}
function spawnAtkDmg(dmg,color="light"){
    let $el = $(`<div class="text-${color}} pop dmg-text">${dmg}</div>`);
    $('#atkDmgTextArea').append($el);
    $el.on('animationend', () => $el.remove());
}
function regen(regen){
    let heal = Math.round((currentMaxHP - currentHP)*regen);
    currentHP = Math.min(currentHP + heal, currentMaxHP);
    let barHeight = (currentHP / currentMaxHP)*100;
    $('#PHB').css({'height': `${barHeight}%`});
}
function consolidateGold(escape = false){
    if(escape){
        if(currentMaiden && currentMaiden.idx == 6 || currentMaiden.idx == 10) collectedGold *= 1.2;
    }
    $('#collectedGold').text(`${collectedGold}g`);
    let totalGold = Math.round(soul.gold + collectedGold);
    
    soul.updateGold(totalGold);
}
function consolidateMats(escape=false){
    if(collectedMats.length > 0){
        if(activeRefiner){ applyRefinerBonus();}
        if(currentMaiden && currentMaiden.idx == 7){ applyRefinerBonus("m7"); }
        collectedMats.forEach(item =>{
            bag.push(item);
        });
        let compiledMats = compileMats("collected");
        if(compiledMats.length > 0){
            let collectedMatsText = '';
            compiledMats.forEach(drop => {
                let idx = materialList.findIndex(mat => mat.id === drop.id);
                let matData = materialList[idx];
                collectedMatsText += `<span class="icon-btn-text">${matData.name} x${drop.cnt}</span><br>`
            });
            $('#collectedMats').html(collectedMatsText);
        }
        updateBag();
    }
}