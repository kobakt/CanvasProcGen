"use strict";
import { shapes } from "./draw.js";

function drawRec(context) {
    // shapes is list of imported ShapeObjects
    // checking which can be drawn
    let availableShapes = shapes.filter(
        x => x.isAvailable(context)
    );
    // Then one will be  picked
    // TODO determine on weight
    let curShape = availableShapes[0];


    curShape.drawShape(context, centerX, centerY);
}
