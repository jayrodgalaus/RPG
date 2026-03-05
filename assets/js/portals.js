var portals = [
    {name:"tp1", img: portals_path+"tp1.webp", },
    {name:"tp2", img: portals_path+"tp2.webp", },
    {name:"tp3", img: portals_path+"tp3.webp", },
    {name:"tp4", img: portals_path+"tp4.webp", },
    {name:"gold", img: portals_path+"gold.webp", },
];

function spawnPortal(){
    let chance = 1 / 5;
    let roll = Math.random();
    let portal;
    if(roll <= chance){
        portal = portals[0];
    }else if(roll <= chance*2){
        portal = portals[1];
    }else if(roll <= chance*3){
        portal = portals[2];
    }else if(roll <= chance*4){
        portal = portals[3];
    }else if(roll <= chance*5){
        portal = portals[4];
    }
    $('#dungeonPanel').css({'background-image':`url('${portal.img}')`});
    $(`#${portal.name}portalMenu`).removeClass('d-none');
}