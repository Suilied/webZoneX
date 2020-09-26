class BootScene extends Phaser.Scene {
    constructor(){
        super('Boot');
    }

    preload() {
        this.loadImages();
        this.loadSpriteSheets();
        // Left as a reminder
        //this.loadAudio();
    }

    loadImages() {
        this.load.image('nato', 'BazBattalion/assets/images/nato-simple.png');
    }

    loadSpriteSheets() {
        // Left as a reminder
        //this.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
        //this.load.spritesheet('characters', 'assets/images/characters.png', { frameWidth: 32, frameHeight: 32 });
    }

    loadAudio(){
        // Left as a reminder
        //this.load.audio('goldSound', ['assets/audio/Pickup.wav']);
    }

    create() {
        this.scene.start('Game');
    }
}