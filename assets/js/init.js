


// IndexedDB setup
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("RPGSlop", 7);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("Soul")) {
                db.createObjectStore("Soul", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("Inventory")) {
                db.createObjectStore("Inventory", { keyPath: "id", autoIncrement: true });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}


async function initSoul() {

    return new Promise((resolve, reject) => {
        const tx = db.transaction("Soul", "readwrite");
        const store = tx.objectStore("Soul");
        const getRequest = store.get(1); // single Soul record with id=1

        getRequest.onsuccess = () => {
            let soulData = getRequest.result;

            if (!soulData) {
                console.log("No Soul found, creating new one...");
                const newSoul = new Soul({ atk: 5, spd: 0, def: 0, hp: 5, availableStats: 15 });
                const putRequest = store.put({ id: 1, ...newSoul });

                putRequest.onsuccess = () => {
                    console.log("New Soul saved to IndexedDB");
                    resolve(newSoul);
                };
                putRequest.onerror = () => reject(putRequest.error);
            } else {
                console.log("Soul found in DB:", soulData);
                const existingSoul = new Soul(soulData);
                resolve(existingSoul);
            }
        };


        getRequest.onerror = () => reject(getRequest.error);
    });
}
async function initInventory() {

    return new Promise((resolve, reject) => {
        const tx = db.transaction("Inventory", "readwrite");
        const store = tx.objectStore("Inventory");

        const getAllRequest = store.getAll(); // get all records

        getAllRequest.onsuccess = async () => {
            let inventoryData = getAllRequest.result;

            if (!inventoryData || inventoryData.length === 0) {
                console.log("No equipment found, creating new starter set...");

                // create beginner weapon
                await createEquipment(db, { eqp_type: "weapon", eqp_id: 6, tier: "G", max_tier: "G" },false);
                // create beginner armor (helmet, breastplate, gloves, greaves)
                await createEquipment(db, { eqp_type: "armor", eqp_id: 0, tier: "G", max_tier: "G" }, false);
                await createEquipment(db, { eqp_type: "armor", eqp_id: 1, tier: "G", max_tier: "G" }, false);
                await createEquipment(db, { eqp_type: "armor", eqp_id: 2, tier: "G", max_tier: "G" }, false);
                await createEquipment(db, { eqp_type: "armor", eqp_id: 3, tier: "G", max_tier: "G" }, false);
                //create fallen equipment
                await createEquipment(db, { eqp_type: "weapon", eqp_id: 9, tier: "E", max_tier: "SR" }, true);
                await createEquipment(db, { eqp_type: "armor", eqp_id: 4, tier: "E", max_tier: "SR" }, true);
                await createEquipment(db, { eqp_type: "armor", eqp_id: 5, tier: "D", max_tier: "SR" }, true);
                await createEquipment(db, { eqp_type: "armor", eqp_id: 6, tier: "C", max_tier: "SR" }, true);
                await createEquipment(db, { eqp_type: "armor", eqp_id: 7, tier: "B", max_tier: "SR" }, true);
                await createEquipment(db, { eqp_type: "armor", eqp_id: 8, tier: "A", max_tier: "SR" }, true);
                
                resolve("Starter equipment created");
            } else {
                console.log("Equipment found in DB");
                // assign to your global inventory variable
                inventory = inventoryData.map(obj => Object.assign(new Equipment(obj), obj));
                resolve(inventoryData);
            }
        };

        getAllRequest.onerror = () => reject(getAllRequest.error);
    });
}
async function initDungeon() {

    return new Promise((resolve, reject) => {
        const tx = db.transaction("Dungeon", "readwrite");
        const store = tx.objectStore("Dungeon");

        const getAllRequest = store.getAll(); // get all records

        getAllRequest.onsuccess = async () => {
            let inventoryData = getAllRequest.result;

            if (!inventoryData || inventoryData.length === 0) {
                console.log("No equipment found, creating new starter set...");

                // create beginner weapon
                await createEquipment(db, { eqp_type: "weapon", eqp_id: 6, tier: "G", max_tier: "G" },false);
                // create beginner armor (helmet, breastplate, gloves, greaves)
                await createEquipment(db, { eqp_type: "armor", eqp_id: 0, tier: "G", max_tier: "G" }, false);
                await createEquipment(db, { eqp_type: "armor", eqp_id: 1, tier: "G", max_tier: "G" }, false);
                await createEquipment(db, { eqp_type: "armor", eqp_id: 2, tier: "G", max_tier: "G" }, false);
                await createEquipment(db, { eqp_type: "armor", eqp_id: 3, tier: "G", max_tier: "G" }, false);
                
                resolve("Starter equipment created");
            } else {
                console.log("Equipment found in DB");
                // assign to your global inventory variable
                inventory = inventoryData.map(obj => Object.assign(new Equipment(obj), obj));
                resolve(inventoryData);
            }
        };

        getAllRequest.onerror = () => reject(getAllRequest.error);
    });
}


$(document).ready(async function(){
    //db
    db = await openDB();
    initSoul().then(dbsoul => {
        soul = dbsoul;
    });
    await initInventory();
    initLoadOut();
    //UI
    populateStatMenu();
    populateDungeonFloors();
})


