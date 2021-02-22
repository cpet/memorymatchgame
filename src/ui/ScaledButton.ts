import Phaser from "phaser";
import { TweenMax } from "gsap";

/**
 * Purpose of this class is to encapsulate a sprite, image or bitmap text and animate it's scale independently of it's parent container.
 * Pointer events will be used via this game object.
 */
export class ScaledButton {
    go: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image | Phaser.GameObjects.BitmapText;
    /**
     * Pass in a sprite, image or bitmap text as the game object to encapsulate.
     * The game object will ve set to interactive with hand cursor for mouse users.
     * @param go the game object to encapsulate.
     */
    constructor(go: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image | Phaser.GameObjects.BitmapText) {
        this.go = go;

        // Input is enabled by default.
        this.go.setInteractive({ useHandCursor: true });
        this.go.visible = true;

        this.go.on('pointerover', this.onPointerOver, this);
        this.go.on('pointerout', this.onPointerOut, this);
    }

    get displayWidth(): number {
        return this.go.width * this.go.scale;
    }

    get displayHeight(): number {
        return this.go.height * this.go.scale;
    }

    set x(x: number) {
        this.go.x = x;
    }

    set y(y: number) {
        this.go.y = y;
    }

    get x(): number {
        return this.go.x;
    }

    get y(): number {
        return this.go.y;
    }

    setInteractive(is_interactive: boolean = true) {
        if (is_interactive) {
            this.go.setInteractive({ useHandCursor: true });
        }
        else {
            this.go.disableInteractive();
        }
    }

    setXY(x: number, y: number) {
        this.go.setX(x);
        this.go.setY(y);

        this.storeDefaultValues();
    }

    setScale(scale: number) {
        this.go.setScale(scale);
        this.storeDefaultValues();
    }

    set depth(v: number) {
        this.go.depth = v;
    }

    setOrigin(ox: number, oy: number) {
        this.go.setOrigin(ox, oy);
        return this;
    }

    //// Tweenable scales.
    // Getters must exist in tweenable values.

    onPointerOver(pointer, localX, localY, event) {
        // this.emit('pointerover', [pointer, localX, localY, event]);

        TweenMax.to(this, 0.25, {
            _tweenableScaleX: this.defaultValues.scaleX + 0.1,
            _tweenableScaleY: this.defaultValues.scaleY + 0.1
        });
    }

    onPointerOut(pointer, localX, localY, event) {
        // this.emit('pointerout', [pointer, localX, localY, event]);

        TweenMax.to(this, 0.25, {
            _tweenableScaleX: this.defaultValues.scaleX,
            _tweenableScaleY: this.defaultValues.scaleY
        });
    }

    set _tweenableScaleX(scale: number) {
        this.go.scaleX = scale;
    }
    
    get _tweenableScaleX(): number {
        return this.go.scaleX;
    }

    set _tweenableScaleY(scale: number) {
        this.go.scaleY = scale;
    }

    get _tweenableScaleY(): number {
        return this.go.scaleY;
    }

    defaultValues: DefaultValues = {
        x: 0, y: 0,
        scaleX: 1, scaleY: 1
    }

    /**
     * Stores the current tweenable values (x, y, scaleX, scaleY...) into the normalValues Object.
     */
    storeDefaultValues() {
        this.defaultValues.x = this.x;
        this.defaultValues.y = this.y;
        this.defaultValues.scaleX = this.go.scaleX;
        this.defaultValues.scaleY = this.go.scaleY;

        return this;
    }

}

interface DefaultValues {
    x: number, y: number,
    scaleX: number, scaleY: number
}