import { GameScene } from "../scene/GameScene";
import * as GG from "../GG";
import { Card } from "./Card";

export class ActorsManager {

    scene: GameScene;

    // With 4 x 5 being the maximum asked for.
    cardsPoolSize: number = 20;

    // Array or arrays because more game actor types can be pooled in different arrays.
    private _pools: Array<Array<any>>;

    /**
     * Constructs a new card in the given Phaser.Scene scene.
     * The newly created card is in an active and visible state.
     * @param scene 
     */
    constructor(scene: GameScene) {
        this.scene = scene;
        this._pools = [];

        this._pools[GG.ACTOR_ID.CARD] = [];

        for (let i = 0; i < this.cardsPoolSize; i++) {
            this._pools[GG.ACTOR_ID.CARD].push(this.createNewCard(GG.CARD_TYPE.MIN));
        }
    }

    /**
     * Creates a new innactive, invisible card. This is the normal pooled state of a card.
     * @param type the type of card to create. Use one of the GG.CARD_TYPE constants.
     */
    createNewCard(type: number): Card {
        let card = new Card(type, this.scene, -1);
        card.reset();
        return card;
    }

    /**
     * Returns a card from the pool or a new one is created if the pool is empty.
     * @param type the type of card to get. Use one of the GG.CARD_TYPE constants.
     */
    getCard(type: number): Card {
        let card: Card = this._pools[GG.ACTOR_ID.CARD].pop();
        if (!card) {
            card = this.createNewCard(type)
        }

        card.type = type;
        card.setActive(true);
        card.setVisible(true);
        return card;
    }

    /**
     * Pools back a Card for later use.
     * @param card the card to pool.
     */
    poolCard(card: Card) {
        // console.log('poolActor, armatureId', a.armatureId, ', baddie ships:', this._scene.baddieShips, ', pools:', this._pools);

        this._pools[GG.ACTOR_ID.CARD].push(card);
        card.reset();
    }
}