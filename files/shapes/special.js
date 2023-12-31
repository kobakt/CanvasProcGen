import { nextColor } from "../colors.js";
import {
  drawRect,
  isSquare,
  makeShapeObject,
} from "./shapeObject.js";

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
 * A function used to determine if a special object
 * can be drawn or not.
 * @param {ContextFunction} minIterFunc
 * @returns {ContextFunction}
 */
function isAvailableSpecial(minIterFunc) {
  return (global, local) => {
    const specialOffset = local.specialShapePlaceable
      ? 0
      : 2 * global.settings.minSideSize.val;
    return (
      isSquare(local) &&
      local.numOfIter >= minIterFunc(global, local) &&
      local.length >=
        global.settings.minSideSize.val * 3 + specialOffset
    );
  };
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
 * Makes a special shape.
 * @param {ContextFunction} minIterValFunc
 * @param {ContextFunction} weightFunc
 * @param {ContextFunction} drawHelp
 * @param {ContextFunction} nestingIndentFunc
 */
function makeSpecial(
  minIterValFunc,
  weightFunc,
  drawHelp,
  nestingIndentFunc,
) {
  return makeShapeObject(
    isAvailableSpecial(minIterValFunc),
    weightFunc,
    drawSpecial(drawHelp, nestingIndentFunc),
  );
}

export { floorEvenOrOdd, makeSpecial };
