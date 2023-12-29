"use strict";
// alert("main.js");

import {
  FormType,
  defaultSettings,
  defaultSettings2,
} from "./settings.js";
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
// const btn = document.querySelector("#Generate");
const btn = document.getElementById("generate");

btn.addEventListener("click", () => {
  main();
});
main();

const tempSettings = defaultSettings2();
//TODO input type="reset"
// TODO <fieldset> and <legend>
/**
 * @param {import("./settings.js").Setting<any>} object
 * @param {string} name
 */
function addElemsRec(object, name) {
  if (object.val !== undefined) {
    const div = document.createElement("div");
    const label = document.createElement("label");
    label.appendChild(document.createTextNode(name));
    div.appendChild(label);
    const input = document.createElement("input");
    div.appendChild(input);
    input.type = object.formType;
    input.addEventListener("click", () => {
      alert(name + " " + object.val);
    });
    const sidebar = document.getElementById("sidebar");
    sidebar.appendChild(div);
  } else {
    // alert(JSON.stringify(Object.keys(object)));
    Object.keys(object)
      .filter((name) => object[name] !== undefined)
      .forEach((key) => {
        addElemsRec(object[key], name + "." + key);
      });
  }
}
addElemsRec(tempSettings, "settings");
