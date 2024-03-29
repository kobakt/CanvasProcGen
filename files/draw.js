"use strict";
/** @typedef {import("./shapes/shapeObject.js").Shape} Shape */

const shapes = [];

import { rectObject } from "./shapes/rect.js";
shapes.push(rectObject());

import { splitObject } from "./shapes/split.js";
shapes.push(splitObject());

import { indentObject } from "./shapes/indent.js";
shapes.push(indentObject());

import { blend } from "./shapes/recIndent.js";
shapes.push(blend());

import { distance } from "./shapes/recIndent.js";
shapes.push(distance());

import { opposites } from "./shapes/recIndent.js";
shapes.push(opposites());

import { circleObject } from "./shapes/circle.js";
shapes.push(circleObject());

import { crossObject } from "./shapes/cross.js";
shapes.push(crossObject());

import { diamondObject } from "./shapes/diamond.js";
import { nextColor } from "./colors.js";
shapes.push(diamondObject());

/**
 * Takes a list of shapes and picks one based on their weights.
 * @param {GlobalContext} global
 * @param {LocalContext} local
 * @param {Shape[]} shapesToPick
 * @returns {Shape}
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
  return shapesToPick.pop();
}

/**
 * Returns function which adds to stack as well as updating color and numOfIter
 * @param {LocalContext[]} stack
 * @returns {ContextFunction<void>}
 */
function addToStack(stack) {
  return (global, local) => {
    local.color = nextColor(global, local);
    local.numOfIter++;
    stack.push(local);
  };
}
/**
 * Recursive function which handles drawing a section of the canvas.
 * @param {GlobalContext} global
 * @param {LocalContext} initLocal
 * @param {LocalContext[]} stack
 * @returns {void}
 */
function drawStack(global, initLocal, stack) {
  stack.push(initLocal);
  while (stack.length > 0) {
    const local = stack.pop();
    let availableShapes = shapes.filter(
      (x) => x.isAvailable(global, local) && x.weight(global, local),
    );
    if (availableShapes.length === 0) {
      if (local.specialShapePlaceable) {
        // rect is not available and
        // we don't need to draw a rect in this case,
        // so don't draw anything.
        continue;
        // return;
      }
      // Need to draw something, so draw a rect.
      availableShapes.push(rectObject());
    }
    let curShape = pickShape(global, local, availableShapes);
    curShape.drawShape(global, local);
  }
}

export { addToStack, drawStack };
