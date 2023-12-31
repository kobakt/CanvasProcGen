import { hex, nextColor } from "../colors.js";
import { floorEvenOrOdd, makeSpecial } from "./special.js";

/**
 * Just draws Cross and returns length for nesting.
 * @param {GlobalContext} global
 * @param {LocalContext} local
 * @returns {number}
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

  return floorEvenOrOdd(
    Math.floor(
      local.length - 2 * offset - 2 * global.settings.minSideSize.val,
    ),
    local.length,
  );
}

function crossObject() {
  return makeSpecial(
    (global) => global.settings.shapes.cross,
    drawCrossHelp,
  );
}

export { crossObject };
