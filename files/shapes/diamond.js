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
    global.settings.shapes.diamond.minIter.val,
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
      local.length / 2 - Math.SQRT2 * global.settings.minSideSize.val,
    ),
    local.length,
  );

  if (
    newLength >= global.settings.minSideSize.val &&
    Math.random() < global.settings.shapes.diamond.nestingProb.val
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
    (global) => global.settings.shapes.diamond.weight.val,
    drawSpecial(
      drawDiamondHelp,
      (global) =>
        global.settings.shapes.diamond.nestingIndentProb.val,
    ),
  );
}

export { diamondObject };
