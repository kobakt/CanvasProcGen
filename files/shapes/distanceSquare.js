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
    local.numOfIter >= global.settings2.shapes.distance.minIter.val &&
    local.length > global.settings2.minSideSize.val * 3
  );
}

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function drawDistance(global, local) {
  while (local.length >= global.settings2.minSideSize.val) {
    global.ctx.fillStyle = hex(local.color);
    global.ctx.fillRect(
      Math.round(local.centerX - local.length / 2),
      Math.round(local.centerY - local.length / 2),
      local.length,
      local.length,
    );
    local.color = nextColor(global, local);
    local.length -= global.settings2.minSideSize.val * 2;
  }
}

function distanceObject() {
  return makeShapeObject(
    isAvailable,
    (global) => global.settings2.shapes.distance.weight.val,
    drawDistance,
  );
}

export { distanceObject };
