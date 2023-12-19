"use strict";
// alert("main.js");

import { defaultSettings } from "./settings.js";
import { randomColor, nextDistanceColor } from "./colors.js";
import { drawRec } from "./draw.js";
/**
@typedef {import("./colors.js").Color} Color
@typedef {import("./settings.js").Settings} Settings
*/

const canvas = document.getElementById("canvas");
// @ts-ignore
const ctx = canvas.getContext("2d");

// Drawing functions

/**
 * @param {Settings} settings
 */
function randStartColor(settings) {
  //TODO: idk why i did it this way, but i'll leave for now 
  return nextDistanceColor(
    randomColor(),
    settings.minColorDist,
    settings.maxColorDist,
  );
}
  
/**
 * @param {Settings} settings
 */
function draw(settings) {
  // alert('begin');
  if (settings === null || settings === undefined) {
    settings = defaultSettings();
  }
  // @ts-ignore
  [canvas.width, canvas.height] = [
    settings.width,
    settings.height,
  ];

  let startColor = settings.startColor
    ? settings.startColor
    : randStartColor(settings);

  /**
  @type {GlobalContext} global
  */
  let global = {
    settings,
    // TODO: Probably change to like a queue to prevent
    // stack oveflow.
    callback: drawRec,
    ctx,
  }
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
          lastSplitByHeight: false
      },
      specialShapePlaceable: false,
  }

  drawRec(global, local);
  // alert('final');
}

// Main

const settings = defaultSettings();
// Wallpaper
// [settings.width, settings.height] = [1920, 1080];
// Wallpaper cut by value testing
let val = 2;
[settings.width, settings.height] = [1920 / val, 1080 / val];
settings.minSideSize = settings.width / 192;
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

draw(settings);

// IDEA split based on ratio
// Idea indented and non-indented circle/diamond
