class GameScene extends Phaser.Scene {
    constructor(){
        super('Game');
        this.score = 0;
        this.gameManager = {};
    }

    init() {
        // Left as a reminder
        //this.scene.launch('Ui');
    }

    create(){
        // Left as a reminder
        // this.createAudio();
        // this.createInput();

        this.matter.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
        this.createGameManager();

        this.input.on('pointerdown', (pointer) => {
            //if(pointer)
            if(pointer.button === 0){
                this.gameManager.handleSelection(pointer);
            }

            if(pointer.button === 2){
                this.gameManager.handleMoveOrder(pointer);
            }
        });
    }

    update(){
        if(this.gameManager)
            this.gameManager.update();
    }

    createGameManager(){
        this.gameManager = new GameManager(this.scene, this.matter, "noData");
        this.gameManager.setup();
    }
}