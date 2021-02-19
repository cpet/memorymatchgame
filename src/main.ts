import Phaser from "phaser";
import * as GG from "./GG";
import { PreloadScene } from "./scene/PreloadScene";
import { LoadScene } from "./scene/LoadScene";
import { LobbyScene } from "./scene/LobbyScene";

export class MemoryMatchGame {
    constructor() {
        const gameConfig = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: '0xFFFFFF',//16777215,
            // resolution: window.devicePixelRatio,
            // resolution: 2,
            // zoom: 0.5,
            parent: "gamediv",
            dom: {
                createContainer: true
            },
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                    fps: 60,
                    gravity: { y: 0 }
                }
            },
            render: {
                pixelArt: false,
                clearBeforeRender: false,
                transparent: false,
                roundPixels: true
            },
            // disableContextMenu: true,
            // Setup the DB plugin.
            plugins: {
                // global: [
                //     { key: "DragonBonesPlugin", plugin: dragonBones.phaser.plugin.DragonBonesPlugin, start: true } // setup DB plugin
                // ]

                scene: [
                    // Setup spine here if needed.
                ]
            },
            scene: [
                PreloadScene,
                LoadScene,
                LobbyScene
                // GameScene,
            ]
        };

        var game = new Phaser.Game(gameConfig);

        window.addEventListener('resize', function (event) {
            GG.onWindowResize(window.innerWidth, window.innerHeight);
        }, false);
    }
}

/**
 * Soon as the basic stuff loads, start the Phaser preloading. 
 */
window.onload = function () {
    new MemoryMatchGame();
}