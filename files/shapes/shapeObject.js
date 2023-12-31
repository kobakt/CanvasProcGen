"use strict";

import { hex, nextColor } from "../colors.js";

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
 * If n and m are both even or both odd, return n
 * Else return n-1
 * M will typically be the original length.
 * So when you don't know if the centers end with .0 or .5
 * and you want to know whether n should be even or odd like m,
 * use this.
 * @param {number} n
 * @param {number} m
 */
function floorEvenOrOdd(n, m) {
  if ((n + m) % 2 === 0) {
    return n;
  }
  return n - 1;
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
 * A function used to draw special objects.
 * @param {ContextFunction} specialFun
 * @param {ContextFunction} nestingIndentProbFunc
 * @returns {ContextFunction}
 */
function drawSpecial(specialFun, nestingIndentProbFunc) {
  return (global, local) => {
    if (local.specialShapePlaceable) {
      specialFun(global, local);
    } else {
      drawRect(global, local);
      if (Math.random() < nestingIndentProbFunc(global, local)) {
        local.length -= 2 * global.settings.minSideSize.val;
        local.height -= 2 * global.settings.minSideSize.val;
      }
      local.color = nextColor(global, local);
      specialFun(global, local);
    }
  };
}

/**
 * A function used to determine if a special object
 * can be drawn or not.
 * @param {number} specialMinIter
 * @returns {ContextFunction}
 */
function isAvailableSpecial(specialMinIter) {
  return (global, local) => {
    const specialOffset = local.specialShapePlaceable
      ? 0
      : 2 * global.settings.minSideSize.val;
    return (
      isSquare(local) &&
      local.numOfIter >= specialMinIter &&
      local.length >=
        global.settings.minSideSize.val * 3 + specialOffset
    );
  };
}

export {
  isAvailableSpecial,
  drawSpecial,
  drawRect,
  floorEvenOrOdd,
  makeShapeObject,
  isSquare,
};
