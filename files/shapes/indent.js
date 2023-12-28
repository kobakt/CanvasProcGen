import { nextColor } from "../colors.js";
import { drawRect, makeShapeObject } from "./shapeObject.js";

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function isAvailable(global, local) {
  const minSize = global.settings.minSideSize * 3;
  return (
    local.numOfIter >= global.settings.minIterations.minIndentIter &&
    local.length >= minSize &&
    local.height >= minSize
  );
}

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function drawIndent(global, local) {
  drawRect(global, local);
  // global.ctx.fillStyle = hex(local.color);
  // global.ctx.fillRect(
  //   local.centerX - local.length / 2,
  //   local.centerY - local.height / 2,
  //   local.length,
  //   local.height,
  // );

  const newContext = structuredClone(local);
  newContext.numOfIter++;
  newContext.color = nextColor(global, local);
  newContext.length -= global.settings.minSideSize * 2;
  newContext.height -= global.settings.minSideSize * 2;
  newContext.specialShapePlaceable = true;

  global.callback(global, newContext);
}

function indentObject() {
  return makeShapeObject(
    isAvailable,
    (global) => global.settings.rectWeights.indentRect,
    drawIndent,
  );
}

export { indentObject };
