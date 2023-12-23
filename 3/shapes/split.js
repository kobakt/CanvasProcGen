"use strict";

import { makeShapeObject } from "./shapeObject.js";
import { nextColor } from "../colors.js";

/**
 * @param {GlobalContext} global
 * @param {boolean} lastBool
 * @param {number} curVal
 * @param {number} otherVal
 */
function isAvailableHelp(global, lastBool, curVal, otherVal) {
  return (
    (!global.settings.splitRestrict ||
      !lastBool ||
      splitFactors(otherVal, global).length === 0) &&
    splitFactors(curVal, global).length > 0
  );
}

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function isAvailableLength(global, local) {
  return isAvailableHelp(
    global,
    local.split.lastSplitByLength,
    local.length,
    local.height,
  );
}

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function isAvailableHeight(global, local) {
  return isAvailableHelp(
    global,
    local.split.lastSplitByHeight,
    local.height,
    local.length,
  );
}

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function isAvailable(global, local) {
  return (
    isAvailableLength(global, local) ||
    isAvailableHeight(global, local)
  );
}

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
      // (sideLength / factor) % 1 === 0 && // Shouldn't need
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

/**
 * @param {LocalContext} local
 * @param {boolean} byLength
 * @param {number} numOfSplits
 */
function findOffset(local, byLength, numOfSplits) {
  const offsetCenter = byLength ? local.centerX : local.centerY;
  const offsetSideLength = byLength ? local.length : local.height;
  const offset = offsetSideLength / numOfSplits;
  return {
    offset,
    offsetStart: offsetCenter - offsetSideLength / 2 + offset / 2,
  };
}

/**
 * Returns true for by length
 * and false for by height
 * @param {GlobalContext} global
 * @param {LocalContext} local
 * @returns {boolean}
 */
function areWeDoingLenOrHght(global, local) {
  if (!isAvailableLength(global, local)) {
    return false;
  }
  if (!isAvailableHeight(global, local)) {
    return true;
  }
  return Math.random() >= 0.5;
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
    iterColor = nextColor(global, local);
    const newCenter = offsetObj.offsetStart + offsetObj.offset * i;
    const newLocal = structuredClone(local);
    newLocal.specialShapePlaceable = false;
    newLocal.split = {
      lastSplitByLength: byLength,
      lastSplitByHeight: !byLength,
    };
    newLocal.centerX = byLength ? newCenter : local.centerX;
    newLocal.centerY = byLength ? local.centerY : newCenter;
    newLocal.length = byLength
      ? local.length / numOfSplits
      : local.length;
    newLocal.height = byLength
      ? local.height
      : local.height / numOfSplits;
    newLocal.color = iterColor;
    newLocal.numOfIter++;

    global.callback(global, newLocal);
  }
}

/**
@returns {import("./shapeObject").Shape}
*/
function splitObject() {
  return makeShapeObject(
    isAvailable,
    (global) => global.settings.rectWeights.split,
    drawSplit,
  );
}

export { splitObject };
