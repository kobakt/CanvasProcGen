"use strict";
// alert("main.js");

import { defaultSettings } from "./settings.js";
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
  const scale = window.devicePixelRatio;
  // const scale = 4;

  if (settings === null || settings === undefined) {
    settings = defaultSettings();
  }

  [canvas.style.width, canvas.style.height] = [
    settings.width.val / scale + "px",
    settings.height.val / scale + "px",
  ];
  [canvas.width, canvas.height] = [
    settings.width.val,
    settings.height.val,
  ];

  let startColor = settings.color.randomColor.val
    ? randStartColor()
    : makeHexColor(settings.color.startColor.val);

  /**
  @type {GlobalContext} global
  */
  let global = {
    callback: drawRec,
    ctx: ctx,
    settings: settings,
  };
  /**
  @type {LocalContext} local
  */
  let local = {
    length: settings.width.val,
    height: settings.height.val,
    centerX: settings.width.val / 2,
    centerY: settings.height.val / 2,
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
  addElemsRec(settings, "settings");
  // Wallpaper
  // [settings.width, settings.height] = [1920, 1080];
  // Wallpaper cut by value testing
  // const val = 2;
  // [settings.width, settings.height] = [1920 / val, 1080 / val];
  // settings.minSideSize = settings.width / 192;
  // [settings.width, settings.height] = [2048 / val, 1024 / val];
  // settings.minSideSize = settings.width / 256;
  // settings.minSideSize = settings.width / 5;

  // Settings tests:
  // settings.startColor = makeColor(80, 80, 80);
  // Min
  // settings.minColorDist = 0;
  // settings.minColorDist = 50;
  // settings.minColorDist = 255;
  // Max
  // settings.maxColorDist = 0;
  // settings.maxColorDist = 50;
  // settings.maxColorDist = 100;
  // settings.maxColorDist = 255;
  // settings.maxColorDist = 255 * 3;
  // settings.splitRestrict = false;
  // settings.minIterations.minCrossIter = 0;
  // settings.specialIndentProbability = 1;
  // settings.specialNestingProbability.cross = 1;
  // settings.squareWeights.cross = 10;

  const btn = document.getElementById("generate");
  btn.addEventListener("click", () => {
    draw(settings);
  });
  draw(settings);
}
main();
