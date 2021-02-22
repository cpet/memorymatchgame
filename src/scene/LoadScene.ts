import Phaser from "phaser";
import * as GG from "../GG";

export class LoadScene extends Phaser.Scene {
    loadBarBg: Phaser.GameObjects.Image;
    loadBar: Phaser.GameObjects.Image;

    lastLoadPercent: number = 0;

    logoHere: Phaser.GameObjects.Image;
    preload() {
        
        this.load.image(GG.KEYS.BG.FAR_BG, "./assets/img/bg.png");
        this.load.bitmapFont(GG.KEYS.FONTS.CHANGA_ONE, "./assets/fonts/ChangaOne_0.png", "./assets/fonts/ChangaOne.xml");
        this.load.atlas(GG.KEYS.ATLAS_SS1, "./assets/img/sprite_sheet1.png", "./assets/img/sprite_sheet1.json");

        // Load the sfx sprite.
        // this.load.audio(GG.SFX_SPRITES.ANSWER_FEEDBACK, ['assets/sfx/AnswerSfxSoundSprite.mp3', 'assets/sfx/AnswerSfxSoundSprite.ogg']);

        // Load the music.
        // this.load.audio(GG.MUSIC_KEYS.MENU_MUSIC, ['assets/music/MenuMusic.mp3', 'assets/music/MenuMusic.ogg']);
    }

    constructor() {
        super({ key: GG.KEYS.SCENE.LOAD });
    }

    init() {
        this.cameras.main.setBackgroundColor("#FFFFFF");
        let screen_w = this.game.renderer.width;
        let screen_h = this.game.renderer.height;

        let load_bar_bg_width: number = Math.round(screen_w * 0.88);
        let load_bar_bg_height: number = Math.round(screen_h * 0.02);
        // @ts-ignore.
        let load_bar_bg_graphics: Phaser.GameObjects.Graphics = this.make.graphics();
        load_bar_bg_graphics.fillStyle(0x1150a5);
        load_bar_bg_graphics.fillRect(0, 0, load_bar_bg_width, load_bar_bg_height);
        load_bar_bg_graphics.generateTexture("load_bar_bg", load_bar_bg_width, load_bar_bg_height);
        load_bar_bg_graphics.destroy();
        this.loadBarBg = this.add.image(screen_w * 0.5,
            screen_h * 0.9 - screen_h * 0.01,
            "load_bar_bg");

        let load_bar_width: number = Math.round(screen_w * 0.86);
        let load_bar_height: number = Math.round(screen_h * 0.01);
        // @ts-ignore.
        let load_bar_graphics: Phaser.GameObjects.Graphics = this.make.graphics();

        load_bar_graphics.fillStyle(0x48dfed);
        load_bar_graphics.fillRect(0, 0, load_bar_width, load_bar_height);
        load_bar_graphics.generateTexture("load_bar", load_bar_width, load_bar_height);
        load_bar_graphics.destroy();
        this.loadBar = this.add.image(screen_w * 0.5,
            screen_h * 0.9 - screen_h * 0.01,
            "load_bar");

        this.load.on("progress", this.onLoadProgress, this);

        this.logoHere = this.add.image(0, 0, GG.KEYS.LOGO_HERE);
        this.logoHere.setOrigin(0.5, 0.5);
    }

    create(): void {
        if (this.sys.game.device.os.desktop) {
            GG.SETTINGS.IS_TOUCH_SCREEN = false;
            // GG.soundManager.numConcurentSprites = 8;
            // GG.soundManager.numConcurentAnimalSfxSprites = 4;
        }
        else {
            GG.SETTINGS.IS_TOUCH_SCREEN = true;
            // GG.soundManager.numConcurentSprites = 4;
            // GG.soundManager.numConcurentAnimalSfxSprites = 2;
        }

        this.enableResizeListener();

        ////
        // GG.soundManager.buildSounds(this);
        // GG.musicManager.addMusicSound(this.sound.add(GG.MUSIC_KEYS.MENU_MUSIC, { loop: true, volume: GG.MUSIC_VOLUME }));

        ////
        var data: Object = {
            message: "Load Scene Complete!",
            fromScene: GG.KEYS.SCENE.LOAD
        };

        this.fit();

        // Go to the title (without initial tap) as per client's request.
        this.disableResizeListener();
        this.scene.start(GG.KEYS.SCENE.LOBBY, data);
        
        // Dev mode auto screne traversal.
        // this.scene.start(GG.KEYS.SCENE.LEVEL_MAP, data);
        // this.scene.start(GG.KEYS.SCENE.GAME, data);
        // this.scene.start(global.KEYS.SCENE.SOUND_PROMPT, data);
        // this.scene.start(global.KEYS.SCENE.END_GAME, data);
    }

    /**
     * Updates the loading bar percentage.
     * @param load_percent 
     */
    onLoadProgress(load_percent: number) {
        this.lastLoadPercent = load_percent;
        this.fit();
    }

    /**
     * Enables the resize listener for this scene.
     * Should be called when activating this scene.
     */
    enableResizeListener() {
        GG.setCurrentScene(this);
        this.scale.on("resize", this.onResize, this);
    }

    /**
     * Disables the resize listener for this scene.
     * Ussually called when switching to a new scene.
     */
    disableResizeListener() {
        GG.setCurrentScene(null);
        this.scale.off("resize", this.onResize, this);
    }

    /**
     * Triggered when the user resizes the browser window or rotates the device.
     * Calls fit() to refit all the elements into the new dimensions.
     */
    onResize() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        this.cameras.resize(width, height);

        this.fit();
    }

    /**
     * Centers the logo and the loading bar based on screen dimensions.
     */
    fit() {
        let screen_w = this.game.renderer.width;
        let screen_h = this.game.renderer.height;

        // First try to fit the logo as a percentage of the screen's height.
        this.logoHere.setScale(1);
        var scale: number = (screen_h / this.logoHere.displayHeight) * 0.5;

        this.logoHere.setScale(scale);
        this.logoHere.x = screen_w * 0.5;
        this.logoHere.y = screen_h * 0.4;

        if (this.logoHere.displayWidth > screen_w) {
            this.logoHere.setScale(1);
            scale = (screen_w / this.logoHere.displayWidth) * 0.8;
            this.logoHere.setScale(scale);
            this.logoHere.x = screen_w * 0.5;
            this.logoHere.y = screen_h * 0.4;
        }

        this.loadBarBg.displayWidth = Math.round(screen_w * 0.88);
        this.loadBarBg.displayHeight = Math.round(screen_h * 0.02);
        this.loadBarBg.x = screen_w * 0.5;
        this.loadBarBg.y = screen_h * 0.9 - screen_h * 0.01;

        this.loadBar.displayWidth = Math.round(screen_w * 0.86 * this.lastLoadPercent);
        this.loadBar.displayHeight = Math.round(screen_h * 0.01);
        this.loadBar.x = screen_w * 0.5;
        this.loadBar.y = screen_h * 0.9 - screen_h * 0.01;
    }
}
