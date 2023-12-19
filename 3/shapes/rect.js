import { makeShapeObject } from "./shapeObject.js";
import { hex } from "../colors.js";

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function isAvailable(global, local) {
  let drawRatios = global.settings.drawRatios;
  return local.length >= drawRatios.minLengthRatio * global.settings.width
    && local.length <= drawRatios.maxLengthRatio * global.settings.width &&
    local.height >= drawRatios.minHeightRatio * global.settings.height &&
    local.height <= drawRatios.maxHeightRatio * global.settings.height;
}

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function drawRect(global, local) {
  global.ctx.fillStyle = hex(local.color);
  global.ctx.fillRect(
    local.centerX - local.length / 2,
    local.centerY - local.height / 2,
    local.length,
    local.height,
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
