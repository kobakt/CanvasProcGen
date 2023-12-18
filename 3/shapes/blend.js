import { makeShapeObject } from "./shape.js";
import { defaultSettings } from "../settings.js";

function drawBlend(numberOfBands, color1, color2, centerX, centerY, length) {
  const colors = getBlendColors(numberOfBands, color1, color2);
  colors.forEach((color, i) => {
    ctx.fillStyle = color.hex();
    const curLength = length - i * 2 * Math.round(length / (2 * numberOfBands));
    ctx.fillRect(
      Math.floor(centerX - curLength / 2),
      Math.floor(centerY - curLength / 2),
      Math.ceil(curLength),
      Math.round(curLength),
    );
  });
}

function isAvailable() {
  return (
    !(drawLength !== drawHeight) &&
    numOfIter >= settings.minIterations.minBledSquareIter &&
    drawLength >= settings.minSideSize * 3
  );
}

function action(centerX, centerY) {
  drawBlend(
    Math.round(drawLength / (settings.minSideSize * 2)),
    curColor,
    nextColor,
    centerX,
    centerY,
    drawLength,
  );
}

function blendObject() {
  i;
  return makeShapeObject(
    isAvailable,
    defaultSettings().squareWeights.blendSquare,
    action,
  );
}
export { blendObject };
