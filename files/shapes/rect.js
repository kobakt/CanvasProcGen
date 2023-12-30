import { drawRect, makeShapeObject } from "./shapeObject.js";

/**
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

function rectObject() {
  // also separate square weight to possibly look at
  return makeShapeObject(
    isAvailable,
    (global) => global.settings.shapes.rect.weight.val,
    drawRect,
  );
}

export { rectObject };
