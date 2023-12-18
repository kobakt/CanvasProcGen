import { makeShapeObject } from "./shapeObject.js";
import { defaultSettings } from "../settings.js";
import { hex } from "../colors.js";

function isAvailable(context) {
  let settings = context.settings;
  let { drawLength, drawHeight } = context.draw;
  return (
    drawLength >= settings.drawRatios.minLengthRatio * settings.length &&
    drawLength <= settings.drawRatios.maxLengthRatio * settings.length &&
    drawHeight >= settings.drawRatios.minHeightRatio * settings.height &&
    drawHeight <= settings.drawRatios.maxHeightRatio * settings.height
  );
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
    // isAvailable,
    () => true, //TODO
    (global) => global.settings.rectWeights.drawRect,
    drawRect,
  );
}

export { rectObject };
