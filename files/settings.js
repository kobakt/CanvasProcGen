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
      FormType.Number,
      0,
      Infinity,
    ),
    minIter: makeSetting(
      minIter,
      "How many splits/nestings need to happen before this shape can appear.",
      FormType.Number,
      0,
      Infinity,
    ),
    maxIter: makeSetting(
      maxIter,
      "How many splits/nestings need to happen before this shape can no longer appear.",
      FormType.Number,
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
@prop {Setting<boolean>} randomColor
@prop {Setting<string>} startColor
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
@typedef {object} Settings
@prop {Setting<number>} width
@prop {Setting<number>} height
@prop {Setting<number>} minSideSize
@prop {Setting<boolean>} splitRestrict
@prop {DrawRatios} ratios
@prop {ColorSettings} color
@prop {ShapesSettings} shapes
*/

/**
@returns {Settings}
*/
function defaultSettings() {
  return {
    width: makeSetting(
      1200,
      "Width of the canvas.",
      FormType.Number,
      0,
      Infinity,
    ),
    height: makeSetting(
      600,
      "Height of the canvas.",
      FormType.Number,
      0,
      Infinity,
    ),
    minSideSize: makeSetting(
      4,
      "The smallest a shape can be.",
      FormType.Number,
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
      randomColor: makeSetting(
        true,
        "Use a random starting color. Otherwise use set color.",
        FormType.CheckBox,
      ),
      startColor: makeSetting(
        null,
        "Starting color.",
        FormType.Color,
      ),
      minDist: makeSetting(
        50,
        "The minimum amount of change when picking a new color.",
        FormType.Slider,
        0,
        255 * 3,
      ),
      maxDist: makeSetting(
        150,
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

export { FormType, defaultSettings };
