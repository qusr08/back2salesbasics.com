export class Simulation {
    constructor(element) {
        this.element = element;
        this.initialized = false;
    }

    onResize() {
        this.render.options.width = this.element.offsetWidth;
        this.render.options.height = this.element.offsetHeight;
        this.render.canvas.width = this.element.offsetWidth;
        this.render.canvas.height = this.element.offsetHeight;
    }

    init() {
        // Create the matter.js engine
        this.engine = Matter.Engine.create();

        // Create the matter.js renderer
        this.render = Matter.Render.create({
            options: {
                width: this.element.offsetWidth,
                height: this.element.offsetHeight,
                wireframes: false,
                background: getComputedStyle(this.element).getPropertyValue('--background-color')
            },
            element: this.element,
            engine: this.engine
        });
        Matter.Render.run(this.render);

        // Make sure the canvas html element is the first child in the list
        // this.render.canvas.parentNode.insertBefore(this.render.canvas, this.render.canvas.parentNode.firstChild);

        // Make the element have a transparent background
        this.element.style.backgroundColor = "transparent";

        // Create the matter.js runner
        this.runner = Matter.Runner.create();
        Matter.Runner.run(this.runner, this.engine);

        // Add an event to matter.js so the simulation can be updated
        Matter.Events.on(this.engine, 'afterUpdate', (e) => { this.update(); });
    }

    update() { }
}