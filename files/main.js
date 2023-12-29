"use strict";
// alert("main.js");

import {
  FormType,
  defaultSettings,
  defaultSettings2,
} from "./settings.js";
import { makeHexColor, randomColor } from "./colors.js";
import { drawRec } from "./draw.js";
import { addElemsRec } from "./sidebar.js";
/**
@typedef {import("./colors.js").Color} Color
@typedef {import("./settings.js").Settings} Settings
*/

// Drawing functions

/**
@returns {Color}
 */
function randStartColor() {
  return randomColor();
}

/**
 * @param {Settings} settings
 */
function draw(settings) {
  // alert('begin');
  /** @type {HTMLCanvasElement} canvas */
  // @ts-ignore
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // if (settings === null || settings === undefined) {
  //   settings = defaultSettings();
  // }
  // [canvas.width, canvas.height] = [settings.width, settings.height];
  [canvas.width, canvas.height] = [
    tempSettings.width.val,
    tempSettings.height.val,
  ];

  // let startColor = settings.startColor
  //   ? settings.startColor
  //   : randStartColor();
  let startColor = tempSettings.color.randomColor.val
    ? randStartColor()
    : makeHexColor(tempSettings.color.startColor.val);

  /**
  @type {GlobalContext} global
  */
  let global = {
    settings,
    // TODO: Probably change to like a queue to prevent
    // stack oveflow.
    callback: drawRec,
    ctx: ctx,
    settings2: tempSettings,
  };
  /**
  @type {LocalContext} local
  */
  let local = {
    // length: settings.width,
    // height: settings.height,
    // centerX: settings.width / 2,
    // centerY: settings.height / 2,
    length: tempSettings.width.val,
    height: tempSettings.height.val,
    centerX: tempSettings.width.val / 2,
    centerY: tempSettings.height.val / 2,
    color: startColor,
    numOfIter: 0,
    split: {
      lastSplitByLength: false,
      lastSplitByHeight: false,
    },
    specialShapePlaceable: false,
  };

  drawRec(global, local);
  // alert('final');
}

// Main
function main() {
  const settings = defaultSettings();
  // Wallpaper
  // [settings.width, settings.height] = [1920, 1080];
  // Wallpaper cut by value testing
  const val = 2;
  // [settings.width, settings.height] = [1920 / val, 1080 / val];
  // settings.minSideSize = settings.width / 192;
  [settings.width, settings.height] = [2048 / val, 1024 / val];
  settings.minSideSize = settings.width / 256;
  // settings.minSideSize = settings.width / 5;

  // Settings tests:
  // settings.startColor = makeColor(80, 80, 80);
  // Min
  // settings.minColorDist = 0;
  settings.minColorDist = 50;
  // settings.minColorDist = 255;
  // Max
  // settings.maxColorDist = 0;
  settings.maxColorDist = 50;
  // settings.maxColorDist = 100;
  // settings.maxColorDist = 255;
  // settings.maxColorDist = 255 * 3;
  // settings.splitRestrict = false;
  // settings.minIterations.minCrossIter = 0;
  // settings.specialIndentProbability = 1;
  // settings.specialNestingProbability.cross = 1;
  // settings.squareWeights.cross = 10;

  draw(settings);

  // IDEA split based on ratio
  // Idea indented and non-indented circle/diamond
}

//TODO find right place for this
// probably add both of these to main
// and change main call in event listener to draw
// or a new generate function
// sucht that main only runs once.
const tempSettings = defaultSettings2();
addElemsRec(tempSettings, "settings");

const btn = document.getElementById("generate");
btn.addEventListener("click", () => {
  main();
});
main();
