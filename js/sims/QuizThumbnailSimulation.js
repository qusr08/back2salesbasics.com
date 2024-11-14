import { Simulation } from "./Simulation.js";
import { randFloat } from "../utils.js";

export class QuizThumbnailSimulation extends Simulation {
    constructor(wrapper) {
        super(wrapper);

        // Declare coin variables
        this.coinRadius = 30;
        this.coins = [];
        this.removedCoins = [];
        this.maxCoins = 20;
        this.lastCoinSpawnTime = -1;
        this.coinSpawnInterval = 900; // Milliseconds
        this.coinSpawnVelocity = 0.05;
        this.coinOptions = {
            restitution: 0.45,
            render: {
                sprite: {
                    texture: "../../png/coin.png",
                    xScale: this.coinRadius * 2 / 500, // The coin image is 500 pixels big
                    yScale: this.coinRadius * 2 / 500
                }
            }
        };
        this.removedCoinScaleSpeed = 0.01;

        this.wallThickness = 20;
        this.wallOptions = {
            isStatic: true,
            render: {
                fillStyle: getComputedStyle(this.element).getPropertyValue('--background-color')
            }
        };
        this.leftWall = undefined;
        this.rightWall = undefined;
        this.ground = undefined;

        this.init();
    }

    onResize() {
        super.onResize();

        // Update the position and size of the boundary walls
        Matter.Composite.remove(this.engine.world, [this.ground, this.leftWall, this.rightWall]);
        this.createWalls();
    }

    init() {
        super.init();

        this.createWalls();

        this.initialized = true;
    }

    update() {
        // If the simulation has not been initialized, then do not try to update it
        if (!this.initialized) {
            return;
        }

        // Spawn a new coin if it is time to do so
        let now = Date.now();
        if (now - this.lastCoinSpawnTime >= this.coinSpawnInterval) {
            this.createCoin();
            this.lastCoinSpawnTime = now;
        }

        // Update the size of all coins that have been removed
        for (let i = this.removedCoins.length - 1; i >= 0; i--) {
            this.removedCoins[i].scale -= this.removedCoinScaleSpeed;
            this.removedCoins[i].body.render.sprite.xScale = this.removedCoins[i].scale;
            this.removedCoins[i].body.render.sprite.yScale = this.removedCoins[i].scale;

            if (this.removedCoins[i].scale <= 0) {
                Matter.Composite.remove(this.engine.world, this.removedCoins[i].body);
                this.removedCoins.splice(i, 1);
            }
        }
    }

    createWalls() {
        // Create boundary walls
        this.ground = Matter.Bodies.rectangle(this.element.offsetWidth / 2, this.element.offsetHeight + (this.wallThickness / 2), this.element.offsetWidth, this.wallThickness, this.wallOptions);
        this.leftWall = Matter.Bodies.rectangle(-this.wallThickness / 2, this.element.offsetHeight / 2, this.wallThickness, this.element.offsetHeight, this.wallOptions);
        this.rightWall = Matter.Bodies.rectangle(this.element.offsetWidth + (this.wallThickness / 2), this.element.offsetHeight / 2, this.wallThickness, this.element.offsetHeight, this.wallOptions);

        // Create boundaries around the edges of the screen (excluding the top)
        Matter.Composite.add(this.engine.world, [this.ground, this.leftWall, this.rightWall]);
    }

    createCoin() {
        // Create a coin object
        let coin = Matter.Bodies.circle(randFloat(this.coinRadius, this.element.offsetWidth / 2 - this.coinRadius), -this.coinRadius, this.coinRadius, this.coinOptions);

        Matter.Body.rotate(coin, randFloat(0, 360));
        Matter.Body.applyForce(coin, coin.position, { x: randFloat(-this.coinSpawnVelocity, this.coinSpawnVelocity), y: 0 });

        // Add the coin object to the world
        Matter.Composite.add(this.engine.world, coin);

        // If the max coin amount has been reached, remove the oldest coin
        if (this.coins.length == this.maxCoins) {
            this.removedCoins.push({ body: this.coins[0], scale: this.coins[0].render.sprite.xScale });
            this.coins.splice(0, 1);
        }

        // Add the new coin to the array
        this.coins.push(coin);
    }
}