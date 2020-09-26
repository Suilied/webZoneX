class GameManager{
    constructor(scene, mapData){
        this.scene = scene;
        this.mapData = mapData;

        this.spawners = {};
        this.chests = {};
        this.monsters = {};

        this.playerLocations = [];
        this.chestLocations = [];
        this.monsterLocations = [];
    }

    setup(){
        this.parseMapData();
        this.setupEventListener();
        this.setupSpawners();
        this.spawnPlayer();
    }

    getCenterX(obj){ return obj.x + ( obj.width / 2 ); }
    getCenterY(obj){ return obj.y + ( obj.height / 2 ); }

    parseMapData(){
        this.mapData.forEach( (layer) => {
            if(layer.name == 'player_locations') {
                layer.objects.forEach( (obj) => {
                    this.playerLocations.push([getCenterX(obj), getCenterY(obj)]);
                });
            }
            else if(layer.name == 'chest_locations') {
                layer.objects.forEach( (obj) => {
                    if(this.chestLocations[obj.properties.spawner]){
                        this.chestLocations[obj.properties.spawner].push([getCenterX(obj), getCenterY(obj)]);
                    } else {
                        this.chestLocations[obj.properties.spawner] = [[getCenterX(obj), getCenterY(obj)]];
                    }
                });
            }
            else if(layer.name == 'monster_locations') {
                layer.objects.forEach( (obj) => {
                    if(this.monsterLocations[obj.properties.spawner]){
                        this.monsterLocations[obj.properties.spawner].push([getCenterX(obj), getCenterY(obj)]);
                    } else {
                        this.monsterLocations[obj.properties.spawner] = [[getCenterX(obj), getCenterY(obj)]];
                    }
                });
            }
        });
    }

    setupEventListener(){
        this.scene.events.on('pickupChest', (chestId) =>{
            if(this.chests[chestId]){
                this.spawners[this.chests[chestId].spawnerId].removeObject(chestId);
            }
        });
    }

    setupSpawners(){

        const config = {
            spawnInterval: 3000,
            limit: 3,
        };

        let spawner;

        // create chest spawners
        Object.keys(this.chestLocations).forEach( (key) => {
            config.id = `chest-${key}`;
            config.spawnerType = SpawnerType.CHEST;

            spawner = new Spawner(config, this.chestLocations[key], this.addChest.bind(this), this.deleteChest.bind(this));

            this.spawners[spawner.id] = spawner;
        });

        // create monser spawners
        Object.keys(this.monsterLocations).forEach( (key) => {
            config.id = `monster-${key}`;
            config.spawnerType = SpawnerType.MONSTER;

            spawner = new Spawner(config, this.monsterLocations[key], this.addMonster.bind(this), this.deleteMonster.bind(this));

            this.spawners[spawner.id] = spawner;
        });
    }

    spawnPlayer(){
        const location = this.playerLocations[Math.floor(Math.random()*this.playerLocations.length)];
        this.scene.events.emit('spawnPlayer', location);
    }

    addChest(chestId, chest){
        this.chests[chestId] = chest;
        this.scene.events.emit('chestSpawned', chest);
    }

    deleteChest(chestId){
        delete this.chests[chestId];
    }

    addMonster(monsterId, monster){
        this.monsters[monsterId] = monster;
        this.scene.events.emit('monsterSpawned', monster);
    }

    deleteMonster(monsterId){
        delete this.monsters[monsterId];
    }
}