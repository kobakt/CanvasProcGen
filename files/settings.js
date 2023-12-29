"use strict";

const FormType = {
  Slider: "range",
  Number: "number",
  CheckBox: "checkbox",
  Color: "color",
};
Object.freeze(FormType);

/**
 * @template T
 * @typedef {Object} Setting
 * @prop {T} val
 * @prop {string} desc
 * @prop {string} formType
 * @prop {number} [min]
 * @prop {number} [max]
 */

/**
 * @template T
 * @param {T} val
 * @param {string} desc
 * @param {string} formType
 * @param {number} [min]
 * @param {number} [max]
 * @returns {Setting<T> | undefined}
 */
function makeSetting(val, desc, formType, min, max) {
  if (val === undefined) {
    return undefined;
  }
  return {
    val,
    desc,
    formType,
    min,
    max,
  };
}

/**
@typedef {Object} ShapeObjectSettings
@prop {Setting<number>} weight
@prop {Setting<number>} minIter
@prop {Setting<number>} [maxIter]
@prop {Setting<number>} [nestingProb]
@prop {Setting<number>} [nestingIndentProb]
*/

/**
@param {number} minIter
@param {number} [maxIter]
@param {number} [nestingProb]
@param {number} [nestingIndentProb]
@returns {ShapeObjectSettings}
*/
function makeShapeObjectSettings(
  minIter,
  maxIter,
  nestingProb,
  nestingIndentProb,
) {
  return {
    weight: makeSetting(
      1,
      "How likely this shape will show up if available.",
      FormType.Slider,
      0,
      Infinity,
    ),
    minIter: makeSetting(
      minIter,
      "How many splits/nestings need to happen before this shape can appear.",
      FormType.Slider,
      0,
      Infinity,
    ),
    maxIter: makeSetting(
      maxIter,
      "How many splits/nestings need to happen before this shape can no longer appear.",
      FormType.Slider,
      0,
      Infinity,
    ),
    nestingProb: makeSetting(
      nestingProb,
      "The probability that another shape will be nested inside this shape.",
      FormType.Slider,
      0,
      1,
    ),
    nestingIndentProb: makeSetting(
      nestingIndentProb,
      "The probability that this shape will be indented.",
      FormType.Slider,
      0,
      1,
    ),
  };
}

/**
@typedef {object} ColorSettings
@prop {Setting<Color?>} startColor
@prop {Setting<number>} minDist
@prop {Setting<number>} maxDist
*/

/**
@typedef {object} ShapesSettings
@prop {ShapeObjectSettings} rect
@prop {ShapeObjectSettings} split
@prop {ShapeObjectSettings} indent
@prop {ShapeObjectSettings} blend
@prop {ShapeObjectSettings} distance
@prop {ShapeObjectSettings} opposites
@prop {ShapeObjectSettings} circle
@prop {ShapeObjectSettings} diamond
@prop {ShapeObjectSettings} cross
*/

/**
@typedef {object} DrawRatios
@prop {Setting<number>} lengthMin
@prop {Setting<number>} lengthMax
@prop {Setting<number>} heightMin
@prop {Setting<number>} heightMax
*/

/**
@typedef {object} Settings2
@prop {Setting<number>} width
@prop {Setting<number>} height
@prop {Setting<number>} minSideSize
@prop {Setting<boolean>} splitRestrict
@prop {DrawRatios} ratios
@prop {ColorSettings} color
@prop {ShapesSettings} shapes
*/

/**
@returns {Settings2}
*/
function defaultSettings2() {
  return {
    width: makeSetting(
      1200,
      "Width of the canvas.",
      FormType.Slider,
      0,
      Infinity,
    ),
    height: makeSetting(
      600,
      "Height of the canvas.",
      FormType.Slider,
      0,
      Infinity,
    ),
    minSideSize: makeSetting(
      4,
      "The smallest a shape can be.",
      FormType.Slider,
      0,
      Infinity,
    ),
    splitRestrict: makeSetting(
      true,
      "Are splits restricted from repeatedly splitting the same direction. " +
        "Makes canvas look uniform lengthwise and heightwise.",
      FormType.CheckBox,
    ),
    ratios: {
      lengthMin: makeSetting(0, "", FormType.Slider, 0, 1),
      lengthMax: makeSetting(0.15, "", FormType.Slider, 0, 1),
      heightMin: makeSetting(0, "", FormType.Slider, 0, 1),
      heightMax: makeSetting(0.15, "", FormType.Slider, 0, 1),
    },
    color: {
      startColor: makeSetting(null, "", FormType.Color, 0, 255 * 3), //TODO lol
      minDist: makeSetting(
        255,
        "The minimum amount of change when picking a new color.",
        FormType.Slider,
        0,
        255 * 3,
      ),
      maxDist: makeSetting(
        255 * 3,
        "The maximum amount of change when picking a new color.",
        FormType.Slider,
        0,
        255 * 3,
      ),
    },
    shapes: {
      rect: makeShapeObjectSettings(0),
      split: makeShapeObjectSettings(0, 5),
      indent: makeShapeObjectSettings(4),
      blend: makeShapeObjectSettings(4),
      distance: makeShapeObjectSettings(4),
      opposites: makeShapeObjectSettings(4),
      circle: makeShapeObjectSettings(4, undefined, 0.5, 0.5),
      diamond: makeShapeObjectSettings(4, undefined, 0.5, 0.5),
      cross: makeShapeObjectSettings(4, undefined, 0.5, 0.5),
    },
  };
}

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
      minOppositesSquareIter: 4,
      minBlendSquareIter: 4,
      minDistanceSquareIter: 4,
      minCircleIter: 4,
      minDiamondIter: 4,
      minCrossIter: 4,
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

export { FormType, defaultSettings2, defaultSettings };
