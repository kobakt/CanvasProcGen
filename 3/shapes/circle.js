import { hex, nextColor } from "../colors.js";
import {
  drawRect,
  drawSpecial,
  floorEvenOrOdd,
  isSquare,
  makeShapeObject,
} from "./shapeObject.js";

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function isAvailable(global, local) {
  const specialOffset = local.specialShapePlaceable
    ? 0
    : 2 * global.settings.minSideSize;
  return (
    isSquare(local) &&
    local.numOfIter >= global.settings.minIterations.minCircleIter &&
    local.length >= global.settings.minSideSize * 3 + specialOffset
  );
}

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function drawCircleHelp(global, local) {
  global.ctx.beginPath();
  global.ctx.fillStyle = hex(nextColor(global, local));
  const radius = local.length / 2;
  global.ctx.arc(
    local.centerX,
    local.centerY,
    radius,
    0,
    2 * Math.PI,
  );
  global.ctx.fill();
  const newLength = floorEvenOrOdd(
    Math.floor((radius - global.settings.minSideSize) * Math.SQRT2),
    local.length,
  );
  if (
    newLength >= global.settings.minSideSize &&
    Math.random() < global.settings.specialNestingProbability.circle
  ) {
    const newLocal = structuredClone(local);
    newLocal.color = nextColor(global, local);
    newLocal.numOfIter++;
    newLocal.length = newLength;
    newLocal.height = newLength;
    newLocal.specialShapePlaceable = true;
    global.callback(global, newLocal);
  }
}

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function drawCircle(global, local) {
  drawSpecial(drawCircleHelp)(global, local);
}

function circleObject() {
  return makeShapeObject(
    isAvailable,
    (global) => global.settings.squareWeights.circle,
    drawCircle,
  );
}

export { circleObject };
