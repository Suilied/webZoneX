class Unit {
    constructor(scene, matter, key, x, y, a){
        this.scene = scene;
        this.matter = matter;
        this.startPosition = new Phaser.Math.Vector2(x, y);
        this.key = key;

        this.moveSpeed = 50;
        this.moveRatio = 0; // 0 == 100% march | 1 == 100% wheel
        // this.turnSpeed = 0.05; <- turning and moveing speed together are 100% of max-speed, e.g. divide speed between turning and moving

        this.image = matter.add.image(x, y, key);
        this.image.setDensity(10);
        this.image.setAngle(a ? a : 0);
        this.image.body.frictionAir = 0.1;

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

    // may be deprecated later
    setupUnit(position, angle){
        this.image.setPosition(position.x, position.y);
        this.image.setAngle(angle);
    }

    setSelected() { this.selected = true; this.image.setTint('0x00ff00');}
    unsetSelected() { this.selected = false; this.image.clearTint();}
    toggleSelected(){
        this.selected = !this.selected;
        if(state)
            this.image.setTint('0x00ff00');
        else
            this.image.clearTint();
    }

    setMoveCommand(x, y) {
        // direction-to-goal-vec == goal-position-vec MINUS current-position-vec
        let goalPosition = new Phaser.Math.Vector2(x, y);
        let startPosition = new Phaser.Math.Vector2(this.image.body.position.x, this.image.body.position.y);
        let positionToGoalVec = goalPosition.clone().subtract(startPosition);
        let positionToGoalVecNorm = goalPosition.clone().subtract(startPosition).normalize();

        this.moveCommand = {
            goalPosition: goalPosition,
            positionToGoalVec: positionToGoalVec,
            positionToGoalVecNorm: positionToGoalVecNorm,
            active: true
        };
    }

    executeMovement() {
        // see which way we should rotate.
        let facingVec = new Phaser.Math.Vector2(this.image.body.axes[0]);
        let rightVec = new Phaser.Math.Vector2(this.image.body.axes[1]);

        let facingDotGoal = facingVec.dot(this.moveCommand.positionToGoalVecNorm);
        let rightDotGoal = rightVec.dot(this.moveCommand.positionToGoalVecNorm);
        let wheelDirection = 0; // 1 == clockwise; -1 == counterclockwise

        if(facingDotGoal < 0) { // goal is behind us
            if(rightDotGoal < 0) { // goal is behind and to the left
                wheelDirection = -1;
            }
            else { // goal is behind and to the right
                wheelDirection = 1;
            }
        }
        else { // goal is in front of us
            if(rightDotGoal < 0) { // goal is in front and to the left
                wheelDirection = -1;
            }
            else { // goal is in front and to the right
                wheelDirection = 1;
            }
        }

        if( facingVec.fuzzyEquals(this.moveCommand.positionToGoalVecNorm, 0.1) ) {
            wheelDirection = 0;
        }

        if( wheelDirection === 0 ) {
            this.image.applyForce(facingVec.setLength(this.moveSpeed));
        }
        else {
            this.image.setAngularVelocity(wheelDirection*0.01);
        }
    }

    update(){
        if( this.moveCommand.active ){
            // Check to see if we can stop moving
            let bodyPosition = new Phaser.Math.Vector2(this.image.body.position);
            let travelDiff = this.moveCommand.goalPosition.clone().subtract(bodyPosition);
            if( travelDiff.lengthSq() < 100 ){
                this.moveCommand.active = false;
            }
            else {
                this.executeMovement();
            }
        }
    }
}