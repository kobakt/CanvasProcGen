import { hex, nextColor } from "../colors.js";
import { floorEvenOrOdd } from "./shapeObject.js";
import { makeSpecial } from "./special.js";

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
  return makeSpecial(
    (global) => global.settings.shapes.diamond.minIter.val,
    (global) => global.settings.shapes.diamond.weight.val,
    drawDiamondHelp,
    (global) => global.settings.shapes.diamond.nestingIndentProb.val,
  );
}

export { diamondObject };
