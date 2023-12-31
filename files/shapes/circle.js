import { hex, nextColor } from "../colors.js";
import { floorEvenOrOdd } from "./shapeObject.js";
import { makeSpecial } from "./special.js";

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
  const newLength = floorEvenOrOdd(
    Math.floor(
      (radius - global.settings.minSideSize.val) * Math.SQRT2,
    ),
    local.length,
  );
  if (
    newLength >= global.settings.minSideSize.val &&
    Math.random() < global.settings.shapes.circle.nestingProb.val
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

function circleObject() {
  return makeSpecial(
    (global) => global.settings.shapes.circle.minIter.val,
    (global) => global.settings.shapes.circle.weight.val,
    drawCircleHelp,
    (global) => global.settings.shapes.circle.nestingIndentProb.val,
  );
}

export { circleObject };
