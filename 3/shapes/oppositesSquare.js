import { hex, nextColor } from "../colors.js";
import { isSquare, makeShapeObject } from "./shapeObject.js";

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function isAvailable(global, local) {
  return (
    isSquare(local) &&
    local.numOfIter >=
      global.settings.minIterations.minOppositesSquareIter &&
    local.length >= global.settings.minSideSize * 3
  );
}

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function drawOpposites(global, local) {
  let otherColor = nextColor(global, local);
  while (local.length >= global.settings.minSideSize) {
    global.ctx.fillStyle = hex(local.color);
    global.ctx.fillRect(
      Math.floor(local.centerX - local.length / 2),
      Math.floor(local.centerY - local.length / 2),
      local.length,
      local.length,
    );
    [local.color, otherColor] = [otherColor, local.color];
    local.length -= global.settings.minSideSize * 2;
  }
}

function oppositesObject() {
  return makeShapeObject(
    isAvailable,
    (global) => global.settings.squareWeights.oppositesSquare,
    drawOpposites,
  );
}

export { oppositesObject };
