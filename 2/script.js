/* eslint-env browser */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//-----------------------------------------------------
// Colors:

function makeHexCode(r, g, b) {
  return '#'.concat([r, g, b].reduce((prev, cur) => {
    let value;
    if (cur < 0) {
      value = '00';
      // eslint-disable-next-line no-alert
      alert(`Color value negative.${r} ${g} ${b}`);
    } else if (cur < 15.5) {
      value = `0${(Math.round(cur)).toString(16)}`;
    } else if (cur <= 255) {
      value = (Math.round(cur)).toString(16);
    } else if (cur > 255) {
      value = 'FF';
      // eslint-disable-next-line no-alert
      alert('Color value above 255.');
    } else {
      // eslint-disable-next-line no-alert
      alert('Color value does not exist.');
      throw Error('Color value does not exist.');
    }
    return prev + value;
  }, ''));
}

function makeColor(r, g, b) {
  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
    hex() { return makeHexCode(this.r, this.g, this.b); },
    arr() { return [this.r, this.g, this.b]; },
  };
}

// eslint-disable-next-line no-unused-vars
function makeHexColor(hexCode) {
  return makeColor(parseInt(hexCode.substr(1, 2), 16),
    parseInt(hexCode.substr(3, 2), 16),
    parseInt(hexCode.substr(5, 2), 16));
}

function randomColor() {
  const getRandom = () => Math.round(Math.random() * 255);
  return makeColor(getRandom(), getRandom(), getRandom());
}

// eslint-disable-next-line no-unused-vars
function euclideanColorDistance(color1, color2) {
  const colorArr1 = color1.arr();
  const colorArr2 = color2.arr();
  return Math.hypot(...colorArr1.map((v, i) => v - colorArr2[i]));
}

// eslint-disable-next-line no-unused-vars
function manhattanColorDistance(color1, color2) {
  const colorArr1 = color1.arr();
  const colorArr2 = color2.arr();
  return colorArr1.reduce((prev, cur, i) => prev + Math.hypot(cur - colorArr2[i]), 0);
}

function nextDistanceColor(color, minD, maxD) {
  function getVal(initVal, diff) {
    if (initVal + diff <= 255 && initVal - diff >= 0) {
      if (Math.random() < 0.5) {
        return initVal + diff;
      }
      return initVal - diff;
    } if (initVal + diff <= 255) {
      return initVal + diff;
    }
    return initVal - diff;
  }

  const colorArr = color.arr();
  const maxDistArr = colorArr.map(v => Math.max(v, 255 - v));
  const maxDist = maxDistArr.reduce((prev, cur) => prev + cur, 0);

  const numberOfPoints = Math.min(maxDist, maxD,
    minD + Math.floor((Math.min(maxDist, maxD) - minD) * Math.random()));

  const rWeight = Math.random() * maxDistArr[0];
  const gWeight = Math.random() * maxDistArr[1];
  const bWeight = Math.random() * maxDistArr[2];
  const totalWeight = rWeight + gWeight + bWeight;
  // FIXME figure out rounding
  const rPoints = Math.round(numberOfPoints * rWeight / totalWeight);
  const gPoints = Math.round(numberOfPoints * gWeight / totalWeight);
  const bPoints = numberOfPoints - rPoints - gPoints; // FIXME test that this is fair
  // const bPoints = Math.round(numberOfPoints * bWeight / totalWeight);
  // alert(`${numberOfPoints} ${rPoints + gPoints + bPoints}`);
  // FIXME Test in for loop

  return makeColor(getVal(colorArr[0], rPoints),
    getVal(colorArr[1], gPoints),
    getVal(colorArr[2], bPoints));
}

//-----------------------------------------------------

function drawOppositesAcc(numberOfBands, color1, color2, centerX, centerY, length, interval) {
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


function getBlendColors(numberOfColors, color1, color2) {
  if (numberOfColors <= 1) {
    return [color1];
  }
  const colorArr1 = color1.arr();
  const colorArr2 = color2.arr();
  const colors = [];

  for (let i = 0; i < numberOfColors; i += 1) {
    const cArrFinal = [];
    for (let rgbIndex = 0; rgbIndex < 3; rgbIndex += 1) {
      const m = (colorArr2[rgbIndex] - colorArr1[rgbIndex]) / (numberOfColors - 1);
      cArrFinal.push(m * i + colorArr1[rgbIndex]);
    }
    colors.push(makeColor(...cArrFinal));
  }
  return colors;
}

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

function defaultSettings() {
  return {
    length: 1200,
    height: 600,
    minColorDist: 256 * 1 - 1,
    maxColorDist: 256 * 3 - 1,
    minSideSize: 5,
    // startColor: null,
    drawRatios: {
      minLengthRatio: 0,
      maxLengthRatio: 0.15,
      minHeightRatio: 0,
      maxHeightRatio: 0.15,
    },
    maxSplitAmount: 5,
    minIterations: {
      minIndentIter: 4,
      minOppositesSquareIter: 5,
      minBlendSquareIter: 5,
      minDistanceSquareIter: 5,
      minCircleIter: 5,
      minDiamondIter: 5,
      minCrossIter: 5,
    },
    rectWeights: {
      drawRect: 1,
      indentRect: 1,
      split: 1,
    },
    squareWeights: {
      drawRect: 1,
      indentRect: 1,
      split: 1,
      oppositesSquare: 1,
      blendSquare: 1,
      distanceSquare: 1,
      circle: 1,
      diamond: 1,
      cross: 1,
    },
    specialNestingProbability: {
      circle: 0.5,
      diamond: 0.5,
      cross: 0.5,
    },
  };
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

function draw(settings) {
  // alert('begin');
  let drawSettings = settings;
  if (settings === null || settings === undefined) {
    drawSettings = defaultSettings();
  }
  [canvas.width, canvas.height] = [drawSettings.length, drawSettings.height];
  const color = drawSettings.startColor ? drawSettings.startColor
    : nextDistanceColor(randomColor(), drawSettings.minColorDist, drawSettings.maxColorDist);
  drawAcc(0, color, drawSettings.length / 2, drawSettings.height / 2,
    drawSettings.length, drawSettings.height,
    { splitLength: false, splitHeight: false }, false, drawSettings);
  // alert('final');
}

//----------------------------------------------------

// Square Tests
// [canvas.width, canvas.height] = [1024, 1024];
// drawOpposites(5, makeHexColor('#000000'), makeHexColor('#550000'),
//   150, 150, 300);
// drawBlend(10, makeHexColor('#FF0000'), makeHexColor('#005500'), 450, 150, 300);
// drawDistance(10, null, 255 * 1, 255 * 3, 150, 450, 300);

// draw()

const settings = defaultSettings();
// Wallpaper
[settings.width, settings.height] = [1920, 1080];
// Wallpaper in half testing
[settings.width, settings.height] = [1920 / 2, 1080 / 2];
settings.minSideSize = settings.width / 192;

// Settings tests:
settings.startColor = makeColor(80, 80, 80);
settings.minColorDist = 50;
// settings.maxColorDist = 0;
settings.maxColorDist = 50;

draw(settings);


// IDEA split based on ratio
// TODO weight things better and/or custom weighting
// IDEA set starting color
// Idea indented and non-indented circle/diamond
// BUG min and max colorDistance
