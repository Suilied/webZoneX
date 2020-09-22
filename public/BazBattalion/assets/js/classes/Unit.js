class Unit {
    constructor(scene, matter, x, y, key){
        this.scene = scene;
        this.matter = matter;
        this.startX = x;
        this.startY = y;
        this.key = key;

        this.image = matter.add.image(x, y, key);
        this.image.setInteractive();
        this.image.on('pointerdown', (pointer) => {
            this.setSelected();
        });

        // setup interactive values
        this.moveCommand = {
            position: [0,0],
            active: false
        };

        this.selected = false;
    }

    setSelected(){
        this.selected = !this.selected;
        if(this.selected)
            this.image.setTint('0x00ff00');
        else
            this.image.clearTint();
    }

    setMoveCommand(x, y) {
        this.moveCommand = {
            position: [x, y],
            active: true
        };

        // direction-to-goal-vec == goal-position-vec MINUS current-position-vec
        let goalVec = new Phaser.Math.Vector2(x, y);
        let startVec = new Phaser.Math.Vector2(this.image.x, this.image.y);
        let dirVec = goalVec.subtract(startVec).setLength(10);
        this.image.setVelocity(dirVec.x, dirVec.y);
    }
}