import { randFloat } from "../utils.js";
import { Simulation } from "./Simulation.js";

const RANGE_WIDTH = 450;
const RANGE_HEIGHT = RANGE_WIDTH / 2;
const ARROW_WIDTH = (150 / 750.0) * RANGE_HEIGHT;
const ARROW_HEIGHT = RANGE_HEIGHT;
const ARROW_SPEED = 0.2;
const ARROW_MAX_SPEED = 0.4;

const CONTENT = [
    {
        "name": "Poor", 
        "class": "poor",
        "text": "Your management team is experiencing severe deficiencies in core sales activities, managerial practices, and team interactions. <strong>This indicates a critical need for urgent intervention.</strong>"
    },
    {
        "name": "Needs Improvement",
        "class": "needs-improvement",
        "text": "Your management team is facing significant challenges in various aspects of sales activities and management practices. <strong>This suggests that your sales team may be struggling to meet its goals.</strong>"
    },
    {
        "name": "Acceptable",
        "class": "acceptable",
        "text": "Your sales team exhibits solid foundations in sales activities and management practices are conducive to the current. There are areas where improvement can be made. <strong>This indicates that your sales team has potential for growth!</strong>"
    },
    {
        "name": "Excellent",
        "class": "excellent",
        "text": "Your sales team demonstrates strong competencies in core sales activities. Your management team shows strong managerial practices, and team interactions. <strong>This suggests that your sales team is well-equipped to succeed.</strong>"
    }
];

export class QuizResultSimulation extends Simulation {
    constructor(wrapper) {
        super(wrapper);

        this.range = undefined;
        this.rangeOptions = {
            isStatic: true,
            render: {
                sprite: {
                    texture: "../../png/range4Weight.png",
                    xScale: RANGE_WIDTH / 1500, // The range image is 1500x750
                    yScale: RANGE_HEIGHT / 750
                }
            }
        }

        this.arrow = undefined;
        this.arrowOptions = {
            isStatic: true,
            render: {
                sprite: {
                    texture: "../../png/rangeArrow.png",
                    xScale: ARROW_WIDTH / 150, // The arrow image is 150x750
                    yScale: ARROW_HEIGHT / 750,
                    yOffset: 0.4 // This is equal to => 0.5 - (150 / 2 / 750)
                }
            }
        }
        this.arrowToAngle = 0;

        this.score = 0;

        // Get all of the different score level elements
        this.resultElement = this.element.querySelector(".quiz-result");
        this.enabledResultIndex = -1;

        this.init();
    }

    onResize() {
        super.onResize();

        // Reposition the range and arrow objects
        this.range.position = { x: this.element.offsetWidth / 2, y: this.element.offsetHeight / 3 };
        this.arrow.position = { x: this.element.offsetWidth / 2, y: this.element.offsetHeight / 3 + RANGE_HEIGHT / 2 };
    }

    init() {
        super.init();

        // Create the result graphics
        this.range = Matter.Bodies.rectangle(this.element.offsetWidth / 2, this.element.offsetHeight / 3, RANGE_WIDTH, RANGE_HEIGHT, this.rangeOptions);
        this.arrow = Matter.Bodies.rectangle(this.element.offsetWidth / 2, this.element.offsetHeight / 3 + RANGE_HEIGHT / 2, ARROW_WIDTH, ARROW_HEIGHT, this.arrowOptions);
        Matter.Composite.add(this.engine.world, [this.range, this.arrow]);

        this.setScore(randFloat(0, 1)); // TEST

        this.initialized = true;
    }

    update() {
        // If the simulation has not been initialized, then do not try to update it
        if (!this.initialized) {
            return;
        }

        // Adjust the rotation of the arrow based on its target angle
        // Subtracting a little bit off of the target angle to make sure the arrow stops moving once it gets close enough
        if (this.arrow.angle < this.arrowToAngle - 0.001) {
            // Make it so the arrow slows down as it approaches its target angle
            let angleDifferenceMod = Math.min(ARROW_MAX_SPEED, (this.arrowToAngle - this.arrow.angle) / Math.PI);
            Matter.Body.rotate(this.arrow, angleDifferenceMod * ARROW_SPEED);
        } else if (this.enabledResultIndex == -1) {
            // Set the range element index based on the score
            if (this.score < 0.4) this.enabledResultIndex = 0;
            else if (this.score < 0.6) this.enabledResultIndex = 1;
            else if (this.score < 0.8) this.enabledResultIndex = 2;
            else this.enabledResultIndex = 3;
            
            // Update the html elements
            this.resultElement.classList.add(CONTENT[this.enabledResultIndex].class);
            this.resultElement.querySelector("h3").innerHTML = "Score: " + CONTENT[this.enabledResultIndex].name;
            this.resultElement.querySelector("p").innerHTML = CONTENT[this.enabledResultIndex].text;
            this.resultElement.style.opacity = 1;
        }
    }

    setScore(score) {
        this.score = Math.max(Math.min(score, 1), 0);
        this.enabledResultIndex = -1;

        // Clamp the score between 0 and 1
        // Then convert it to an angle that the arrow needs to rotate to
        this.arrowToAngle = (this.score * Math.PI) - (Math.PI / 2);
        Matter.Body.setAngle(this.arrow, -Math.PI / 2);
    }
}