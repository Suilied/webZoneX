class GameScene extends Phaser.Scene {
    constructor(){
        super('Game');
        this.score = 0;
    }

    init() {
        this.scene.launch('Ui');
    }

    create(){
        this.createMap();
        this.createAudio();
        this.createChests();
        this.createPlayer();
        this.addCollisions();
        this.createInput();

        this.createGameManager();
    }

    update(){
        this.player.update(this.cursors);
    }

    createAudio(){
        this.goldPickupAudio = this.sound.add('goldSound');
    }

    createPlayer(){
        this.player = new Player(this, 224, 224, 'characters', 0);
    }

    createChests() {
        this.chests = this.physics.add.group();
        this.chestPositions = [[100, 100], [200, 200], [300, 300], [400, 400], [500, 500]];
        this.maxNumberOfChests = 3;

        for(let i=0; i<this.maxNumberOfChests; i++){
            this.spawnChest();
        }
    }

    spawnChest(){
        const location = this.chestPositions[Math.floor(Math.random() * this.chestPositions.length)];

        let chest = this.chests.getFirstDead();
        if(!chest){
            const chest = new Chest(this, location[0], location[1], 'items', 0);
            this.chests.add(chest);
        }
        else {
            chest.setPosition(location[0], location[1]);
            chest.makeActive();
        }
    }

    createInput(){
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    addCollisions(){
        this.physics.add.collider(this.player, this.map.blockedLayer);
        this.physics.add.overlap(this.player, this.chests, this.collectChest, null, this);
    }

    createMap(){
        this.map = new Map(this, 'map', 'background', 'background', 'blocked');
    }

    collectChest(player, chest){
        this.goldPickupAudio.play();
        this.score += chest.coins;
        this.events.emit('updateScore', this.score);
        chest.makeInactive();
        this.time.delayedCall(1000, this.spawnChest, [], this);
    }

    createGameManager(){
        this.gameManager = new GameManager(this, this.map.map.objects);
        this.gameManager.setup();
    }
}