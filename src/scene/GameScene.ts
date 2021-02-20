import Phaser from "phaser";
import { Card } from "../game/Card";
import * as GG from "../GG";
import { ActorsManager } from "../game/ActorsManager";

export class GameScene extends Phaser.Scene {
    bg: Phaser.GameObjects.Image;

    actorsMng: ActorsManager;
    gridSize: Phaser.Geom.Point;
    gridCont: Phaser.GameObjects.Container;
    gridPadding: Phaser.Geom.Point;
    cards: Card[];
    
    /**
     * The number of cards currently in play.
     * Should not exceed 2?
     */
    numCardsInPlay:number = 0;


    constructor() {
        super({
            key: GG.KEYS.SCENE.GAME
        });
    }

    create(data) {
        this.bg = this.add.image(0, 0, GG.KEYS.BG.FAR_BG).setOrigin(0, 0);

        // Card faces as an animation.
        let card_face_frames = this.anims.generateFrameNames(GG.KEYS.TEX_SS1, { prefix: 'card', end: 10, zeroPad: 4 });
        this.anims.create({ key: GG.KEYS.ANIMS.CARD_FACES, frames: card_face_frames, repeat: -1, frameRate: 30 });

        // Actors pooling.
        this.actorsMng = new ActorsManager(this);

        // Grid setup.
        this.gridSize = new Phaser.Geom.Point(3, 4);
        this.gridCont = this.add.container();

        if (data) {
            this.gridSize.x = data.grid.x;
            this.gridSize.y = data.grid.y;
        }

        this.gridPadding = new Phaser.Geom.Point(10, 10);
        this.buildGrid();
        this.fit();
        this.enableResizeListener();

        // DEV.
        // this.testCardCreation(); // OK.
        // this.testCardPooling(); // OK.
    }

    /**
     * Builds the game cards grid using the this.gridSize from the previous scene.
     */
    buildGrid() {
        this.cards = [];

        for (let row = 0; row < this.gridSize.y; row++) {
            for (let col = 0; col < this.gridSize.x; col++) {
                let card = this.actorsMng.getCard(GG.CARD_TYPE.MIN);
                card.gridIx = row * this.gridSize.y + col;
                console.log("card.gridIx: ", card.gridIx);

                card.setXY(
                    this.gridPadding.x + col * (card.spr.width + this.gridPadding.x) + card.spr.width * 0.5,
                    this.gridPadding.y + row * (card.spr.height + this.gridPadding.y) + card.spr.height * 0.5
                );

                card.setInterractive(true);
                card.on("pointerdown", this._onCardPointerDown, this);
                this.gridCont.add(card.spr);
                this.cards.push(card);
            }
        }
    }

    private _onCardPointerDown(pointer, localX, localY, event, card: Card) {
        // if (this.numCardsInPlay < 12) {
            card.startFlippingAnimation();
            this.numCardsInPlay++;
        // }
    }

    /**
     * Fits the background and gamplay elements to fit the available screen size.
     */
    fit() {
        let screen_w: number = this.game.renderer.width;
        let screen_h: number = this.game.renderer.height;

        // Fit in the background covering the entire available screen and center on the larger side.
        this.bg.setScale(1);
        let bg_scale: number = Math.max(screen_w / this.bg.width, screen_h / this.bg.displayHeight);
        this.bg.setScale(bg_scale);
        this.bg.x = Math.floor((screen_w - this.bg.displayWidth) * 0.5);
        this.bg.y = Math.floor((screen_h - this.bg.displayHeight) * 0.5);

        let card = this.cards[0];
        // If fit() is called before any cards are ready ignore.
        if (!card) { return; }

        let grid_cont_w: number = this.gridPadding.x + this.gridSize.x * (card.spr.width + this.gridPadding.x);
        let grid_cont_h: number = this.gridPadding.y + this.gridSize.y * (card.spr.height + this.gridPadding.y);

        this.gridCont.scale = Math.min(screen_w / grid_cont_w, screen_h / grid_cont_h);
        this.gridCont.x = Math.floor(Math.abs(grid_cont_w * this.gridCont.scale - screen_w) * 0.5);
        this.gridCont.y = Math.floor(Math.abs(grid_cont_h * this.gridCont.scale - screen_h) * 0.5);
    }


    /**
     * Enables the resize listener for this scene.
     * Should be called when activating this scene.
     */
    enableResizeListener() {
        GG.setCurrentScene(this);
        this.scale.on('resize', this.fit, this);
    }

    /**
     * Disables the resize listener for this scene.
     * Ussually called when switching to a new scene.
     */
    disableResizeListener() {
        GG.setCurrentScene(null);
        this.scale.off('resize', this.fit, this);
    }

    ////

    testCardPooling() {
        let c1 = this.actorsMng.getCard(GG.CARD_TYPE.COW).setXY(200, 280);
        let c2 = this.actorsMng.getCard(GG.CARD_TYPE.DRAGON).setXY(500, 280);
    }

    testCardCreation() {
        let card1 = new Card(GG.CARD_TYPE.PIG, this, 0).setXY(200, 150);
        card1.type = GG.CARD_TYPE.SPIDER;
        let card2 = new Card(GG.CARD_TYPE.SPIDER, this, 1).setXY(500, 150);
        card2.type = GG.CARD_TYPE.DRAGON
        // let card3 = new Card(11, this).setXY(700, 150); // OK.
        // let card4 = new Card(-1, this).setXY(700, 150); // OK.
    }

}