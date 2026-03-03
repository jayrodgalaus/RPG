const maidens_path = "assets/img/NPCs/Maidens/";
const maiden_buffs = [
    {idx: 0, description: ""},
    {idx: 1, description: ""},
    {idx: 2, description: ""},
    {idx: 3, description: ""},
    {idx: 4, description: ""},
    {idx: 5, description: ""},
    {idx: 6, description: ""},
    {idx: 7, description: ""},
    {idx: 8, description: ""},
    {idx: 9, description: ""},
    {idx: 10, description: ""},
    {idx: 11, description: ""},
    {idx: 12, description: ""},
    {idx: 13, description: ""},
    {idx: 14, description: ""},
    {idx: 15, description: ""},
    {idx: 16, description: ""},
    {idx: 17, description: ""},
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
