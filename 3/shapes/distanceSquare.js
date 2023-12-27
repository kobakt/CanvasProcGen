import { hex, nextColor } from "../colors.js";
import {
  drawSpecial,
  isSquare,
  makeShapeObject,
} from "./shapeObject.js";

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function isAvailable(global, local) {
  return (
    isSquare(local) &&
    local.numOfIter >=
      global.settings.minIterations.minDistanceSquareIter &&
    local.length > global.settings.minSideSize * 3
  );
}

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function drawDistance(global, local) {
  while (local.length >= global.settings.minSideSize) {
    global.ctx.fillStyle = hex(local.color);
    global.ctx.fillRect(
      Math.round(local.centerX - local.length / 2),
      Math.round(local.centerY - local.length / 2),
      local.length,
      local.length,
    );
    local.color = nextColor(global, local);
    local.length -= global.settings.minSideSize * 2;
  }
}

function distanceObject() {
  return makeShapeObject(
    isAvailable,
    (global) => global.settings.squareWeights.distanceSquare,
    drawDistance,
  );
}

export { distanceObject };
