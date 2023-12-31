"use strict";

import { hex, nextColor } from "../colors.js";

/**
 * A shape object used to draw on th canvas.
 * @typedef {Object} Shape
 * @prop {ContextFunction<boolean>} isAvailable
 * @prop {ContextFunction<number>} weight
 * @prop {ContextFunction<void>} drawShape
 */

/**
 * A function to make a Shape.
 * @param {ContextFunction<boolean>} isAvailable
 * @param {ContextFunction<number>} weight
 * @param {ContextFunction<void>} drawShape
 * @returns {Shape}
 */
function makeShapeObject(isAvailable, weight, drawShape) {
  return {
    isAvailable,
    weight,
    drawShape,
  };
}

/**
 * Are we drawing a square shape?
 * @param {LocalContext} local
 * @returns {boolean}
 */
function isSquare(local) {
  return local.length === local.height;
}

/**
 * Draws a simple rectangle.
 * @param {GlobalContext} global
 * @param {LocalContext} local
 * @returns {void}
 */
function drawRect(global, local) {
  global.ctx.fillStyle = hex(local.color);
  global.ctx.fillRect(
    local.centerX - local.length / 2,
    local.centerY - local.height / 2,
    local.length,
    local.height,
  );
}

/**
 * Creates a function which draws an indent shape
 * with a nested draw function.
 * @param {ContextFunction<void>} contextFunc
 * @returns {ContextFunction<void>}
 */
function drawIndent(contextFunc) {
  return (global, local) => {
    drawRect(global, local);
    const val1 = 2;
    const val2 = 2;
    local.length -= global.settings.minSideSize.val * val1;
    local.height -= global.settings.minSideSize.val * val2;
    local.color = nextColor(global, local);
    local.numOfIter++;
    local.specialShapePlaceable = true;
    contextFunc(global, local);
  };
}

export { drawIndent, drawRect, makeShapeObject, isSquare };
