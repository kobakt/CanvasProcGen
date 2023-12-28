import { hex, nextColor, getBlendColors } from "../colors.js";
import { isSquare, makeShapeObject } from "./shapeObject.js";

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function drawBlend(global, local) {
  const numOfBands = Math.round(
    local.length / (global.settings.minSideSize * 2),
  );
  const color2 = nextColor(global, local);
  const colors = getBlendColors(numOfBands, local.color, color2);
  colors.forEach((color, i) => {
    global.ctx.fillStyle = hex(color);
    const curLength =
      local.length -
      i * 2 * Math.round(local.length / (2 * numOfBands));
    global.ctx.fillRect(
      Math.floor(local.centerX - curLength / 2),
      Math.floor(local.centerY - curLength / 2),
      Math.ceil(curLength),
      Math.round(curLength),
    );
  });
}

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function isAvailable(global, local) {
  return (
    isSquare(local) &&
    local.numOfIter >=
      global.settings.minIterations.minBlendSquareIter &&
    local.length >= global.settings.minSideSize * 3
  );
}

function blendObject() {
  return makeShapeObject(
    isAvailable,
    (global) => global.settings.squareWeights.blendSquare,
    drawBlend,
  );
}
export { blendObject };
