import Phaser from "phaser";
import * as GG from '../GG';

export class PreloadScene extends Phaser.Scene {
    lastLoadPercent: number = 0;

    constructor() {
        super({ key: GG.KEYS.SCENE.PRELOAD });
    }

    init() {
        this.cameras.main.setBackgroundColor('#FFFFFF');
        this.load.on('progress', this.onLoadProgress, this);
    }

    preload() {
        // this.load.atlas(GameGlobal.KEYS.TEX_UI_SS, './assets/img/ScreensAndUiSS.png', './assets/img/ScreensAndUiSS.json');
        this.load.image(GG.KEYS.LOGO_HERE, './assets/img/LogoHere.png');
    }

    create(): void {
        var data: Object = {
            message: "Preload Scene Complete!",
            fromScene: GG.KEYS.SCENE.PRELOAD
        };

        this.scene.start(GG.KEYS.SCENE.LOAD, data);
    }

    onLoadProgress(load_percent: number) {
        this.lastLoadPercent = load_percent;
    }

}
