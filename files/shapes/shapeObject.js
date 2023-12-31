"use strict";

import { hex } from "../colors.js";

/**
 * A shape object used to draw on th canvas.
 * @typedef {Object} Shape
 * @prop {ContextFunction} isAvailable
 * @prop {ContextFunction} weight
 * @prop {ContextFunction} drawShape
 */

/**
 * A function to make a Shape.
 * @param {ContextFunction} isAvailable
 * @param {ContextFunction} weight
 * @param {ContextFunction} drawShape
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

export { drawRect, makeShapeObject, isSquare };
