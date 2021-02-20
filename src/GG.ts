/**
 * A global game space for the game's settings and such.
 */

export const CARD_BACK_IX = 0;
export const CARD_TYPE = {
    BAT: 1,
    CAT: 2,
    COW: 3,
    DRAGON: 4,
    GARBAGE_MAN: 5,
    GHOST_DOG: 6,
    HEN: 7,
    HORSE: 8,
    PIG: 9,
    SPIDER: 10,

    /**
     * Minimum allowed value.
     */
    MIN: 1,

    /**
     * Maximum allowed value.
     */
    MAX: 10
}

// export const CARD_FRAMES_NAMES = {
//     BACK: 'card0000',
//     BAT: 'card0001',
//     CAT: 'card0002',
//     COW: 'card0003',
//     DRAGON: 'card0004',
//     GARBAGE_MAN: 'card0005',
//     GHOST_DOG: 'card0006',
//     HEN: 'card0007',
//     HORSE: 'card0008',
//     PIG: 'card0009',
//     SPIDER: 'card0010',
// }

export const ACTOR_ID = {
    CARD: 0,
    POOF_GFX: 1
}

/**
 * Actors z-like depths.
 */
export const BASE_DEPTH = {
    BG: 0,
    CARD: 10,
    GFX: 40
};

export const SETTINGS = {
    CAM_FOLLOW_LERP: 0.01,
    IS_TOUCH_SCREEN: false,
    SFX_VOLUJME: 0.7,
    MUSIC_VOLUME: 0.3
};

/**
 * Ids for eveything game related.
 */
export const KEYS = {
    FONTS: {
        CHANGA_ONE: 'ChangaOne'
    },
    /**
     * Sprite sheet. 
     * - card faces and back.
     * - back button.
     */
    TEX_SS1: 'ss1',

    ANIMS: {
        CARD_FACES: 'card_faces',
    },

    SCENE: {
        PRELOAD: 'preload_scene',
        LOAD: 'load_scene',

        LOBBY: 'lobby_scene',
        SOUND_UI: 'sound_ui',

        GAME: 'game_scene',
        GAME_PAUSED: 'game_paused_scene',
        // GAME_UI: 'game_ui'
    },

    LOGO_HERE: 'logo_here',

    BG: {
        FAR_BG: 'FarBg0000',
    },

    UI: {
        BTN_BACK: 'backBtn0000'
    }
};

/**
 * The currently active Phaser.Scene.
 */
export let currentScene: Phaser.Scene;

/**
 * Set the currently active Phaser.Scene.
 * @param v the scene.
 */
export function setCurrentScene(v: Phaser.Scene) {
    currentScene = v;
}

/**
 * Triggers when the wind 'resize' event fires.
 * Calls the active scene's onResize (where defined) to adapt to the new window size.
 * @param new_width 
 * @param new_height 
 */
export function onWindowResize(new_width: number, new_height: number) {
    if (currentScene && currentScene.scale) {
        currentScene.scale.resize(new_width, new_height);
        //@ts-ignore.
        if (currentScene.onResize) {
            //@ts-ignore.
            currentScene.onResize.apply(currentScene);
        }
    }
};