import { getBlendColors, nextColor } from "../colors.js";
import {
  drawRect,
  isSquare,
  makeShapeObject,
} from "./shapeObject.js";
/** @typedef {import("./shapeObject.js").Shape} Shape*/

/**
 * Determines if recIndent can be drawn.
 * @param {ContextFunction<number>} minIterValFunc
 * @returns {ContextFunction<boolean>}
 */
function isAvailableIndent(minIterValFunc) {
  return (global, local) =>
    isSquare(local) &&
    local.numOfIter >= minIterValFunc(global, local) &&
    local.length > global.settings.minSideSize.val * 3;
}

/**
 * A function which changes local.color
 * @callback ChangeColor
 * @param {number} iter
 * @returns {void}
 */

/**
 * Gets the number of bands in the recIndent.
 * @param {GlobalContext} global
 * @param {LocalContext} local
 * @returns {number}
 */
function getNumOfBands(global, local) {
  return Math.round(
    local.length / (global.settings.minSideSize.val * 2),
  );
}

/**
 * Draws the recIndent with the given color-changing helper function.
 * @param {ContextFunction<ChangeColor>} changeColorHelp
 * @returns {ContextFunction<void>}
 */
function drawRecIndent(changeColorHelp) {
  return (global, local) => {
    const numOfBands = getNumOfBands(global, local);
    const changeColor = changeColorHelp(global, local);
    for (let i = 0; i < numOfBands; i++) {
      changeColor(i);
      drawRect(global, local);
      local.length -= global.settings.minSideSize.val * 2;
      local.height -= global.settings.minSideSize.val * 2;
    }
  };
}

/**
 * Makes a recIndent
 * @param {ContextFunction<number>} minIterValFunc
 * @param {ContextFunction<number>} weightFunc
 * @param {ContextFunction<ChangeColor>} changeColorHelp
 * @returns {Shape}
 */
function makeRecIndent(minIterValFunc, weightFunc, changeColorHelp) {
  return makeShapeObject(
    isAvailableIndent(minIterValFunc),
    weightFunc,
    drawRecIndent(changeColorHelp),
  );
}

/**
 * The color help function for distance recIndent
 * @param {GlobalContext} global
 * @param {LocalContext} local
 * @returns {ChangeColor}
 */
function distanceColorHelp(global, local) {
  return (i) => {
    if (i !== 0) {
      local.color = nextColor(global, local);
    }
  };
}

/**
 * The distance recIndent
 * @returns {Shape}
 */
function distance() {
  return makeRecIndent(
    (global) => global.settings.shapes.distance.minIter.val,
    (global) => global.settings.shapes.distance.weight.val,
    distanceColorHelp,
  );
}

/**
 * The color help function for opposites recIndent
 * @param {GlobalContext} global
 * @param {LocalContext} local
 * @returns {ChangeColor}
 */
function oppositesColorHelp(global, local) {
  const color1 = local.color;
  const color2 = nextColor(global, local);
  return (i) => {
    local.color = i % 2 === 0 ? color1 : color2;
  };
}

/**
 * The opposites recIndent
 * @returns {Shape}
 */
function opposites() {
  return makeRecIndent(
    (global) => global.settings.shapes.opposites.minIter.val,
    (global) => global.settings.shapes.opposites.weight.val,
    oppositesColorHelp,
  );
}

/**
 * The color help function for blend recIndent
 * @param {GlobalContext} global
 * @param {LocalContext} local
 * @returns {ChangeColor}
 */
function blendColorHelp(global, local) {
  const numOfBands = getNumOfBands(global, local);
  const color2 = nextColor(global, local);
  const colors = getBlendColors(numOfBands, local.color, color2);
  return (i) => {
    local.color = colors[i];
  };
}

/**
 * The blend recIndent
 * @returns {Shape}
 */
function blend() {
  return makeRecIndent(
    (global) => global.settings.shapes.blend.minIter.val,
    (global) => global.settings.shapes.blend.weight.val,
    blendColorHelp,
  );
}

export { blend, opposites, distance, makeRecIndent };
