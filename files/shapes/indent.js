import { nextColor } from "../colors.js";
import { drawRect, makeShapeObject } from "./shapeObject.js";
/** @typedef {import("./shapeObject.js").Shape} Shape */

/**
 * Determines if an indent shape can be drawn
 * @param {GlobalContext} global
 * @param {LocalContext} local
 * @returns {boolean}
 */
function isAvailable(global, local) {
  const minSize = global.settings.minSideSize.val * 3;
  return (
    local.numOfIter >= global.settings.shapes.indent.minIter.val &&
    local.length >= minSize &&
    local.height >= minSize
  );
}

/**
 * Draws an indent shape with a nested draw call.
 * @param {GlobalContext} global
 * @param {LocalContext} local
 * @returns {void}
 */
function drawIndent(global, local) {
  drawRect(global, local);

  local.numOfIter++;
  local.color = nextColor(global, local);
  local.length -= global.settings.minSideSize.val * 2;
  local.height -= global.settings.minSideSize.val * 2;
  local.specialShapePlaceable = true;

  global.callback(global, local);
}

/**
 * Creates an indent object.
 * @returns {Shape}
 */
function indentObject() {
  return makeShapeObject(
    isAvailable,
    (global) => global.settings.shapes.indent.weight.val,
    drawIndent,
  );
}

export { indentObject };
