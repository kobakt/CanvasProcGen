"use strict";
// alert("script.js");

// TEMPORARY, PASS AS VARIABLE LATER
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

import { nextDistanceColor, getBlendColors } from "./colors.js";

function drawOppositesAcc(
  numberOfBands,
  color1,
  color2,
  centerX,
  centerY,
  length,
  interval,
) {
  if (numberOfBands <= 0) {
    return;
  }
  ctx.fillStyle = color1.hex();
  ctx.fillRect(
    Math.floor(centerX - length / 2),
    Math.floor(centerY - length / 2),
    length,
    length,
  );
  drawOppositesAcc(
    numberOfBands - 1,
    color2,
    color1,
    centerX,
    centerY,
    length - interval,
    interval,
  );
}

function drawOpposites(
  numberOfBands,
  color1,
  color2,
  centerX,
  centerY,
  length,
) {
  drawOppositesAcc(
    numberOfBands,
    color1,
    color2,
    centerX,
    centerY,
    length,
    2 * Math.round(length / (2 * numberOfBands)),
  );
}

//-----------------------------------------------------

//----------------------------------------------------

function drawDistanceAcc(n, color, minD, maxD, centerX, centerY, length, d) {
  if (n <= 0) {
    return;
  }
  ctx.fillStyle = color.hex();
  ctx.fillRect(
    Math.round(centerX - length / 2),
    Math.round(centerY - length / 2),
    length,
    length,
  );
  const newColor = nextDistanceColor(color, minD, maxD);
  drawDistanceAcc(n - 1, newColor, minD, maxD, centerX, centerY, length - d, d);
}

function drawDistance(n, startColor, minD, maxD, centerX, centerY, length) {
  let color = startColor;
  if (startColor === null) {
    color = randomColor();
  }
  let minimumD = minD;
  if (minD < 0) {
    minimumD = 0;
  }
  let maximumD = maxD;
  if (maxD < 0) {
    maximumD = 0;
  }
  drawDistanceAcc(
    n,
    color,
    minimumD,
    maximumD,
    centerX,
    centerY,
    length,
    2 * Math.round(length / (2 * n)),
  );
}

//----------------------------------------------------

// PROBABLY MEMOIZE THIS
function allFactors(n) {
  const factors = [];
  const curN = n;
  // const sqrt = Math.sqrt(n);
  for (let i = 2; i <= n / 2; i += 1) {
    if (curN % i === 0) {
      factors.push(i);
    }
  }
  return factors;
}

// eslint-disable-next-line no-unused-vars
function primeFactors(n) {
  const factors = [];
  let curN = n;
  // const sqrt = Math.sqrt(n);
  for (let i = 2; i <= n / 2; i += 1) {
    if (curN % i === 0) {
      while (curN % i === 0) {
        curN /= i;
      }
      factors.push(i);
    }
  }
  return factors;
}

//----------------------------------------------------

function drawAcc(
  numOfIter,
  color,
  centerXCoord,
  centerYCoord,
  length,
  height,
  lastSplits,
  specialShapePlaceable,
  settings,
) {
  // alert('drawAcc begin');
  let curColor = color;
  let nextColor = nextDistanceColor(
    curColor,
    settings.minColorDist,
    settings.maxColorDist,
  );
  let drawLength = length;
  let drawHeight = height;

  const actions = [];

  const lengthFactors = splitFactors(drawLength);
  const heightFactors = splitFactors(drawHeight);
  // can't be split
  if (lengthFactors.length === 0 && heightFactors.length === 0) {
    // alert('cant split');
    actions.push({
      action: drawRect,
      weight: 1,
    });
  }

  let weights;
  if (drawLength !== drawHeight) {
    // Rectangles
    // alert('Rect');
    weights = settings.rectWeights;

    // if (drawLength >= settings.drawRatios.minLengthRatio * settings.length
    //   && drawLength <= settings.drawRatios.maxLengthRatio * settings.length
    //   && drawHeight >= settings.drawRatios.minHeightRatio * settings.height
    //   && drawHeight <= settings.drawRatios.maxHeightRatio * settings.height) {
    //   actions.push({
    //     action: drawRect,
    //     weight: weights.drawRect,
    //   });
    // }

    // if ((!lastSplits.splitLength || heightFactors.length === 0)
    //   && lengthFactors.length > 0) {
    //   actions.push({
    //     action: splitFunction(lengthFactors, true),
    //     weight: weights.split,
    //   });
    // }
    // if ((!lastSplits.splitHeight || lengthFactors.length === 0)
    //   && heightFactors.length > 0) {
    //   actions.push({
    //     action: splitFunction(heightFactors, false),
    //     weight: weights.split,
    //   });
    // }

    // if (numOfIter >= settings.minIterations.minIndentIter
    //   && drawLength >= settings.minSideSize * 3 && drawHeight >= settings.minSideSize * 3) {
    //   actions.push({
    //     action: indentRect,
    //     weight: weights.indentRect,
    //   });
    // }
  } else {
    // Squares
    // alert('Square');
    weights = settings.squareWeights;
    // if (drawLength >= settings.drawRatios.minLengthRatio * settings.length
    //   && drawLength <= settings.drawRatios.maxLengthRatio * settings.length
    //   && drawHeight >= settings.drawRatios.minHeightRatio * settings.height
    //   && drawHeight <= settings.drawRatios.maxHeightRatio * settings.height) {
    //   actions.push({
    //     action: drawRect,
    //     weight: weights.drawRect,
    //   });
    // }

    // if ((!lastSplits.splitLength || heightFactors.length === 0)
    //   && lengthFactors.length > 0) {
    //   actions.push({
    //     action: splitFunction(lengthFactors, true),
    //     weight: weights.split,
    //   });
    // }
    // if ((!lastSplits.splitHeight || lengthFactors.length === 0)
    //   && heightFactors.length > 0) {
    //   actions.push({
    //     action: splitFunction(heightFactors, false),
    //     weight: weights.split,
    //   });
    // }

    // if (numOfIter >= settings.minIterations.minIndentIter
    //   && drawLength >= settings.minSideSize * 3 && drawHeight >= settings.minSideSize * 3) {
    //   actions.push({
    //     action: indentRect,
    //     weight: weights.indentRect,
    //   });
    // }

    // if (numOfIter >= settings.minIterations.minOppositesSquareIter
    //   && drawLength >= settings.minSideSize * 3) {
    //   actions.push({
    //     action: (centerX, centerY) => {
    //       drawOpposites(Math.round(drawLength / (settings.minSideSize * 2)), curColor,
    //         nextColor, centerX, centerY, drawLength);
    //     },
    //     weight: weights.oppositesSquare,
    //   });
    // }
    // if (numOfIter >= settings.minIterations.minBledSquareIter
    //   && drawLength >= settings.minSideSize * 3) {
    //   actions.push({
    //     action: (centerX, centerY) => {
    //       drawBlend(Math.round(drawLength / (settings.minSideSize * 2)), curColor,
    //         nextColor, centerX, centerY, drawLength);
    //     },
    //     weight: weights.blendSquare,
    //   });
    // }
    // if (numOfIter >= settings.minIterations.minDistanceSquareIter
    //   && drawLength >= settings.minSideSize * 3) {
    //   actions.push({
    //     action: (centerX, centerY) => {
    //       drawDistance(Math.round(drawLength / (settings.minSideSize * 2)),
    //         curColor, settings.minColorDist, settings.maxColorDist, centerX, centerY, drawLength);
    //     },
    //     weight: weights.distanceSquare,
    //   });
    // }

    // const specialOffset = specialShapePlaceable ? 0 : 2 * settings.minSideSize;
    // if (numOfIter >= settings.minIterations.minCircleIter
    //   && length >= settings.minSideSize * 3 + specialOffset) {
    //   actions.push({
    //     action: specialShapePlaceable ? circle : indentSpecialFunction(circle),
    //     weight: weights.circle,
    //   });
    // }

    // if (numOfIter >= settings.minIterations.minDiamondIter
    //   && length >= settings.minSideSize * 3 + specialOffset) {
    //   actions.push({
    //     action: specialShapePlaceable ? diamond : indentSpecialFunction(diamond),
    //     weight: weights.diamond,
    //   });
    // }

    // if (numOfIter >= settings.minIterations.minCrossIter
    //   && length >= settings.minSideSize * 4 + specialOffset) {
    //   actions.push({
    //     action: specialShapePlaceable ? cross : indentSpecialFunction(cross),
    //     weight: weights.cross,
    //   });
    // }
  }
}

export { drawAcc };
