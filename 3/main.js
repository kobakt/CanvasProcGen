"use strict"
// alert("main.js");

import { defaultSettings } from "./settings.js";
import { randomColor, nextDistanceColor } from "./colors.js"
import { drawAcc } from "./script.js"


const canvas = document.getElementById('canvas');
// @ts-ignore
const ctx = canvas.getContext('2d');

// Drawing functions

function randStartColor(settings) {
  return nextDistanceColor(
    randomColor(), 
    settings.minColorDist, 
    settings.maxColorDist
  )
}

function draw(settings) {
  // alert('begin');
  let drawSettings = settings;
  if (settings === null || settings === undefined) {
    drawSettings = defaultSettings();
  }
  [canvas.width, canvas.height] = [
    drawSettings.length, 
    drawSettings.height
  ];
  const color = drawSettings.startColor ? drawSettings.startColor
    : randStartColor(drawSettings);
  drawAcc(0, color, drawSettings.length / 2, drawSettings.height / 2,
    drawSettings.length, drawSettings.height,
    { splitLength: false, splitHeight: false }, false, drawSettings);
  // alert('final');
}

// Main

const settings = defaultSettings();
// Wallpaper
[settings.width, settings.height] = [1920, 1080];
// Wallpaper in half testing
[settings.width, settings.height] = [1920 / 2, 1080 / 2];
settings.minSideSize = settings.width / 192;

// Settings tests:
// settings.startColor = makeColor(80, 80, 80);
// settings.minColorDist = 0;
settings.minColorDist = 50;
// settings.maxColorDist = 0;
settings.maxColorDist = 100;
// settings.maxColorDist = 255 * 3;

draw(settings);


// IDEA split based on ratio
// Idea indented and non-indented circle/diamond
