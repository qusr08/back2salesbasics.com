"use strict";

import { QuizThumbnailSimulation } from "./sims/QuizThumbnailSimulation.js";

let simulations = [];

window.onload = (e) => {
    document.querySelectorAll(".matter-wrapper").forEach((wrapper) => {
        switch (parseInt(wrapper.getAttribute("matter-index"))) {
            case 0: simulations.push(new QuizThumbnailSimulation(wrapper)); break;
        }
    });
}

window.onresize = (e) => simulations.forEach(simulation => simulation.onResize());