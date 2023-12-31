import { getBlendColors, nextColor } from "../colors.js";
import {
  drawRect,
  isSquare,
  makeShapeObject,
} from "./shapeObject.js";
/** @typedef {import("./shapeObject.js").Shape} Shape*/

/**
 * @param {ContextFunction} minIterValFunc
 * @returns {ContextFunction}
 */
function isAvailableIndent(minIterValFunc) {
  return (global, local) =>
    isSquare(local) &&
    local.numOfIter >= minIterValFunc(global, local) &&
    local.length > global.settings.minSideSize.val * 3;
}

/**
 * @callback ChangeColor
 * @param {number} iter
 */

/**
 * @param {ContextFunction} changeColorHelp
 * @returns {ContextFunction}
 */
function drawRecIndent(changeColorHelp) {
  return (global, local) => {
    const numOfBands = Math.round(
      local.length / (global.settings.minSideSize.val * 2),
    );
    /** @type {ChangeColor} changeColor */
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
 * @param {ContextFunction} minIterValFunc
 * @param {ContextFunction} weightFunc
 * @param {ContextFunction} changeColorHelp
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
 * @param {GlobalContext} global
 * @param {LocalContext} local
 * @returns {ChangeColor}
 */
function blendColorHelp(global, local) {
  const numOfBands = Math.round(
    local.length / (global.settings.minSideSize.val * 2),
  );
  const color2 = nextColor(global, local);
  const colors = getBlendColors(numOfBands, local.color, color2);
  return (i) => {
    local.color = colors[i];
  };
}

/**
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
