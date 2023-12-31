import { nextColor } from "../colors.js";
import {
  drawIndentHelp,
  drawRect,
  isSquare,
  makeShapeObject,
} from "./shapeObject.js";
/** 
@typedef {import("shapes/shapeObject.js").Shape} Shape
@typedef {import("../settings.js").ShapeObjectSettings} ShapeObjectSettings 
*/

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
 * @param {ContextFunction<ShapeObjectSettings>} getSettings
 * @returns {ContextFunction<boolean>}
 */
function isAvailableSpecial(getSettings) {
  return (global, local) => {
    const specialOffset = local.specialShapePlaceable ? 0 : 2;
    return (
      isSquare(local) &&
      local.numOfIter >= getSettings(global, local).minIter.val &&
      local.length >=
        global.settings.minSideSize.val * (3 + specialOffset)
    );
  };
}

/**
 * Draws and updates local for nesting an object inside.
 * @param {ContextFunction<number>} specialFun
 * @returns{ContextFunction<void>}
 */
function drawUpdateSpecial(specialFun) {
  return (global, local) => {
    const newLength = specialFun(global, local);
    local.length = newLength;
    local.height = newLength;
    global.callback(global, local);
  };
}

/**
 * A function used to draw special objects.
 * @param {ContextFunction<number>} specialFun
 * @param {ContextFunction<ShapeObjectSettings>} getSettings
 * @returns {ContextFunction<void>}
 */
function drawSpecial(specialFun, getSettings) {
  return (global, local) => {
    drawIndentHelp(
      drawUpdateSpecial(specialFun),
      !local.specialShapePlaceable,
      Math.random() <
        getSettings(global, local).nestingIndentProb.val,
    )(global, local);
  };
}

/**
 * Makes a special shape.
 * @param {ContextFunction<ShapeObjectSettings>} getShapeSettings
 * @param {ContextFunction<number>} drawHelp
 */
function makeSpecial(getShapeSettings, drawHelp) {
  return makeShapeObject(
    isAvailableSpecial(getShapeSettings),
    (global, local) => getShapeSettings(global, local).weight.val,
    drawSpecial(drawHelp, getShapeSettings),
  );
}

export { floorEvenOrOdd, makeSpecial };
