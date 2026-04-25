var dungeons = {}
const easyDungeons = ["goblins","kobolds","zombies","skeletons","ghosts"];
const midDungeons = ["arachne","cultists","fallen"];
const lateDungeons = ["demons","angels","abyss"];
const lastDungeon = ["abyss"];
const maps = ["Hemog Forest","Ari Cemetery","Ruins of Demog","The Crossroads","Abyss"];
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
var lastEncounter = null;
var goblinTimeout = null;
function populateDungeonFloors(){
    let dungeonText = $('#mapMenuDungeonList button.active').text().toLowerCase();
    let currentDungeon = dungeons[dungeonText];
    let floorHTML = '';
    let floor = 1;
    while(floor <= currentDungeon.maxFloor ){
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
    $('#mobImg').removeClass('dead')
    setTimeout(function(){
        
        atkInterval = setInterval(function(){attack(maxEHP)},currentASPD*1000);
        hitInterval = setInterval(function(){enemyAttack()},enemyMob.atkspd*1000);
        $('#PActB').css({'animation':`actionLoading ${currentASPD}s infinite`});
        console.log(enemyMob.name)
        if(enemyMob.name == "Gold Goblin" || enemyMob.name == "Elite Gold Goblin"){
            goblinTimeout = setTimeout(
                function(){
                    clearInterval(atkInterval); clearInterval(hitInterval);
                    console.log('reward triggered from initFightMenu')
                    triggerReward(true);
                }
                ,5000);
            $('#EName').addClass('gold')
        }else if(enemyMob.name == "Death" || enemyMob.name == "Elite Death"){
            $('#EName').addClass('death')
        }else{
            $('#EName').removeClass('gold death')
        }
    }, 500)
    

}
async function getDungeonState(){
    const tx = db.transaction("Dungeon", "readwrite");
    const store = tx.objectStore("Dungeon");
    let req = store.get(1);
    req.onsuccess = async () => {
        let dungeonState = req.result;
        console.log(dungeonState)
        dungeons = dungeonState.dungeons;
        currentRun = dungeonState.currentRun;
        $('#runCount').text(`Run ${currentRun}`)
    }
    // resolve("Dungeon State fetched");
}
async function updateDungeonState(){
    console.log('updateDungeonState')
    const tx = db.transaction("Dungeon", "readwrite");
    const store = tx.objectStore("Dungeon");
    let dungeonText = $('#mapMenuDungeonList button.active').text().toLowerCase();
    let dungeonMaxFloor = dungeons[dungeonText].maxFloor;
    dungeons[dungeonText].maxFloor = currentFloor > dungeonMaxFloor ? currentFloor : dungeonMaxFloor;
    store.put({
        id: 1,
        dungeons: dungeons,
        currentRun: currentRun,
    });
    $('#runCount').text(`Run ${currentRun}`)
    tx.oncomplete = () => //console.log("dungeon state updated in IndexedDB:",dungeons[dungeonText]);
    tx.onerror = () => reject(getRequest.error);
}
async function startRun(){
    console.log('startRun');
    clearDungeonMenus();
    resetDungeon();
    currentRun += 1;
    currentATK = calcAtk;
    currentDmg = calcDmg;
    currentSPD = calcSpd;
    currentASPD = calcAtkspd;
    currentDEF = calcDef;
    currentHP = calcHppoints;
    currentMaxHP = calcHppoints;
    currentRoom = 0; 
    currentMobRate +=  refinerMobSpawnBuff();

    nextRoom();
}
async function nextRoom() {
    console.log('nextRoom')
    triggerTransition();
    clearDungeonMenus();
    if(currentFloor == 0){return;}
    currentRoom += 1;
    if(currentFloor % 10 == 0 && currentRoom == 6){
        if(currentFloor == 50){
            let dungeonText = $('#mapMenuDungeonList button.active').text().toLowerCase();
            dungeons[dungeonText].apexClear = true;
        }
        spawnPortal(0);
    }else if(currentFloor % 10 == 0 && currentRoom < 6){
        // console.log("currentFloor:",currentFloor, " currentRoom:",currentRoom)
        currentRoom = 5;
        if(currentFloor != 50){
            $('#bossMenu').removeClass('d-none');
            changeDungeonPanelBG('bossPortal')
        }else{
            $('#apexMenu').removeClass('d-none');
            changeDungeonPanelBG('apexPortal')
        }
    }else if(easyDungeons.includes(currentDungeon.species) && !maidenQ1Complete && currentRoom == 5 && currentFloor == 9){
        setActiveMaiden(3);
        $('#maidenMenu').removeClass('d-none');
        $('#maidenBuffText').html(currentMaiden.buff.description);
        $('#dungeonPanel').css({'background-image':`url('${currentMaiden.img}')`});
    }else if(easyDungeons.includes(currentDungeon.species) && !maidenQ1Complete && currentRoom == 5 && currentFloor == 19){
        setActiveMaiden(4);
        $('#maidenMenu').removeClass('d-none');
        $('#maidenBuffText').html(currentMaiden.buff.description);
        $('#dungeonPanel').css({'background-image':`url('${currentMaiden.img}')`});
    }else{
        if(currentRoom >= 6){
            currentRoom = 0;
            currentFloor++;
            
            // console.log("currentFloor:",currentFloor, " currentRoom:",currentRoom)
            //next floor logic
            $('#nextFloorMenu').removeClass('d-none');
            changeDungeonPanelBG('next')
            if(currentFloor % 10 == 0 && currentRoom < 6){
                currentRoom = 5;
                if(currentFloor != 50){
                    clearDungeonMenus();
                    $('#bossMenu').removeClass('d-none');
                    changeDungeonPanelBG('bossPortal')
                }else{
                    clearDungeonMenus();
                    $('#apexMenu').removeClass('d-none');
                    changeDungeonPanelBG('apexPortal')
                }
            }else{
                
            }
        }else{
            
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
            }else if(encounterRoll > enemyEncounter && encounterRoll <= maidenEncounter){
                setActiveMaiden();
                if(currentMaiden){
                    $('#maidenMenu').removeClass('d-none');
                    $('#maidenBuffText').text(currentMaiden.buff.description);
                    $('#dungeonPanel').css({'background-image':`url('${currentMaiden.img}')`});
                }else{
                    spawnMob();
                    // let bg = enemyMob.img;
                    // $('#dungeonCanvas').show();
                    // $('#dungeonPanel').css({'background-image':`url('${bg}')`})
                    // initFightMenu();
                }
                
            }else if(encounterRoll > maidenEncounter && encounterRoll <= thiefEncounter){
                if(lastEncounter && lastEncounter == 'thief'){
                    spawnMob();
                }else{
                    let stolenGold = Math.floor(Math.max(collectedGold * 0.1, currentFloor*5));
                    collectedGold -= stolenGold;
                    $('#thiefMenu').removeClass('d-none');
                    $("#stolenGold").text(stolenGold);
                    changeDungeonPanelBG('thief');
                    lastEncounter = 'thief';
                }
                
            }else if(encounterRoll > thiefEncounter && encounterRoll <= statueEncounter){
                if(lastEncounter && lastEncounter == 'statue'){
                    spawnMob();
                }else{
                    changeDungeonPanelBG('statue')
                    $('#statueMenu').removeClass('d-none');
                    regen(0.2);
                    lastEncounter = 'statue';
                }
                
            }else if(encounterRoll > statueEncounter && encounterRoll <= chestEncounter){
                if(lastEncounter && lastEncounter == 'chest'){
                    spawnMob();
                }else{
                    let foundGold = Math.floor(Math.min(collectedGold * 0.05, currentFloor*5));
                    collectedGold +=  foundGold;
                    $('#chestMenu').removeClass('d-none');
                    $("#foundGold").text(foundGold);
                    changeDungeonPanelBG('chest');
                    lastEncounter = 'chest';
                }
            }else if(encounterRoll <= portalEncounter){
                if(lastEncounter && lastEncounter == 'portal'){
                    spawnMob();
                }else{
                    spawnPortal();
                    lastEncounter = 'portal';
                }
            }else{
                spawnMob(false,false,'abyss');
                // let bg = enemyMob.img;
                // $('#dungeonCanvas').show();
                // $('#dungeonPanel').css({'background-image':`url('${bg}')`})
                // initFightMenu();
            }

        }
    }
    // console.log(" floor ",currentFloor,"room ",currentRoom)
    
}
function bossFight(){
    console.log('bossFight')
    clearDungeonMenus();
    let isApex = currentFloor == 50;
    let isBoss = currentFloor % 10 == 0 && currentFloor != 50;
    spawnMob(isBoss,isApex);
    // let bg = enemyMob.img;
    // $('#dungeonPanel').css({'background-image':`url('${bg}')`})
    // initFightMenu('boss');
}
function triggerTransition(){
    console.log('triggerTransition')
    $('#transitionOverlay').addClass('transitioning');
    setTimeout(function(){$('#transitionOverlay').removeClass('transitioning');}, 1100)
}
function triggerHitTaken(){
    console.log('triggerHitTaken')
    $('#hitOverlay').addClass('transitioning');
    setTimeout(function(){$('#hitOverlay').removeClass('transitioning');}, 500)
}
async function triggerReward(isGoldGob = false, escape = false){
    // console.log('triggerReward')
    let matRewardText = "";
    let eqpText = "";
    clearInterval(atkInterval);
    clearInterval(hitInterval);
    if(goblinTimeout){clearTimeout(goblinTimeout);}
    $('#PActB').removeAttr('style');
    let gold = 0;

    if(escape){
        
        consolidateGold(escape);
        consolidateMats(escape);
        gold = collectedGold;
        if(currentMaiden){
            if(!currentMaiden.isUnlocked) unlockMaiden();
            currentMaiden.location = "town";
            let spc = currentDungeon.species;
            if(easyDungeons.includes(spc) && !maidenQ1Complete && currentMaiden.idx == 3){
                maidenQ1Complete = true;
            }else if(easyDungeons.includes(spc) && !maidenQ2Complete && currentMaiden.idx == 4){
                maidenQ2Complete = true;
            }
            checkMaidenQuests();
            updateMaidenStatus();
        }
        await updateDungeonState();
        resetRefiner();
        resetDungeon();
    }else{
        $('#mobImg').addClass('dead')
        gold = enemyMob.gold;
        if(isGoldGob){
            let maxehp = parseInt($('#maxEHP').text());
            let currentehp = parseInt($('#currentEHP').text());
            gold = Math.round((1+((maxehp - currentehp) / maxehp))*enemyMob.gold);
        }
        if(currentMaiden){
            if(currentMaiden.idx == 16){
                gold = gold * (Math.round(Math.random() * 2));
            }else if(currentMaiden.idx == 17){
                gold = gold * (Math.round(0.5 + Math.random() * 1.5));
            }
        }
        collectedGold += gold;
        let mat = rollMaterialDrop();
        let eqp = await rollEqpDrop();
        matRewardText = "";

        if(mat != null && mat != undefined && mat != -1){
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
        if(eqp){
            eqpText = (eqp.displayName).trim()
        }
        // console.log("collectedGold",collectedGold);
    }
    
    changeMaidenLocations();
    $('#rewadGold').text("+"+gold+"g");
    $('#rewardMats').text(matRewardText);
    $('#rewardEqpt').text(eqpText);
    setTimeout(function(){$('#rewardOverlayCont').css({'left': 0});},300)
    

}
async function triggerDeath(){
    setTimeout(function(){
        let sfx = $('#deathsfx')[0].cloneNode();
        sfx.play();
    },300)
    
    triggerTransition();
    clearDungeonMenus();
    changeDungeonPanelBG('death');
    $('#deathMenu').removeClass('d-none');
    clearInterval(atkInterval);
    clearInterval(hitInterval);
    consolidateGold();
    consolidateMats();
    
    await updateDungeonState();
    resetRefiner();
    //reset dungeon initial values
    resetDungeon();
}
function clearDungeonMenus(){
    console.log('clearDungeonMenus')
    $('#deathMenu, #fightMenu, #nextFloorMenu,#maidenMenu, #thiefMenu, #chestMenu, #statueMenu, #bossMenu, #apexMenu, .portal-menu').addClass('d-none');
    $('#rewardOverlayCont').css({'left': '100vw'});
    $('#atkDmgTextArea').empty();
    $('#mobImg').removeAttr('style');
    $('#mobImg').removeClass('dead')
    clearInterval(atkInterval);
    clearInterval(hitInterval);
}
function changeDungeonPanelBG(bg = ''){
    $('#dungeonPanel').removeClass('next maiden thief statue chest bossPortal apexPortal death').addClass(bg).removeAttr('style');
    $('#mobImg').removeAttr('style');
}
function attack(maxEHP){
    if(enemyMob.hpPoints > 0){
        let sfxindex = Math.round((Math.random() * 2))
        let atksfx = $('.hitsfx')[sfxindex].cloneNode();
        atksfx.play();
        atkCounter++;
        // $('#dungeonPanel').addClass('shake');
        // setTimeout(function(){$('#dungeonPanel').removeClass('shake');},120);
        $('#mobImg').addClass('shake');
        setTimeout(function(){$('#mobImg').removeClass('shake');},120);
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
        triggerReward();
    }
    
}
function enemyAttack(){
    if(currentHP > 0){
        
        let baseDmg = Math.max(enemyMob.dmg - currentDEF, Math.floor(enemyMob.dmg * enemyMob.minDmg));
        let randomMultiplier = 0.9 + Math.random() * 0.2;  // 0.9 ~ 1.1
        let finalDmg = Math.floor(baseDmg * randomMultiplier);
        if(finalDmg > 0){
            $('#PHBCont').addClass('shake');
            setTimeout(function(){$('#PHBCont').removeClass('shake');},120);
        }
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
    console.log('resetDungeon')
    changeMaidenLocations();
    baseMobSpawnRate = 0.6;
    currentMobRate = baseMobSpawnRate;
    let dungeonText = $('#mapMenuDungeonList button.active').text().toLowerCase();
    currentDungeon = dungeons[dungeonText];
    let activeFloor = $('#mapMenuFloorList button.active').attr('floor');
    currentFloor = parseInt( activeFloor ? activeFloor : 0);
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
    populateDungeonFloors();
    $('#startRunBtn').addClass('invisible');
}
function spawnAtkDmg(dmg,color="light"){
    console.log('spawnAtkDmg')
    let $el = $(`<div class="text-${color}} pop dmg-text">${dmg}</div>`);
    let rotation = Math.floor(Math.random()*360)
    let $slash = $(`<div class="slash"><div class="slash-trail" style="transform: rotate(${rotation}deg);"></div></div> `);
    $('#atkDmgTextArea').append($el).append($slash);
    $el.on('animationend', () => $el.remove());
    $slash.on('animationend', () => $slash.remove());
}
function regen(regen){
    console.log('regen')
    let heal = Math.round((currentMaxHP - currentHP)*regen);
    currentHP = Math.min(currentHP + heal, currentMaxHP);
    let barHeight = (currentHP / currentMaxHP)*100;
    $('#PHB').css({'height': `${barHeight}%`});
}
function consolidateGold(escape = false){
    console.log('consolidateGold',escape)
    if(escape){
        if(currentMaiden && (currentMaiden.idx == 6 || currentMaiden.idx == 10)) collectedGold *= 1.2;
    }
    $('#collectedGold').text(`${collectedGold}g`);
    $('#rewadGold').text(`${collectedGold}g`);
    let totalGold = Math.round(soul.gold + collectedGold);
    
    soul.updateGold(totalGold);
}
function consolidateMats(escape=false){
    console.log('consolidateMats')
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
    }else{
        $('#collectedMats').html('');
    }
}