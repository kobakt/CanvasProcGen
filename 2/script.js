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
      alert('Color value negative.');
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
    const localLength = length - i * 2 * Math.round(length / (2 * numberOfBands));
    ctx.fillRect(Math.floor(centerX - localLength / 2), Math.floor(centerY - localLength / 2),
      Math.ceil(localLength), Math.round(localLength));
  });
}

//----------------------------------------------------

function nextDistanceColor(color, minD) {
  const colorArr = color.arr();
  const maxDistArr = colorArr.map(v => Math.max(v, 255 - v));
  const maxDist = maxDistArr.reduce((prev, cur) => prev + cur, 0);
  const difDist = Math.min(maxDist, minD);
  let curDist = difDist;

  function getVal(initVal, diff) {
    if (initVal + diff <= 255 && initVal - diff > 0) {
      if (Math.random() < 0.5) {
        return initVal + diff;
      }
      return initVal - diff;
    } if (initVal + diff <= 255) {
      return initVal + diff;
    }
    return initVal - diff;
  }

  const newColorArr = [];

  let minVal1 = curDist - (maxDistArr[1] + maxDistArr[2]);
  if (minVal1 < 0) { minVal1 = 0; }
  const randVal1 = minVal1 + Math.floor((maxDistArr[0] - minVal1) * Math.random());
  curDist -= randVal1;
  newColorArr.push(getVal(colorArr[0], randVal1));

  let minVal2 = curDist - (maxDistArr[2]);
  if (minVal2 < 0) { minVal2 = 0; }
  const randVal2 = minVal2 + Math.floor((maxDistArr[1] - minVal2) * Math.random());
  curDist -= randVal2;
  newColorArr.push(getVal(colorArr[1], randVal2));

  newColorArr.push(getVal(colorArr[2],
    Math.max(curDist, Math.floor(Math.random() * maxDistArr[2]))));

  return makeColor(...newColorArr);
}

function drawDistanceAcc(n, color, minD, centerX, centerY, length, d) {
  if (n <= 0) {
    return;
  }
  ctx.fillStyle = color.hex();
  ctx.fillRect(Math.round(centerX - length / 2), Math.round(centerY - length / 2), length, length);
  const newColor = nextDistanceColor(color, minD);
  drawDistanceAcc(n - 1, newColor, minD, centerX, centerY, length - d, d);
}

function drawDistance(n, startColor, minD, centerX, centerY, length) {
  let color = startColor;
  if (startColor === null) {
    color = randomColor();
  }
  let minimumD = minD;
  if (minD < 0) { minimumD = 0; }
  drawDistanceAcc(n, color, minimumD, centerX, centerY, length, 2 * Math.round(length / (2 * n)));
}

//----------------------------------------------------

function drawProcAcc(n, color, xCoord, yCoord, length, height, minColorDist, minSideSize,
  minIndentIter, minSquareIter, minDrawLength, maxDrawLength) {
  function splitLength(localColor, centerX, centerY, localLength, h) {
    drawProcAcc(n + 1, localColor, centerX - localLength / 4, centerY, localLength / 2, h,
      minColorDist, minSideSize, minIndentIter, minSquareIter, minDrawLength, maxDrawLength);
    drawProcAcc(n + 1, nextDistanceColor(localColor, minColorDist),
      centerX + localLength / 4, centerY, localLength / 2, h,
      minColorDist, minSideSize, minIndentIter, minSquareIter, minDrawLength, maxDrawLength);
  }

  function splitHeight(localColor, centerX, centerY, localLength, h) {
    drawProcAcc(n + 1, localColor, centerX, centerY - h / 4, localLength, h / 2,
      minColorDist, minSideSize, minIndentIter, minSquareIter, minDrawLength, maxDrawLength);
    drawProcAcc(n + 1, nextDistanceColor(localColor, minColorDist),
      centerX, centerY + h / 4, localLength, h / 2,
      minColorDist, minSideSize, minIndentIter, minSquareIter, minDrawLength, maxDrawLength);
  }

  function draw(localColor, centerX, centerY, localLength, h) {
    ctx.fillStyle = localColor.hex();
    ctx.fillRect(centerX - localLength / 2, centerY - h / 2,
      localLength, h, minColorDist, minSideSize);
  }

  function indent(localColor, centerX, centerY, localLength, h) {
    ctx.fillStyle = localColor.hex();
    ctx.fillRect(centerX - localLength / 2, centerY - h / 2, localLength, h);
    const newColor = nextDistanceColor(localColor, minColorDist);
    drawProcAcc(n + 1, newColor, centerX, centerY,
      localLength - 2 * minSideSize, h - 2 * minSideSize,
      minColorDist, minSideSize, minIndentIter, minSquareIter, minDrawLength, maxDrawLength);
  }

  const actions = [];

  if (length <= minSideSize * 2
    && height <= minSideSize * 2) {
    actions.push(draw);
  }
  if (length >= minDrawLength
    && length <= maxDrawLength
    && height >= minDrawLength
    && height <= maxDrawLength) {
    actions.push(draw);
  }
  // can't be split in two or indented
  if ((length % 2 === 1 || height % 2 === 1)
    && (length <= minSideSize * 3 || height <= minSideSize * 3)) {
    actions.push(draw);
  }
  if (length >= minSideSize * 2 && length % 2 === 0) {
    actions.push(splitLength);
  }
  if (height >= minSideSize * 2 && height % 2 === 0) {
    actions.push(splitHeight);
  }
  if (n >= minIndentIter && length >= minSideSize * 3 && height >= minSideSize * 3) {
    actions.push(indent);
  }
  if (n >= minSquareIter && length === height
    && length >= minSideSize * 3 && height >= minSideSize * 3) {
    // actions.push((localColor, centerX, centerY, localLength) => {
    //   drawOpposites(Math.round(localLength / (minSideSize * 2)), localColor,
    //     nextDistanceColor(localColor, minColorDist), centerX, centerY, localLength);
    // });
    // actions.push((localColor, centerX, centerY, localLength) => {
    //   drawBlend(Math.round(localLength / (minSideSize * 2)), localColor,
    //     nextDistanceColor(localColor, minColorDist), centerX, centerY, localLength);
    // });
    // actions.push((localColor, centerX, centerY, localLength) => {
    //   drawDistance(Math.round(localLength / (minSideSize * 2)),
    //     localColor, minColorDist, centerX, centerY, localLength);
    // });
  }

  actions[Math.floor(Math.random() * actions.length)](color, xCoord, yCoord, length, height);
}

function drawProc(centerX, centerY, length, h, minColorDist, minSideSize,
  minIndentIter = 5, minSquareIter = 5, minDrawLength = 0, maxDrawLength = 100) {
  drawProcAcc(0, nextDistanceColor(randomColor(), minColorDist), centerX, centerY, length, h,
    minColorDist, minSideSize, minIndentIter, minSquareIter, minDrawLength, maxDrawLength);
}

//----------------------------------------------------

// [canvas.width, canvas.height] = [1024, 1024];
// drawOpposites(5, makeHexColor('#000000'), makeHexColor('#550000'),
//   150, 150, 300);
// drawBlend(10, makeHexColor('#FF0000'), makeHexColor('#005500'), 450, 150, 300);
// drawDistance(10, null, 255 * 1, 150, 450, 300);

// [canvas.width, canvas.height] = [1024, 512];
// drawProc(canvas.width / 2, canvas.height / 2, canvas.width, canvas.height,
//   255 * 1.0, 5, 5, 6,
//   0 * Math.max(canvas.width, canvas.height),
//   0.1 * Math.max(canvas.width, canvas.height));
// [canvas.width, canvas.height] = [1920, 1080];
// drawProc(canvas.width / 2, canvas.height / 2, canvas.width, canvas.height,
//   255 * 1.0, 10, 4, 5,
//   0 * Math.max(canvas.width, canvas.height),
//   0.1 * Math.max(canvas.width, canvas.height));

const imgURL = canvas.toDataURL();
document.getElementById('cimg').src = imgURL;
