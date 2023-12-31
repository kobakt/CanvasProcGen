import { drawRect, makeShapeObject } from "./shapeObject.js";
/** @typedef {import("shapes/shapeObject.js").Shape} Shape

/**
 * Determines if a rect can be drawn based on the ratio
 * of the local length and height vs the global length and height.
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function isAvailable(global, local) {
  let drawRatios = global.settings.ratios;
  return (
    local.length >=
      drawRatios.lengthMin.val * global.settings.width.val &&
    local.length <=
      drawRatios.lengthMax.val * global.settings.width.val &&
    local.height >=
      drawRatios.heightMin.val * global.settings.height.val &&
    local.height <=
      drawRatios.heightMax.val * global.settings.height.val
  );
}

/**
 * Creates a simple object that draws a rectangle.
 * @returns {Shape}
 */
function rectObject() {
  return makeShapeObject(
    isAvailable,
    (global) => global.settings.shapes.rect.weight.val,
    drawRect,
  );
}

export { rectObject };
