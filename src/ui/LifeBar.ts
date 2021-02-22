import { TweenMax } from "gsap";
import Phaser from "phaser"

export class LifeBar {
    scene: Phaser.Scene;
    bg: Phaser.GameObjects.Image;
    meter: Phaser.GameObjects.Image;

    private _percent: number = 1;
    private _meterOrigW: number = 120;
    private _meterMaxW: number = 120;
    private _scale: number = 1;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, bg_frame_key: string, meter_frame_key: string) {
        this.scene = scene;

        // Add the lifebar bg and lifebar meter.
        this.bg = this.scene.add.image(0, 0, texture, bg_frame_key);
        this.bg.setOrigin(0, 0);
        this.meter = scene.add.image(0, 0, texture, meter_frame_key);
        this.meter.setOrigin(0, 0);
        // this.meter.visible = false;

        this._meterOrigW = this.meter.displayWidth;
        this._meterMaxW = this._meterOrigW;
        this.setXY(x, y);
    }

    setXY(x: number, y: number) {
        this.bg.x = x - (this.bg.displayWidth - this._meterMaxW) * 0.5;
        this.meter.x = x;

        this.bg.y = y - (this.bg.displayHeight - this.meter.displayHeight) * 0.5;
        this.meter.y = y;
    }

    applyRatio(scale: number) {
        this._scale = scale;
        this.bg.setScale(scale, scale);
        this.meter.setScale(this._percent * scale, scale);

        this._meterMaxW = Math.floor(this._meterOrigW * scale);
    }

    addToContainer(cont: Phaser.GameObjects.Container) {
        cont.add(this.bg);
        cont.add(this.meter);
    }

    set fixedOnCamera(v: boolean) {
        if (v == true) {
            this.bg.setScrollFactor(0);
            this.meter.setScrollFactor(0);
        }
        else {
            this.bg.setScrollFactor(1);
            this.meter.setScrollFactor(1);
        }
    }

    set depth(v: number) {
        this.bg.depth = v;
        this.meter.depth = v + 1;
    }

    /**
     * Set as a value between 0 and 1.
     */
    set percent(v: number) {
        if (v < 0) { v = 0; }
        if (v > 1) { v = 1; }
        this._percent = v;

        TweenMax.to(this.meter, 0.25, {
            scaleX: this._percent * this._scale
        });
    }

    get percent(): number {
        return this._percent;
    }

    ////

    /**
     * Sets both the background and meter angle.
     */
    set angle(v: number) {
        this.bg.angle = v;
        this.meter.angle = v;
    }


    /**
     * Returns the lifebar's background angle.
     */
    get angle(): number {
        return this.bg.angle;
    }

    get displayWidth(): number {
        return this.bg.displayWidth;
    }

    set width(v: number) {
        this.bg.width = v;
        this.meter.width = v;
    }

    /**
     * Returns the background's display height.
     */
    get displayHeight(): number {
        return this.bg.displayHeight;
    }

    set height(v: number) {
        this.bg.height = v;
        this.meter.height = v;
    }

    set alpha(v: number) {
        this.bg.alpha = v;
        this.meter.alpha = v;
    }

    get alpha(): number {
        return this.meter.alpha;
    }

    set visible(v: boolean) {
        this.bg.visible = v;
        this.meter.visible = v;
    }

    get visible(): boolean {
        return this.bg.visible;
    }

    destroy() {
        this.bg.destroy();
        this.meter.destroy();
        TweenMax.killTweensOf(this.meter);
    }

}