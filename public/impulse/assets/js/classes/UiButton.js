class UiButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, key, hoverKey, text, targetCallback){
        super(scene, x, y);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.key = key;
        this.hoverKey = hoverKey;
        this.text = text;
        this.targetCallback = targetCallback;

        this.createButton();
        this.scene.add.existing(this);
    }

    createButton(){
        this.button = this.scene.add.image(0, 0, 'button1');
        //this.add(this.button); //might be needed if we need this to move with the Container
        this.button.setInteractive();

        this.button.setScale(1.4);
        
        this.buttonText = this.scene.add.text(0, 0, this.text, { fontSize: "26px", fill: "#ffffff" });
        //this.add(this.buttonText); //might be needed if we need this to move with the Container
        Phaser.Display.Align.In.Center(this.buttonText, this.button);
        
        this.add(this.button);
        this.add(this.buttonText);

        this.button.on('pointerdown', () => {
            this.targetCallback();
        });
        
        this.button.on('pointerover', () => {
            this.button.setTexture(this.hoverKey);
        });
        
        this.button.on('pointerout', () => {
            this.button.setTexture(this.key);
        });
    }
}