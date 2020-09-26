class GameManager {
    constructor(scene, matter, mapData) {
        this.scene = scene;
        this.matter = matter;
        this.mapData = mapData;

        this.units = [];
    }

    setup() {
        // setup units
        this.addUnit(250, 100, 0);
        this.addUnit(550, 100, 0);
        this.addUnit(250, 500, 180);
    }

    addUnit(x, y, a) {
        let newUnit = new Unit(this.scene, this.matter, "nato", x, y, a);
        this.units.push(newUnit);
    }

    handleSelection(pointer) {
        let mouseOverUnit = this.units.find( (unit) => {
            return unit.image.getBounds().contains(pointer.x, pointer.y);
        });

        if( mouseOverUnit )
            mouseOverUnit.setSelected();
        else
            this.units.forEach( unit => {
                unit.unsetSelected();
            });
    }

    handleMoveOrder(pointer) {
        let selectedUnits = this.units.filter( (unit) => {return unit.selected === true;} );
        selectedUnits.forEach( (unit) => {
            unit.setMoveCommand(pointer.x, pointer.y);
        });
    }

    update(){
        this.units.forEach( unit => {
            unit.update();
        });
    }
}