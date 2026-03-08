/* 
    early: 1-3, 1-5 specialty [DEF]
    mid: 3-5, 3-7 specialty [ATK,SPD]
    late: 5-7, 5-10 specialty [ATK,HP,DEF]
*/
/* 
    mat drop chance is base 40%
    mat drops = random from array of materialList where materialList obj.mob == dungeonMobs' mob.species)
*/
var materialList = [
    {id: 0, mob: "death", category:"material", name: "Soul", stat: "ATK", min: 10, max: 10},
    {id: 1, mob: "angels", category:"material", name: "Angel feather", stat: "SPD", min: 5, max: 7},
    {id: 2, mob: "angels", category:"material", name: "Angel hair", stat: "HP", min: 5, max: 7},
    {id: 3, mob: "angels", category:"material", name: "Corrupt ichor", stat: "ATK", min: 5, max: 10}, //specialty
    {id: 4, mob: "arachne", category:"material", name: "Carapace", stat: "DEF", min: 3, max: 5},
    {id: 5, mob: "arachne", category:"material", name: "Black silk", stat: "SPD", min: 3, max: 7}, //specialty
    {id: 6, mob: "cultists", category:"material", name: "Candle", stat: "HP", min: 3, max: 5},
    {id: 7, mob: "cultists", category:"material", name: "Virgin blood", stat: "ATK", min: 3, max: 7}, //specialty
    {id: 8, mob: "demons", category:"material", name: "Obsidian", stat: "DEF", min: 5, max: 7},
    {id: 9, mob: "demons", category:"material", name: "Hellfire", stat: "ATK", min: 5, max: 7},
    {id: 10, mob: "demons", category:"material", name: "Infernal ash", stat: "HP", min: 5, max: 10}, //specialty
    {id: 11, mob: "dragons", category:"material", name: "Dragon scale", stat: "DEF", min: 5, max: 7},
    {id: 12, mob: "dragons", category:"material", name: "Dragon tooth", stat: "ATK", min: 5, max: 7},
    {id: 13, mob: "dragons", category:"material", name: "Reverse scale", stat: "DEF", min: 5, max: 10}, //specialty
    {id: 14, mob: "fallen", category:"material", name: "Corrupt ichor", stat: "ATK", min: 3, max: 5},
    {id: 15, mob: "fallen", category:"material", name: "Corrupt ichor", stat: "SPD", min: 3, max: 5},
    {id: 16, mob: "fallen", category:"material", name: "Corrupt ichor", stat: "DEF", min: 3, max: 5},
    {id: 17, mob: "fallen", category:"material", name: "Corrupt ichor", stat: "HP", min: 3, max: 5},
    {id: 18, mob: "fallen", category:"material", name: "Madness", stat: "ATK", min: -3, max: 10}, //specialty 
    {id: 19, mob: "generic", category:"material", name: "Madness", stat: "ATK", min: -2, max: 5}, //specialty
    {id: 20, mob: "generic", category:"material", name: "Weapon shard", stat: "ATK", min: 1, max: 3}, 
    {id: 21, mob: "generic", category:"material", name: "Armor shard", stat: "DEF", min: 1, max: 3}, 
    {id: 22, mob: "generic", category:"material", name: "Monster Blood", stat: "HP", min: 1, max: 3}, 
    {id: 23, mob: "generic", category:"material", name: "Frenzy Stone", stat: "SPD", min: 2, max: 2},
]

function rollMaterialDrop(bonus=0) {
    // base 40% chance; 50% for boss, 60% for apex
    let base = enemyMob.isApex ? 0.6 : (enemyMob.isBoss ? 0.5 : 0.4);

    let drop_chance = bonus >= 0.6 ? 1 : base+bonus;  
    if (Math.random() <= (drop_chance)) {
        // filter materials by mobCategory

        let mats = materialList.filter(m => m.mob === enemyMob.category);
        if (mats.length > 0) {
            // pick random material and return only its id
            let mat = mats[Math.floor(Math.random() * mats.length)];
            return mat.id;
        }
    }
    return null; // no drop
}
function updateBag(){
    const tx = db.transaction("Bag", "readwrite");
    const store = tx.objectStore("Bag");
    store.put({id: 1, items:bag});

    tx.oncomplete = () => console.log("Bag updated");
    tx.onerror = () => console.error("Failed to update Soul in IndexedDB");
}
// global var collectedMats = [array of int ids]

function compileCollectedMats() {
    const counts = {};
    const result = [];

    // count each id
    for (let id of collectedMats) {
        counts[id] = (counts[id] || 0) + 1;
    }

    // convert to array of {id, cnt}
    for (let id in counts) {
        result.push({ id: parseInt(id), cnt: counts[id] });
    }

    return result;
}

function compileMats(src = "bag"){
    const counts = {};
    const result = [];
    let arr = src != "bag" ? collectedMats : bag;
    for (let id of arr) {
        counts[id] = (counts[id] || 0) + 1;
    }

    // convert to array of {id, cnt}
    for (let id in counts) {
        result.push({ id: parseInt(id), cnt: counts[id] });
    }

    return result;
}

function populateMatsTab(){
    let html = `<ul class="list-group list-group-flush">`;
    let matsList = compileMats();
    if(matsList.length > 0){
        matsList.forEach(drop => {
            let idx = materialList.findIndex(mat => mat.id === drop.id);
            let matData = materialList[idx];
            html += `<li class="list-group-item">${matData.name} x${drop.cnt}</li>`
        });
    }
    html += `</ul>`
    
    $('#mats-tab-pane').html(html);
}
