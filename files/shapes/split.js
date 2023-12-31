"use strict";

import { makeShapeObject } from "./shapeObject.js";
import { nextColor } from "../colors.js";
import { findFactors, splitFactors } from "./splitFactors.js";

/**
 * @param {GlobalContext} global
 * @param {boolean} lastBool
 * @param {number} curVal
 * @param {number} otherVal
 */
function isAvailableHelp(global, lastBool, curVal, otherVal) {
  return (
    (!global.settings.splitRestrict.val ||
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
  return (
    isAvailableLength(global, local) &&
    (!isAvailableHeight(global, local) || Math.random() >= 0.5)
  );
}

/**
 * @param {LocalContext} local
 * @param {boolean} byLength
 * @param {number} newCenter
 * @param {number} numOfSplits
 * @param {import("../colors.js").Color} iterColor
 */
function newSplitLocal(local, byLength, newCenter, numOfSplits) {
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
  return newLocal;
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

  for (let i = 0; i < numOfSplits; i++) {
    const newCenter = offsetObj.offsetStart + offsetObj.offset * i;
    const newLocal = newSplitLocal(
      local,
      byLength,
      newCenter,
      numOfSplits,
    );

    global.callback(global, newLocal);
  }
}

function splitObject() {
  return makeShapeObject(
    isAvailable,
    (global) => global.settings.shapes.split.weight.val,
    drawSplit,
  );
}

export { splitObject };
