import Phaser from "phaser";
import * as GG from "../GG";
import { ScaledButton } from "../ui/ScaledButton";
// import { ToggleButton } from 'src/ui/ToggleButton';

export class LobbyScene extends Phaser.Scene {
    bg: Phaser.GameObjects.Image;

    /**
     * Contains the menu's buttons.
     */
    private _btnsCont: Phaser.GameObjects.Container;

    /**
     * The container cannot find the correct bounds of children that don't have the getBounds function.
     * such is the case of the BitmapText. Must compute the values manually.
     */
    private _btnsContBounds: Phaser.Geom.Rectangle;

    private _gridDatas: Phaser.Geom.Point[];

    constructor() {
        super({
            key: GG.KEYS.SCENE.LOBBY
        });
    }

    create() {
        this.bg = this.add.image(0, 0, GG.KEYS.BG.FAR_BG).setOrigin(0, 0);

        // Put all the grid select buttons in a container to easilly manage the fit screen requiremnt.
        this._gridDatas = [
            new Phaser.Geom.Point(3, 4),
            new Phaser.Geom.Point(5, 2),
            new Phaser.Geom.Point(4, 4),
            new Phaser.Geom.Point(4, 5),
        ];

        this._btnsCont = this.add.container(0, 0);
        this._btnsContBounds = new Phaser.Geom.Rectangle();

        // Create each grid button using bitmap texts.
        for (let i = 0; i < this._gridDatas.length; i++) {
            const btn_bmp: Phaser.GameObjects.BitmapText =
                this.add.bitmapText(140, 260, GG.KEYS.FONTS.CHANGA_ONE, "", 72)
                    .setCenterAlign();

            const grid = this._gridDatas[i];

            btn_bmp.text = grid.x + ' x ' + grid.y;
            btn_bmp.setOrigin(0.5, 0);
            btn_bmp.x = 0;
            btn_bmp.y = i * 80;

            this._btnsCont.add(btn_bmp);

            // Since is a vertical setup requirement it's pretty easy to compute the bounds.
            // This executes only once, so the lazy code on the height won't impact anything.
            this._btnsContBounds.width = Math.max(btn_bmp.width, this._btnsContBounds.width);
            this._btnsContBounds.height = Math.max(btn_bmp.y + btn_bmp.height, this._btnsContBounds.height);

            // When tapped or click start the game scene with the appropriate grid setup.
            let sbtn: ScaledButton = new ScaledButton(btn_bmp);
            sbtn.go.on('pointerdown', () => {
                this._onGameStart(i);
            }, this);
        }


        // TODO: start title music.

        // this._sfxToggleBtn = new ToggleButton(
        //     this.add.sprite(-1000, -1000, GG.KEYS.TEX_MAIN_SS, GG.KEYS.UI.SFX_ON),
        //     [GG.KEYS.UI.SFX_ON, GG.KEYS.UI.SFX_OFF]);
        // this._sfxToggleBtn.setOrigin(1, 0);
        // this._sfxToggleBtn.setState(GG.soundManager.soundOn);
        // this._sfxToggleBtn.on('toggled', this.onSfxToggle, this);
        // this._sfxToggleBtn.depth = 100;

        // this._musicToggleBtn = new ToggleButton(
        //     this.add.sprite(-1000, -1000, GG.KEYS.TEX_MAIN_SS, GG.KEYS.UI.MUSIC_ON),
        //     [GG.KEYS.UI.MUSIC_ON, GG.KEYS.UI.MUSIC_OFF]);
        // this._musicToggleBtn.setOrigin(1, 0);
        // this._musicToggleBtn.setState(GG.musicManager.musicOn);
        // this._musicToggleBtn.on('toggled', this.onMusicToggle, this);
        // this._musicToggleBtn.depth = 101;

        this.fit();
        this.enableResizeListener();

        // GG.musicManager.setMusic(GG.MUSIC_KEYS.MENU_MUSIC);

        // DEV.
        // Go quickly into the game scene with a predefined grid type.
        // this._onGameStart(1);
    }

    /**
     * Called when the user selects a grid type. Starts the memory match game.
     * @param grid_conf_ix the index of the desired grid configuration.
     */
    private _onGameStart(grid_conf_ix: any) {
        //
        var data: Object = {
            message: "Grid Type Selected",
            fromScene: GG.KEYS.SCENE.LOBBY,
            grid: this._gridDatas[grid_conf_ix]
        };

        this.scene.start(GG.KEYS.SCENE.GAME, data);
    }

    /**
     * Fits the background and UI elements (bitmap buttons) on screen.
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

        // Fit the grid select buttons.
        let btns_cont_scale: number = Math.min(((screen_w * 0.8) / this._btnsContBounds.width), (screen_h * 0.8) / this._btnsContBounds.height);
        this._btnsCont.setScale(btns_cont_scale);
        this._btnsCont.x = screen_w * 0.5;
        // The container scales to 0.8 of the screen height so the top padding is an easy 0.1.
        this._btnsCont.y = screen_h * 0.1;
    }

    //// Handlers.

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

    // onSfxToggle() {
    //     GG.soundManager.soundOn = this._sfxToggleBtn.isOn();
    //     GG.soundManager.playClickSfx();
    // }

    // onMusicToggle() {
    //     GG.musicManager.musicOn = this._musicToggleBtn.isOn();
    //     GG.soundManager.playClickSfx();
    // }

    // doPortraitPauseAndSound(screen_width: number, screen_height: number) {
    //     let sfx_ratio: number = screen_width / GG.worldDims.width;

    //     this._sfxToggleBtn.setScale(sfx_ratio);
    //     this._sfxToggleBtn.setXY(screen_width * 0.99, screen_height * 0.01);

    //     this._musicToggleBtn.setScale(sfx_ratio);
    //     this._musicToggleBtn.setXY(
    //         this._sfxToggleBtn.x,
    //         this._sfxToggleBtn.y + this._sfxToggleBtn.displayHeight + (20 * sfx_ratio)
    //     );
    // }

    // doLandscapePauseAndSound(screen_width: number, screen_height: number) {
    //     let sfx_ratio: number = screen_height / GG.worldDims.width;

    //     this._musicToggleBtn.setScale(sfx_ratio);
    //     this._musicToggleBtn.setXY(screen_width * 0.99, screen_height * 0.01);

    //     this._sfxToggleBtn.setScale(sfx_ratio);
    //     this._sfxToggleBtn.setXY(
    //         this._musicToggleBtn.x - this._sfxToggleBtn.displayWidth - (20 * sfx_ratio),
    //         this._musicToggleBtn.y
    //     );
    // }

    //// Obsolete?

    // private _onStartClick() {
    //     this.disableResizeListener();
    //     this.cleanUp();

    //     // Phaser scene manager destroyes it by default.
    //     this._mathgamesWrapper.ignoreDestroy = true;
    //     this._mathgamesWrapper = null;

    //     // this.scene.start(GG.KEYS.SCENE.LEVEL_MAP, { fromScene: GG.KEYS.SCENE.TITLE });
    //     // GG.soundManager.playClickSfx();
    // }

    cleanUp() {

    }

}