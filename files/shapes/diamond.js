import { hex, nextColor } from "../colors.js";
import {
  drawSpecial,
  floorEvenOrOdd,
  isAvailableSpecial,
  makeShapeObject,
} from "./shapeObject.js";

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function isAvailable(global, local) {
  return isAvailableSpecial(
    global.settings.minIterations.minDiamondIter,
    3,
  )(global, local);
}

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function drawDiamondHelp(global, local) {
  const offset = local.length / 2;
  global.ctx.beginPath();
  global.ctx.fillStyle = hex(local.color);
  global.ctx.moveTo(local.centerX - offset, local.centerY);
  global.ctx.lineTo(local.centerX, local.centerY - offset);
  global.ctx.lineTo(local.centerX + offset, local.centerY);
  global.ctx.lineTo(local.centerX, local.centerY + offset);
  global.ctx.fill();

  const newLength = floorEvenOrOdd(
    Math.floor(
      local.length / 2 - Math.SQRT2 * global.settings.minSideSize,
    ),
    local.length,
  );

  if (
    newLength >= global.settings.minSideSize &&
    Math.random() < global.settings.specialNestingProbability.diamond
  ) {
    const newLocal = structuredClone(local);
    newLocal.numOfIter++;
    newLocal.color = nextColor(global, local);
    newLocal.length = newLength;
    newLocal.height = newLength;
    newLocal.specialShapePlaceable = true;

    global.callback(global, newLocal);
  }
}

function diamondObject() {
  return makeShapeObject(
    isAvailable,
    (global) => global.settings.squareWeights.diamond,
    drawSpecial(drawDiamondHelp),
  );
}

export { diamondObject };
