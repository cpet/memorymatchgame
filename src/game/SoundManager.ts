import * as GG from "../GG";

export default class SoundManager {

    numConcurentSfxSprites: number = 4;

    private _SFX_VOLUME: number = 0.5;
    private _soundOn: boolean = true;

    private _sfxMarkers = [
        { name: GG.KEYS.SFX.CARD, start: 0, duration: 0.3, config: { volume: this._SFX_VOLUME } },
        { name: GG.KEYS.SFX.MATCH1, start: 0.5, duration: 0.8, config: { volume: this._SFX_VOLUME } },
        { name: GG.KEYS.SFX.MATCH2, start: 1.5, duration: 0.6, config: { volume: this._SFX_VOLUME } },
        { name: GG.KEYS.SFX.NO_MATCH, start: 2.5, duration: 0.41, config: { volume: this._SFX_VOLUME } },
        { name: GG.KEYS.SFX.BTN, start: 3.5, duration: 0.11, config: { volume: this._SFX_VOLUME } },
        { name: GG.KEYS.SFX.GAME_LOST, start: 4, duration: 3.35, config: { volume: this._SFX_VOLUME } },
        { name: GG.KEYS.SFX.GAME_WON, start: 8, duration: 2.85, config: { volume: this._SFX_VOLUME } },
        { name: GG.KEYS.SFX.GAME_INSTR, start: 11.5, duration: 2.7, config: { volume: this._SFX_VOLUME } },
        { name: GG.KEYS.SFX.LOBBY_INSTR, start: 15, duration: 7.2, config: { volume: this._SFX_VOLUME } }
    ];

    ////

    private _matchSfxKeys: string[];

    /**
     * An array of sound sprites that can be plapyed concurently.
     */
    private _concurentSfxSprites: Array<Phaser.Sound.BaseSound>;

    /**
     * The last concurent sfx index played.
     */
    private _lastConcurentSfxIndex: number = 0;

    constructor() {
        this._matchSfxKeys = [GG.KEYS.SFX.MATCH1, GG.KEYS.SFX.MATCH2];
    }

    /**
     * Builds the concurent BaseSound sprites.
     * @param scene a Phaser.Scene scene to builds these sounds in.
     */
    buildSounds(scene: Phaser.Scene) {
        this._concurentSfxSprites = [];
        for (let i = 0; i < this.numConcurentSfxSprites; i++) {
            this._concurentSfxSprites.push(this.createSfxSprite(scene));
        }
    }

    /**
     * Creates
     * @param scene 
     */
    createSfxSprite(scene: Phaser.Scene): Phaser.Sound.BaseSound {
        // Init the sfx sprite.
        let sfx_sprite = scene.sound.add(GG.KEYS.SFX.ALL_SFX_SPRITE);
        for (let i = 0; i < this._sfxMarkers.length; i++) {
            let marker = this._sfxMarkers[i];
            sfx_sprite.addMarker(marker);
        }

        return sfx_sprite;
    }

    /**
     * Tries to play a sound concurently, otherwise it just replaces the oldest played.
     * @param sfx_key the sound effect key. Use GG.KEYS.SFX.
     */
    playSound(sfx_key: string) {
        if (!this._soundOn) { return; }
        if (!sfx_key) { return; }

        if (this._concurentSfxSprites[this._lastConcurentSfxIndex].isPlaying) {
            this._lastConcurentSfxIndex++;
        }

        if (this._lastConcurentSfxIndex >= this._concurentSfxSprites.length) {
            this._lastConcurentSfxIndex = 0;
        }

        this._concurentSfxSprites[this._lastConcurentSfxIndex].play(sfx_key);
    }

    /**
     * Plays a random match sfx.
     */
    playRandomMatchSfx() {
        this.playSound(this._matchSfxKeys[Phaser.Math.RND.between(0, this._matchSfxKeys.length)]);
    }

    stopAllsounds() {
        for (let i = 0; i < this._concurentSfxSprites.length; i++) {
            this._concurentSfxSprites[i].stop();
            this._concurentSfxSprites[i].pause();
        }
    }
}