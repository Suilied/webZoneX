class Player {
    constructor(scene) {
        this.scene = scene;
        this.units = [];
    }

    create(){
        this.units.push(new Regiment(this.scene, 250, 250, 'nato', 0));
    }

    update() {
        // handle all unit behavior.
        this.units.forEach( (unit) => {
            unit.update();
        });
    }

    handleInput(input){
        // check if touch event is inside one of our units' hitboxes
        this.units.forEach( (unit) => {
            // TODO: early out after fulfilling either click or moveOrder
            if( Phaser.Geom.Rectangle.ContainsPoint( unit.getBounds(), {x: input.activePointer.downX, y: input.activePointer.downY} ) ) {
                // select unit if not already selected
                unit.setSelected();
            }
            else {
                if( unit.selected === true )
                    unit.setMoveCommand(input.activePointer.downX, input.activePointer.downY);
            }
        });
    }
}