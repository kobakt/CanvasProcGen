"use strict";

const savedFactors = {};
/**
 * @param {number} n
 * @returns {number[]}
 */
export function allFactors(n) {
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

//TODO also make memoized maybe
/**
 * Returns possible side lengths such that
 * they fall within min and max side lengths
 * @param {number} sideLength
 * @param {GlobalContext} global
 */
export function splitFactors(sideLength, global) {
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

export { findFactors };
