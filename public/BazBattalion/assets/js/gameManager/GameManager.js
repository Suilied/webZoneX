class GameManager {
    constructor(scene, matter, mapData) {
        this.scene = scene;
        this.matter = matter;
        this.mapData = mapData;

        this.units = [];
    }

    setup() {
        // setup units
        this.addUnit();
    }

    addUnit() {
        let newUnit = new Unit(this.scene, this.matter, 250, 250, "nato");
        this.units.push(newUnit);
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
        })
    }
}