const maidens_path = "assets/img/NPCs/Maidens/";
const maiden_buffs = [
    {idx: 0, description: "Gives tome that grants +(current floor x (1 - 3)) random stats"},
    {idx: 1, description: "Gives random C-S rune"},
    {idx: 2, description: "Title slot unlock (max 1 slots unlocked this way) otherwise, +5% all stats, double damage every 5th attack until end of run"},
    {idx: 3, description: "+15% ATK and SPD"},
    {idx: 4, description: "+15% all stats"},
    {idx: 5, description: "Occasional healing 10% missing health"},
    {idx: 6, description: "+20% gold after run"},
    {idx: 7, description: "+20% mats after run"},
    {idx: 8, description: "+10% DEF"},
    {idx: 9, description: "+10% HP"},
    {idx: 10, description: "+30% Gold, ‑10% mats after run"},
    {idx: 11, description: "+50% damage every 5 hits "},
    {idx: 12, description: "+1% to all stats"},
    {idx: 13, description: "+2% to two random stats"},
    {idx: 14, description: "+10% ATK SPD, ‑6% HP"},
    {idx: 15, description: "+10% HP, ‑6% ATK"},
    {idx: 16, description: "Gold x 0% - 200% after each battle"},
    {idx: 17, description: "Gold x 50% - 150% after each battle"},
]
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
            location: Math.random() <= 0.5 ? "town" : "dungeon"
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
    }
}
