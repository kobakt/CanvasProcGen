import { nextColor } from "../colors.js";
import {
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
 * Updates local for nesting an object inside.
 * @param {GlobalContext} global
 * @param {LocalContext} local
 * @param {number} newLength
 */
function updateLocalNesting(global, local, newLength) {
  local.numOfIter++;
  local.color = nextColor(global, local);
  local.length = newLength;
  local.height = newLength;
  local.specialShapePlaceable = true;
}

/**
 * A function used to draw special objects.
 * @param {ContextFunction<number>} specialFun
 * @param {ContextFunction<ShapeObjectSettings>} getSettings
 * @returns {ContextFunction<void>}
 */
function drawSpecial(specialFun, getSettings) {
  return (global, local) => {
    if (local.specialShapePlaceable) {
      specialFun(global, local);
    } else {
      drawRect(global, local);
      if (
        Math.random() <
        getSettings(global, local).nestingIndentProb.val
      ) {
        local.length -= 2 * global.settings.minSideSize.val;
        local.height -= 2 * global.settings.minSideSize.val;
      }
      local.color = nextColor(global, local);
      const newLength = specialFun(global, local);
      if (
        newLength >= global.settings.minSideSize.val &&
        Math.random() < getSettings(global, local).nestingProb.val
      ) {
        updateLocalNesting(global, local, newLength);
        global.callback(global, local);
      }
    }
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
