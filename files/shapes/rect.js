import { drawRect, makeShapeObject } from "./shapeObject.js";

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function isAvailable(global, local) {
  let drawRatios = global.settings.drawRatios;
  return (
    local.length >=
      drawRatios.minLengthRatio * global.settings.width &&
    local.length <=
      drawRatios.maxLengthRatio * global.settings.width &&
    local.height >=
      drawRatios.minHeightRatio * global.settings.height &&
    local.height <= drawRatios.maxHeightRatio * global.settings.height
  );
}

function rectObject() {
  // also separate square weight to possibly look at
  return makeShapeObject(
    isAvailable,
    (global) => global.settings.rectWeights.drawRect,
    drawRect,
  );
}

export { rectObject };
