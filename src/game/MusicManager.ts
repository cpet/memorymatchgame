import Phaser from "phaser";

export default class MusicManager {

    private _musicOn: boolean = true;
    private _musicTracks: Object = {};
    private _currentMusic: Phaser.Sound.BaseSound = null;
    private _lastPlayedMusicKey: string = '';

    constructor() {

    }

    /**
     * Add a music track to be used in the game.
     * @param new_music [Phaser.Sound.BaseSound]
     */
    addMusicSound(new_music: Phaser.Sound.BaseSound) {
        this._musicTracks[new_music.key] = new_music;
    }

    /**
     * Sets the current music
     * @param key     [string] key of the music to play.
     * @param config  [Phaser.Types.Sound.SoundConfig] sound configuration object.
     */
    setMusic(key: string, config: Phaser.Types.Sound.SoundConfig = {}) {
        if (this._currentMusic) {
            if (this._currentMusic.isPlaying) {
                if (this._currentMusic.key == key) {
                    // console.log('>> >> Same music key. Ignoring setMusic call.');
                    this._lastPlayedMusicKey = key;
                    return;
                }

                this._currentMusic.stop();
                this._currentMusic = null;
            }
        }

        // Remember the last music requested in case it is requested later, via setIsMusicOn().
        this._lastPlayedMusicKey = key;
        if (!this._musicOn) {
            this.stopMusic();
            return;
        }

        let new_music: Phaser.Sound.BaseSound = this._musicTracks[key];
        if (new_music && !new_music.isPlaying) {
            new_music.play('', config);
            this._currentMusic = this._musicTracks[key];
            this._lastPlayedMusicKey = key;
        }
    }

    /**
     * Stops the current music if no key provided, otherwise stops the music identified by the key.
     * @param key [string] the music key to stop.
     */
    stopMusic(key: string = 'current') {
        if (key == 'current' && this._currentMusic) {
            this._currentMusic.stop();
            this._currentMusic = null;
            return;
        }

        let music_to_stop: Phaser.Sound.BaseSound = this._musicTracks[key];
        if (music_to_stop) {
            music_to_stop.stop();
        }
    }

    ////
    get musicOn(): boolean {
        return this._musicOn;
    }

    set musicOn(value: boolean) {
        this._musicOn = value;
        if (this._musicOn == false) {
            this.stopMusic();
        }
        else {
            this.setMusic(this._lastPlayedMusicKey);
        }
    }
}