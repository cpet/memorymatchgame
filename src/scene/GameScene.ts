import Phaser from "phaser";
import { Card } from "../game/Card";
import * as GG from "../GG";
import { ActorsManager } from "../game/ActorsManager";

export class GameScene extends Phaser.Scene {

    actorsMng: ActorsManager;

    constructor() {
        super({
            key: GG.KEYS.SCENE.GAME
        });
    }

    create() {
        let card_face_frames = this.anims.generateFrameNames(GG.KEYS.TEX_SS1, { prefix: 'card', end: 10, zeroPad: 4 });
        this.anims.create({ key: GG.KEYS.ANIMS.CARD_FACES, frames: card_face_frames, repeat: -1, frameRate: 30 });

        this.actorsMng = new ActorsManager(this);

        // this.testCardCreation(); // OK.
        this.testCardPooling();
    }

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