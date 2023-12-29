import { nextColor } from "../colors.js";
import { drawRect, makeShapeObject } from "./shapeObject.js";

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function isAvailable(global, local) {
  const minSize = global.settings2.minSideSize.val * 3;
  return (
    local.numOfIter >= global.settings2.shapes.indent.minIter.val &&
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
  newContext.length -= global.settings2.minSideSize.val * 2;
  newContext.height -= global.settings2.minSideSize.val * 2;
  newContext.specialShapePlaceable = true;

  global.callback(global, newContext);
}

function indentObject() {
  return makeShapeObject(
    isAvailable,
    (global) => global.settings2.shapes.indent.weight.val,
    drawIndent,
  );
}

export { indentObject };
