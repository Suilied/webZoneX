let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [
        BootScene,
        TitleScene,
        GameScene,
        UiScene,
    ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 0,
            }
        }
    },
    input: {
        activePointers: 3
    },
};

let game = new Phaser.Game(config);