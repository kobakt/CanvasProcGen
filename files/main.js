"use strict";
import { defaultSettings } from "./settings.js";
import { makeHexColor, randomColor } from "./colors.js";
import { drawRec } from "./draw.js";
import { addElemsRec } from "./sidebar.js";
/**
@typedef {import("./settings.js").Settings} Settings
*/

/**
 * Sets up the canvas to de drawn and then calls drawRec.
 * @param {Settings} settings
 * @returns {void}
 */
function draw(settings) {
  /** @type {HTMLCanvasElement} canvas */
  // @ts-ignore
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  if (settings === null || settings === undefined) {
    settings = defaultSettings();
  }

  [canvas.width, canvas.height] = [
    settings.width.val,
    settings.height.val,
  ];
  // Fixes high DPI issues on my PC.
  // Honestly not sure how it works on other
  // computers or on mobile.
  const scale = window.devicePixelRatio;
  [canvas.style.width, canvas.style.height] = [
    settings.width.val / scale + "px",
    settings.height.val / scale + "px",
  ];

  let startColor = settings.color.randomColor.val
    ? randomColor()
    : makeHexColor(settings.color.startColor.val);

  /** @type {GlobalContext} global */
  let global = {
    callback: drawRec,
    ctx: ctx,
    settings: settings,
  };
  /** @type {LocalContext} local */
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
}

/**
 * The main function for the program.
 * Nicely keeps variable names from global scope.
 */
function main() {
  const settings = defaultSettings();
  addElemsRec(settings, "settings");

  const btn = document.getElementById("generate");
  btn.addEventListener("click", () => {
    draw(settings);
  });
  draw(settings);
}
main();
