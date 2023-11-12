"use strict"
// alert("script.js");

// TEMPORARY, PASS AS VARIABLE LATER
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

import { nextDistanceColor, getBlendColors } from "./colors.js";

function drawOppositesAcc(numberOfBands, color1, color2, centerX, 
  centerY, length, interval) {
  if (numberOfBands <= 0) {
    return;
  }
  ctx.fillStyle = color1.hex();
  ctx.fillRect(Math.floor(centerX - length / 2), Math.floor(centerY - length / 2), length, length);
  drawOppositesAcc(numberOfBands - 1, color2, color1, centerX, centerY,
    length - interval, interval);
}

function drawOpposites(numberOfBands, color1, color2, centerX, centerY, length) {
  drawOppositesAcc(numberOfBands, color1, color2, centerX, centerY,
    length, 2 * Math.round(length / (2 * numberOfBands)));
}

//-----------------------------------------------------



function drawBlend(numberOfBands, color1, color2, centerX, centerY, length) {
  const colors = getBlendColors(numberOfBands, color1, color2);
  colors.forEach((color, i) => {
    ctx.fillStyle = color.hex();
    const curLength = length - i * 2 * Math.round(length / (2 * numberOfBands));
    ctx.fillRect(Math.floor(centerX - curLength / 2), Math.floor(centerY - curLength / 2),
      Math.ceil(curLength), Math.round(curLength));
  });
}

//----------------------------------------------------

function drawDistanceAcc(n, color, minD, maxD, centerX, centerY, length, d) {
  if (n <= 0) {
    return;
  }
  ctx.fillStyle = color.hex();
  ctx.fillRect(Math.round(centerX - length / 2), Math.round(centerY - length / 2), length, length);
  const newColor = nextDistanceColor(color, minD, maxD);
  drawDistanceAcc(n - 1, newColor, minD, maxD, centerX, centerY, length - d, d);
}

function drawDistance(n, startColor, minD, maxD, centerX, centerY, length) {
  let color = startColor;
  if (startColor === null) {
    color = randomColor();
  }
  let minimumD = minD;
  if (minD < 0) { minimumD = 0; }
  let maximumD = maxD;
  if (maxD < 0) { maximumD = 0; }
  drawDistanceAcc(n, color, minimumD, maximumD, centerX, centerY,
    length, 2 * Math.round(length / (2 * n)));
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

const savedFactors = {};
function allFactorsMemo(n) {
  if (savedFactors[n]) {
    return savedFactors;
  }
  
  const factors = [];
  for (let i = 2; i <= n / 2; i += 1) {
    if (n % i === 0) {
      factors.push(i);
    }
  }

  savedFactors[n] = factors;
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

function drawAcc(numOfIter, color, centerXCoord, centerYCoord, length, height,
  lastSplits, specialShapePlaceable, settings) {
  // alert('drawAcc begin');
  let curColor = color;
  let nextColor = nextDistanceColor(curColor, settings.minColorDist, settings.maxColorDist);
  let drawLength = length;
  let drawHeight = height;

  function splitFactors(sideLength) {
    return allFactors(sideLength).filter(factor => (sideLength / factor) % 1 === 0
      && sideLength / factor >= settings.minSideSize && factor <= settings.maxSplitAmount);
  }

  function splitFunction(factors, byLength) {
    return (centerX, centerY) => {
      const numOfSplits = factors[Math.floor(factors.length * Math.random())];
      const offsetCenter = byLength ? centerX : centerY;
      const offsetSideLength = byLength ? drawLength : drawHeight;
      const offset = offsetSideLength / numOfSplits;
      const offsetStart = offsetCenter - offsetSideLength / 2 + offset / 2;
      let iterColor = curColor;
      for (let i = 0; i < numOfSplits; i += 1) {
        const newCenter = offsetStart + offset * i;
        drawAcc(numOfIter + numOfSplits - 1, iterColor,
          byLength ? newCenter : centerX,
          byLength ? centerY : newCenter,
          byLength ? drawLength / numOfSplits : drawLength,
          byLength ? drawHeight : drawHeight / numOfSplits,
          { splitLength: byLength, splitHeight: !byLength }, false, settings);
        iterColor = nextDistanceColor(iterColor, settings.minColorDist, settings.maxColorDist);
      }
    };
  }

  function drawRect(centerX, centerY) {
    ctx.fillStyle = curColor.hex();
    ctx.fillRect(centerX - drawLength / 2, centerY - drawHeight / 2,
      drawLength, drawHeight);
  }

  function indentRect(centerX, centerY) {
    ctx.fillStyle = curColor.hex();
    ctx.fillRect(centerX - drawLength / 2, centerY - drawHeight / 2, drawLength, drawHeight);
    drawAcc(numOfIter + 1, nextColor, centerX, centerY,
      drawLength - 2 * settings.minSideSize, drawHeight - 2 * settings.minSideSize,
      lastSplits, true, settings);
  }
  function indentSpecialFunction(specialFunc) {
    return (centerX, centerY) => {
      drawRect(centerX, centerY);
      drawLength -= 2 * settings.minSideSize;
      drawHeight -= 2 * settings.minSideSize;
      curColor = nextColor;
      nextColor = nextDistanceColor(curColor, settings.minColorDist, settings.maxColorDist);
      specialFunc(centerX, centerY);
    };
  }

  function floorEvenOrOdd(n, m) {
    if ((n + m) % 2 === 0) {
      return n;
    }
    return n - 1;
  }

  function circle(centerX, centerY) {
    ctx.beginPath();
    ctx.fillStyle = nextColor.hex();
    const radius = drawLength / 2;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
    const newLength = floorEvenOrOdd(
      Math.floor((radius - settings.minSideSize) * Math.SQRT2), drawLength,
    );
    if (newLength >= settings.minSideSize
      && Math.random() > settings.specialNestingProbability.circle) {
      drawAcc(numOfIter + 1,
        nextDistanceColor(nextColor, settings.minColorDist, settings.maxColorDist),
        centerX, centerY,
        newLength, newLength,
        lastSplits, true, settings);
    }
  }

  function diamond(centerX, centerY) {
    ctx.beginPath();
    ctx.fillStyle = nextColor.hex();
    const offset = drawLength / 2;
    ctx.moveTo(centerX - offset, centerY);
    ctx.lineTo(centerX, centerY - offset);
    ctx.lineTo(centerX + offset, centerY);
    ctx.lineTo(centerX, centerY + offset);
    ctx.fill();
    const newLength = floorEvenOrOdd(
      Math.floor(drawLength / 2 - Math.SQRT2 * settings.minSideSize), drawLength,
    );
    // const newLength = floorEvenOrOdd(Math.floor(drawLength / 2), drawLength);
    if (newLength >= settings.minSideSize
      && Math.random() > settings.specialNestingProbability.diamond) {
      drawAcc(numOfIter + 1,
        nextDistanceColor(nextColor, settings.minColorDist, settings.maxColorDist),
        centerX, centerY,
        newLength, newLength,
        lastSplits, true, settings);
    }
  }

  function cross(centerX, centerY) {
    const halfLength = drawLength / 2;
    const offset = drawLength / 6;

    ctx.fillStyle = curColor.hex();
    // Top-Left Corner
    ctx.beginPath();
    ctx.moveTo(centerX - halfLength, centerY - halfLength);
    // upper
    ctx.lineTo(centerX - offset, centerY - halfLength);
    ctx.lineTo(centerX, centerY - (halfLength - offset));
    ctx.lineTo(centerX + offset, centerY - halfLength);
    // Top-Right Corner
    ctx.lineTo(centerX + halfLength, centerY - halfLength);
    // right
    ctx.lineTo(centerX + halfLength, centerY - offset);
    ctx.lineTo(centerX + (halfLength - offset), centerY);
    ctx.lineTo(centerX + halfLength, centerY + offset);
    // Bottom-Right Corner
    ctx.lineTo(centerX + halfLength, centerY + halfLength);
    // lower
    ctx.lineTo(centerX + offset, centerY + halfLength);
    ctx.lineTo(centerX, centerY + (halfLength - offset));
    ctx.lineTo(centerX - offset, centerY + halfLength);
    // Bottom-Left Corner
    ctx.lineTo(centerX - halfLength, centerY + halfLength);
    // left
    ctx.lineTo(centerX - halfLength, centerY + offset);
    ctx.lineTo(centerX - (halfLength - offset), centerY);
    ctx.lineTo(centerX - halfLength, centerY - offset);
    ctx.fill();

    // const newLength = drawLength - 2 * offset;
    const newLength = floorEvenOrOdd(
      Math.floor(drawLength - 2 * offset - 2 * settings.minSideSize),
    );
    if (newLength >= settings.minSideSize
      && Math.random() > settings.specialNestingProbability.cross) {
      drawAcc(numOfIter + 1,
        nextDistanceColor(nextColor, settings.minColorDist, settings.maxColorDist),
        centerX, centerY,
        newLength, newLength,
        lastSplits, true, settings);
    }
  }

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

    if (drawLength >= settings.drawRatios.minLengthRatio * settings.length
      && drawLength <= settings.drawRatios.maxLengthRatio * settings.length
      && drawHeight >= settings.drawRatios.minHeightRatio * settings.height
      && drawHeight <= settings.drawRatios.maxHeightRatio * settings.height) {
      actions.push({
        action: drawRect,
        weight: weights.drawRect,
      });
    }

    if ((!lastSplits.splitLength || heightFactors.length === 0)
      && lengthFactors.length > 0) {
      actions.push({
        action: splitFunction(lengthFactors, true),
        weight: weights.split,
      });
    }
    if ((!lastSplits.splitHeight || lengthFactors.length === 0)
      && heightFactors.length > 0) {
      actions.push({
        action: splitFunction(heightFactors, false),
        weight: weights.split,
      });
    }

    if (numOfIter >= settings.minIterations.minIndentIter
      && drawLength >= settings.minSideSize * 3 && drawHeight >= settings.minSideSize * 3) {
      actions.push({
        action: indentRect,
        weight: weights.indentRect,
      });
    }
  } else {
    // Squares
    // alert('Square');
    weights = settings.squareWeights;
    if (drawLength >= settings.drawRatios.minLengthRatio * settings.length
      && drawLength <= settings.drawRatios.maxLengthRatio * settings.length
      && drawHeight >= settings.drawRatios.minHeightRatio * settings.height
      && drawHeight <= settings.drawRatios.maxHeightRatio * settings.height) {
      actions.push({
        action: drawRect,
        weight: weights.drawRect,
      });
    }

    if ((!lastSplits.splitLength || heightFactors.length === 0)
      && lengthFactors.length > 0) {
      actions.push({
        action: splitFunction(lengthFactors, true),
        weight: weights.split,
      });
    }
    if ((!lastSplits.splitHeight || lengthFactors.length === 0)
      && heightFactors.length > 0) {
      actions.push({
        action: splitFunction(heightFactors, false),
        weight: weights.split,
      });
    }

    if (numOfIter >= settings.minIterations.minIndentIter
      && drawLength >= settings.minSideSize * 3 && drawHeight >= settings.minSideSize * 3) {
      actions.push({
        action: indentRect,
        weight: weights.indentRect,
      });
    }

    if (numOfIter >= settings.minIterations.minOppositesSquareIter
      && drawLength >= settings.minSideSize * 3) {
      actions.push({
        action: (centerX, centerY) => {
          drawOpposites(Math.round(drawLength / (settings.minSideSize * 2)), curColor,
            nextColor, centerX, centerY, drawLength);
        },
        weight: weights.oppositesSquare,
      });
    }
    if (numOfIter >= settings.minIterations.minBlendSquareIter
      && drawLength >= settings.minSideSize * 3) {
      actions.push({
        action: (centerX, centerY) => {
          drawBlend(Math.round(drawLength / (settings.minSideSize * 2)), curColor,
            nextColor, centerX, centerY, drawLength);
        },
        weight: weights.blendSquare,
      });
    }
    if (numOfIter >= settings.minIterations.minDistanceSquareIter
      && drawLength >= settings.minSideSize * 3) {
      actions.push({
        action: (centerX, centerY) => {
          drawDistance(Math.round(drawLength / (settings.minSideSize * 2)),
            curColor, settings.minColorDist, settings.maxColorDist, centerX, centerY, drawLength);
        },
        weight: weights.distanceSquare,
      });
    }

    const specialOffset = specialShapePlaceable ? 0 : 2 * settings.minSideSize;
    if (numOfIter >= settings.minIterations.minCircleIter
      && length >= settings.minSideSize * 3 + specialOffset) {
      actions.push({
        action: specialShapePlaceable ? circle : indentSpecialFunction(circle),
        weight: weights.circle,
      });
    }

    if (numOfIter >= settings.minIterations.minDiamondIter
      && length >= settings.minSideSize * 3 + specialOffset) {
      actions.push({
        action: specialShapePlaceable ? diamond : indentSpecialFunction(diamond),
        weight: weights.diamond,
      });
    }

    if (numOfIter >= settings.minIterations.minCrossIter
      && length >= settings.minSideSize * 4 + specialOffset) {
      actions.push({
        action: specialShapePlaceable ? cross : indentSpecialFunction(cross),
        weight: weights.cross,
      });
    }
  }


  if (actions.length === 0) {
    // eslint-disable-next-line no-alert
    alert('No valid actions.');
    throw Error('No valid actions.');
  }
  const totalWeight = actions.reduce((prev, curAction) => prev + curAction.weight, 0);
  let actionValue = Math.random() * totalWeight;
  while (actionValue > 0) {
    const curAction = actions.pop();
    if (actionValue < curAction.weight) {
      curAction.action(centerXCoord, centerYCoord);
    }
    actionValue -= curAction.weight;
  }
}

export { drawAcc };
