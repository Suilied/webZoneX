class Spawner{
    constructor(config, spawnLocations, addObject, deleteObject) {
        this.id = config.id;
        this.spawnInterval = config.spawnInterval;
        this.limit = config.limit;
        this.spawnerType = config.spawnerType;
        this.spawnLocations = spawnLocations;
        this.addObject = addObject;
        this.deleteObject = deleteObject;

        this.objectsCreated = [];

        this.start();
    }

    start(){
        this.interval = setInterval( () => {
            if(this.objectsCreated.length < this.limit){
                this.spawnObject();
            }
        }, this.spawnInterval);
    }

    spawnObject(){
        if(this.spawnerType === SpawnerType.CHEST) {
            this.spawnChest();
        } else if(this.spawnerType === SpawnerType.MONSTER) {
            this.spawnMonster();
        }
    }

    spawnChest(){
        const location = this.pickRandomLocation();
        const chest = new ChestModel(location[0], location[1], randomNumber(10,20), this.id);
        this.objectsCreated.push(chest);
        this.addObject(chest.id, chest);
    }

    spawnMonster(){
        const location = this.pickRandomLocation();
        const monster = new MonsterModel(
            location[0],
            location[1],
            randomNumber(10,20),
            this.id,
            randomNumber(0,20),
            randomNumber(3,5),
            1
        );
        this.objectsCreated.push(monster);
        this.addObject(monster.id, monster);
    }

    pickRandomLocation(){
        const location = this.spawnLocations[Math.floor(Math.random()*this.spawnLocations.length)];
        const invalidLocation = this.objectsCreated.some( (obj) => {
            return (obj.x === location[0] && obj.y === location[1]);
        });

        if(invalidLocation)
            return this.pickRandomLocation();

        return location;
    }

    removeObject(id){
        this.objectsCreated = this.objectsCreated.filter( object => object.id !== id);
        this.deleteObject(id);
    }
}