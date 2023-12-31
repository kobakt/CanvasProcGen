"use strict";
// alert("colors.js")

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string}
 */
function makeHexCode(r, g, b) {
  return "#".concat(
    [r, g, b].reduce((prev, cur) => {
      let value;
      if (cur < 0) {
        value = "00";
        // eslint-disable-next-line no-alert
        alert(`Color value negative.${r} ${g} ${b}`);
      } else if (cur < 15.5) {
        value = `0${Math.round(cur).toString(16)}`;
      } else if (cur <= 255) {
        value = Math.round(cur).toString(16);
      } else if (cur > 255) {
        value = "FF";
        alert("Color value above 255.");
      } else {
        alert("Color value does not exist.");
        throw Error("Color value does not exist.");
      }
      return prev + value;
    }, ""),
  );
}

/**
 * @typedef Color
 * @prop {number} r
 * @prop {number} g
 * @prop {number} b
 */

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {Color}
 */
function makeColor(r, g, b) {
  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
  };
}

/**
 * @param {Color} color
 */
function hex(color) {
  return makeHexCode(color.r, color.g, color.b);
}

/**
 * @param {Color} color
 */
function arr(color) {
  return [color.r, color.g, color.b];
}

/**
 * @param {string} hexCode
 */
function makeHexColor(hexCode) {
  return makeColor(
    parseInt(hexCode.substr(1, 2), 16),
    parseInt(hexCode.substr(3, 2), 16),
    parseInt(hexCode.substr(5, 2), 16),
  );
}

function randomColor() {
  const getRandom = () => Math.round(Math.random() * 255);
  return makeColor(getRandom(), getRandom(), getRandom());
}

// eslint-disable-next-line no-unused-vars
function euclideanColorDistance(color1, color2) {
  const colorArr1 = arr(color1);
  const colorArr2 = arr(color2);
  return Math.hypot(...colorArr1.map((v, i) => v - colorArr2[i]));
}

// eslint-disable-next-line no-unused-vars
function manhattanColorDistance(color1, color2) {
  const colorArr1 = arr(color1);
  const colorArr2 = arr(color2);
  return colorArr1.reduce(
    (prev, cur, i) => prev + Math.hypot(cur - colorArr2[i]),
    0,
  );
}

// maxD overrides minD
function nextDistanceColor(color, minD, maxD) {
  function getVal(initVal, diff) {
    if (initVal + diff <= 255 && initVal - diff >= 0) {
      if (Math.random() < 0.5) {
        return initVal + diff;
      }
      return initVal - diff;
    }
    if (initVal + diff <= 255) {
      return initVal + diff;
    }
    return initVal - diff;
  }

  const colorArr = arr(color);
  const maxDistArr = colorArr.map((v) => Math.max(v, 255 - v));
  const maxDist = maxDistArr.reduce((prev, cur) => prev + cur, 0);

  const numberOfPoints = Math.min(
    maxDist,
    maxD,
    minD +
      Math.round((Math.min(maxDist, maxD) - minD) * Math.random()),
  );

  const rWeight = Math.random() * maxDistArr[0];
  const gWeight = Math.random() * maxDistArr[1];
  const bWeight = Math.random() * maxDistArr[2];
  const totalWeight = rWeight + gWeight + bWeight;
  const rPoints = Math.min(
    Math.max(
      Math.round((numberOfPoints * rWeight) / totalWeight),
      numberOfPoints - maxDistArr[1] - maxDistArr[2],
    ),
    maxDistArr[0],
  );
  const gPoints = Math.min(
    Math.max(
      Math.round((numberOfPoints * gWeight) / totalWeight),
      numberOfPoints - rPoints - maxDistArr[2],
    ),
    maxDistArr[1],
  );
  const bPoints = numberOfPoints - rPoints - gPoints;

  // testing
  // testing nextColorDistance
  // if (maxDistArr.some((v, i) => v !== [rPoints, gPoints, bPoints][i])) {
  //   alert(`${colorArr} | ${maxDist} | ${numberOfPoints} | ${maxDistArr} | `
  //     + `${[rWeight, gWeight, bWeight]} | ${totalWeight} | `
  //     + `${[rPoints, gPoints, bPoints]} | `
  //     + `${makeColor(getVal(colorArr[0], rPoints),
  //       getVal(colorArr[1], gPoints),
  //       getVal(colorArr[2], bPoints)).arr()}`);
  // }

  return makeColor(
    getVal(colorArr[0], rPoints),
    getVal(colorArr[1], gPoints),
    getVal(colorArr[2], bPoints),
  );
}

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function nextColor(global, local) {
  return nextDistanceColor(
    local.color,
    global.settings.color.minDist.val,
    global.settings.color.maxDist.val,
  );
}

// testing nextColorDistance
// const n = 100000000;
// const [min, max] = [0, 0];
// // const [min, max] = [100, 100];
// // const [min, max] = [255 * 3, 255 * 3];
// // const [min, max] = [0, 100];
// // const [min, max] = [0, 255 * 3];
// // const [min, max] = [100, 0];
// // const [min, max] = [255 * 3, 0];
// // const [min, max] = [255 * 3, 100];
// const values = [0, 0, 0];
// for (let i = 0; i < n; i += 1) {
//   const color = nextDistanceColor(makeColor(0, 0, 0), min, max);
//   // const colorTotal = color.arr().reduce((prev, cur) => prev + cur, 0);
//   // if (colorTotal === min) {
//   //   alert(`Hit min ${colorTotal}`);
//   // } else if (colorTotal === max) {
//   //   alert(`Hit max ${colorTotal}`);
//   // } else if (colorTotal < min) {
//   //   alert(`outside min ${colorTotal}`);
//   // } else if (colorTotal > max) {
//   //   alert(`outside max ${colorTotal}`);
//   // }
//   color.arr().forEach((v, j) => { values[j] += v; });
// }
// alert(`average color distances ${values.map(v => v / n)}`);

/**
 * @param {number} numberOfColors
 * @param {Color} color1
 * @param {Color} color2
 */
function getBlendColors(numberOfColors, color1, color2) {
  if (numberOfColors <= 1) {
    return [color1];
  }
  const colorArr1 = arr(color1);
  const colorArr2 = arr(color2);
  const colors = [];

  for (let i = 0; i < numberOfColors; i++) {
    const cArrFinal = [];
    for (let rgbIndex = 0; rgbIndex < 3; rgbIndex += 1) {
      const m =
        (colorArr2[rgbIndex] - colorArr1[rgbIndex]) /
        (numberOfColors - 1);
      cArrFinal.push(m * i + colorArr1[rgbIndex]);
    }
    // colors.push(makeColor(...cArrFinal);
    colors.push(makeColor(cArrFinal[0], cArrFinal[1], cArrFinal[2]));
  }
  return colors;
}

export {
  makeColor,
  makeHexCode,
  makeHexColor,
  randomColor,
  euclideanColorDistance,
  manhattanColorDistance,
  getBlendColors,
  nextColor,
  hex,
  arr,
};
