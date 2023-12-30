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
    global.settings2.shapes.diamond.minIter.val,
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
      local.length / 2 -
        Math.SQRT2 * global.settings2.minSideSize.val,
    ),
    local.length,
  );

  if (
    newLength >= global.settings2.minSideSize.val &&
    Math.random() < global.settings2.shapes.diamond.nestingProb.val
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
    (global) => global.settings2.shapes.diamond.weight.val,
    drawSpecial(
      drawDiamondHelp,
      (global) =>
        global.settings2.shapes.diamond.nestingIndentProb.val,
    ),
  );
}

export { diamondObject };
