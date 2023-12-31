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
  return drawIndentHelp(contextFunc, true, true);
}
/**
 * Creates a function which can indent and/or draw a rect
 * with a nested draw function.
 * @param {ContextFunction<void>} specialFunc
 * @param {boolean} doDraw
 * @param {boolean} doIndent
 * @returns {ContextFunction<void>}
 */
function drawIndentHelp(specialFunc, doDraw, doIndent) {
  return (global, local) => {
    if (doDraw) {
      drawRect(global, local);
      local.color = nextColor(global, local);
    }
    if (doIndent) {
      const divisor = 2 * global.settings.minSideSize.val;
      const maxIndentLength = Math.floor(local.length / divisor - 1);
      const maxIndentHeight = Math.floor(local.height / divisor - 1);
      const val1 =
        2 * Math.ceil((Math.random() * maxIndentLength) / 2);
      const val2 =
        2 * Math.ceil((Math.random() * maxIndentHeight) / 2);
      local.length -= global.settings.minSideSize.val * val1;
      local.height -= global.settings.minSideSize.val * val2;
      local.specialShapePlaceable = true;
    }
    specialFunc(global, local);
  };
}

export {
  drawIndentHelp,
  drawIndent,
  drawRect,
  makeShapeObject,
  isSquare,
};
