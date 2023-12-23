"use strict";

/**
@typedef {Object} Shape
@prop {ContextFunction} isAvailable
@prop {ContextFunction} weight
@prop {ContextFunction} drawShape
*/

/**
@param {ContextFunction} isAvailable 
@param {ContextFunction} weight
@param {ContextFunction} drawShape
@returns {Shape}
*/
function makeShapeObject(isAvailable, weight, drawShape) {
  return {
    isAvailable,
    weight,
    drawShape,
  };
}

/**
 * @param {LocalContext} local
 */
function isSquare(local) {
  return local.length === local.height;
}

// function floorEvenOrOdd(n, m) {
//   if ((n + m) % 2 === 0) {
//     return n;
//   }
//   return n - 1;
// }

// function indentSpecialFunction(specialFunc) {
//   return (centerX, centerY) => {
//     drawRect(centerX, centerY);
//     drawLength -= 2 * settings.minSideSize;
//     drawHeight -= 2 * settings.minSideSize;
//     curColor = nextColor;
//     nextColor = nextDistanceColor(curColor, settings.minColorDist, settings.maxColorDist);
//     specialFunc(centerX, centerY);
//   };
// }

export { makeShapeObject, isSquare };
