"use strict";
// alert("main.js");

import { defaultSettings } from "./settings.js";
import { randomColor } from "./colors.js";
import { drawRec } from "./draw.js";
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

  if (settings === null || settings === undefined) {
    settings = defaultSettings();
  }
  [canvas.width, canvas.height] = [settings.width, settings.height];

  let startColor = settings.startColor
    ? settings.startColor
    : randStartColor();

  /**
  @type {GlobalContext} global
  */
  let global = {
    settings,
    // TODO: Probably change to like a queue to prevent
    // stack oveflow.
    callback: drawRec,
    ctx: ctx,
  };
  /**
  @type {LocalContext} local
  */
  let local = {
    length: settings.width,
    height: settings.height,
    centerX: settings.width / 2,
    centerY: settings.height / 2,
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
  const globalSettings = defaultSettings();
  // Wallpaper
  // [settings.width, settings.height] = [1920, 1080];
  // Wallpaper cut by value testing
  const val = 2;
  // [settings.width, settings.height] = [1920 / val, 1080 / val];
  // settings.minSideSize = settings.width / 192;
  [globalSettings.width, globalSettings.height] = [
    2048 / val,
    1024 / val,
  ];
  globalSettings.minSideSize = globalSettings.width / 256;
  // settings.minSideSize = settings.width / 5;

  // Settings tests:
  // settings.startColor = makeColor(80, 80, 80);
  // Min
  // settings.minColorDist = 0;
  globalSettings.minColorDist = 50;
  // settings.minColorDist = 255;
  // Max
  // settings.maxColorDist = 0;
  globalSettings.maxColorDist = 50;
  // settings.maxColorDist = 100;
  // settings.maxColorDist = 255;
  // settings.maxColorDist = 255 * 3;
  // settings.splitRestrict = false;

  draw(globalSettings);

  // IDEA split based on ratio
  // Idea indented and non-indented circle/diamond
}
main();
