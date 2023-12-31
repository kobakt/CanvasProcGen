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
}

/**
 * Recursive function which handles drawing a section of the canvas.
 * @param {GlobalContext} global
 * @param {LocalContext} local
 * @returns {void}
 */
function drawRec(global, local) {
  let availableShapes = shapes.filter((x) =>
    x.isAvailable(global, local),
  );
  if (availableShapes.length === 0) {
    availableShapes.push(rectObject());
  }

  let curShape = pickShape(global, local, availableShapes);
  curShape.drawShape(global, local);
}

export { drawRec };
