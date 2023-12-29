import { drawRect, makeShapeObject } from "./shapeObject.js";

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function isAvailable(global, local) {
  let drawRatios = global.settings2.ratios;
  return (
    local.length >=
      drawRatios.lengthMin.val * global.settings2.width.val &&
    local.length <=
      drawRatios.lengthMax.val * global.settings2.width.val &&
    local.height >=
      drawRatios.heightMin.val * global.settings2.height.val &&
    local.height <=
      drawRatios.heightMax.val * global.settings2.height.val
  );
}

function rectObject() {
  // also separate square weight to possibly look at
  return makeShapeObject(
    isAvailable,
    (global) => global.settings2.shapes.rect.weight,
    drawRect,
  );
}

export { rectObject };
