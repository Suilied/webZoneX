class Regiment extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, key, frame){
        super(scene, x, y, key, frame);

        this.x = x;
        this.y = y;

        this.scene = scene;
        this.maxVelocity = 100;
        this.moveCommand = {
            position: [0,0],
            active: false
        };
        this.selected = false;
    
        this.scene.physics.world.enable(this);
    
        this.setInteractive();
        this.on('pointerdown', this.onClickBehavior);
        this.setCollideWorldBounds(true);

        this.scene.add.existing(this);
    }

    onClickBehavior() {
        console.log("Clicked the thing!");
    }

    setMoveCommand(x, y) {
        this.moveCommand = {
            position: [x, y],
            active: true
        };
    }

    update() {
        // TODO:
        // in stead of "cursors" supply mouse input thingy
        //InputPlugin.pointer1
        // if mouse thingy then move towards new goal.
    }
}