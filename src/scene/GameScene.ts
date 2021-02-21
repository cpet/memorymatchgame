import Phaser from "phaser";
import { Card } from "../game/Card";
import * as GG from "../GG";
import { ActorsManager } from "../game/ActorsManager";
import { Power2, TweenMax } from "gsap";

export class GameScene extends Phaser.Scene {
    bg: Phaser.GameObjects.Image;

    /**
     * Game actors pooling.
     */
    actorsMng: ActorsManager;

    gridSize: Phaser.Geom.Point;
    gridCont: Phaser.GameObjects.Container;
    gridPadding: Phaser.Geom.Point;

    /**
     * All the cards.
     */
    cards: Card[];
    numMatches: number = 0;

    /**
     * Cards that are in play, or subject to being matched.
     */
    private _cardsInPlay: Card[];

    private _gameWonParticles: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor() {
        super({
            key: GG.KEYS.SCENE.GAME
        });
    }

    create(data) {
        this.bg = this.add.image(0, 0, GG.KEYS.BG.FAR_BG).setOrigin(0, 0);

        // Card faces as an animation.
        let card_face_frames = this.anims.generateFrameNames(GG.KEYS.TEX_SS1, { prefix: 'card', end: 10, zeroPad: 4 });
        this.anims.create({ key: GG.KEYS.ANIMS.CARD_FACES, frames: card_face_frames, repeat: -1, frameRate: 30 });

        // Actors pooling.
        this.actorsMng = new ActorsManager(this);

        // Grid setup.
        this.gridSize = new Phaser.Geom.Point(3, 4);
        this.gridCont = this.add.container();

        if (data) {
            this.gridSize.x = data.grid.x;
            this.gridSize.y = data.grid.y;
        }

        this.gridPadding = new Phaser.Geom.Point(10, 10);
        this.cards = [];
        this._cardsInPlay = [];

        this.buildGrid();
        this.fit();
        this.enableResizeListener();

        this.numMatches = 0;

        // DEV.
        // this.testCardCreation(); // OK.
        // this.testCardPooling(); // OK.
        // this._doGameWon(); // OK.
    }

    /**
     * Builds the game cards grid using the this.gridSize from the previous scene.
     */
    buildGrid() {
        let card_types = [];
        let length: number = this.gridSize.x * this.gridSize.y / 2 + 1;
        for (let i = 1; i < length; i++) {
            card_types.push(i);
            card_types.push(i);
        }

        // Phaser.Utils.Array.Shuffle(card_types);

        console.log("card_types: ", card_types);
        console.log("this.gridSize: ", this.gridSize);

        for (let row = 0; row < this.gridSize.y; row++) {
            for (let col = 0; col < this.gridSize.x; col++) {

                let card = this.actorsMng.getCard(GG.CARD_TYPE.MIN);
                card.gridIx = col + row * this.gridSize.x;
                card.type = card_types[card.gridIx];

                card.setXY(
                    this.gridPadding.x + col * (card.spr.width + this.gridPadding.x) + card.spr.width * 0.5,
                    this.gridPadding.y + row * (card.spr.height + this.gridPadding.y) + card.spr.height * 0.5
                );

                card.setInterractive(true);
                card.on("pointerdown", this._onCardPointerDown, this);

                this.gridCont.add(card.spr);
                this.cards.push(card);
            }
        }
    }

    /**
     * Flips the card face up if allowed to do so.
     * Checks for a successful match.
     * A maximum of 2 cards can be in play at once.
     * 
     * @param pointer 
     * @param localX 
     * @param localY 
     * @param event 
     * @param card 
     */
    private _onCardPointerDown(pointer, localX, localY, event, card: Card) {
        // console.log("_onCardPointerDown, %s", this._cardsInPlay);

        if (this._cardsInPlay.length < 2) {
            card.startFlippingAnimation();
            this._cardsInPlay.push(card);

            // More than one card calls for a match check.
            if (this._cardsInPlay.length > 1) {
                if (this._cardsInPlay[0].type == this._cardsInPlay[1].type) {
                    this._onMatchSucceded();
                }
                else {
                    TweenMax.delayedCall(0.25, this._onMatchFailed, null, this);
                }
            }
        }
    }

    /**
     * On a succeful match remove both matched cards from the cards in play
     * and disable the input on them.
     * Checks for game won condistions.
     */
    private _onMatchSucceded() {
        while (this._cardsInPlay.length > 0) {
            let card: Card = this._cardsInPlay.pop();
            card.setAsMatched();
            card.startSuccessAnimation();
        }

        this.numMatches += 2;
        // Game won condition: all cards are matched.
        if (this.numMatches == this.cards.length) {
            this._doGameWon();
        }
    }

    /**
     * On a failed match, temporarely disable the input on the cards and
     * flip them face down later on. 
     */
    private _onMatchFailed() {
        this._cardsInPlay[0].startFailedAnimation();
        TweenMax.delayedCall(1, this._rejectCardsInPlay, null, this);
    }

    /**
     * Empties the cards in play tracker and flips any card in play face down.
     */
    private _rejectCardsInPlay() {
        while (this._cardsInPlay.length > 0) {
            let card: Card = this._cardsInPlay.pop();
            card.startFlippingAnimation();
        }
    }

    private _doGameWon() {
        let screen_w: number = this.game.renderer.width;
        let screen_h: number = this.game.renderer.height;

        let card: Card = this.cards[0];
        let frame_names: string[] = [];
        let card_face_frames = this.anims.generateFrameNames(GG.KEYS.TEX_SS1, { prefix: 'card', end: 10, zeroPad: 4 });
        for (let i = 1; i < card_face_frames.length; i++) {
            const frame: Phaser.Types.Animations.AnimationFrame = card_face_frames[i];
            frame_names.push(frame.frame + "");
        }

        let particles = this.add.particles(GG.KEYS.TEX_SS1);
        this.gridCont.add(particles);
        let grid_width: number = (card.spr.displayWidth + this.gridPadding.x) * this.gridSize.x;
        this._gameWonParticles = particles.createEmitter({
            frame: frame_names,
            x: { min: card.spr.displayWidth / 2, max: grid_width - card.spr.displayWidth / 2 },
            y: -card.spr.displayHeight / 2,
            rotate: { min: 0, max: 360 },
            // angle: { min: -45, max: 45 },
            collideBottom: true,
            lifespan: 8000,
            speedY: { min: 200, max: 280 },
            frequency: 500,
            quantity: 2,
            scaleX: { min: 0.1, max: 1.2 },
            scaleY: { min: 0.1, max: 1.2 },
            alpha: { min: 0.1, max: 1 },
            accelerationY: { min: 100, max: 200 },
            emitCallback: (particle, emitter) => {
                //// Must declare the on complete before use for the transpiler to be happy.
                // 2.
                let onFirstComplete = (particle, emitter) => {
                    TweenMax.to(particle, Phaser.Math.RND.realInRange(1.75, 2.5), {
                        scaleX: Phaser.Math.RND.realInRange(0.9, 1),
                        scaleY: Phaser.Math.RND.realInRange(0.9, 1),
                        ease: Power2.easeInOut
                    });
                }

                // 1.
                TweenMax.to(particle, Phaser.Math.RND.realInRange(1.75, 2.5), {
                    scaleX: Phaser.Math.RND.realInRange(0.75, 0.85),
                    scaleY: Phaser.Math.RND.realInRange(0.7, 0.8),
                    onComplete: onFirstComplete,
                    onCompleteScope: this,
                    onCompleteParams: [particle, emitter],
                    ease: Power2.easeInOut
                });

                particle.alpha = 0.1;
                TweenMax.to(particle, 0.5, { alpha: 1 });
                TweenMax.to(particle, 4, { angle: Phaser.Math.RND.between(0, 360), });
            },
            emitCallbackScope: this
        });
    }

    private _doGameLost() {

    }

    /**
     * Fits the background and gamplay elements to fit the available screen size.
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

        let card = this.cards[0];
        // If fit() is called before any cards are ready ignore.
        if (!card) { return; }

        let grid_cont_w: number = this.gridPadding.x + this.gridSize.x * (card.spr.width + this.gridPadding.x);
        let grid_cont_h: number = this.gridPadding.y + this.gridSize.y * (card.spr.height + this.gridPadding.y);

        this.gridCont.scale = Math.min(screen_w / grid_cont_w, screen_h / grid_cont_h);
        this.gridCont.x = Math.floor(Math.abs(grid_cont_w * this.gridCont.scale - screen_w) * 0.5);
        this.gridCont.y = Math.floor(Math.abs(grid_cont_h * this.gridCont.scale - screen_h) * 0.5);

        // If the game won particles emiter is set, update it's x spawn locations.
        // if (this._gameWonParticles) {
        //     this._gameWonParticles.x = { min: card.spr.displayWidth / 2, max: screen_w - card.spr.displayWidth / 2 }
        // }
    }

    reset() {
        while (this.cards.length > 0) {
            const card: Card = this.cards.pop();
            card.off("pointerdown", this._onCardPointerDown, this);
            this.actorsMng.poolCard(card);
        }

        this.gridCont.removeAll();
        TweenMax.killAll();

        this.numMatches = 0;
    }


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

    ////

    testCardPooling() {
        let c1 = this.actorsMng.getCard(GG.CARD_TYPE.COW).setXY(200, 280);
        let c2 = this.actorsMng.getCard(GG.CARD_TYPE.DRAGON).setXY(500, 280);
    }

    testCardCreation() {
        let card1 = new Card(GG.CARD_TYPE.PIG, this, 0).setXY(200, 150);
        card1.type = GG.CARD_TYPE.SPIDER;
        let card2 = new Card(GG.CARD_TYPE.SPIDER, this, 1).setXY(500, 150);
        card2.type = GG.CARD_TYPE.DRAGON
        // let card3 = new Card(11, this).setXY(700, 150); // OK.
        // let card4 = new Card(-1, this).setXY(700, 150); // OK.
    }

}