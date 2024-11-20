"use strict";

import { QuizThumbnailSimulation } from "./sims/QuizThumbnailSimulation.js";
import { QuizResultSimulation } from "./sims/QuizResultSimulation.js";

let simulations = [];

window.onload = (e) => {
    document.querySelectorAll(".matter-wrapper").forEach((wrapper) => {
        switch (parseInt(wrapper.getAttribute("matter-index"))) {
            case 0: simulations.push(new QuizThumbnailSimulation(wrapper)); break;
            case 1: simulations.push(new QuizResultSimulation(wrapper)); break;
        }
    });
}

window.onresize = (e) => simulations.forEach(simulation => simulation.onResize());