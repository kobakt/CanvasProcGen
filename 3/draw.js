"use strict"
/**
@typedef {import("./colors.js").Color} Color
@typedef {import("./settings.js").Settings} Settings
@typedef {import("./shapes/shapeObject.js").Shape} Shape
*/


const shapes = [];

// import { blendobject } from "./shapes/blend.js"; 
// shapes.push(blendobject());

import { rectObject } from "./shapes/rect.js";
shapes.push(rectObject());

import { splitObject } from "./shapes/split.js";
shapes.push(splitObject());


/**
 * @param {Shape[]} shapesToPick
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function pickShape(global, local, shapesToPick) {
  if (shapesToPick.length === 0) {
    alert("No valid shapes.");
    throw Error("No valid shapes.");
  }
  const totalWeight = shapesToPick.reduce(
    (prev, curShape) => prev + curShape.weight(global, local),
    0,
  );
  let selectionWeight = Math.random() * totalWeight;
  while (selectionWeight > 0) {
    const curShape = shapesToPick.pop();
    if (selectionWeight < curShape.weight(global, local)) {
      return curShape;
    }
    selectionWeight -= curShape.weight(global, local);
  }
}

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function drawRec(global, local) {
  // shapes is list of imported ShapeObjects
  // checking which can be drawn
  let availableShapes = shapes.filter(
    x => x.isAvailable(global, local)
  );
  let curShape = pickShape(global, local, availableShapes);
  curShape.drawShape(global, local);
}

export { drawRec };
