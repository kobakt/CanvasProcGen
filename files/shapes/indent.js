import { nextColor } from "../colors.js";
import { drawRect, makeShapeObject } from "./shapeObject.js";

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function isAvailable(global, local) {
  const minSize = global.settings.minSideSize.val * 3;
  return (
    local.numOfIter >= global.settings.shapes.indent.minIter.val &&
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

  const newContext = structuredClone(local);
  newContext.numOfIter++;
  newContext.color = nextColor(global, local);
  newContext.length -= global.settings.minSideSize.val * 2;
  newContext.height -= global.settings.minSideSize.val * 2;
  newContext.specialShapePlaceable = true;

  global.callback(global, newContext);
}

function indentObject() {
  return makeShapeObject(
    isAvailable,
    (global) => global.settings.shapes.indent.weight.val,
    drawIndent,
  );
}

export { indentObject };
