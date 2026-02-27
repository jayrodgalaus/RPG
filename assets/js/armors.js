const armorTypes = [
    { type: "Shield", slot: 2, atk_chance: 0.10, spd_chance: 0.05, def_chance: 0.55, hp_chance: 0.30 },
    { type: "Helmet", slot: 3,     atk_chance: 0.15, spd_chance: 0.20, def_chance: 0.35, hp_chance: 0.30 },
    { type: "Breastplate", slot: 4,atk_chance: 0, spd_chance: 0.10, def_chance: 0.50, hp_chance: 0.40 },
    { type: "Gloves", slot: 5,     atk_chance: 0.25, spd_chance: 0.40, def_chance: 0.20, hp_chance: 0.15 },
    { type: "Greaves", slot: 6,    atk_chance: 0.10, spd_chance: 0.30, def_chance: 0.30, hp_chance: 0.30 }
];
const armorList = [
    //Beginner
    /* 0 */{category:"armor", name: "Helmet", type: armorTypes[1], img: eqp_path+"Beginner/3.webp", mob:"Beginner"},
    /* 1 */{category:"armor", name: "Breastplate", type: armorTypes[2], img: eqp_path+"Beginner/4.webp", mob:"Beginner"},
    /* 2 */{category:"armor", name: "Gloves", type: armorTypes[3], img: eqp_path+"Beginner/5.webp", mob:"Beginner"},
    /* 3 */{category:"armor", name: "Greaves", type: armorTypes[4], img: eqp_path+"Beginner/6.webp", mob:"Beginner"},
    //Fallen
    /* 4 */{category:"armor", name: "Shield", type: armorTypes[0], img: eqp_path+"Shield/Fallen/F.webp", mob:"Fallen"},
    /* 5 */{category:"armor", name: "Helmet", type: armorTypes[1], img: eqp_path+"Helmet/Fallen/D.webp", mob:"Fallen"},
    /* 6 */{category:"armor", name: "Breastplate", type: armorTypes[2], img: eqp_path+"Breastplate/Fallen/C.webp", mob:"Fallen"},
    /* 7 */{category:"armor", name: "Gloves", type: armorTypes[3], img: eqp_path+"Gloves/Fallen/B.webp", mob:"Fallen"},
    /* 8 */{category:"armor", name: "Greaves", type: armorTypes[4], img: eqp_path+"Greaves/Fallen/A.webp", mob:"Fallen"},
];