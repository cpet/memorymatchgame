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
    // faceName: string;

    frames: Phaser.Animations.AnimationFrame[];

    gridIx: number = -1;

    private _type: number = -1;

    private _flipTL: TimelineMax;
    private _failTL: TimelineMax;
    private _successTL: TimelineMax;

    private _isMatched: boolean = false;

    /**
     * Instantiates the encapsulated sprite into the given scene.
     * @param type    the index type of this card, use one of the GG.CARD_TYPE constants.
     * @param scene   the scene to create the sprite card into.
     */
    constructor(type: number, scene: Phaser.Scene, grid_ix: number) {
        super();
        // Play must be called for the anims to become available.
        this.spr = scene.add.sprite(200, 120, GG.KEYS.ATLAS_SS1)
            .play(GG.KEYS.ANIMS.CARD_FACES)
            .stop();

        this.frames = this.spr.anims.currentAnim.frames;
        this.isShowingFace = false;
        this.type = type;

        this.gridIx = grid_ix;
        this._isMatched = false;

        // Flip animation timeline.
        this._flipTL = new TimelineMax();
        this._flipTL
            .to(this.spr, 0.15, {
                scaleX: 0,
                scaleY: 1.2,
                ease: Power2.easeOut,
                onStart: () => {
                    // Might be a bit overkill but adding it as make sure.
                    // These type of decisions be discussed in the approval of the commit.
                    // If it were another type of more generic object I would have opted it out in
                    // favor of flexibility. But in the scope of this game it is simple enough to allow it.
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
                ease: Power2.easeIn,
                onComplete: () => {
                    this.isFlipping = false;
                    if (!this.isShowingFace) {
                        this.setInterractive(true);
                    }

                    this.emit(CARD_EVENTS.FLIP_COMPLETE, this)
                },
                onCompleteScope: this
            });

        this._flipTL.pause();

        // Fail animation timeline.
        this._failTL = new TimelineMax();
        this._failTL
            .to(this.spr, 0.15, {
                scaleX: 1.05,
                scaleY: 1.05,
                ease: Power2.easeOut
            })
            .to(this.spr, 0.1, {
                angle: 15,
                ease: Power2.easeIn
            })
            .to(this.spr, 0.1, {
                angle: -15,
                ease: Power2.easeInOut,
                repeat: 3,
                yoyo: true
            })
            .to(this.spr, 0.15, {
                scaleX: 1,
                scaleY: 1,
                angle: 0,
                ease: Power2.easeIn
            });

        this._failTL.pause();

        // Success animation timeline.
        this._successTL = new TimelineMax();
        this._successTL
            .to(this.spr, 0.15, {
                scaleX: 1.1,
                scaleY: 1.15,
                ease: Power2.easeOut
            })
            .to(this.spr, 0.15, {
                scaleX: 1,
                scaleY: 1,
                ease: Power2.easeIn,
            });

        this._successTL.pause();
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
            // let stop_frame = this.frames[v];
            // this.faceName = stop_frame.frame.name;
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
        this.setInterractive(false);
        this._flipTL.restart();
    }

    startSuccessAnimation() {
        this._successTL.restart();
        GG.soundManager.playRandomMatchSfx();
    }

    startFailedAnimation() {
        this._failTL.restart();
        GG.soundManager.playSound(GG.KEYS.SFX.NO_MATCH);
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
        if (is_interractive == true && !this.isFlipping && !this._isMatched) {
            this.spr.setInteractive({ useHandCursor: true });
            this.spr.on("pointerdown", this._onPointerDown, this);
        }
        else {
            this.spr.disableInteractive();
            this.spr.off("pointerdown", this._onPointerDown, this);
        }
    }

    private _onPointerDown(pointer, localX, localY, event) {
        this.emit(CARD_EVENTS.POINTER_DOWN, pointer, localX, localY, event, this);
        GG.soundManager.playSound(GG.KEYS.SFX.CARD);
    }

    setAsMatched() {
        this.setInterractive(false);
        this._isMatched = true;
    }

    get isMatched(): boolean {
        return this._isMatched;
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
        this._isMatched = false;

        this.setInterractive(false);
        TweenMax.killTweensOf(this);

        this.spr.scale = 1;
    }
}
export const CARD_EVENTS = {
    FLIP_COMPLETE: "flip_complete",
    POINTER_DOWN: "pointerdown"
}
