import { hex, nextColor } from "../colors.js";
import { floorEvenOrOdd, makeSpecial } from "./special.js";

/**
 * Just draws diamond and returns length for nesting.
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

  return floorEvenOrOdd(
    Math.floor(
      local.length / 2 - Math.SQRT2 * global.settings.minSideSize.val,
    ),
    local.length,
  );
}

function diamondObject() {
  return makeSpecial(
    (global) => global.settings.shapes.diamond,
    drawDiamondHelp,
  );
}

export { diamondObject };
