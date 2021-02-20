import Phaser from "phaser";
import { Card } from "../game/Card";
import * as GG from "../GG";
import { ActorsManager } from "../game/ActorsManager";

export class GameScene extends Phaser.Scene {
    actorsMng: ActorsManager;
    gridSize: Phaser.Geom.Point;
    gridCont: Phaser.GameObjects.Container;
    gridPadding: Phaser.Geom.Point;
    cards: Card[];

    constructor() {
        super({
            key: GG.KEYS.SCENE.GAME
        });
    }

    create(data) {
        let card_face_frames = this.anims.generateFrameNames(GG.KEYS.TEX_SS1, { prefix: 'card', end: 10, zeroPad: 4 });
        this.anims.create({ key: GG.KEYS.ANIMS.CARD_FACES, frames: card_face_frames, repeat: -1, frameRate: 30 });
        this.actorsMng = new ActorsManager(this);

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

        // this.testCardCreation(); // OK.
        // this.testCardPooling(); // OK.
    }

    buildGrid() {
        this.cards = [];

        for (let row = 0; row < this.gridSize.y; row++) {
            for (let col = 0; col < this.gridSize.x; col++) {
                let card = this.actorsMng.getCard(GG.CARD_TYPE.MIN);
                card.setXY(
                    this.gridPadding.x + col * (card.spr.width + this.gridPadding.x),
                    this.gridPadding.y + row * (card.spr.height + this.gridPadding.y)
                );

                this.gridCont.add(card.spr);
                this.cards.push(card);
            }
        }
    }

    fit() {
        let screen_w: number = this.game.renderer.width;
        let screen_h: number = this.game.renderer.height;

        // TODO: Fit the background.

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
        let card1 = new Card(GG.CARD_TYPE.PIG, this).setXY(200, 150);
        card1.type = GG.CARD_TYPE.SPIDER;
        let card2 = new Card(GG.CARD_TYPE.SPIDER, this).setXY(500, 150);
        card2.type = GG.CARD_TYPE.DRAGON
        // let card3 = new Card(11, this).setXY(700, 150); // OK.
        // let card4 = new Card(-1, this).setXY(700, 150); // OK.
    }

}