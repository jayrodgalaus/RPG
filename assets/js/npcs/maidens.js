const maidens_path = "assets/img/NPCs/Maidens/";
const maiden_buffs = [
    {idx: 0, description: "Gives tome that grants +(current floor x (1 - 3)) random stats"},
    {idx: 1, description: "Gives random C-S rune"},
    {idx: 2, description: "Title slot unlock (max 1 slots unlocked this way) otherwise, +5% all stats, double damage every 5th attack until end of run"},
    {idx: 3, description: "+15% ATK and SPD"},
    {idx: 4, description: "+15% all stats"},
    {idx: 5, description: "Occasional healing 10% missing health"},
    {idx: 6, description: "+20% gold after run"},
    {idx: 7, description: "+20% dungeon mats after run"},
    {idx: 8, description: "+10% DEF"},
    {idx: 9, description: "+10% HP"},
    {idx: 10, description: "+20% Gold, ‑10% mats after run"},
    {idx: 11, description: "+50% damage every 5 hits "},
    {idx: 12, description: "+1% to all stats"},
    {idx: 13, description: "+2% to two random stats"},
    {idx: 14, description: "+10% ATK SPD, ‑6% HP"},
    {idx: 15, description: "+10% HP, ‑6% ATK"},
    {idx: 16, description: "Gold x 0% - 200% after each battle"},
    {idx: 17, description: "Gold x 50% - 150% after each battle"},
]
var unlockedMaidens = [];
var maidens_SR = generateMaidenList(["Vaelith", "Seraphine", "Veyra"],0);
var maidens_S = generateMaidenList(["Enchantress","Aura Master"],3);
var maidens_A = generateMaidenList(["Calistra","Zephyra", "Orlith", "Maerith", "Dravenna", "Nyxara", "Noctira"],5);
var maidens_B = generateMaidenList(["Elira","Morrigan", "Kaelenne", "Isolde"],12);
var maidens_C = generateMaidenList(["Thalira","Lilith"],16);
var maidenQ1Complete = false;
var maidenQ2Complete = false;


function generateMaidenList(names, idx) {
    return names.map(name => {
        const maiden = {
            idx: idx,
            name: name,
            img: maidens_path + name + ".webp",
            buff: maiden_buffs[idx],
            location: Math.random() <= 0.5 ? "town" : "dungeon",
            isUnlocked: unlockedMaidens.includes(idx) //check if idx is in unlockedMaidens
        };
        idx++; // increment after creating the object
        return maiden;
    });
}
function updateMaidenLocation(){
    maidens_S[0].location = maidenQ1Complete ? "town" : "dungeon"; // enchantress
    maidens_S[1].location = maidenQ2Complete ? "town" : "dungeon"; // auramaster
    
    let maidenBrackets = [maidens_SR,maidens_A,maidens_B, maidens_C];
    maidenBrackets.forEach(bracket =>{
        bracket.forEach(maiden => {
            maiden.location = Math.random() <= 0.5 ? "town" : "dungeon"
        });
    })
    
}

function setActiveMaiden(){
    if (!currentMaiden){
        let SRChance = 0.05;
        let AChance = SRChance + 0.175;
        let BChance = AChance + 0.475
        let CChance = BChance + 0.3;
        let bracket;
        while(!bracket){
            let roll = Math.random();
            if(roll <= SRChance){
                bracket = maidens_SR;
            }else if(roll <= AChance){
                bracket = maidens_A;
            }else if(roll <= BChance){
                bracket = maidens_B;
            }else if(roll <= CChance){
                bracket = maidens_C;
            }
        }
        currentMaiden = bracket[Math.floor(Math.random() * bracket.length)];
        applyMaidenBuff()
    }
}

function applyMaidenBuff(){
    switch (currentMaiden.idx){
        case 0:
        // "Gives tome that grants +(current floor x (1 - 3)) random stats"},
            bag.push(consumables[0]);
            break;
        case 1:
        // "Gives random C-S rune"},
            break;
        case 2: 
        // "Title slot unlock (max 1 slots unlocked this way) otherwise, +5% all stats, double damage every 5th attack until end of run"},
            if(!soul.title1Unlocked){
                soul.title1Unlocked = true;
                soul.update();
            }else{
                currentATK *= 1.02;                
                currentDmg = Math.floor(currentATK*3);
                currentSPD *= 1.02;
                currentASPD = currentSPD >= 430 ? 0.14 : 1 - (currentSPD * 0.002);
                currentDEF *= 1.02;
                currentHP += calcHppoints * 0.02;
                currentMaxHP += calcHppoints * 0.02;          
            }
            break;
        case 3:
        // "+15% ATK and SPD"},
            currentATK *= 1.15;                
            currentDmg = Math.floor(currentATK*3);
            currentSPD *= 1.15;
            currentASPD = currentSPD >= 430 ? 0.14 : 1 - (currentSPD * 0.002);
            break;
        case 4:
        // "+15% all stats"},
            currentATK *= 1.15;                
            currentDmg = Math.floor(currentATK*3);
            currentSPD *= 1.15;
            currentASPD = currentSPD >= 430 ? 0.14 : 1 - (currentSPD * 0.002);
            currentDEF *= 1.15;
            currentHP += calcHppoints * 0.02;
            currentMaxHP += calcHppoints * 0.02;
            break;
        case 5:
        // "Occasional healing 10% missing health"},
            break;
        case 6:
        // "+20% gold after run"},
            break;
        case 7:
        // "+20% mats after run"},
            break;
        case 8:
        // "+10% DEF"},
            currentDEF *= 1.1;
            break;
        case 9:
        // "+10% HP"},
            currentHP += calcHppoints * 0.02;
            currentMaxHP += calcHppoints * 0.02;
            break;
        case 10:
        // "+20% Gold, ‑10% mats after run"},
            break;
        case 11:
        // "+50% damage every 5 hits "},
            break;
        case 12:
        // "+1% to all stats"},
            currentATK *= 1.01;                
            currentDmg = Math.floor(currentATK*3);
            currentSPD *= 1.01;
            currentASPD = currentSPD >= 430 ? 0.14 : 1 - (currentSPD * 0.002);
            currentDEF *= 1.01;
            currentHP += calcHppoints * 0.01;
            currentMaxHP += calcHppoints * 0.01;  
            break;
        // "+2% to two random stats"},
        case 13:
            if(Math.random() <= 0.5){
                currentATK *= 1.02;                
                currentDmg = Math.floor(currentATK*3);
            }else{
                currentSPD *= 1.02;
                currentASPD = currentSPD >= 430 ? 0.14 : 1 - (currentSPD * 0.002);
            }
            if(Math.random() <= 0.5){
                currentDEF *= 1.02;                
            }else{
                currentHP += calcHppoints * 0.02;
                currentMaxHP += calcHppoints * 0.02;  
            }
            break;
        case 14:
        // "+10% ATK SPD, ‑6% HP"},
            currentSPD *= 1.1;
            currentHP -= calcHppoints * 0.06;
            currentMaxHP -= calcHppoints * 0.06;  
            break;
        case 15:
        // "+10% HP, ‑6% ATK"},
            currentATK *= 0.94;                
            currentDmg = Math.floor(currentATK*3);
            currentHP += calcHppoints * 0.1;
            currentMaxHP += calcHppoints * 0.1;  
        // "Gold x 0% - 200% after each battle"},
        // "Gold x 50% - 150% after each battle"},
    }
}
function unlockMaiden(){
    if(!unlockedMaidens.includes(currentMaiden.idx)){
        unlockedMaidens.push(currentMaiden.idx);
        currentMaiden.isUnlocked = true;
        const tx = db.transaction("Maidens", "readwrite");
        const store = tx.objectStore("Maidens");
        store.put({ id: 1, unlockedMaidens:unlockedMaidens });
        tx.oncomplete = () => console.log("Maidens updated in IndexedDB");
        tx.onerror = () => console.error("Failed to update Soul in IndexedDB");
    }
}