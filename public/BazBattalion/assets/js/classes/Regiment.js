class Regiment extends Phaser.Physics.Matter.Image {
    constructor(world, x, y, key){
        super(world, x, y, key);

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

        // directionVec = goalVec - startVec
        let goalVec = new Phaser.Math.Vector2(x, y);
        let startVec = new Phaser.Math.Vector2(this.x, this.y);
        let dirVec = goalVec.subtract(startVec).setLength(100);

        //this.setAcceleration(dirVec);
        this.setVelocity(dirVec.x, dirVec.y);
    }

    update() {
        // if( this.moveCommand.active ){
        //     // lerp towards goal

        // }
        //console.log(`Position: ${this.x} ; ${this.y}`);
    }
}