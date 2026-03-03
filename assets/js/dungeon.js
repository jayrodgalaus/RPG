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
var mobSpawnRate = 0.5;
var currentDungeon = "town";
var currentFloor = 0;
var currentRun = 0;
var currentRoom = 0;
var currentMaiden;
var collectedGold = 0;
var collectedMats = [];
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
                    mobSpawnRate: mobSpawnRate,
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
                    mobSpawnRate: mobSpawnRate,
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
    $('#dungeonCanvas').hide();
    //hide encounter menus
    $('#thiefMenu, #chestMenu').addClass('d-none');
    currentRoom += 1;
    console.log("room ",currentRoom)
    if(currentRoom == 6){
        //next floor logic
        if(currentFloor % 9 == 0){
            console.log("Spawn boss shit")
            // spawn boss shit
        }else{
            currentFloor+=1;
            $('#dungeonPanel').addClass('next').removeClass('maiden thief statue chest').removeAttr('style')
        }
        currentRoom = 0;

    }else{
        // await updateDungeonState();
        /* 
            Add computation of maiden bonus
        */
        //Add computation of refiner buff if applicable
        let enemyEncounter = (mobSpawnRate + refinerMobSpawnBuff());
        if(currentFloor == 1 && currentRoom == 1){
            enemyEncounter = 1; //no special encounters in first floor first room
        }        
        let otherEncounters = (1 - enemyEncounter)/4;
        let maidenEncounter = currentMaiden ? enemyEncounter : enemyEncounter + otherEncounters; //no encounters if there is a maiden
        let splitEncounters = currentMaiden ? otherEncounters/3 : 0; // split maiden probability to other encounters
        let thiefEncounter = maidenEncounter + otherEncounters + splitEncounters;
        let statueEncounter = thiefEncounter + otherEncounters + splitEncounters;
        let chestEncounter = statueEncounter + otherEncounters + splitEncounters;
        let encounterRoll = Math.random();
        if(encounterRoll <= enemyEncounter){
            spawnMob();
            let bg = enemyMob.img;
            $('#dungeonCanvas').show();
            $('#dungeonPanel').css({'background-image':`url('${bg}')`})
            initDungeonCanvas();
        }else if(encounterRoll > enemyEncounter && encounterRoll <= maidenEncounter){
            setActiveMaiden();
            $('#dungeonPanel').css({'background-image':`url('${currentMaiden.img}')`});
        }else if(encounterRoll > maidenEncounter && encounterRoll <= thiefEncounter){
            let stolenGold = Math.floor(Math.min(soul.gold * 0.05, currentFloor*5));
            let gold = soul.gold - stolenGold;
            soul.updateGold(gold);
            $('#thiefMenu').removeClass('d-none');
            $("#stolenGold").text(stolenGold);
            $('#dungeonPanel').addClass('thief').removeClass('maiden statue chest next').removeAttr('style')
        }else if(encounterRoll > thiefEncounter && encounterRoll <= statueEncounter){
            $('#dungeonPanel').addClass('statue').removeClass('maiden thief chest next').removeAttr('style')
        }else if(encounterRoll > statueEncounter && encounterRoll <= chestEncounter){
            let foundGold = Math.floor(Math.min(soul.gold * 0.05, currentFloor*5));
            let gold = soul.gold + foundGold;
            soul.updateGold(gold);
            $('#chestMenu').removeClass('d-none');
            $("#foundGold").text(foundGold);
            $('#dungeonPanel').addClass('chest').removeClass('maiden thief statue next').removeAttr('style')
        }
    }
}