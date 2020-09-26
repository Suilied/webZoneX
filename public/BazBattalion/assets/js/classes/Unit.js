class Unit {
    constructor(scene, matter, x, y, key){
        this.scene = scene;
        this.matter = matter;
        this.startX = x;
        this.startY = y;
        this.key = key;

        this.moveSpeed = 50;
        this.moveRatio = 0; // 0 == 100% march | 1 == 100% wheel
        // this.turnSpeed = 0.05; <- turning and moveing speed together are 100% of max-speed, e.g. divide speed between turning and moving
        this.facingVec = new Phaser.Math.Vector2(0,-1);
        this.rightVec = this.getRightVec(this.facingVec);

        this.image = matter.add.image(x, y, key);
        this.image.setDensity(10);
        this.image.body.frictionAir = 0.1;

        this.image.setInteractive();
        this.image.on('pointerdown', (pointer) => {
            this.setSelected();
        });

        // setup interactive values
        this.moveCommand = {
            goalPosition: {},
            moveDirection: {},
            active: false
        };

        this.selected = false;
    }

    getLinearSpeed(){ return (1-this.moveRatio)*this.moveSpeed; }
    getWheelSpeed(){ return (this.moveRatio)*this.moveSpeed; }
    getRightVec(vec){ return new Phaser.Math.Vector2(vec.y, vec.x*-1);}

    setSelected(){
        this.selected = !this.selected;
        if(this.selected)
            this.image.setTint('0x00ff00');
        else
            this.image.clearTint();
    }

    setMoveCommand(x, y) {
        // direction-to-goal-vec == goal-position-vec MINUS current-position-vec
        let goalPosition = new Phaser.Math.Vector2(x, y);
        let startPosition = new Phaser.Math.Vector2(this.image.body.position.x, this.image.body.position.y);
        let positionToGoalVec = goalPosition.clone().subtract(startPosition).setLength(50);
        let positionToGoalVecNorm = goalPosition.clone().subtract(startPosition).normalize();

        this.moveCommand = {
            goalPosition: goalPosition,
            moveDirection: positionToGoalVec,
            moveDirectionNormal: positionToGoalVecNorm,
            active: true
        };
    }

    update(){
        //this.image

        if( this.moveCommand.active ){
            this.image.applyForce(this.moveCommand.moveDirection);

            // see which way we should rotate.
            console.log();
        }

        // determining rotation
        // dot the facingVec with the destinationVec
        // if result < 0 the destination lies behind us
        // if 

        // if( this.moveCommand.active ){
        //     let position = new Phaser.Math.Vector2(this.image.x, this.image.y);
        //     if( this.moveCommand.goalPosition.subtract(position).lengthSq() <= 100){
        //         console.log("Reached the goal!");
        //         this.moveCommand.active = false;
        //     }
        //     else {
        //         this.image.applyForce(this.moveCommand.moveDirection.x, this.moveCommand.moveDirection.y);
        //     }
        // }
    }
}