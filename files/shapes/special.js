import {
  drawSpecial,
  isAvailableSpecial,
  makeShapeObject,
} from "./shapeObject.js";

/**
 * @param {ContextFunction} minIterValFunc
 * @param {ContextFunction} weightFunc
 * @param {ContextFunction} drawHelp
 * @param {ContextFunction} nestingIndentFunc
 */
function makeSpecial(
  minIterValFunc,
  weightFunc,
  drawHelp,
  nestingIndentFunc,
) {
  return makeShapeObject(
    (global, local) =>
      isAvailableSpecial(minIterValFunc(global, local))(
        global,
        local,
      ),
    weightFunc,
    drawSpecial(drawHelp, nestingIndentFunc),
  );
}

export { makeSpecial };
