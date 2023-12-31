import { drawStack } from "../draw.js";
import { drawIndent, makeShapeObject } from "./shapeObject.js";
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
 * Creates an indent object.
 * @returns {Shape}
 */
function indentObject() {
  return makeShapeObject(
    isAvailable,
    (global) => global.settings.shapes.indent.weight.val,
    (global, local) => drawIndent(global.callback)(global, local),
  );
}

export { indentObject };
