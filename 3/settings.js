"use strict"
// alert("settings.js");

function defaultSettings() {
  return {
    length: 1200,
    height: 600,
    minColorDist: 255 * 1,
    maxColorDist: 255 * 3,
    minSideSize: 5,
    // startColor: null,
    drawRatios: {
      minLengthRatio: 0,
      maxLengthRatio: 0.15,
      minHeightRatio: 0,
      maxHeightRatio: 0.15,
    },
    maxSplitAmount: 5,
    minIterations: {
      minIndentIter: 4,
      minOppositesSquareIter: 5,
      minBlendSquareIter: 5,
      minDistanceSquareIter: 5,
      minCircleIter: 5,
      minDiamondIter: 5,
      minCrossIter: 5,
    },
    rectWeights: {
      drawRect: 1,
      indentRect: 1,
      split: 1,
    },
    squareWeights: {
      drawRect: 1,
      indentRect: 1,
      split: 1,
      oppositesSquare: 1,
      blendSquare: 1,
      distanceSquare: 1,
      circle: 1,
      diamond: 1,
      cross: 1,
    },
    specialNestingProbability: {
      circle: 0.5,
      diamond: 0.5,
      cross: 0.5,
    },
  };
}

export { defaultSettings };
