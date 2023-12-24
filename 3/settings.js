"use strict";

/**
@typedef {Object} Settings
@prop {number} width
@prop {number} height
@prop {number} minColorDist 
@prop {number} maxColorDist
@prop {number} minSideSize
@prop {Object} drawRatios
@prop {number} drawRatios.minLengthRatio
@prop {number} drawRatios.maxLengthRatio
@prop {number} drawRatios.minHeightRatio
@prop {number} drawRatios.maxHeightRatio
@prop {number} maxSplitAmount
@prop {Object} minIterations
@prop {number} minIterations.minIndentIter
@prop {number} minIterations.minOppositesSquareIter
@prop {number} minIterations.minBlendSquareIter
@prop {number} minIterations.minDistanceSquareIter
@prop {number} minIterations.minCircleIter
@prop {number} minIterations.minDiamondIter
@prop {number} minIterations.minCrossIter
@prop {Object} rectWeights
@prop {number} rectWeights.drawRect
@prop {number} rectWeights.indentRect
@prop {number} rectWeights.split
@prop {Object} squareWeights
@prop {number} squareWeights.drawRect
@prop {number} squareWeights.indentRect
@prop {number} squareWeights.split
@prop {number} squareWeights.oppositesSquare
@prop {number} squareWeights.blendSquare
@prop {number} squareWeights.distanceSquare
@prop {number} squareWeights.circle
@prop {number} squareWeights.diamond
@prop {number} squareWeights.cross
@prop {Object} specialNestingProbability
@prop {number} specialNestingProbability.circle
@prop {number} specialNestingProbability.diamond
@prop {number} specialNestingProbability.cross
@prop {Color?} startColor
@prop {boolean} splitRestrict
@prop {number} specialIndentProbability
*/

/**
@returns {Settings}
*/
function defaultSettings() {
  return {
    width: 1200,
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
      minBlendSquareIter: 4,
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
    startColor: null,
    splitRestrict: true,
    specialIndentProbability: 0.5,
  };
}

export { defaultSettings };
