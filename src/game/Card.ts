import { TweenMax } from "gsap";
import Phaser from "phaser";
import * as GG from '../GG';

/**
 * Card to encapsulate data and funcitonality needed for a game card.
 * The encapsulated sprite contains an animations of the back of the card and all the card faces.
 * The indexes / types of cards can be set by .type with one of the GG.CARD_TYPE constants.
 */
export class Card {
    spr: Phaser.GameObjects.Sprite;
    private _type: number = -1;

    /**
     * Instantiates the encapsulated sprite into the given scene.
     * @param type    the index type of this card, use one of the GG.CARD_TYPE constants.
     * @param scene   the scene to create the sprite card into.
     */
    constructor(type: number, scene: Phaser.Scene) {
        // Play must be called for the anims to become available.
        let card_spr = scene.add.sprite(200, 120, GG.KEYS.TEX_SS1).play(GG.KEYS.ANIMS.CARD_FACES);
        this.spr = card_spr;
        this.type = type;
    }

    get type(): number {
        return this._type;
    }

    /**
     * Sets the type index of this card and the frame of the encapsulated sprite.
     */
    set type(v: number) {
        let frames = this.spr.anims.currentAnim.frames;
        if (v > -1 && v < frames.length) {
            this._type = v;
            let stop_frame = frames[v];
            // Freeze the animation at the stop frame.
            this.spr.setFrame(stop_frame.frame.name).stop();
        }
        else {
            console.error("Card.type... given index %s, is out of bounds, try one of the GG.CARD_TYPE constants instead!", v);
        }
    }

    setXY(x: number, y: number) {
        this.spr.x = x;
        this.spr.y = y;

        return this;
    }

    setActive(is_active: boolean) {
        this.spr.setActive(is_active);
    }

    get isActive(): boolean {
        return this.spr.active;
    }

    setVisible(is_visible: boolean) {
        this.spr.setVisible(is_visible);
    }

    get isVisible():boolean {
        return this.spr.visible;
    }

    reset() {
        this.setActive(false);
        this.setVisible(false);

        // TweenMax.killTweensOf(this);
    }

}