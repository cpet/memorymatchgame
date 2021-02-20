import { TweenMax, Power2, TimelineMax } from "gsap";
import Phaser from "phaser";
import * as GG from '../GG';

/**
 * Card to encapsulate data and funcitonality needed for a game card.
 * The encapsulated sprite contains an animations of the back of the card and all the card faces.
 * The indexes / types of cards can be set by .type with one of the GG.CARD_TYPE constants.
 */
export class Card extends Phaser.Events.EventEmitter {
    spr: Phaser.GameObjects.Sprite;

    isFlipping: boolean = false;
    isShowingFace: boolean = false;
    faceName: string;

    frames: Phaser.Animations.AnimationFrame[];

    gridIx: number = -1;

    private _type: number = -1;
    private _flipTL: TimelineMax;

    /**
     * Instantiates the encapsulated sprite into the given scene.
     * @param type    the index type of this card, use one of the GG.CARD_TYPE constants.
     * @param scene   the scene to create the sprite card into.
     */
    constructor(type: number, scene: Phaser.Scene, grid_ix: number) {
        super();
        // Play must be called for the anims to become available.
        this.spr = scene.add.sprite(200, 120, GG.KEYS.TEX_SS1)
            .play(GG.KEYS.ANIMS.CARD_FACES)
            .stop();

        this.frames = this.spr.anims.currentAnim.frames;
        this.isShowingFace = false;
        this.type = type;

        this.gridIx = grid_ix;

        //

        this._flipTL = new TimelineMax();
        this._flipTL
            .to(this.spr, 0.15, {
                scaleX: 0,
                scaleY: 1.2,
                ease: Power2.easeOut,
                onStart:()=>{
                    this.setInterractive(false);
                },
                onComplete: () => {
                    this.flip();
                },
                onCompleteScope: this
            })
            .to(this.spr, 0.15, {
                scaleX: 1,
                scaleY: 1,
                ease: Power2.easeOut,
                onComplete: () => {
                    this.isFlipping = false;
                    this.setInterractive(true);
                },
                onCompleteScope: this
            });
        this._flipTL.pause();
    }

    get type(): number {
        return this._type;
    }

    /**
     * Sets the type index of this card and the frame of the encapsulated sprite.
     */
    set type(v: number) {
        if (v > 0 && v < this.frames.length) {
            this._type = v;
            let stop_frame = this.frames[v];
            this.faceName = stop_frame.frame.name;
            // Freeze the animation at the stop frame.
            this.updateVisuals();
            // this.spr.setFrame(stop_frame.frame.name).stop();
        }
        else {
            console.error(
                "Card.type... given index %s, is out of bounds, try one of the GG.CARD_TYPE constants instead.", v);
        }
    }

    startFlippingAnimation() {
        // this.setInterractive(false);
        this._flipTL.restart();
    }

    /**
     * Flipps the card and updates it's visual state.
     */
    flip() {
        this.isShowingFace = !this.isShowingFace;
        this.updateVisuals();
    }

    /**
     * Updates the Card's frame based on either type or flipped state.
     */
    updateVisuals() {
        if (this.isShowingFace == true) {
            this.spr.setFrame(this.frames[this._type].frame.name);
        }
        else {
            this.spr.setFrame(this.frames[GG.CARD_BACK_IX].frame.name);
        }
    }

    setInterractive(is_interractive: boolean) {
        if (is_interractive == true && !this.isFlipping) {
            this.spr.setInteractive({ useHandCursor: true });
            this.spr.on("pointerdown", this._onPointerDown, this);
        }
        else {
            this.spr.disableInteractive();
            this.spr.off("pointerdown", this._onPointerDown, this);
        }
    }

    private _onPointerDown(pointer, localX, localY, event) {
        this.emit("pointerdown", pointer, localX, localY, event, this);
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

    get isVisible(): boolean {
        return this.spr.visible;
    }

    reset() {
        this.setActive(false);
        this.setVisible(false);

        this.setInterractive(false);
        TweenMax.killTweensOf(this);
    }

}