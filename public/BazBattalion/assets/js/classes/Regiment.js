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

        let regimentBounds = this.getBounds();
        console.log(regimentBounds);
        this.selected = false;
        this.selectBox = new Phaser.GameObjects.Rectangle(scene, regimentBounds.centerX, regimentBounds.centerY, regimentBounds.width, regimentBounds.height, "0x00ff00", 0.3);
        this.selectBox.setVisible(false);
    
        this.scene.physics.world.enable(this);
    
        this.setInteractive();
        this.on('pointerdown', this.onClickBehavior);
        this.setCollideWorldBounds(true);

        this.scene.add.existing(this);
        this.scene.add.existing(this.selectBox);
        //this.scene.add.rectangle(30, 30, 10, 10, "0xff0000", 0.5);
    }

    onClickBehavior() {
        // this still works btw!
        console.log("Clicked the thing!");
    }

    setSelected(){
        this.selected = !this.selected;
        this.selectBox.setVisible(this.selected);
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