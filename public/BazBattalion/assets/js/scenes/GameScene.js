class GameScene extends Phaser.Scene {
    constructor(){
        super('Game');
        this.score = 0;
    }

    init() {
        //this.scene.launch('Ui');
    }

    create(){
        this.createAudio();
        this.createWalls();
        this.createPlayer();
        this.addCollisions();
        this.createInput();
    }

    update(){
        //this.regiment.update(this.cursors);
        this.player.update();
    }

    createAudio(){
        //this.goldPickupAudio = this.sound.add('goldSound');
    }

    createPlayer(){
        this.player = new Player(this);
        this.player.create();
    }

    createTouchHandler(){
        // Handle scene-specific touch events
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

    createWalls() {
        this.wall = this.physics.add.image(500, 100, 'button1');
        this.wall.setImmovable();
    }

    createInput(){
        this.cursors = this.input.keyboard.createCursorKeys();
        this.touch = this.input.on('pointerdown', () => {
            this.player.handleInput(this.touch);
        });
    }

    addCollisions(){
        // Left as an example
        //this.physics.add.collider(this.regiment, this.wall);
        //this.physics.add.overlap(this.regiment, this.chests, this.collectChest, null, this);
    }

    // Left as an example
    // collectChest(player, chest){
    //     this.goldPickupAudio.play();
    //     this.score += chest.coins;
    //     this.events.emit('updateScore', this.score);
    //     chest.makeInactive();
    //     this.time.delayedCall(1000, this.spawnChest, [], this);
    // }
}