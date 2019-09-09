/* eslint-env browser */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//-----------------------------------------------------

function drawOppositesAcc(n, c1, c2, x, y, l, d) {
  if (n <= 0) {
    return;
  }
  ctx.fillStyle = c1;
  ctx.fillRect(Math.floor(x - l / 2), Math.floor(y - l / 2), l, l);
  drawOppositesAcc(n - 1, c2, c1, x, y, l - d, d);
}

function drawOpposites(n, c1, c2, x, y, l) {
  drawOppositesAcc(n, c1, c2, x, y, l, 2 * Math.round(l / (2 * n)));
}

//-----------------------------------------------------

function splitColor(c) {
  return [parseInt(c.substr(1, 2), 16),
    parseInt(c.substr(3, 2), 16),
    parseInt(c.substr(5, 2), 16)];
}

function combineColor(cArr) {
  return '#'.concat(cArr.reduce((prev, cur) => {
    let value;
    if (cur < 15.5) {
      value = `0${(Math.round(cur)).toString(16)}`;
    } else {
      value = (Math.round(cur)).toString(16);
    }
    return prev + value;
  }, ''));
}

function getBlendColors(n, c1, c2) {
  if (n <= 1) {
    return [c1];
  }
  const cArr1 = splitColor(c1);
  const cArr2 = splitColor(c2);
  const colors = [];

  for (let i = 0; i < n; i += 1) {
    const cArrFinal = [];
    for (let rgbIndex = 0; rgbIndex < 3; rgbIndex += 1) {
      const m = (cArr2[rgbIndex] - cArr1[rgbIndex]) / (n - 1);
      cArrFinal.push(m * i + cArr1[rgbIndex]);
    }
    colors.push(combineColor(cArrFinal));
  }
  return colors;
}

function drawBlend(n, c1, c2, x, y, l) {
  const colors = getBlendColors(n, c1, c2);
  colors.forEach((c, i) => {
    ctx.fillStyle = c;
    const length = l - i * 2 * Math.round(l / (2 * n));
    ctx.fillRect(Math.floor(x - length / 2), Math.floor(y - length / 2),
      Math.ceil(length), Math.round(length));
  });
}

//----------------------------------------------------

function randomColor() {
  const getRandom = () => Math.round(Math.random() * 255);
  return combineColor([getRandom(), getRandom(), getRandom()]);
}

// Euclidean dist, no longer used after switching to manhattan distance
// function colorDistance(c1, c2) {
//   const cArr1 = splitColor(c1);
//   const cArr2 = splitColor(c2);
//   return Math.hypot(...cArr1.map((v, i) => v - cArr2[i]));
// }

function colorDistance(c1, c2) {
  const cArr1 = splitColor(c1);
  const cArr2 = splitColor(c2);
  return cArr1.reduce((prev, cur, i) => prev + Math.hypot(cur - cArr2[i]), 0);
}

function nextDistanceColor(c, minD) {
  const cArr = splitColor(c);
  const maxDistArr = cArr.map(v => Math.max(v, 255 - v));
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
  newColorArr.push(getVal(cArr[0], randVal1));

  let minVal2 = curDist - (maxDistArr[2]);
  if (minVal2 < 0) { minVal2 = 0; }
  const randVal2 = minVal2 + Math.floor((maxDistArr[1] - minVal2) * Math.random());
  curDist -= randVal2;
  newColorArr.push(getVal(cArr[1], randVal2));

  newColorArr.push(getVal(cArr[2], Math.max(curDist, Math.floor(Math.random() * maxDistArr[2]))));

  return combineColor(newColorArr);
}

function drawDistanceAcc(n, c, minD, x, y, l, d) {
  if (n <= 0) {
    return;
  }
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x - l / 2), Math.round(y - l / 2), l, l);
  const newColor = nextDistanceColor(c, minD);
  drawDistanceAcc(n - 1, newColor, minD, x, y, l - d, d);
}

// minD is manhattan color distance

function drawDistance(n, startColor, minD, x, y, l) {
  let c = startColor;
  if (startColor === null) {
    c = randomColor();
  }
  let minimumD = minD;
  if (minD < 0) { minimumD = 0; }
  drawDistanceAcc(n, c, minimumD, x, y, l, 2 * Math.round(l / (2 * n)));
}

//----------------------------------------------------

function drawProcAcc(n, color, xCoord, yCoord, length, height, minColorDist, minSideSize,
  minIndentIter, minSquareIter, minDrawLength, maxDrawLength) {
  function splitLength(c, x, y, l, h) {
    drawProcAcc(n + 1, c, x - l / 4, y, l / 2, h,
      // drawProcAcc(n + 1, nextDistanceColor(c, minColorDist), x - l / 4, y, l / 2, h,
      minColorDist, minSideSize, minIndentIter, minSquareIter, minDrawLength, maxDrawLength);
    drawProcAcc(n + 1, nextDistanceColor(c, minColorDist), x + l / 4, y, l / 2, h,
      minColorDist, minSideSize, minIndentIter, minSquareIter, minDrawLength, maxDrawLength);
  }

  function splitHeight(c, x, y, l, h) {
    drawProcAcc(n + 1, c, x, y - h / 4, l, h / 2,
      // drawProcAcc(n + 1, nextDistanceColor(c, minColorDist), x, y - h / 4, l, h / 2,
      minColorDist, minSideSize, minIndentIter, minSquareIter, minDrawLength, maxDrawLength);
    drawProcAcc(n + 1, nextDistanceColor(c, minColorDist), x, y + h / 4, l, h / 2,
      minColorDist, minSideSize, minIndentIter, minSquareIter, minDrawLength, maxDrawLength);
  }

  function draw(c, x, y, l, h) {
    ctx.fillStyle = c;
    ctx.fillRect(x - l / 2, y - h / 2, l, h, minColorDist, minSideSize);
  }

  function indent(c, x, y, l, h) {
    ctx.fillStyle = c;
    ctx.fillRect(x - l / 2, y - h / 2, l, h);
    const newColor = nextDistanceColor(c, minColorDist);
    drawProcAcc(n + 1, newColor, x, y, l - 2 * minSideSize, h - 2 * minSideSize,
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
    actions.push((c, x, y, l) => {
      drawOpposites(Math.round(l / (minSideSize * 2)), c,
        nextDistanceColor(c, minColorDist), x, y, l);
    });
    actions.push((c, x, y, l) => {
      drawBlend(Math.round(l / (minSideSize * 2)), c,
        nextDistanceColor(c, minColorDist), x, y, l);
    });
    actions.push((c, x, y, l) => {
      drawDistance(Math.round(l / (minSideSize * 2)), c, minColorDist, x, y, l);
    });
  }

  actions[Math.floor(Math.random() * actions.length)](color, xCoord, yCoord, length, height);
}

function drawProc(x, y, l, h, minColorDist, minSideSize,
  minIndentIter = 5, minSquareIter = 5, minDrawLength = 0, maxDrawLength = 100) {
  drawProcAcc(0, nextDistanceColor(randomColor(), minColorDist), x, y, l, h,
    minColorDist, minSideSize, minIndentIter, minSquareIter, minDrawLength, maxDrawLength);
}

//----------------------------------------------------

// drawOpposites(5, '#000000', '#550000', 300, 300, 512);
// drawOpposites(5, '#000000', '#550000', 300, 300, 300);
// drawBlend(10, '#FF0000', '#005500', 450, 300, 512);
// drawBlend(10, '#FF0000', '#005500', 450, 150, 300);
// drawDistance(10, null, 255 * 1, 150, 450, 300);

[canvas.width, canvas.height] = [1024, 512];
drawProc(canvas.width / 2, canvas.height / 2, canvas.width, canvas.height,
  255 * 1.0, 5, 5, 6,
  0 * Math.max(canvas.width, canvas.height),
  0.1 * Math.max(canvas.width, canvas.height));
// [canvas.width, canvas.height] = [1920, 1080];
// drawProc(canvas.width / 2, canvas.height / 2, canvas.width, canvas.height,
//   255 * 1.0, 10, 4, 5,
//   0 * Math.max(canvas.width, canvas.height),
//   0.1 * Math.max(canvas.width, canvas.height));

const imgURL = canvas.toDataURL();
document.getElementById('cimg').src = imgURL;
