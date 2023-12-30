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
    global.settings.shapes.cross.minIter.val,
    4, //TODO test 3 here, and if 3 is okay, then just get rid of this parameter
  )(global, local);
}

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function drawCrossHelp(global, local) {
  const halfLength = local.length / 2;
  const offset = local.length / 6;
  const left = local.centerX - halfLength;
  const right = local.centerX + halfLength;
  const top = local.centerY - halfLength;
  const bot = local.centerY + halfLength;

  global.ctx.fillStyle = hex(local.color);
  global.ctx.beginPath();
  global.ctx.moveTo(left, top);
  global.ctx.lineTo(local.centerX - offset, top);
  global.ctx.lineTo(local.centerX, top + offset);
  global.ctx.lineTo(local.centerX + offset, top);
  // Top-Right Corner
  global.ctx.lineTo(right, top);
  // right
  global.ctx.lineTo(right, local.centerY - offset);
  global.ctx.lineTo(right - offset, local.centerY);
  global.ctx.lineTo(right, local.centerY + offset);
  // Bottom-Right Corner
  global.ctx.lineTo(right, bot);
  // lower
  global.ctx.lineTo(local.centerX + offset, bot);
  global.ctx.lineTo(local.centerX, bot - offset);
  global.ctx.lineTo(local.centerX - offset, bot);
  // Bottom-Left Corner
  global.ctx.lineTo(left, bot);
  // left
  global.ctx.lineTo(left, local.centerY + offset);
  global.ctx.lineTo(left + offset, local.centerY);
  global.ctx.lineTo(left, local.centerY - offset);
  global.ctx.fill();

  const newLength = floorEvenOrOdd(
    Math.floor(
      local.length - 2 * offset - 2 * global.settings.minSideSize.val,
    ),
    local.length,
  );
  if (
    newLength >= global.settings.minSideSize.val &&
    Math.random() < global.settings.shapes.cross.nestingProb.val
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

function crossObject() {
  return makeShapeObject(
    isAvailable,
    (global) => global.settings.shapes.cross.weight.val,
    drawSpecial(
      drawCrossHelp,
      (global) => global.settings.shapes.cross.nestingIndentProb.val,
    ),
  );
}

export { crossObject };
