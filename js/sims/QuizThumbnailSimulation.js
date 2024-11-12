import { Simulation } from "./Simulation.js";
import { randFloat } from "../utils.js";

export class QuizThumbnailSimulation extends Simulation {
    constructor(wrapper) {
        super(wrapper);

        this.coinSize = 75;
        this.coinObjects = [];

        this.init();
    }

    init() {
        super.init();
        
        this.createCoin();

        this.initialized = true;
    }

    update() {
        // If the simulation has not been initialized, then do not try to update it
        if (!this.initialized) {
            return;
        }

        // Loop through all coin objects and check to see if they have gone off the bottom of the screen
        // If they have, then destroy the coin
        for (let i = this.coinObjects.length - 1; i >= 0; i--) {
            if (this.coinObjects[i].position.y > this.element.offsetHeight + this.coinSize) {
                Matter.Composite.remove(this.engine.world, this.coinObjects[i]);
                this.coinObjects.splice(i, 1);
            }
        }
    }

    createCoin() {
        // Create a coin object
        let coin = Matter.Bodies.circle(randFloat(0, this.element.offsetWidth), -this.coinSize, this.coinSize, {
            render: {
                sprite: {
                    texture: "../../png/coin.png",
                    xScale: this.coinSize / 500, // The coin image is 500 pixels big
                    yScale: this.coinSize / 500
                }
            }
        });

        // Add the coin object to the world
        Matter.Composite.add(this.engine.world, coin);
        this.coinObjects.push(coin);
    }
}