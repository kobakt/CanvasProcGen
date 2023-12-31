import { hex, nextColor } from "../colors.js";
import { floorEvenOrOdd, makeSpecial } from "./special.js";

/**
 * Just draws the circle and nested objects
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
  return floorEvenOrOdd(
    Math.floor(
      (radius - global.settings.minSideSize.val) * Math.SQRT2,
    ),
    local.length,
  );
}

function circleObject() {
  return makeSpecial(
    (global) => global.settings.shapes.circle,
    drawCircleHelp,
  );
}

export { circleObject };
