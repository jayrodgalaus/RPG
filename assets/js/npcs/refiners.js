const refiners_path = npc_town_path+"Refiners/"
var refiners = [
    {name: "Lira", salary: 150, img:refiners_path+"1.webp" , description: "+5% dungeon mats, +10% random mats"},
    {name: "Aria", salary: 250, img:refiners_path+"2.webp" , description: "+15% dungeon mats after run"},
    {name: "Kaela", salary: 375, img:refiners_path+"3.webp" , description: "+10% dungeon mats, +5% random mats"},
    {name: "Mira", salary: 450, img:refiners_path+"4.webp" , description: "15% chance to double mats after run"},
    {name: "Selene", salary: 600, img:refiners_path+"5.webp" , description: "+20% random mats "},
    {name: "Talia", salary: 2600, img:refiners_path+"6.webp" , description: "+10% enemy spawn rate"},
];
var activeRefinerIndex;
var activeRefiner;

var refinerHireRun = 0;
function isRefinerPayable(){
    if(activeRefiner)
        return soul.gold >= activeRefiner.salary;
}
function resetRefiner(){
    if(activeRefiner){
        if ((currentRun - refinerHireRun) % 5 == 0){//pay every 5 runs
            if(!isRefinerPayable()){
                //end contract
                activeRefiner = null;
                refinerHireRun = 0;
                $('#background.storage').css({"background-image": 'url("../img/Backgrounds/storage.webp")'});

            }else{
                soul.gold -= activeRefiner.salary;
            }
        }
    }
}
function hireRefiner(index){
    activeRefinerIndex = index;
    activeRefiner = refiners[index];
    refinerHireRun = currentRun;
    $('#background.storage').css({"background-image": 'url("'+activeRefiner.img+'")'});
}
function populateRefinerMenu() {
    let menuHTML = '';
    for (let i = 0; i < refiners.length; i += 3) {
        menuHTML += `<div class="d-flex align-items-center justify-content-center mt-${i === 0 ? 2 : 3}">`;
        
        // group of 3 refiners
        for (let j = i; j < i + 3 && j < refiners.length; j++) {
            const refiner = refiners[j];
            menuHTML += `
                <div class="d-flex flex-column align-items-center justify-content-center mx-auto" id="refiner${j}" refinerIndex=${j}>
                    <div class="npc-portrait" 
                         style="background-image: url('${refiner.img}'); 
                                background-size: cover; 
                                background-position: center;">
                    </div>
                    <button class="btn btn-light btn-sm mt-1 mx-auto" ${soul.gold < refiner.salary ? 'disabled="disabled"' : ''}>
                        <strong>${refiner.salary}g</strong>
                    </button>
                </div>
            `;
        }

        menuHTML += `</div>`;
    }

    // Example usage: append to parent
    $('#refinerList').html(menuHTML);
}



