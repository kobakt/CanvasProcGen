import { makeShapeObject } from "./shapeObject.js";
import { nextDistanceColor } from "../colors.js";

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function isAvailable(global, local) {
  //TODO this is bad
  return local.length >= global.settings.minSideSize
    && local.height >= global.settings.minSideSize;
}
// if (
//   (!lastSplits.splitLength || heightFactors.length === 0) &&
//   lengthFactors.length > 0
// ) {
//   actions.push({
//     action: splitFunction(lengthFactors, true),
//     weight: weights.split,
//   });
// }
// if (
//   (!lastSplits.splitHeight || lengthFactors.length === 0) &&
//   heightFactors.length > 0
// ) {
//   actions.push({
//     action: splitFunction(heightFactors, false),
//     weight: weights.split,
//   });
// }

const savedFactors = {};
function allFactors(n) {
  if (savedFactors[n]) {
    return savedFactors[n];
  }

  const factors = [];
  // TODO change to sqrt(n)
  for (let i = 2; i <= n / 2; i += 1) {
    if (n % i === 0) {
      factors.push(i);
    }
  }
  
  // savedFactors[n] = [];
  // savedFactors[n].push(...factors);
  savedFactors[n] = factors;
  return factors;
}

/**
 * Returns possible side lengths such that
 * they fall within min and max side lengths
 * @param {number} sideLength
 * @param {GlobalContext} global
 */
function splitFactors(sideLength, global) {
  // savedFactors[sideLength] = allFactors(sideLength);
  // return savedFactors[sideLength].filter(
  return allFactors(sideLength).filter(
    (factor) =>
      (sideLength / factor) % 1 === 0 &&
      sideLength / factor >= global.settings.minSideSize &&
      factor <= global.settings.maxSplitAmount,
  );
}

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 * @param {boolean} byLength
 */
function findFactors(global, local, byLength) {
  if (byLength) {
    return splitFactors(local.length, global);
  }
  return splitFactors(local.height, global);
}

// function splitFunction( byLength) {
//   return (centerX, centerY) => {
//     const numOfSplits = 
//       factors[Math.floor(factors.length * Math.random())];
//     const offsetCenter = byLength ? centerX : centerY;
//     const offsetSideLength = byLength ? drawLength : drawHeight;
//     const offset = offsetSideLength / numOfSplits;
//     const offsetStart = offsetCenter - offsetSideLength / 2 + offset / 2;
//     let iterColor = curColor;
//     for (let i = 0; i < numOfSplits; i += 1) {
//       const newCenter = offsetStart + offset * i;
//       drawAcc(
//         numOfIter + numOfSplits - 1,
//         iterColor,
//         byLength ? newCenter : centerX,
//         byLength ? centerY : newCenter,
//         byLength ? drawLength / numOfSplits : drawLength,
//         byLength ? drawHeight : drawHeight / numOfSplits,
//         { splitLength: byLength, splitHeight: !byLength },
//         false,
//         settings,
//       );
//       iterColor = nextDistanceColor(
//         iterColor,
//         settings.minColorDist,
//         settings.maxColorDist,
//       );
//     }
//   };
// }

/**
 * @param {LocalContext} local
 * @param {boolean} byLength
 * @param {number} numOfSplits
 */
function findOffset(local, byLength, numOfSplits) {
  const offsetCenter = byLength ? local.centerX : local.centerY;
  const offsetSideLength = byLength ? local.length: local.height;
  const offset = offsetSideLength / numOfSplits;
  return {
    offset,
    offsetStart: offsetCenter - offsetSideLength / 2 + offset / 2,
  }
}
/**
 * Returns true for by length
 * and false for by height
 * @param {GlobalContext} global 
 * @param {LocalContext} local 
 * @returns {boolean}
 */
function areWeDoingLenOrHght(global, local) {
  //TODO actually determine this lol
  return true;
}

/**
 * @param {GlobalContext} global 
 * @param {LocalContext} local 
 */
function drawSplit(global, local) {
  const byLength = areWeDoingLenOrHght(global, local);

  const factors = findFactors(global, local, byLength); 
  const randFactor = Math.floor(factors.length * Math.random());
  const numOfSplits = factors[randFactor];

  const offsetObj = findOffset(local, byLength, numOfSplits);

  //TODO maybe consider not starting with this?
  let iterColor = local.color;
  for (let i = 0; i < numOfSplits; i++) {
    const newCenter = offsetObj.offsetStart + offsetObj.offset * i;
    const newLocal = structuredClone(local);
    newLocal.specialShapePlaceable = false;
    newLocal.split = {
      lastSplitByLength: byLength,
      lastSplitByHeight: !byLength,
    }
    newLocal.centerX = byLength ? newCenter : local.centerX;
    newLocal.centerY = byLength ? local.centerY : newCenter;
    newLocal.length = byLength ? 
      local.length / numOfSplits : local.length;
    newLocal.height = byLength ? 
      local.height : local.height / numOfSplits;
    newLocal.color = iterColor;

    global.callback(global, newLocal);

    iterColor = nextDistanceColor(
      iterColor,
      global.settings.minColorDist,
      global.settings.maxColorDist,
    );
  }
}

/**
@returns {import("./shapeObject").Shape}
*/
function splitObject() {
  return makeShapeObject(
    isAvailable,
    // () => true, //TODO
    (global) => global.settings.rectWeights.split,
    drawSplit,
  );
}

export { splitObject };
